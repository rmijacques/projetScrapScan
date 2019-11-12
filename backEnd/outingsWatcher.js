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

    recupDerniersChapitresSortisv2: async function (userName) {
        let mangaStr;
        let nouvScans = false;
        let name;

        console.log("Searching for new scans...");

        let usersData = JSON.parse(fs.readFileSync('usersData.json'));
        let userIndex = usersData.findIndex((elem) => {
            return elem.name == userName;
        });
        //console.log(usersData)
        
        
        //console.log("user data [i] " + usersData[i].name)
        for(let j=0;j<usersData[userIndex].mangaList.length;j++){
            manga = usersData[userIndex].mangaList[j];

            name = manga.name.replace(/ /gi, '-').toLowerCase();
            mangaStr = SITE_URL + manga.name.replace(/ /gi, '-').toLowerCase() + '/' + manga.nextChapter + '/' + 1;
            mangaStr = mangaStr.replace(/\s/g, '');
            nouvScans = true;

            await axios.get(mangaStr).then(async response=>{
                console.log("Nouveau Scan de " + name);

                await downloadTools.telechargerUnScan(name, manga.nextChapter);
                userManager.updateList(manga.name, manga.nextChapter + 1, usersData[userIndex].name);
            }).catch(err=>{
                console.log("Pas de Nouveau Scan de " + manga.name);// + "\n" + mangaStr);
                //console.log("err "+err)
            })
        }
        
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