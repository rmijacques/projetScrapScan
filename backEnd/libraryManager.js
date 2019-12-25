const fs = require('fs');
const tools = require('./tools.js');
const directory_tree = require('directory-tree');
const rimraf = require('rimraf');

const USER_DATA_URL = "usersData.json";
const LIBRARY_URL = "temp/bibliotheque.json";
const TEMP_URL= "temp/"

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
        let trouverManga = library.find((elem)=>mangaName == elem.name);
    
        if(trouverManga){
            return trouverManga.chapters.find(({numChapter:c1}) => c1 === numChapter) != undefined;
        }
        else{
            return false;
        }
    },
    updateMangaLibrary : function(mangaName, chapterNum, nbPages) {
        let srcPages = [];
        let parsedChapterNum = parseInt(chapterNum, 10);
        let addrPage = "temp/" + mangaName + "/" + chapterNum + "/";
        let aEcrire;
        let jsonAvantModif = fs.readFileSync(LIBRARY_URL, (err) => {
            console.log("Erreur lecture JSON: " + err)
        });
        let logAvantModif = JSON.parse(jsonAvantModif);
        let mangaDejaPresent = false;
        let mangaChoisi;
    
        for (let i = 1; i < nbPages; i++) {
            srcPages[i - 1] = addrPage + i + ".png";
        }
        if (logAvantModif.length > 0) {
            //Si le manga est dans la biblio de l'user
            mangaChoisi = logAvantModif.findIndex((manga) => {
                return manga.name == mangaName;
            });
            if (mangaChoisi != -1) {
                logAvantModif[mangaChoisi].chapters.push({
                    numChapter: parsedChapterNum,
                    listePages: srcPages
                });
                logAvantModif[mangaChoisi].chapters.sort((a, b) => {
                    return b.numChapter - a.numChapter;
                })
            } else {
                aEcrire = {
                    name: mangaName,
                    chapters: [{
                        numChapter: parsedChapterNum,
                        listePages: srcPages
                    }]
                }
                logAvantModif.push(aEcrire);
            }
        
        }
        //Si la biblio est vide
        else {
            aEcrire = {
                name: mangaName,
                chapters: [{
                    numChapter: parsedChapterNum,
                    listePages: srcPages
                }]
            }
            logAvantModif.push(aEcrire);
        }
        fs.writeFileSync(LIBRARY_URL, JSON.stringify(logAvantModif, null, '\t'), (err) => {
            console.log(err)
        })
    },

    synchronizeLibrary: function() {
        let library = JSON.parse(fs.readFileSync(LIBRARY_URL));
    
        //Remove every manga/chapter in the json that are not in the temp directory
        library.forEach((index, elem, object) => {
            let mangaName = elem.name;
            let mangaURL = TEMP_URL + mangaName;
            if (fs.existsSync(mangaURL)) {
                elem.chapters.forEach((index, elem, object) => {
                    let numChapter = elem.numChapter;
                    let chapURL = mangaURL + "\\" + numChapter;
                    if (fs.existsSync(chapURL)) {
                        let chapValid = true;
                        elem.listePages.forEach((elem) => {
                            if (fs.existsSync(elem)) {
                                
                            } else {
                                chapValid = false
                            }
                        });
                    } else {
                        object.slice(index, 1);
                        console.log("[REMOVE] : " + chapURL);
                    }
                    if (!chapValid) {
                        object.slice(index, 1);
                        rimraf(chapURL, () => {
                            console.log("[REMOVE] : " + chapURL);
                        });
                    }
                });
            } else {
                object.slice(index, 1);
                console.log("[REMOVE] : " + mangaURL);
            }
        });
        fs.createWriteStream(LIBRARY_URL, library);
        let mangaTree = directory_tree(TEMP_URL);
    
        //Remove every manga/chapter in the temp file that are not in the json
        mangaTree.children.forEach((elem) => {
            if (elem.name != "bibliotheque.json") {
                let mangaName = elem.name;
                if (this.mangaInLibrary(mangaName)) {
                    elem.children.forEach((elem) => {
                        if (elem.name != "cover.jpg") {
                            let numChapter = elem.name;
                            if (this.chapitreInLibrary(mangaName, numChapter)) {
    
                            } else {
                                rimraf(elem.path, () => {
                                    console.log("[REMOVE] : " + elem.path);
                                });
                            }
                        }
                    });
                } else {
                    rimraf(elem.path, () => {
                        console.log("[REMOVE] : " + elem.path);
                    });
                }
            }
        });
    }
}