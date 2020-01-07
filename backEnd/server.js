/*jshint esversion: 8*/
const downloadTools = require('./downloadTools.js');
const userManager = require('./userManager.js');
const libraryManager = require('./libraryManager.js');
const tools = require('./tools.js');
const fs = require('fs');
const express = require('express');
const cors = require('cors');


const LIBRARY_URL = "temp/bibliotheque.json";



//Set up le server
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(cors());

console.log("Server sets up");

/*----------------------------------------- GESTION DES REQUETES HTTP -----------------------------------------*/
//Requete de Base, renvoi une erreur car pas utilisée
app.get('/', function () {
    throw new Error('[custom ]ops ');
});

//make temp directory accessible from outside the app
app.use("/temp", express.static(__dirname + '/temp'));

// Ajouter un error handler (middleware)
app.use(function (error, request, response) {
    console.log(error.message);
    if (error) {
        if (error.message && error.message.match(/^\[custom message\]/gi)) {
            response.send(error.message.replace(/^\[custom message\]/gi, ""));
        } else {
            response.sendStatus(500).send("Internal error");
        }
    }
});

/*----------------------------------------- CREATION DES DOSSIERS POUR GESTION DES SCANS ----------------------------------*/

//Set up le directory de svg de scans
fs.mkdir("temp", function (error) {
    if (error) {
        //console.log("Erreur creation dossier : \n" + error);
    }
});
if (!fs.existsSync(LIBRARY_URL)) {
    fs.mkdir('temp', err => {
        console.log("err mkdir"+err);
    });
    fs.writeFileSync(LIBRARY_URL, '[]', (err) => { console.log(err); });
}

/* ------------------------------------------------- GESTION DES REQUETES SOCKET -----------------------------------------*/

//Sockets
io.on('connection', function(socket){
    socket.emit('connection',"Connecté au serveur");
    console.log('Client connecte');

    socket.on('checkUser',async function(message){
        console.log("////// GOT MESSAGE : checkUser //////");
        console.log(message);

        message = JSON.parse(message);
        let ret = await userManager.isInDataBase(message.userName);  
        socket.emit('checkUser', JSON.stringify({userName: ret}));
    });

    //Recup la liste des urls d'un chapitre et la renvoie
    socket.on('lecteur',async function(message){
        console.log("////// GOT MESSAGE : lecteur //////");
        console.log(message);

        message = JSON.parse(message);
        let mangaName = message.name;
        let numChapter = message.num;
        let ret = await downloadTools.recupUrlsPages(mangaName,numChapter);
        socket.emit('lecteur', JSON.stringify(ret));
    });

    //Recup les dernieres sortie
    socket.on('recupDernieresSorties',async function(message){
        console.log("////// GOT MESSAGE : recupDernieresSorties //////");
        console.log(message);

        message = JSON.parse(message);
        let jsonBiblio = await libraryManager.getLibraryByUser(message.userName);
        socket.emit('recupDernieresSorties',JSON.stringify(jsonBiblio));
    });

    //Recherche un nouveau scan (on le telecharge si il n'est pas present et qu'il existe) et renvoi l'url de ses pages
    //In: chapitre = {mangaName,numChapter}
    socket.on('getChapitre', async function(message){
        console.log("////// GOT MESSAGE : getChapitre //////");
        console.log(message);

        message = JSON.parse(message);
        let name = tools.formatMangaName(message.mangaName);
        let numChapter = message.numChapter;
        let urlList = await libraryManager.getLibraryByScan(name, numChapter);
        if (urlList){
            socket.emit('getChapitre', JSON.stringify({
                urlList: urlList,
                numChapter: numChapter,
                status : "OK"
            }));
        } else {
            if (await downloadTools.verifierExistenceChapitre(name, numChapter)) {
                await downloadTools.telechargerUnScan(name, numChapter);
                urlList = await libraryManager.getLibraryByScan(name, numChapter);
                socket.emit('getChapitre', JSON.stringify({
                    urlList: urlList,
                    numChapter: numChapter,
                    status : "OK"
                }));
            } else {
                socket.emit('getChapitre',JSON.stringify({
                    status : "NOPE"
                }));
            }
        }
    });

    socket.on('getChapitrePageParPage',async function(message){
        console.log("////// GOT MESSAGE : getChapitrePageParPage //////");
        console.log(message);

        message = JSON.parse(message);
        let name = tools.formatMangaName(message.mangaName);
        let numChapter = message.numChapter;
        let urlList = await libraryManager.getLibraryByScan(name, numChapter);
        if (urlList){
            socket.emit('getChapitrePageParPage',JSON.stringify({
                urlList: urlList,
                status : "OK",
                typeData : "listePages"
            }));
        } else {
            if (await downloadTools.verifierExistenceChapitre(name, numChapter)) {
                socket.emit('debutDL');
                await downloadTools.telechargerUnScanPageParPage(name, numChapter,socket);
            } else {
                socket.emit('getChapitre',JSON.stringify({
                    status : "NOPE"
                }));
            }
        }
    });

    socket.on('suivreUnManga', async function(message){
        console.log("////// GOT MESSAGE : suivreUnManga //////");
        console.log(message);

        message = JSON.parse(message);
        let userName = message.userName;
        let mangaName = message.mangaName;
        let numChapter = message.numChapter;
        if(userManager.chapitreInUserData(userName,mangaName,numChapter)){
            socket.emit('suivreUnManga', JSON.stringify({ status: 'deja pres'}));
            return;
        }
        if (await downloadTools.verifierExistenceChapitre(mangaName, numChapter)){
            userManager.updateList(userName,mangaName,numChapter);
            socket.emit('debutDL');
            await downloadTools.telechargerCover(mangaName);
            await downloadTools.telechargerUnScanPageParPage(mangaName, numChapter,socket);
            socket.emit('suivreUnManga', JSON.stringify({ status: 'OK'}));
            return;
        }
        socket.emit('suivreUnManga',JSON.stringify({ status: 'NOPE'}));
    });
});




//lunch scheduled watcher
// schedule.scheduleJob('* * * * *', function(){
//     outingsWatcher.recupDerniersChapitresSortisv2();
// });
server.listen(8080);
console.log('Server started listenning on PORT:8080');