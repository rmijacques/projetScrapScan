const fs = require("fs");

module.exports = {

    getFullMangaList: function () {
        let result = [];
        let usersData = JSON.parse(fs.readFileSync('usersData.json'));
        console.log(usersData)
        usersData.forEach(user => {
            user["mangaList"].forEach(manga => {
                result.push(manga);
            })
        });
        return result;
    },

    updateList: function (mangaName, numChapter, userName) {
        let usersData = JSON.parse(fs.readFileSync('usersData.json'));

        usersData.forEach(user => {
            if (user.name == userName) {
                user.mangaList.forEach(manga => {
                    if (manga.name == mangaName) {
                        manga.nextChapter = numChapter;
                    }
                })
            }
        });
        resJSON = JSON.stringify(usersData);
        fs.writeFile('usersData.json', resJSON, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
            }
        });
    },

    isInDataBase: async function (userName) {

        let usersData = await JSON.parse(fs.readFileSync('usersData.json'));

        for (let user = 0; user < usersData.length; user++) {
            if (userName == usersData[user]["name"]) {
                return usersData[user]["name"];
            }
        }

        return "not identified";
    }
}