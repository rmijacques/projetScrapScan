const fs = require("fs");
const tools = require('./tools.js');

const USER_DATA_URL = "usersData.json";

module.exports = {

    getFullMangaList: function () {
        let result = [];
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        console.log(usersData);
        usersData.forEach(user => {
            user.mangaList.forEach(manga => {
                result.push(manga);
            });
        });
        return result;
    },

    chapitreInUserData: function (userName, mangaName, chapterNum) {
        let result;
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        let userToCheck;
        userToCheck = usersData.find(user => user.name == userName);
        if (userToCheck == undefined) {
            console.log("User inexistant");
            return false;
        }
        if(userToCheck.mangaList == undefined){
            console.log("L'utilisateur n'a pas de liste de manga ");
            //TODO: ajouter création automatique de la liste de mangas
            return false;
        }
        console.log(mangaName + " " + chapterNum);
        result = userToCheck.mangaList.find(chapitre => chapitre.name === mangaName && chapitre.lastChapter === parseInt(chapterNum));
        if (result == undefined) {
            console.log("Chapitre inexistant");
            return false;
        }
        return true;
    },

    updateList: function (userName, mangaName, numChapter) {
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        let user;
        let manga;
        let resJson;

        numChapter = parseInt(numChapter,10);
        mangaName = tools.formatMangaName(mangaName);

        if ((user = usersData.find((elem) => elem.name == userName)) != undefined) {
            if ((manga = user.mangaList.find((elem) => elem.name == mangaName)) != undefined) {
                manga.lastChapter = numChapter;
            } 
            else {
                let ret = {
                    name: mangaName,
                    lastChapter: numChapter
                };
                user.mangaList.push(ret);
            }
        }
        
        resJson = JSON.stringify(usersData, null, 4);
        fs.writeFile(USER_DATA_URL, resJson, 'utf8', function (err/*, data*/) {
            if (err) {
                console.log(err);
            }
        });
    },

    isInDataBase: async function (userName) {

        let usersData = await JSON.parse(fs.readFileSync(USER_DATA_URL));

        for (let user = 0; user < usersData.length; user++) {
            if (userName == usersData[user].name) {
                return usersData[user].name;
            }
        }
        return "not identified";
    }
};