const downloadTools = require('./downloadTools.js');
const outingsWatcher = require('./outingsWatcher.js');
const userManager = require('./userManager.js');
const libraryManager = require('./libraryManager.js')
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');


const LIBRARY_URL = "temp/bibliotheque.json";

//Set up le directory de svg de scans
fs.mkdir("temp", function (error) {
    if (error) {
        //console.log("Erreur creation dossier : \n" + error);
    }
});
if (!fs.existsSync(LIBRARY_URL)) {
    fs.mkdir('temp', err => {
        //console.log("err mkdir")
    })
    fs.writeFileSync(LIBRARY_URL, '[]', (err) => {});
}


//lunch scheduled watcher
// schedule.scheduleJob('* * * * *', function(){
//     outingsWatcher.recupDerniersChapitresSortisv2();
// });
async function main() {
    outingsWatcher.recupDerniersChapitresSortisv2("Remi");
}
main();


//Set up le server
var app = express()
app.use(cors())

console.log("Server sets up");


//Requete de Base, renvoi une erreur car pas utilisée
app.get('/', function (req, res) {
    throw new Error('[custom ]ops ')
    res.send('Page Acueil');
});
//Poser Q Remi
app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page Acueil');
});


//Requete pour checker si login est valide / verifier quel compte doit être chargé
app.get("/checkUser/:userName", async function (req, res) {
    console.log("[GET] /checkUser/" + req.params.userName);
    res.json({
        resText: await userManager.isInDataBase(req.params.userName)
    });
});

//Requete pour choper la couverture
app.get('/cover/:mangaName', function (req, res) {
    console.log("[GET] /cover/" + req.params.mangaName);
    res.send()
})


// Requete des URLS des images d'un scan sur le site
app.get('/lecteur/:mangaName/:numScan', async function (req, res) {
    console.log("[GET] /lecteur/" + req.params.mangaName + '/' + req.params.numScan);
    res.json(await downloadTools.recupUrlsPages(req.params.mangaName, req.params.numScan));
})


//Requete des derniers sorites stockée sur le serveur
app.get('/recupDerniereSorties/:userName', async function (req, res) {
    console.log("[GET] /recupDerniereSorties");
    let jsonBiblio = await libraryManager.getLibraryByUser(req.params.userName);
    res.json(jsonBiblio);
});


//Recherche d'un nouveau scan par l'utilisateur. Renvoi ok en cas de reussite, nope en cas d'echec
app.get('/getChapitre/:manga/:chapitre', async function (req, res) {
    console.log("[GET] /getChapitre/" + req.params.manga + "/" + req.params.chapitre);
    let name = req.params.manga;
    let urlList = await libraryManager.getLibraryByScan(name, req.params.chapitre);
    
    if (urlList){
        res.json({
            urlList: urlList,
            status: "OK"
        });
    } else {
        if (await downloadTools.verifierExistenceChapitre(name, req.params.chapitre)) {
            await downloadTools.telechargerUnScan(name, req.params.chapitre);
            urlList = await libraryManager.getLibraryByScan(name, req.params.chapitre);
            res.json({
                urlList: urlList,
                status: "OK"
            });
        } else {
            res.json({
                status: "NOPE"
            });
        }
    }

})

//Ajouter un manga a usersData
app.get('/suivreUnManga/:userName/:mangaName/:numChapDepart', async function(req,res){
    console.log("[GET] Suivre un manga "+req.params.userName+"/"+req.params.mangaName+"/"+req.params.numChapDepart);
    if(userManager.chapitreInUserData(req.params.userName,req.params.mangaName,req.params.numChapDepart)){
        res.json({ status: 'deja pres'});
        return;
    }
    if (await downloadTools.verifierExistenceChapitre(req.params.mangaName, req.params.numChapDepart)){
        userManager.updateList(req.params.userName,req.params.mangaName,req.params.numChapDepart);
        res.json({ status : 'OK'});
        downloadTools.telechargerUnScan
        return;
    }
    res.json({status : 'NOPE'});

})

//make temp directory accessible from outside the app
app.use("/temp", express.static(__dirname + '/temp'));
// Ajouter un error handler (middleware)
app.use(function (error, request, response, next) {
    console.log(error.message)
    if (error) {
        if (error.message && error.message.match(/^\[custom message\]/gi)) {
            response.send(error.message.replace(/^\[custom message\]/gi, ""))
        } else {
            response.sendStatus(500).send("Internal error")
        }
    }
})



app.listen(8080);
console.log('Server started listenning on PORT:8080');