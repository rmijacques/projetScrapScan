const downloadTools = require('./downloadTools.js');
const outingsWatcher = require('./outingsWatcher.js');
const userManager = require('./userManager.js');
const libraryManager = require('./libraryManager.js')
const tools = require('./tools.js');
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



//Set up le server
var app = express()
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(cors())

console.log("Server sets up");


//Requete de Base, renvoi une erreur car pas utilisée
app.get('/', function (req, res) {
    throw new Error('[custom ]ops ')
    res.send('Page Acueil');
});


//Sockets
io.on('connection',function(socket){
    console.log('Client connecte');
    socket.on('checkUser',async function(userName){
        let ret = await userManager.isInDataBase(userName);  
        socket.emit('checkUser',ret);
    });

    //Recup la liste des urls d'un chapitre et la renvoie
    socket.on('lecteur',async function(chapitre){
        let mangaName = chapitre.name;
        let numChapter = chapitre.num;
        let ret = await downloadTools.recupUrlsPages(mangaName,numScan);
        socket.emit('lecteur',JSON.stringify(ret));
    });

    //Recup les dernieres sortie
    socket.on('recupDernieresSorties',await function(userName){
        let jsonBiblio = await libraryManager.getLibraryByUser(userName);
        socket.emit('recupDernieresSorties',jsonBiblio);   
    });

    //Recherche un nouveau scan (on le telecharge si il n'est pas present et qu'il existe) et renvoi l'url de ses pages
    //In: chapitre = {mangaName,numChapter}
    socket.on('getChapitre',async function(chapitre){
        let name = tools.formatMangaName(chapitre.mangaName);
        let numChapter = chapitre.num;
        let urlList = await libraryManager.getLibraryByScan(name, numChapter);
        if (urlList){
            socket.emit(JSON.stringify({
                urList: urlList,
                status : "OK"
            }))
        } else {
            if (await downloadTools.verifierExistenceChapitre(name, numCHapter)) {
                await downloadTools.telechargerUnScan(name, numChapter);
                urlList = await libraryManager.getLibraryByScan(name, numChapter);
                socket.emit(JSON.stringify({
                    urList: urlList,
                    status : "OK"
                }))
            } else {
                socket.emit(JSON.stringify({
                    status : "NOPE"
                }))
            }
        }
    });
    socket.on('suivreUnManga',function(infos){
        let userName = infos.userName;
        let mangaName = infos.mangaName;
        let numChapter = infos.numChapter;
        if(userManager.chapitreInUserData(userName,mangaName,numChapter)){
            socket.emit(json.stringify({ status: 'deja pres'}));
            return;
        }
        if (await downloadTools.verifierExistenceChapitre(mangaName, numCHapter)){
            userManager.updateList(req.params.userName,mangaName,numCHapter);
            socket.emit(json.stringify({ status: 'OK'}));
            return;
        }
        socket.emit('suivreUnManga',json.stringify({ status: 'NOPE'}));
    })
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



server.listen(8080);
console.log('Server started listenning on PORT:8080');