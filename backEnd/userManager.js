const fs = require("fs");

const USER_DATA_URL = "usersData.json";
const LIBRARY_URL = "temp/bibliotheque.json";

module.exports = {

    getFullMangaList: function () {
        let result = [];
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        console.log(usersData)
        usersData.forEach(user => {
            user["mangaList"].forEach(manga => {
                result.push(manga);
            })
        });
        return result;
    },

    chapitreInUserData: function(userName,mangaName,chapterNum){
        let result;
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));
        let userToCheck
        userToCheck = usersData.find(user => user.name == userName);
        if(userToCheck == undefined){
            console.log("User inexistant")
            return false;
        }
        console.log(userToCheck.mangaList[0].name + " " + userToCheck.mangaList[0].nextChapter)
        console.log(mangaName + " "+ chapterNum)
        result = userToCheck.mangaList.find(chapitre => chapitre.name === mangaName && chapitre.nextChapter === parseInt(chapterNum));
        if(result == undefined){
            console.log("Chapitre inexistant")
            return false;
        }
        return true;
    },

    updateList: function (mangaName, numChapter, userName) {
        let usersData = JSON.parse(fs.readFileSync(USER_DATA_URL));

        usersData.forEach(user => {
            if (user.name == userName) {
                user.mangaList.forEach(manga => {
                    if (manga.name == mangaName) {
                        manga.nextChapter = numChapter;
                    }
                })
            }
        });
        resJSON = JSON.stringify(usersData,null,4);
        fs.writeFile(USER_DATA_URL, resJSON, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    },

    isInDataBase: async function (userName) {

        let usersData = await JSON.parse(fs.readFileSync(USER_DATA_URL));

        for (let user = 0; user < usersData.length; user++) {
            if (userName == usersData[user]["name"]) {
                return usersData[user]["name"];
            }
        }

        return "not identified";
    }
}