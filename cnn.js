const pgPromise= require('pg-promise')
const config={
    host:'localhost',
    post:'5432',
    database:'dannielos',
    user:'postgres',
    password:'postgres'
}
const pgp=pgPromise({});
const db=pgp(config);
//esportar la BDD
exports.db=db;