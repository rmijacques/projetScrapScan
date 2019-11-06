const fs = require("fs");

module.exports = {
    
    getFullMangaList: async function () {
        let result = [];
        let usersData = await JSON.parse(fs.readFileSync('usersData.json'));

        for (let user=0; user < usersData.length; user++){
            for (let manga=0; manga < usersData.length; manga++){
                result.push(usersData[user]["mangaList"][manga]);
            }
        }
    },

    isInDataBase: async function (userName){

        let usersData = await JSON.parse(fs.readFileSync('usersData.json'));

        for (let user=0; user < usersData.length; user++){
            if (userName == usersData[user]["name"]){
                return usersData[user]["name"];
            }
        }

        return "not identified";
    }
}