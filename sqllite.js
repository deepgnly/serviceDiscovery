const sqlite3 = require('sqlite3').verbose();

function connectToSqlLiteDb(storeObj, studentLocation) {

    storeObj.dbConnectionObj = new sqlite3.Database('./db/studentDb.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the Studentdb database.');
    });
}

async function callDatabase(dbConnectionObj, sql) {

    return new Promise(function (resolve, reject) {
        dbConnectionObj.all(sql, [], (err, rows) => {
            if (err) {
                reject(err)
            }
            resolve(rows)
        });
    })

}


module.exports = {
    connectToSqlLiteDb,
    callDatabase
}