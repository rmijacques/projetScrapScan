var dlTools = require('./telechargerChapitre.js');
var surveillance = require('./surveillerSorties.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');


var file = fs.readFileSync("mangas.json");
var data = JSON.parse(file)["mangas"];
console.log(data);

for (var  i = 0; i < data.length; i++){
    dlTools.telechargerUnScan(data[i].name, data[i].lastChapter);
}

//surveillance.recupDerniersChapitresSortis();