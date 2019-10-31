const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');


module.exports = {
    //Depuis la page d'accueil de lelscan, recupere tous les scans sortis recemment
    recupDerniersChapitresSortis : async function (){
        var test;
        var scansSortis = [];
        try{
            test = await axios.get('https://www.lelscan-vf.com/')
                .then((reponse) =>{
                    return reponse.data;
                })
                .catch((error) =>{
                    console.log(error);
                });
            
            const $ = cheerio.load(test);
            $('div[class=mangalist]').find('div[class=manga-item]').each(function(index,element){
                scansSortis[index] = {
                    titre : $(element).find('h3 > a').text(),
                    chapitres : []
                };
                
                $(element).find('div > h6 a').each(function(index2,elem){
                    scansSortis[index].chapitres[index2] = {
                        titreChap : $(elem).text(),
                        lienChap : $(elem).attr('href')
                    };
                });
            });
            for(var i = 0; i < scansSortis.length;i++){
                printManga(scansSortis[i]);
            }
            return scansSortis;
        }
        catch(error){
            console.log(error);
        }
    }
};

function printChapitre(chap){
    console.log("---- "+chap.titreChap);
    console.log("---- "+chap.lienChap);
}

function printManga(manga){
    console.log("\n"+manga.titre);
    for(var i = 0; i < manga.chapitres.length; i++){
        printChapitre(manga.chapitres[i]);
    }
    console.log("\n");
}

