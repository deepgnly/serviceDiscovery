const fs = require('fs');


class TableMetadata{
    constructor(tableName){
        this.tableName=tableName
        this.columnMap={}
        this.doTableHaveAtleastOneForeignKey=false
    }
    addColumn(columnMetadataObj){
        this.columnMap[columnMetadataObj.name]=columnMetadataObj

        
        if (this.doTableHaveAtleastOneForeignKey==false && (columnMetadataObj.refFrom!=="none")){
            this.doTableHaveAtleastOneForeignKey=true
        }
    }
}

class ColumnMetadata{

    constructor(columnName,isPrimary,refFrom){
        this.name=columnName
        this.isPrimary=isPrimary
        this.refFrom=refFrom
    }
}

function geTableMetadataFromString(storeObj,fileLocation){

    let rawdata = fs.readFileSync(fileLocation)
    let rawJson = JSON.parse(rawdata)

    let tableObj,columnObj
    for (let eachTable of rawJson){

        tableObj=new TableMetadata(eachTable["tableName"])

        for(let eachColumn of eachTable["columns"]){
            columnObj=new ColumnMetadata(eachColumn["name"],eachColumn["isPrimary"],eachColumn["refFrom"])
            tableObj.addColumn(columnObj)
        }
        storeObj.addTable(tableObj)
    }

}

module.exports={
    TableMetadata,
    ColumnMetadata,
    geTableMetadataFromString,
}