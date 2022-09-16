
/*

Algorithm
Phase 1: Only Queries now , no insertion

1. Idenity tables which has no columns that of foreign key
2. Create a API for the same

3. Identify Tables which have foreign key
4. Create API with Joins

*/


const express = require('express')
const app = express()
var geTableMetadataFromString = require("./tableops").geTableMetadataFromString
var createHandlerFromTable=require("./handler").createHandlerFromTable
var handleRoute=require("./handler").handleRoute
var connectToSqlLiteDb=require("./sqllite").connectToSqlLiteDb

const port = 3000

class Store {
    constructor() {
        this.TableMap = {}
        this.RouteMap = {};
    }
    addTable(tableMetaObj) {
        this.TableMap[tableMetaObj.tableName] = tableMetaObj
    }
}

let storeObj = new Store()

app.get('/metadata/store', (req, res) => {
    res.send(storeObj)
})

app.get('/api/*', async (req, res) => {

    let path = req.params[0]
    let splittedPathArray = path.split("/")
    let responseString={}

    //for phase 1 , only the 0th element is valid
    let firstPath = splittedPathArray[0]
    if (!(firstPath in storeObj.RouteMap)) {
        res.send("First path=" + firstPath + " not found")
    }else{
        responseString=await handleRoute(storeObj,firstPath)
    }

    res.send(responseString)
})

connectToSqlLiteDb(storeObj)
geTableMetadataFromString(storeObj, "./metadata/studentMeta.json")
createHandlerFromTable(storeObj)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
