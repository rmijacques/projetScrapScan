const axios = require('axios');
const dlTools = require('./telechargerChapitre.js');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const SITE_URL = "https://www.lelscan-vf.com/manga/";

module.exports = {
    //Depuis la page d'accueil de lelscan, recupere tous les scans sortis recemment
    recupDerniersChapitresSortis: async function () {
        var test;
        var scansSortis = [];
        try {
            test = await axios.get('https://www.lelscan-vf.com/')
                .then((reponse) => {
                    return reponse.data;
                })
                .catch((error) => {
                    console.log(error);
                });

            const $ = cheerio.load(test);
            $('div[class=mangalist]').find('div[class=manga-item]').each(function (index, element) {
                scansSortis[index] = {
                    titre: $(element).find('h3 > a').text(),
                    chapitres: []
                };

                $(element).find('div > h6 a').each(function (index2, elem) {
                    scansSortis[index].chapitres[index2] = {
                        titreChap: $(elem).text(),
                        lienChap: $(elem).attr('href')
                    };
                });
            });
            for (var i = 0; i < scansSortis.length; i++) {
                printManga(scansSortis[i]);
            }
            return scansSortis;
        } catch (error) {
            console.log(error);
        }
    },

    recupDerniersChapitresSortisv2: async function () {
        let mangasAVerifier = [];
        let mangaStr;
        let resJSON;

        console.log("Searching for new scans..........");

        mangasAVerifier = await JSON.parse(fs.readFileSync('mangas.json'));

        for (let i = 0; i < mangasAVerifier.length; i++) {
            var name = mangasAVerifier[i].name.replace(/ /gi, '-').toLowerCase();
            mangaStr = SITE_URL + name + '/' + mangasAVerifier[i].nextChapter + '/' + 1;
            console.log(mangaStr);
            await axios.get(mangaStr)
                .then((reponse) => {
                    dlTools.telechargerUnScan(name, mangasAVerifier[i].nextChapter);

                    mangasAVerifier[i].nextChapter++;
                    console.log("Nouveau Scan de " + mangasAVerifier[i].name);
                    //Notifier utilisateur de la sortie du scan

                })
                .catch((error) => {
                    console.log("Pas de Nouveau Scan de " + mangasAVerifier[i].name + "\n" + error);
                });
        }
        resJSON = JSON.stringify(mangasAVerifier);
        fs.writeFile('mangas.json', resJSON, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
        });

    }
};



function printChapitre(chap) {
    console.log("---- " + chap.titreChap);
    console.log("---- " + chap.lienChap);
}

function printManga(manga) {
    console.log("\n" + manga.titre);
    for (var i = 0; i < manga.chapitres.length; i++) {
        printChapitre(manga.chapitres[i]);
    }
    console.log("\n");
}