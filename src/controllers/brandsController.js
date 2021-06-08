import config from "../../config";
import fs from "fs";

export default {
    get: async (req,res,next) => {
        let brands = await req.context.models.Brands.getAll();
        return res.json(brands);
    },
    create: async (req,res,next) => {
        let brand = req.body;
        brand.id = 0;
        if(req.files&&req.files.length){
            brand.img = req.files[0].filename;
            await req.context.models.Brands.create(brand).then(async brand => {
                let data = await req.context.models.Brands.getAll();
                res.json(data);
                return next();
            });
        }else{
            await req.context.models.Brands.create(brand).then(async brand => {
                let data = await req.context.models.Brands.getAll();
                res.json(data);
                return next();
            });
        }
    },
    getOne: async (req,res,next) => {
        let brand = await req.context.models.Brands.getById(req.params.id);
        return res.json(brand);
    },
    find: async (req,res,next) => {
        let brands = await req.context.models.Brands.find(req.body);
        res.json(brands);
        return next();
    },
    update: async (req,res,next) => {
        if(req.files&&req.files.length){
            let brand = await req.context.models.Brands.getById(req.params.id);
            if(brand&&brand.dataValues&&brand.dataValues.img){
                fs.unlink(config.BASEURL+brand.dataValues.img, (err)=>{    
                    console.log(err)
                });
            }
            req.body.img = req.files[0].filename;
            await req.context.models.Brands.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let brands = await req.context.models.Brands.getAll();
                return res.json(brands);
            });
        }else{
            await req.context.models.Brands.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let brands = await req.context.models.Brands.getAll();
                return res.json(brands);
            });
        }
    },
    updateStatusForBrands: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Brands.update({
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
        let brand = await req.context.models.Brands.getById(req.params.id);
        if(brand&&brand.dataValues&&brand.dataValues.img){
            fs.unlink(config.BASEURL+brand.dataValues.img, (err)=>{    
                console.log(err)
            });
        }
        await req.context.models.Brands.delete(req.params.id);
        let brands = await req.context.models.Brands.getAll();
        res.json(brands);
    },
    deleteBrands: async (req,res,next) => {
        await req.context.models.Brands.deleteBrands(req.body);
        res.send(true);
    },
}