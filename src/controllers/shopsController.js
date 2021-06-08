import config from "../../config";
import fs from "fs";

export default {
    get: async (req,res,next) => {
        let shops = await req.context.models.Shops.getAll();
        return res.json(shops);
    },
    create: async (req,res,next) => {
        let shop = req.body;
        shop.id = 0;
        if(req.files&&req.files.length){
            shop.img = req.files[0].filename;
            await req.context.models.Shops.create(shop).then(async shop => {
                let data = await req.context.models.Shops.getAll();
                return res.json(data);
            });
        }else{
            await req.context.models.Shops.create(shop).then(async shop => {
                let data = await req.context.models.Shops.getAll();
                return res.json(data);
            });
        }
    },
    getOne: async (req,res,next) => {
        let shop = await req.context.models.Shops.getById(req.params.id);
        return res.json(shop);
    },
    find: async (req,res,next) => {
        let shops = await req.context.models.Shops.find(req.body);
        res.json(shops);
        return next();
    },
    update: async (req,res,next) => {
        if(req.files&&req.files.length){
            let shop = await req.context.models.Shops.getById(req.params.id);
            if(shop&&shop.dataValues&&shop.dataValues.img){
                fs.unlink(config.BASEURL+shop.dataValues.img, (err)=>{    
                    console.log(err)
                });
            }
            req.body.img = req.files[0].filename;
            await req.context.models.Shops.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let shops = await req.context.models.Shops.getAll();
                return res.json(shops);
            });
        }else{
            await req.context.models.Shops.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let shops = await req.context.models.Shops.getAll();
                return res.json(shops);
            });
        }
    },
    updateStatusForShops: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Shops.update({
            status: status[i]
            }, {
            id: ids[i]
            }).then(function (updatedRow) {
            console.log(updatedRow);
            });
        }
        res.send(true);
    },
    delete: async (req,res,next) => {
        let shop = await req.context.models.Shops.getById(req.params.id);
        if(shop&&shop.dataValues&&shop.dataValues.img){
            fs.unlink(config.BASEURL+shop.dataValues.img, (err)=>{    
                console.log(err)
            });
        }
        await req.context.models.Shops.delete(req.params.id);
        let shops = await req.context.models.Shops.getAll();
        res.json(shops);
    },
    deleteShops: async (req,res,next) => {
        await req.context.models.Shops.deleteShops(req.body);
        res.send(true);
    },
}