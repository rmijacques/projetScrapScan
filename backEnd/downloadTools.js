const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const SITE_URL = "https://www.lelscan-vf.com/manga/";
const COVER_URL = "https://www.lelscan-vf.com/uploads/manga/";
const LIBRARY_URL = "temp/bibliotheque.json";


module.exports = {
    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan
    telechargerUnScan: async function (mangaName, numScan, userName) {

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

        //On teste si le chapitre est deja telechargé ou non
        try {
            fs.mkdirSync(dirName);
        } catch (err) {
            chapitreDejaTelecharge = true;
        }


        console.log(chapitreDejaTelecharge)
        if (!chapitreDejaTelecharge) {
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                console.log(urlPage);
                numPage++;
                urlSepare = urlPage.split('/');
                urlPage = '';
                urlSepare[urlSepare.length - 1] = numPage;
                urlPage = urlSepare.join('/');
            }
        } else {
            console.log("dossier non cree")
            numPage = fs.readdirSync(dirName).length;
        }
        updateMangaLibrary(mangaName, numScan, numPage, userName);


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
    },
    verifierExistenceChapitre: async function(mangaName, chapitre) {
        name = mangaName.replace(/ /gi, '-').toLowerCase();
        mangaStr = SITE_URL + mangaName.replace(/ /gi, '-').toLowerCase() + '/' + chapitre + '/' + 1;
        mangaStr = mangaStr.replace(/\s/g, '');
        nouvScans = true;

        await axios.get(mangaStr).then(async response => {
            nouvScans = true;
        }).catch(err => {
            console.log("Pas de Nouveau Scan de " + mangaName + "\n" + mangaStr);
            console.log("err " + err)
            nouvScans = false;
        })
        return nouvScans
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

function updateMangaLibrary(mangaName, chapterNum, nbPages, userName) {
    let srcPages = [];
    let addrPage = "temp/" + mangaName + "/" + chapterNum + "/";
    let aEcrire;
    let jsonAvantModif = fs.readFileSync(LIBRARY_URL, (err) => {
        console.log("Erreur lecture JSON: " + err)
    });
    let logAvantModif = JSON.parse(jsonAvantModif);
    let mangaDejaPresent = false;
    let userChoisi;
    let mangaChoisi;


    console.log("Avant modif :");
    console.log(logAvantModif);

    for (let i = 1; i < nbPages; i++) {
        srcPages[i - 1] = addrPage + i + ".png";
    }
    if (logAvantModif.length > 0) {
        //On verifie la presence de l'utilisateur dans la biblio
        userChoisi = logAvantModif.findIndex((user) => {
            return user.username == userName;
        });
        if (userChoisi != -1) {
            //Si le manga est dans la biblio de l'user
            mangaChoisi = logAvantModif[userChoisi]["library"].findIndex((manga) => {
                return manga.name == mangaName
            });
            if (mangaChoisi != -1) {
                logAvantModif[userChoisi].library[mangaChoisi].chapters.push({
                    numChapter: chapterNum,
                    listePages: srcPages
                });
                logAvantModif[userChoisi].library[mangaChoisi].chapters.sort((a, b) => {
                    return b.numChapter - a.numChapter;
                })
            } else {
                aEcrire = {
                    name: mangaName,
                    chapters: [{
                        numChapter: chapterNum,
                        listePages: srcPages
                    }]
                }
                logAvantModif[userChoisi].library.push(aEcrire);
            }
        } else {
            aEcrire = {
                username: userName,
                library: [{
                    name: mangaName,
                    chapters: [{
                        numChapter: chapterNum,
                        listePages: srcPages
                    }]
                }]
            }
            logAvantModif.push(aEcrire);
        }
    }
    //Si la biblio est vide
    else {
        aEcrire = {
            username: userName,
            library: [{
                name: mangaName,
                chapters: [{
                    numChapter: chapterNum,
                    listePages: srcPages
                }]
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