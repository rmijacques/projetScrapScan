const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const SITE_URL = "https://www.lelscan-vf.com/manga/";
const COVER_URL = "https://www.lelscan-vf.com/uploads/manga/";
const LIBRARY_URL = "temp/bibliotheque.json";


module.exports = {
    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan
    telechargerUnScan: async function (mangaName, numScan) {
        try {
            //var html = await axios.get(urlPremierePage)
            let numPage = 1;
            let name = mangaName.replace(/ /gi, '-').toLowerCase();
            let urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
            let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';
            let dirName = "temp/" + mangaName;
            let chapitreDejaTelecharge = false;

            fs.mkdir(dirName, function (error) {
                if (error) {
                    console.log("Erreur creation dossier : \n" + error);
                }
            });
            if (!fs.existsSync(dirName + "/cover.jpg")) {
                download(urlCover, dirName + "/cover.jpg", (err) => {});
            }
            dirName += "/" + numScan + "/";
            fs.mkdirSync(dirName, function (error) {
                if (error) {
                    console.log("Le dossier existe, on ne telecharge donc pas le chapitre" + error);
                    chapitreDejaTelecharge = true;
                }
            });
            if(!chapitreDejaTelecharge){
                console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
                while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                    console.log(urlPage);
                    numPage++;
                    urlSepare = urlPage.split('/');
                    urlPage = '';
                    urlSepare[urlSepare.length - 1] = numPage;
                    urlPage = urlSepare.join('/');
                }
            }
            else{
                numPage = fs.readdirSync(dirName).length;
            }
            updateMangaLibrary(mangaName, numScan, numPage);

        } catch (error) {
            console.log(error);
        }
    },

    recupUrlsPages: async function (mangaName, numScan) {
        try {
            var ret = [];
            var numPage = 1;
            var name = mangaName.replace(/ /gi, '-').toLowerCase();
            var urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
            var index = 0;
            while ((ret[index] = await recupUrlImage(urlPage, numPage, "scans/" + mangaName + "/")) != 0) {
                numPage++;
                index++;
                urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
            }

            return ret;
        } catch (error) {
            console.log(error);
        }
    }
};


//Telecharge le fichier present à l'adresse uri et le telecharge dans filename
async function download(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

async function recupUrlImage(urlPage, numPage, dossier) {
    try {
        var html = await axios.get(urlPage)
            .then((reponse) => {
                return reponse.data;
            })
            .catch((error) => {
                return false;
            });

        var $ = cheerio.load(html);
        var lienImage = $('div[id=ppp]').find('img').attr('src');
        if (lienImage.length > 0) {
            return lienImage;
        } else {
            return 0;
        }
    } catch (err) {
        return 0;
    }
}
async function telechargerUnePage(urlPage, numPage, dossier) {
    try {
        var html = await axios.get(urlPage)
            .then((reponse) => {
                return reponse.data;
            })
            .catch((error) => {
                return false;
            });

        var $ = cheerio.load(html);
        var lienImage = $('div[id=ppp]').find('img').attr('src');
        if (lienImage.length == 0) {
            return false;
        }
        await download(lienImage, dossier + numPage + ".png", function () {
            //console.log("\nPage Telechargée : "+numPage)
        });
        return true;
    } catch (error) {
        return false;
    }
}

function updateMangaLibrary(mangaName, chapterNum, nbPages) {
    let srcPages = [];
    let addrPage = "temp/" + mangaName + "/" + chapterNum + "/";
    let aEcrire;
    let jsonAvantModif = fs.readFileSync(LIBRARY_URL, (err) => {
        console.log("Erreur lecture JSON: " + err)
    });
    let logAvantModif = JSON.parse(jsonAvantModif);
    let mangaDejaPresent = false;

    console.log("Avant modif :");
    console.log(logAvantModif);

    for (let i = 1; i < nbPages; i++) {
        srcPages[i - 1] = addrPage + i + ".png";
    }
    if (logAvantModif.length > 0) {
        for (let i = 0; i < logAvantModif.length; i++) {
            let element = logAvantModif[i];
            //Si le manga est dans la biblio
            if (element.name == mangaName) {
                mangaDejaPresent = true;
                element.chapters.push({
                    numChapter: chapterNum,
                    listePages: srcPages
                });
                element.chapters.sort((a, b) => {
                    return b.numChapter - a.numChapter;
                })
            }
        }
        //Si le manga n'est pas dans la biblio
        if (!mangaDejaPresent) {
            aEcrire = {
                name: mangaName,
                chapters: [{
                    numChapter: chapterNum,
                    listePages: srcPages
                }]
            }
            logAvantModif.push(aEcrire);
        }
    }
    //Si la biblio est vide
    else {
        aEcrire = {
            name: mangaName,
            chapters: [{
                numChapter: chapterNum,
                listePages: srcPages
            }]
        }
        logAvantModif.push(aEcrire);
    }

    console.log("Apres modif :");
    console.log(logAvantModif);

    fs.writeFileSync(LIBRARY_URL, JSON.stringify(logAvantModif, null, '\t'), (err) => {
        console.log(err)
    })

}