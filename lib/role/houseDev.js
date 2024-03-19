const mongoDB = require('../db/mongoDB');
const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const path = require('path');
const collectionName = config.mongoDBCollection.houseDevCollection;
const { ObjectId } = require('mongodb'); // or ObjectID 

const houseDevDoc = {
    name:'',
    companyId:'',
    state: 0,
    serviceCharge: '',
    city:'',
    area:'',
    owner: null,
    address:'',
    saleType:0,
    source : '' , 
    hostName:'',
    hostPhone: '',
    hostGender:true,
    remark:'',
    isDelete:false,
    // createTime:
    // updateTime:
}
const userCollection = config.mongoDBCollection.userCollection;

function newHouseDevDoc(){
    const doc = JSON.parse(JSON.stringify(houseDevDoc))
    const date = new Date();
    doc.createTime = date;
    doc.updateTime = date;
    return doc;
}

function addHouseDev(name,companyId,state,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,callback) {
    const doc = newHouseDevDoc()
    if(utilsValue.isValid(name)){
        doc.name = name
    }
    if(utilsValue.isValid(companyId)){
        doc.companyId = ObjectId(companyId)
    }
    if(utilsValue.isValid(state)){
        doc.state = state
    }
    if(utilsValue.isValid(serviceCharge)){
        doc.serviceCharge = serviceCharge
    }
    if(utilsValue.isValid(city)){
        doc.city = city
    }
    if(utilsValue.isValid(area)){
        doc.area = area
    }
    if(utilsValue.isValid(owner)){
        doc.owner = ObjectId(owner)
    }
    if(utilsValue.isValid(address)){
        doc.address = address
    }
    if(utilsValue.isValid(saleType)){
        doc.saleType = saleType
    }
    if(utilsValue.isValid(source)){
        doc.source = source
    }
    if(utilsValue.isValid(hostName)){
        doc.hostName = hostName
    }
    if(utilsValue.isValid(hostPhone)){
        doc.hostPhone = hostPhone
    }
    if(utilsValue.isValid(hostGender)){
        doc.hostGender = hostGender
    }
    if(utilsValue.isValid(remark)){
        doc.remark = remark
    }
    mongoDB.insert(collectionName, doc, callback);
}

function removeHouseDev(ids,callback){
    let isValid = true;
    for(let i = 0;i<ids.length;i++){
        if(ids[i].length!=24){
            isValid = false;
        }
    }
    if(isValid == true){
        const objectIds = []
        for(let i = 0 ;i<ids.length;i++ ){
            objectIds.push(ObjectId(ids[i]))
        }
        const searchDoc = {
            '_id': {$in : objectIds}
        }
        const updateData = {
            isDelete:true,
            updateTime: new Date()
        }
        mongoDB.updateMany(collectionName, searchDoc, updateData, (result,data)=>{
            if(result && data.nModified>0){
                callback(true,data)
            }else{
                callback(false,data)
            }
        });
    }else{
        callback(false, 'ids is invalid')
    }
}

function editHouseDev(id,name,companyId,state,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark, callback) {
    if (id.length == 24){
        const updateData = {
            name,
            companyId:ObjectId(companyId),
            state,
            serviceCharge,
            city,
            area,
            owner:ObjectId(owner),
            address,
            saleType,
            source,
            hostName,
            hostPhone,
            hostGender,
            remark,
            updateTime: new Date()
        }
        const searchDoc = {
            '_id': ObjectId(id)
        }
        mongoDB.update(collectionName, searchDoc, updateData, (result,data)=>{
            if(result && data.nModified>0){
                callback(true,data)
            }else{
                callback(false,data)
            }
        });

    }else{
        callback(false, 'id invalid')
    }    
}

function getHouseDevListQueryInfos(isDelete,name,state,companyId,owner,city,area,saleType){
    const queryInfo = {
        isDelete
    }

    let queryInfos = []
    
    if(utilsValue.isValid(city)){
        queryInfo.city = city
    }

    if(utilsValue.isValid(area)){
        queryInfo.area = area
    }

    if(utilsValue.isValid(state) && utilsValue.isNumber(state)){
        queryInfo.state = state
    }

    if(utilsValue.isValid(companyId)){
        queryInfo.companyId = ObjectId(companyId)
    }

    if(utilsValue.isValid(owner)){
        queryInfo.owner = ObjectId(owner)
    }

    if(utilsValue.isValid(saleType)){
        queryInfo.saleType = saleType
    }
    
    if(utilsValue.isValid(name)){
        const textQueryExp = []
        const queryName = {'name':new RegExp(name),isDelete}
        textQueryExp.push(queryName)
        const textQueryObj = { '$or' : textQueryExp}
        queryInfos = {'$and':[queryInfo,textQueryObj]}
    }else{
        queryInfos = queryInfo
    }
    return queryInfos;
}

function getHouseDevList(queryInfos,skip,limit,sort,callback){
    const maxLimit = 300

    if (!utilsValue.isNumber(skip)){
        skip = 0;
    }
    if (!utilsValue.isNumber(limit)){
        limit = maxLimit;
    }
    if (!utilsValue.isValid(sort)){
        sort = {updateTime:-1}
    }
    const lookup =
    {
        from: userCollection,
        localField : 'owner',
        foreignField : '_id',
        as: 'ownerData',
    }
    mongoDB.queryJoinCollectionList(collectionName,lookup,queryInfos,skip,limit, sort , (result, msg) => {
        callback(result, msg);
    })
}

function getHouseDev(id,isDelete,callback){
    if(isDelete == 'true'){
        isDelete = true
    }
    if(isDelete == 'false'){
        isDelete = false
    }
    const queryInfo = {
        isDelete,
        '_id':ObjectId(id)
    }
    mongoDB.queryFindOne(collectionName, queryInfo, (result, msg) => {
        callback(result, msg);
    })
}

//sample time : 2022/10/11
function getSaveDate(time){
    let result = new Date()
    if(utilsValue.isValid(time)){
        const calcu = time.split('/')
        if(calcu.length == 3){
            result.setFullYear(calcu[0], calcu[1]-1, calcu[2]);
            result.setHours(8, 0, 0);
        }
    }
    return result
}

exports.addHouseDev = addHouseDev
exports.editHouseDev = editHouseDev
exports.removeHouseDev = removeHouseDev
exports.getHouseDevList = getHouseDevList
exports.getHouseDev = getHouseDev
exports.getHouseDevListQueryInfos = getHouseDevListQueryInfos