const axios = require('axios');
const downloadTools = require('./downloadTools.js');
const userManager = require('./userManager.js')
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
        let nouvScans = false;
        let name;

        console.log("Searching for new scans...");

        mangasAVerifier = userManager.getFullMangaList();
        let usersData = JSON.parse(fs.readFileSync('usersData.json'));
        usersData.forEach(async function(user){
            await user["mangaList"].forEach(async function(manga){
                name = manga.name.replace(/ /gi, '-').toLowerCase();
                mangaStr = SITE_URL + name + '/' + manga.nextChapter + '/' + 1;
                console.log(mangaStr);
                await axios.get(mangaStr)
                    .then((reponse) => {
                        nouvScans = true;
                    })
                    .catch((error) => {});
                if (nouvScans) {
                    await downloadTools.telechargerUnScan(name, manga.nextChapter,user.name);
                    userManager.updateList(manga.name,manga.nextChapter+1,user.name)
                    console.log("Nouveau Scan de " + manga.name);
                    //Notifier utilisateur de la sortie du scan
                } else {
                    console.log("Pas de Nouveau Scan de " + manga.name + "\n");
                }
            })
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