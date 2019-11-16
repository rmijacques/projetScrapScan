const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const libraryManager = require('./libraryManager.js')
const tools = require('./tools.js');

const SITE_URL = "https://www.lelscan-vf.com/manga/";
const COVER_URL = "https://www.lelscan-vf.com/uploads/manga/";
const LIBRARY_URL = "temp/bibliotheque.json";


module.exports = {
    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan et renvoie chaque page au client quand elle est telecharge
    telechargerUnScanPageParPage: async function (mangaName, numScan,socket) {
        let numPage = 1;
        let name = tools.formatMangaName(mangaName);
        let urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
        let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';
        let dirName = "temp/" + mangaName;
        let chapitreDejaTelecharge = false;

        //Creation dossier du manga si inexistant
        if(libraryManager.mangaInLibrary(mangaName)){
            fs.mkdir(dirName, (err)=>{});
        }
        console.log("");
        //Ajout de la cover si inexistante
        if (!fs.existsSync(dirName + "/cover.jpg")) {
            download(urlCover, dirName + "/cover.jpg", (err) => {});
        }
        dirName += "/" + numScan + "/";
        
        if(!libraryManager.chapitreInLibrary(mangaName,numScan)){
            fs.mkdirSync(dirName);
        }
        else {
            chapitreDejaTelecharge = true;
        }

        if (!chapitreDejaTelecharge) {
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                console.log(urlPage);
                sendNewPageUrlToClient(mangaName,numScan,numPage,socket);
                numPage++;
                urlSepare = urlPage.split('/');
                urlSepare[urlSepare.length - 1] = numPage;
                urlPage = urlSepare.join('/');
            }
        } 
        else {
            console.log("Le chapitre a deja ete telechargé");
            numPage = fs.readdirSync(dirName).length;
        }
        updateMangaLibrary(mangaName, numScan, numPage);
    },

    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan
    telechargerUnScan: async function (mangaName, numScan,socket) {
        let numPage = 1;
        let name = tools.formatMangaName(mangaName);
        let urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
        let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';
        let dirName = "temp/" + mangaName;
        let chapitreDejaTelecharge = false;

        //Creation dossier du manga si inexistant
        if(libraryManager.mangaInLibrary(mangaName)){
            fs.mkdir(dirName, (err)=>{});
        }
        
        //Ajout de la cover si inexistante
        if (!fs.existsSync(dirName + "/cover.jpg")) {
            download(urlCover, dirName + "/cover.jpg", (err) => {});
        }
        dirName += "/" + numScan + "/";
        
        if(libraryManager.chapitreInLibrary(mangaName,numScan)){
            fs.mkdirSync(dirName);
        }
        else {
            chapitreDejaTelecharge = true;
        }

        if (!chapitreDejaTelecharge) {
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                console.log(urlPage);
                sendNewPageUrlToClient(mangaName,numScan,numPage,socket);
                numPage++;
                urlSepare = urlPage.split('/');
                urlSepare[urlSepare.length - 1] = numPage;
                urlPage = urlSepare.join('/');
            }
        } 
        else {
            console.log("Le chapitre a deja ete telechargé");
            numPage = fs.readdirSync(dirName).length;
        }
        updateMangaLibrary(mangaName, numScan, numPage);
    },

    recupUrlsPages: async function (mangaName, numScan) {
        try {
            var ret = [];
            var numPage = 1;
            var name = tools.formatMangaName(mangaName);
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
        name = tools.formatMangaName(mangaName);
        mangaStr = SITE_URL + name + '/' + chapitre + '/' + 1;
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
    await request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function sendNewPageUrlToClient(mangaName,numScan,numPage,socket){
    let addrPage = "temp/" + mangaName + "/" + numScan + "/" + numPage + ".png";
    socket.emit('getChapitrePageParPage',JSON.stringify({
        urlPage: addrPage,
        numPage: numPage,
        status : "OK",
        typeData : "pageUnique"
    }));
}

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
    let parsedChapterNum = parseInt(chapterNum, 10);
    let addrPage = "temp/" + mangaName + "/" + chapterNum + "/";
    let aEcrire;
    let jsonAvantModif = fs.readFileSync(LIBRARY_URL, (err) => {
        console.log("Erreur lecture JSON: " + err)
    });
    let logAvantModif = JSON.parse(jsonAvantModif);
    let mangaDejaPresent = false;
    let mangaChoisi;


    console.log("Avant modif :");
    console.log(logAvantModif);

    for (let i = 1; i < nbPages; i++) {
        srcPages[i - 1] = addrPage + i + ".png";
    }
    if (logAvantModif.length > 0) {
        //Si le manga est dans la biblio de l'user
        mangaChoisi = logAvantModif.findIndex((manga) => {
            return manga.name == mangaName;
        });
        if (mangaChoisi != -1) {
            logAvantModif[mangaChoisi].chapters.push({
                numChapter: parsedChapterNum,
                listePages: srcPages
            });
            logAvantModif[mangaChoisi].chapters.sort((a, b) => {
                return b.numChapter - a.numChapter;
            })
        } else {
            aEcrire = {
                name: mangaName,
                chapters: [{
                    numChapter: parsedChapterNum,
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
                numChapter: parsedChapterNum,
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