module.exports = {
    formatMangaName : function(name){
        return name.replace(/ /gi,'-').replace(/\'/gi,'').replace(/\:/gi,'-').replace(/\./gi,'-').toLowerCase();
    }
}