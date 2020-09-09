function GetUrl(database_name) {
    //return "mongodb+srv://root:0000@cluster0.tbtdc.gcp.mongodb.net/" + database_name + "?retryWrites=true&w=majority";
    return "mongodb://localhost:27017/";
}

module.exports.GetUrl=GetUrl;