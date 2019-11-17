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
    telechargerUnScanPageParPage: async function (mangaName, numScan, socket) {
        let numPage = 1;
        let name = tools.formatMangaName(mangaName);
        let urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
        let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';
        let dirName = "temp/" + mangaName;
        let chapitreDejaTelecharge = false;

        //Creation dossier du manga si inexistant
        if (libraryManager.mangaInLibrary(mangaName)) {
            fs.mkdir(dirName, (err) => {});
        }
        console.log("");
        //Ajout de la cover si inexistante
        if (!fs.existsSync(dirName + "/cover.jpg")) {
            download(urlCover, dirName + "/cover.jpg", (err) => {});
        }
        dirName += "/" + numScan + "/";

        if (!libraryManager.chapitreInLibrary(mangaName, numScan)) {
            fs.mkdirSync(dirName);
        } else {
            chapitreDejaTelecharge = true;
        }

        if (!chapitreDejaTelecharge) {
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                console.log(urlPage);
                sendNewPageUrlToClient(mangaName, numScan, numPage, socket);
                numPage++;
                urlSepare = urlPage.split('/');
                urlSepare[urlSepare.length - 1] = numPage;
                urlPage = urlSepare.join('/');
            }
        } else {
            console.log("Le chapitre a deja ete telechargé");
            numPage = fs.readdirSync(dirName).length;
        }
        console.log("Le chapitre a bien été téléchargé");
        libraryManager.updateMangaLibrary(mangaName, numScan, numPage);
    },

    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan
    telechargerUnScan: async function (mangaName, numScan, socket) {
        let numPage = 1;
        let name = tools.formatMangaName(mangaName);
        let urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
        let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';
        let dirName = "temp/" + mangaName;
        let chapitreDejaTelecharge = false;

        //Creation dossier du manga si inexistant
        if (libraryManager.mangaInLibrary(mangaName)) {
            fs.mkdir(dirName, (err) => {});
        }

        //Ajout de la cover si inexistante
        if (!fs.existsSync(dirName + "/cover.jpg")) {
            download(urlCover, dirName + "/cover.jpg", (err) => {});
        }
        dirName += "/" + numScan + "/";

        if (libraryManager.chapitreInLibrary(mangaName, numScan)) {
            fs.mkdirSync(dirName);
        } else {
            chapitreDejaTelecharge = true;
        }

        if (!chapitreDejaTelecharge) {
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while (await telechargerUnePage(urlPage, numPage, dirName) == true) {
                console.log(urlPage);
                sendNewPageUrlToClient(mangaName, numScan, numPage, socket);
                numPage++;
                urlSepare = urlPage.split('/');
                urlSepare[urlSepare.length - 1] = numPage;
                urlPage = urlSepare.join('/');
            }
        } else {
            console.log("Le chapitre a deja ete telechargé");
            numPage = fs.readdirSync(dirName).length;
        }
        libraryManager.updateMangaLibrary(mangaName, numScan, numPage);
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

    verifierExistenceChapitre: async function (mangaName, chapitre) {
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
    },
    telechargerCover: function (mangaName) {
        mangaName = tools.formatMangaName(mangaName);
        let dirName = "temp/" + mangaName;
        let urlCover = COVER_URL + name + '/cover/cover_250x350.jpg';

        fs.mkdir(dirName, (err) => {});
        //Ajout de la cover si inexistante
        if (!fs.existsSync(dirName + "/cover.jpg")) {
            download(urlCover, dirName + "/cover.jpg", (err) => {});
        }
    }
};


//Telecharge le fichier present à l'adresse uri et le telecharge dans filename
async function download(uri, filename, callback) {
    await request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

function sendNewPageUrlToClient(mangaName, numScan, numPage, socket) {
    let addrPage = "temp/" + mangaName + "/" + numScan + "/" + numPage + ".png";
    socket.emit('getChapitrePageParPage', JSON.stringify({
        urlPage: addrPage,
        numPage: numPage,
        status: "OK",
        typeData: "pageUnique"
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