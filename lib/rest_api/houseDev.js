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
                companyId: '61ed2777f5178ce385654350',
                status: 0,
                serviceCharge:'半個月',
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
        const companyId = req.body.companyId
        const serviceCharge = req.body.serviceCharge
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
        const status = req.body.status*1
        const response = {
            'status':true,
            'data':''
        }
        houseDev.addHouseDev(name,companyId,status,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,(result,data)=> {
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
                companyId: '61ed2777f5178ce385654350',
                status: 0,
                serviceCharge:'半個月',
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
        const companyId = req.body.companyId
        const serviceCharge = req.body.serviceCharge
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
        const status = req.body.status*1
        const response = {
            'status':true,
            'data':''
        }
        houseDev.editHouseDev(id,name,companyId,status,serviceCharge,city,area,owner,address,saleType,source,hostName,hostPhone,hostGender,remark,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        })
    });



    app.get(preRestApi + '/getHouseDevList', function(req, res) {
       /*
        #swagger.parameters['isDelete'] = {
            in: 'query',
            type: 'boolean',
        }
        #swagger.parameters['sort'] = {
            in: 'query',
            type: 'string',
            schema: '{\"updateTime\":1}'
        }
        */ 
        let isDelete = req.query.isDelete
        let skip = req.query.skip
        let limit = req.query.limit
        const city = req.query.city
        const area = req.query.area
        const name = req.query.name
        let status = req.query.status
        const companyId = req.query.companyId
        const saleType = req.query.saleType
        const owner = req.query.owner

        status = status*1
        skip = skip*1;
        limit = limit*1
        if(isDelete == 'true'){
            isDelete = true
        }else{
            isDelete = false
        }

        const queryInfos = houseDev.getHouseDevListQueryInfos(isDelete,name,status,companyId,owner,city,area,saleType)
        let sort;
        try{
            sort = JSON.parse(req.query.sort)
        }catch(e){
            sort = {}
        }
        const response = {
            'status':true,
            'data':''
        }

        houseDev.getHouseDevList(queryInfos,skip,limit,sort,(result,data)=> {
            response.status = result;
            response.data = data
            res.send(response);
        }) 
    });

  

}