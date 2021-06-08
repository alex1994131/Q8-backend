import config from "../../config";
import fs from "fs";

export default {
    get: async (req,res,next) => {
        let categories = await req.context.models.Categories.getAll();
        return res.json(categories);
    },
    create: async (req,res,next) => {
        let category = req.body;
        category.id = 0;
        if(req.files&&req.files.length){
            category.img = req.files[0].filename;
            await req.context.models.Categories.create(category).then(async category => {
                let data = await req.context.models.Categories.find(req.body);
                return res.json(data);
            });
        }else{
            await req.context.models.Categories.create(category).then(async category => {
                let data = await req.context.models.Categories.find(req.body);
                return res.json(data);
            });
        }
    },
    getOne: async (req,res,next) => {
        let category = await req.context.models.Categories.getById(req.params.id);
        return res.json(category);
    },
    find: async (req,res,next) => {
        console.log(req.body)
        let categories = await req.context.models.Categories.find(req.body);
        res.json(categories);
        return next();
    },
    update: async (req,res,next) => {
        if(req.files&&req.files.length){
            let category = await req.context.models.Categories.getById(req.params.id);
            if(category&&category.dataValues&&category.dataValues.img){
                fs.unlink(config.BASEURL+category.dataValues.img, (err)=>{    
                    console.log(err)
                });
            }
            req.body.img = req.files[0].filename;
            await req.context.models.Categories.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let categories = await req.context.models.Categories.find(req.body);
                return res.json(categories);
            });
        }else{
            await req.context.models.Categories.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let categories = await req.context.models.Categories.find(req.body);
                return res.json(categories);
            });
        }
    },
    updateStatusForCategories: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Categories.update({
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
        let category = await req.context.models.Categories.getById(req.params.id);
        if(category&&category.dataValues&&category.dataValues.img){
            fs.unlink(config.BASEURL+category.dataValues.img, (err)=>{    
                console.log(err)
            });
        }
        await req.context.models.Categories.delete(req.params.id);
        let categories = await req.context.models.Categories.getAll();
        return res.json(categories);
    },
    deleteCategories: async (req,res,next) => {
        let category = await req.context.models.Categories.getById(req.body.id);
        if(category&&category.dataValues&&category.dataValues.img){
            fs.unlink(config.BASEURL+category.dataValues.img, (err)=>{    
                console.log(err)
            });
        }
        await req.context.models.Categories.delete(req.body.id);
        let categories = await req.context.models.Categories.find(req.body);
        return res.json(categories);
    },
}