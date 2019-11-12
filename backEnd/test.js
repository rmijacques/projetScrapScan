const downloadTools = require('./downloadTools.js');
const outingsWatcher = require('./outingsWatcher.js');
const userManager = require('./userManager.js')
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');


// var file = fs.readFileSync("usersData.json");
// var data = JSON.parse(file)[0]["mangaList"];
// console.log(data);

// downloadTools.telechargerUnScan("shingeki-no-kyojin", 121);

let abc = [1,2,3];
let b;
if((b = abc.find((elem) => elem == 1)) == 1){
    console.log("true")
}
