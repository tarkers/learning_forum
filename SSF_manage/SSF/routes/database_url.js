function GetUrl(database_name) {
    //return "mongodb+srv://root:0000@cluster0.tbtdc.gcp.mongodb.net/" + database_name + "?retryWrites=true&w=majority";
    //return "mongodb://localhost:27017/";
    return "mongodb+srv://leon1234858:8ntscpal@cluster0.gyixj.gcp.mongodb.net/people?retryWrites=true&w=majority";
}

module.exports.GetUrl=GetUrl;