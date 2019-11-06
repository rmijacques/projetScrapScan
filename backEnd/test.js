const downloadTools = require('./downloadTools.js');
const outingsWatcher = require('./outingsWatcher.js');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');


// var file = fs.readFileSync("usersData.json");
// var data = JSON.parse(file)[0]["mangaList"];
// console.log(data);

downloadTools.telechargerUnScan("one-piece", 900);