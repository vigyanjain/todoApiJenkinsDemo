const dotenv = require('dotenv');
const result = dotenv.config();

if (result.error){
    throw result.error;
}

module.exports = {
    PORT: process.env.PORT,
    MURI: process.env.MURI,
    MDB: process.env.MDB
};