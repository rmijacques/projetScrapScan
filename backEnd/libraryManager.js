const fs = require('fs');

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

        //Va chercher dans la librairie tout les chapitres existant que le user suit
        userLibrary.mangaList.forEach((elem) => {
            let mangaName = elem.name.replace(/ /gi, '-').toLowerCase();
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
    }
}