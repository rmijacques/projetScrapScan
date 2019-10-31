const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');

const SITE_URL = "https://www.lelscan-vf.com/manga/";

module.exports = {
    //Telecharge toutes les Pages d'un scan à partir d'un nom et d'un numéro de scan
    telechargerUnScan : async function (mangaName,numScan){
        try{
            //var html = await axios.get(urlPremierePage)
            var numPage = 1;
            var name = mangaName.replace(/ /gi, '-').toLowerCase();
            var urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;

            fs.mkdir("scans/" + mangaName, function(error){
                if (error){
                    console.log("Erreur creation dossier : \n" + error);
                }
            });
            console.log("Lancement du telechargement de " + mangaName + " Scan N°" + numScan);
            while(await telechargerUnePage(urlPage,numPage,"scans/" + mangaName + "/") == true){
                console.log(urlPage);
                numPage++;
                urlSepare = urlPage.split('/');
                urlPage = '';
                urlSepare[urlSepare.length -1] = numPage;
                urlPage = urlSepare.join('/');
            }
        }
        catch(error){
            console.log(error);
        }
    },

    recupUrlsPages : async function(mangaName,numScan){
        try{
            var ret = [];
            var numPage = 1;
            var name = mangaName.replace(/ /gi, '-').toLowerCase();
            var urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
            var index = 0;
            while((ret[index] = await recupUrlImage(urlPage,numPage,"scans/" + mangaName + "/")) != 0){
                numPage++;
                index++;
                urlPage = SITE_URL + name + '/' + numScan + '/' + numPage;
            }
            return ret;
        }
        catch(error){
            console.log(error);
        }
    }
};


//Telecharge le fichier present à l'adresse uri et le telecharge dans filename
async function download(uri, filename, callback){
    request.head(uri, function(err, res, body){
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

async function recupUrlImage(urlPage,numPage,dossier){
    try{
        var html = await axios.get(urlPage)
        .then((reponse) =>{
            return reponse.data;
        })
        .catch((error) =>{
            return false;
        });

        var $ = cheerio.load(html);
        var lienImage = $('div[id=ppp]').find('img').attr('src');
        if(lienImage.length > 0){
            return lienImage;            
        }
        else{
            return 0;
        }
    }
    catch(err){
        return 0;
    }
}
async function telechargerUnePage(urlPage,numPage,dossier){
    try{
        var html = await axios.get(urlPage)
        .then((reponse) =>{
            return reponse.data;
        })
        .catch((error) =>{
            return false;
        });

        var $ = cheerio.load(html);
        var lienImage = $('div[id=ppp]').find('img').attr('src');
        if(lienImage.length == 0){
            return false;
        }
        await download(lienImage, dossier + numPage + ".png", function() {
            //console.log("\nPage Telechargée : "+numPage)
        });
        return true;
    }
    catch(error){
        return false;
    }
}
    


