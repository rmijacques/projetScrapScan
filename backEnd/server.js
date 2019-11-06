const downloadTools = require('./downloadTools.js');
const outingsWatcher = require('./outingsWatcher.js');
const userManager = require('./userManager.js')
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const express = require('express');
const cors= require('cors');
const schedule = require('node-schedule');


var app = express()
app.use(cors())

fs.mkdir("temp", function (error) {
    if (error) {
        console.log("Erreur creation dossier : \n" + error);
    }
    
});

if(!fs.existsSync('temp/bibliotheque.json')){
    fs.writeFile('temp/bibliotheque.json','[]',(err)=>{});    
}

// schedule.scheduleJob('* * * * *', function(){
//     outingsWatcher.recupDerniersChapitresSortisv2();
// });

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page Acueil');
});

app.get('/lecteur/:mangaName/:numScan', async function(req,res){
    res.json(await downloadTools.recupUrlsPages(req.params.mangaName, req.params.numScan));  
})

app.get('/recupDerniereSorties', async function(req,res){
    let biblio = await fs.readFileSync("temp/bibliotheque.json",(err)=>{
        console.log("Recup dernieres sortie : \n"+err);
    });
    res.send(biblio);
});

app.get("/checkUser/:userName", async function(req,res){
    res.send(await userManager.isInDataBase(req.params.userName));
});

app.listen(8080);
console.log('Server running listenning on 8080 using cors');