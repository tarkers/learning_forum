require('dotenv').config();

function GetUrl(database_name) {
    //return "mongodb+srv://root:0000@cluster0.tbtdc.gcp.mongodb.net/" + database_name + "?retryWrites=true&w=majority";
    //return "mongodb://localhost:27017/";
    if (database_name == 'supServer')
        return process.env.supportServer
    else
        return process.env.mongodbPlace;
    //return "mongodb+srv://leon1234858:8ntscpal@cluster0.gyixj.gcp.mongodb.net/people?retryWrites=true&w=majority";
}
function GetSAN(type) {
    switch (type) {
        case 'local_uri' :
            return process.env.localUri + '/SAN/activate/';
        case 'sendMailer':
            return process.env.sendMailer;
        case 'Gmail_ID':
            return process.env.sendMailer;
        case 'Gmail_password':
            return process.env.Gmail_password;
        case 'managePage':
            return process.env.managePage;
        default:
            return '';
    }
}

module.exports.GetUrl = GetUrl;
module.exports.GetSAN = GetSAN;