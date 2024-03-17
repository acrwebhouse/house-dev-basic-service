const mongoDB = require('../db/mongoDB');
const config = require('../setting/config').config;
const utilsValue = require('../utils/value');
const path = require('path');
const collectionName = config.mongoDBCollection.houseDevCollection;
const { ObjectId } = require('mongodb'); // or ObjectID 

const houseDevDoc = {
    name:'',
    companyId:'',
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

function addHouseDev(name,companyId,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,callback) {
    const doc = newHouseDevDoc()
    if(utilsValue.isValid(name)){
        doc.name = name
    }
    if(utilsValue.isValid(companyId)){
        doc.companyId = ObjectId(companyId)
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

function editHouseDev(id,name,companyId,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark, callback) {
    if (id.length == 24){
        const updateData = {
            name,
            companyId:ObjectId(companyId),
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

function editHousesNoCheckUniqueAddress(searchDoc,updateData, callback) {

    if(utilsValue.isValid(searchDoc._id)){
        searchDoc._id = ObjectId(searchDoc._id)
    }

    if(utilsValue.isValid(searchDoc.owner)){
        searchDoc.owner = ObjectId(searchDoc.owner)
    }

    if(utilsValue.isValid(searchDoc.belongId)){
        searchDoc.belongId = ObjectId(searchDoc.belongId)
    }

    if(utilsValue.isValid(updateData.owner)){
        updateData.owner = ObjectId(updateData.owner)
    }

    if(utilsValue.isValid(updateData.belongId)){
        updateData.belongId = ObjectId(updateData.belongId)
    }

    mongoDB.updateMany(collectionName, searchDoc, updateData, (result,data)=>{
        if(result && data.nModified>0){
            callback(true,data)
        }else{
            callback(false,data)
        }
    });    
}


function getHouseListQueryInfos(isDelete,ownerArray,creatorArray,city,area,minFloor,maxFloor,minPrice,maxPrice,minPing,maxPing,minRoom,maxRoom,buildingType,typeOfRental,parking,pet,manager,garbage,smoke,cook,belongType,belongId,textQuery,minCreateTime,maxCreateTime){
    const queryInfo = {
        isDelete
    }

    let queryInfos = []
    
    for(let i = 0 ;i<ownerArray.length;i++){
        ownerArray[i] = ObjectId(ownerArray[i])
    }
    if(ownerArray.length > 0){
        const searchOwner = {}
        searchOwner['$in'] = ownerArray
        queryInfo.owner = searchOwner
    }

    for(let i = 0 ;i<creatorArray.length;i++){
        creatorArray[i] = ObjectId(creatorArray[i])
    }
    if(creatorArray.length > 0){
        const searchCreator = {}
        searchCreator['$in'] = creatorArray
        queryInfo.creator = searchCreator
    }

    if(utilsValue.isValid(city)){
        queryInfo.city = city
    }

    if(utilsValue.isValid(area)){
        queryInfo.area = area
    }

    if(utilsValue.isNumber(minFloor) && utilsValue.isNumber(maxFloor)){
        queryInfo.floor = {
            $lte : maxFloor,
            $gte : minFloor
        }
    }
    
    if(utilsValue.isNumber(minPrice) && utilsValue.isNumber(maxPrice)){
        queryInfo.price = {
            $lte : maxPrice,
            $gte : minPrice
        }
    }

    if(utilsValue.isNumber(minPing) && utilsValue.isNumber(maxPing)){
        queryInfo.ping = {
            $lte : maxPing,
            $gte : minPing
        }
    }

    if(utilsValue.isNumber(minRoom) && utilsValue.isNumber(maxRoom)){
        queryInfo['config.room'] = {
            $lte : maxRoom,
            $gte : minRoom
        }
    }
    
    if(utilsValue.isNumber(buildingType)){
        queryInfo['config.buildingType'] = buildingType
    }

    if(utilsValue.isNumber(typeOfRental)){
        queryInfo['saleInfo.typeOfRental'] = typeOfRental
    }

    if(utilsValue.isTrueStr(parking)){
        queryInfo.parking = true
    }

    if(utilsValue.isTrueStr(pet)){
        queryInfo['saleInfo.pet'] = true
    }

    if(utilsValue.isTrueStr(manager)){
        queryInfo['saleInfo.manager'] = true
    }

    if(utilsValue.isTrueStr(garbage)){
        queryInfo['saleInfo.garbage'] = true
    }

    if(utilsValue.isTrueStr(smoke)){
        queryInfo['saleInfo.smoke'] = true
    }

    if(utilsValue.isTrueStr(cook)){
        queryInfo['saleInfo.cook'] = true
    }
    
    if(utilsValue.isValid(belongType)){
        queryInfo.belongType = belongType*1
    }

    if(utilsValue.isValid(belongId)){
        queryInfo.belongId = ObjectId(belongId)
    }

    if(utilsValue.isValid(minCreateTime) && utilsValue.isValid(maxCreateTime) ){
        queryInfo.createTime = {
            $gte: getSaveDate(minCreateTime),
            $lte: getSaveDate(maxCreateTime),
        }
    }

    if(utilsValue.isValid(textQuery)){
        const textQueryExp = []
        const queryAddress = {'address':new RegExp(textQuery),isDelete}
        const queryTraffic = {isDelete}
        queryTraffic['traffic.name'] = new RegExp(textQuery)
        const queryLife = {isDelete}
        queryLife['life.name'] = new RegExp(textQuery)
        const queryEducate = {isDelete}
        queryEducate['educate.name'] = new RegExp(textQuery)
        textQueryExp.push(queryAddress)
        textQueryExp.push(queryTraffic)
        textQueryExp.push(queryLife)
        textQueryExp.push(queryEducate)
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
// exports.getHouseListQueryInfos = getHouseListQueryInfos