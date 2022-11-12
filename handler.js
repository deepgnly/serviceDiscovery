var callDatabase = require("./sqllite").callDatabase

async function handleRoute(storeObj, routeString) {

    let tableMetaObj = storeObj.RouteMap[routeString]
    let sql
    if (tableMetaObj.doTableHaveAtleastOneForeignKey) {
        sql = prepareSqlForRelationshipTable(storeObj.RouteMap[routeString])
    } else {
        sql = prepareSqlFromTableObj(storeObj.RouteMap[routeString])
    }

    try {
        let rows = await callDatabase(storeObj.dbConnectionObj, sql)
        return rows
    } catch (err) {
        return err
    }
}


function prepareSqlFromTableObj(tableMetaObj) {

    return "select * from " + tableMetaObj.tableName
}

function prepareSqlForRelationshipTable(tableMetaObj) {

    let baseSql = "select * from " + tableMetaObj.tableName
    let eachColumn,splt
    for (let eachColumnName in tableMetaObj.columnMap) {
        eachColumn = tableMetaObj.columnMap[eachColumnName]

        if (eachColumn.refFrom !== "none") {
            splt = eachColumn.refFrom.split("/")
            refTable = splt[0]
            refColumn = splt[1]
            baseSql += " left JOIN " + refTable + " on " + tableMetaObj.tableName + "." + eachColumn.name + "==" + refTable + "." + refColumn
        }
    }

    return baseSql

}

function createHandlerFromTable(storeObj) {
    let eachTable
    for (let key in storeObj.TableMap) {
        eachTable = storeObj.TableMap[key]
        //has no foreign key
        storeObj.RouteMap[eachTable.tableName] = eachTable
    }
}

module.exports = {
    createHandlerFromTable, handleRoute
}