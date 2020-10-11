require('dotenv').config();

function GetUrl(database_name) {
    switch (database_name) {
        case 'core_ID':
            return process.env.core_ID;
        case 'core_password':
            return process.env.core_password;
        case 'supServer':
            return process.env.supServer;
        default:
            return process.env.mongodbPath;
    }
}

module.exports.GetUrl=GetUrl;