const dlTools = require('./telechargerChapitre.js');
const watcher = require('./surveillerSorties.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const express = require('express');
const cors= require('cors');
const schedule = require('node-schedule');



var app = express()
app.use(cors())

app.get('/', function (req, res) {
    throw new Error('[custom ]ops ')
    res.send('Page Acueil');
});

//Renvoi la liste des url des pages du scan demandé
app.get('/lecteur/:mangaName/:numScan', async function (req, res) {
    res.json(await dlTools.recupUrlsPages(req.params.mangaName, req.params.numScan));
})
app.get('/recupMangasPreferes', async function (req, res) {
    res.send(await fs.readFileSync("mangas.json"));
})
// Ajouter un error handler (middleware)
app.use(function (error, request, response, next) {
    console.log(error.message)
    if (error) {
        if (error.message && error.message.match(/^\[custom message\]/gi)) {
            response.send(error.message.replace(/^\[custom message\]/gi, ""))
        }
        else {
            response.sendStatus(500).send("Internal error")
        }
    }
})

fs.mkdir("temp", function (error) {
    if (error) {
        console.log("Erreur creation dossier : \n" + error);
    }
    
});

if(!fs.existsSync('temp/bibliotheque.json')){
    fs.writeFile('temp/bibliotheque.json','[]',(err)=>{});    
}


app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page Acueil');
});

schedule.scheduleJob('* * * * *', function(){
    watcher.recupDerniersChapitresSortisv2();
});

watcher.recupDerniersChapitresSortisv2();

app.get('/lecteur/:mangaName/:numScan', async function(req,res){
    res.json(await dlTools.recupUrlsPages(req.params.mangaName, req.params.numScan));  
})
app.get('/recupDerniereSorties', async function(req,res){
    let biblio = await fs.readFileSync("temp/bibliotheque.json",(err)=>{
        console.log("Recup dernieres sortie : \n"+err);
    });
    res.send(biblio);
});


app.listen(8080);
console.log('Server running listenning on 8080 using cors');