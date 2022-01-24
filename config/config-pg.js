//const {Client} = require('pg');
import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
    user: "openpg", 
    password: "openpgpwd",
    host: "localhost",//"172.17.0.1",
    port: 5432,
    database: "emica-test"
})
client.connect();

//module.exports = client;
export default client;