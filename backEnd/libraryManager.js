const fs = require('fs');
const tools = require('./tools.js')

const USER_DATA_URL = "usersData.json";
const LIBRARY_URL = "temp/bibliotheque.json";

module.exports = {
    getLibraryByUser: async function (userName) {
        let result = []
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        let library = JSON.parse(fs.readFileSync(LIBRARY_URL));
        
        //Trouver la liste des mangas que le user suit
        let userLibrary = usersData.find((elem) => {
            return elem.name == userName;
        });
        //console.log("UserLib : " + JSON.stringify(userLibrary));

        //Va chercher dans la librairie tout les chapitres existant que le user suit
        userLibrary.mangaList.forEach((elem) => {
            let mangaName = tools.formatMangaName(elem.name);
            //console.log(mangaName);
            let manga = library.find((elem) => {
                return elem.name == mangaName;
            });
            if (manga == undefined) {
                console.log("Warning ! " + USER_DATA_URL + " and " + LIBRARY_URL + " not synchronized");
            }
            result.push(manga);
        });

        return result;
    },

    getLibraryByScan: async function (mangaName, numChapter) {
        let parseNumChapter = parseInt(numChapter, 10);
        let library = JSON.parse(fs.readFileSync(LIBRARY_URL));
        let manga = library.find((elem) => {
            return elem.name == mangaName;
        });
        
        mangaName = tools.formatMangaName(mangaName);
        
        if (manga == undefined) {
            return undefined;
        } else {
            let scan = manga.chapters.find((elem) => {
                return elem.numChapter == parseNumChapter;
            })
            if (scan == undefined){
                return undefined;
            } else {
                return scan.listePages;
            }
        }
    },

    mangaInLibrary: function(mangaName){
        let library = JSON.parse(fs.readFileSync(LIBRARY_URL));
        mangaName = tools.formatMangaName(mangaName);
        let recherche = library.find((elem)=>elem.name == mangaName);
        return recherche != undefined;
    },

    chapitreInLibrary: function(mangaName,numChapter){
        let library = JSON.parse(fs.readFileSync(LIBRARY_URL));
        mangaName = tools.formatMangaName(mangaName);
        let trouverManga = library.find((elem)=>elem.name);
    
        if(trouverManga){
            return trouverManga.chapters.find(({numChapter:c1}) => c1 === numChapter) != undefined;
        }
        else{
            return false;
        }
    }
}