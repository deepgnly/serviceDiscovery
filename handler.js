var callDatabase = require("./sqllite").callDatabase

async function handleRoute(storeObj, routeString) {


    let sql = prepareSqlFromTableObj(storeObj.RouteMap[routeString])
    try {
        let rows=await callDatabase(storeObj.dbConnectionObj, sql)
        return rows
    } catch (err) {
        return err
    }
}


function prepareSqlFromTableObj(tableMetaObj) {

    return "select * from course"
}

function createHandlerFromTable(storeObj) {
    let eachTable
    for (let key in storeObj.TableMap) {
        eachTable = storeObj.TableMap[key]
        if (eachTable.doTableHaveAtleastOneForeignKey === true) {
            continue
        }
        //has no foreign key
        storeObj.RouteMap[eachTable.tableName] = eachTable
    }
}

module.exports = {
    createHandlerFromTable, handleRoute
}