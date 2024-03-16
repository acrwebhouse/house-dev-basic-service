exports.on = function(app) {
    const preRestApi = '/houseDev';
    const houseDev = require('../role/houseDev');
    const utilsValue = require('../utils/value');
    const { ObjectId } = require('mongodb'); // or ObjectID 

    app.post(preRestApi + '/addHouseDev', function(req, res) {
        /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Add a houseDev',
            schema: {
                name:'文山區好房子',
                city:'台北市',
                area:'文山區',
                owner: '61ed2777f5178ce385654350',
                address:'台北市文山區興隆路四段',
                saleType:1,
                source:'591租屋',
                hostName:'王大明',
                hostPhone:'0939520012',
                hostGender:true,
                remark:'備註內容'
            }
        }*/ 

        
        const name = req.body.name
        const city = req.body.city
        const area = req.body.area
        const owner = req.body.owner
        const address = req.body.address
        const saleType = req.body.saleType
        const source = req.body.source
        const hostName = req.body.hostName
        const hostPhone = req.body.hostPhone
        const hostGender = req.body.hostGender
        const remark = req.body.remark
        
        const response = {
            'status':true,
            'data':''
        }
        houseDev.addHouseDev(name,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.delete(preRestApi + '/removeHouseDev', function(req, res) {
       /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Remove a house Dev',
            schema: {
                ids: ['61ed2777f5178ce385654350','61ed2777f5178ce385654353']
            }
        }*/ 
        const ids = req.body.ids
        const response = {
            'status':true,
            'data':''
        }
        houseDev.removeHouseDev(ids,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });

    app.get(preRestApi + '/getHouseDev', function(req, res) {
        /*
         #swagger.parameters['isDelete'] = {
             in: 'query',
             type: 'boolean',
         }
         */
         const response = {
            'status':true,
            'data':''
        }
         const id = req.query.id
         const isDelete = req.query.isDelete
         houseDev.getHouseDev(id,isDelete,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
     });

    app.put(preRestApi + '/editHouseDev', function(req, res) {
       /*#swagger.parameters['obj'] = {
            in: 'body',
            description: 'Edit a house',
            schema: {
                id:'61ed2777f5178ce385654350',
                name:'文山區好房子',
                city:'台北市',
                area:'文山區',
                owner: '61ed2777f5178ce385654350',
                address:'台北市文山區興隆路四段',
                saleType:1,
                source:'591租屋',
                hostName:'王大明',
                hostPhone:'0939520012',
                hostGender:true,
                remark:'備註內容'
            }
        }*/ 

        const id = req.body.id
        const name = req.body.name
        const city = req.body.city
        const area = req.body.area
        const owner = req.body.owner
        const address = req.body.address
        const saleType = req.body.saleType
        const source = req.body.source
        const hostName = req.body.hostName
        const hostPhone = req.body.hostPhone
        const hostGender = req.body.hostGender
        const remark = req.body.remark
        const response = {
            'status':true,
            'data':''
        }
        houseDev.editHouseDev(id,name,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });



    // app.get(preRestApi + '/getHouses', function(req, res) {
    //    /*
    //     #swagger.parameters['isDelete'] = {
    //         in: 'query',
    //         type: 'boolean',
    //     }
    //     #swagger.parameters['sort'] = {
    //         in: 'query',
    //         type: 'string',
    //         schema: '{\"updateTime\":1}'
    //     }
    //     */ 
    //     let isDelete = req.query.isDelete
    //     let skip = req.query.skip
    //     let limit = req.query.limit
    //     let minPrice = req.query.minPrice
    //     let maxPrice = req.query.maxPrice
    //     let minPing = req.query.minPing
    //     let maxPing = req.query.maxPing
    //     let minRoom = req.query.minRoom
    //     let maxRoom = req.query.maxRoom
    //     let minFloor = req.query.minFloor
    //     let maxFloor = req.query.maxFloor
    //     let buildingType = req.query.buildingType
    //     const city = req.query.city
    //     const area = req.query.area
    //     //特色
    //     const parking = req.query.parking
    //     const pet = req.query.pet
    //     const manager = req.query.manager
    //     const garbage = req.query.garbage
    //     const smoke = req.query.smoke
    //     const cook = req.query.cook
    //     const textQuery = req.query.textQuery
    //     const owner = req.query.owner
    //     let isShowTransaction = req.query.isShowTransaction

    //     //類型
    //     let typeOfRental = req.query.typeOfRental
    //     minPrice = minPrice*1
    //     maxPrice = maxPrice*1
    //     minPing = minPing*1
    //     maxPing = maxPing*1
    //     minRoom = minRoom*1
    //     maxRoom = maxRoom*1
    //     minFloor = minFloor*1
    //     maxFloor = maxFloor*1
    //     typeOfRental = typeOfRental*1
    //     buildingType = buildingType*1

    //     //歸屬
    //     const belongType = req.query.belongType
    //     const belongId = req.query.belongId

    //     skip = skip*1;
    //     limit = limit*1
    //     if(isDelete == 'true'){
    //         isDelete = true
    //     }else{
    //         isDelete = false
    //     }

    //     if(isShowTransaction == 'true'){
    //         isShowTransaction = true
    //     }else{
    //         isShowTransaction = false
    //     }
        
    //     const ownerArray = []
    //     if(utilsValue.isValid(owner)){
    //         ownerArray.push(owner)
    //     }
    //     const queryInfos = house.getHouseListQueryInfos(isDelete,ownerArray,[],city,area,minFloor,maxFloor,minPrice,maxPrice,minPing,maxPing,minRoom,maxRoom,buildingType,typeOfRental,parking,pet,manager,garbage,smoke,cook,belongType,belongId,textQuery,'','')
    //     let sort;
    //     try{
    //         sort = JSON.parse(req.query.sort)
    //     }catch(e){
    //         sort = {}
    //     }
    //     const response = {
    //         'status':true,
    //         'data':''
    //     }

    //     house.getHouseList(queryInfos,skip,limit,sort,isShowTransaction,(result,data)=> {
    //         response.status = result;
    //         response.data = data
    //         res.send(response);
    //     }) 
    // });

  

}