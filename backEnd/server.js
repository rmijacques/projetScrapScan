var dlTools = require('./telechargerChapitre.js');
var surveillance = require('./surveillerSorties.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
var express = require('express');
var cors= require('cors');


var app = express()
app.use(cors())

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.send('Page Acueil');
});

//Renvoi la liste des url des pages du scan demandé
app.get('/lecteur/:mangaName/:numScan', async function(req,res){
    res.json(await dlTools.recupUrlsPages(req.params.mangaName, req.params.numScan));  
})

app.listen(8080);
console.log('Server running listenning on 8080 using cors');