import fs from "fs";
import config from "../../config";
export default {
    get: async (req,res,next) => {
        let products = await req.context.models.Products.getAll();
        return res.json(products);
    },
    create: async (req,res,next) => {
        let product = req.body;
        product.id = 0;
        var filenames = "";
        var flag = 1;
        for(let i in req.files)
        {
            if(req.files[i].fieldname=='qrcode'){
                req.body.qrcode = req.files[i].filename;
            }else{
                if((req.files.length-1)==i){
                    filenames += req.files[i].filename;
                }else{
                    filenames += req.files[i].filename + " @@@@@ ";
                }
                product.files=filenames;
            }
            if(flag == req.files.length)
            {
                await req.context.models.Products.create(product).then(async product => {
                    let products = await req.context.models.Products.find(req.body);
                    res.json(products);
                    return next();
                });
            }
            flag++;
        }
    },
    getOne: async (req,res,next) => {
        let product = await req.context.models.Products.getById(req.params.id);
        return res.json(product);
    },
    find: async (req,res,next) => {
        let products = await req.context.models.Products.find(req.body);
        res.json(products);
        return next();
    },
    update: async (req,res,next) => {
        var filenames = "";
        var flag = 1;
        if(req.files&&req.files.length){

            let product = await req.context.models.Products.getById(req.params.id);
            if(product&&product.dataValues&&product.dataValues.files){
                filenames = product.dataValues.files+' @@@@@ ';
            }
            
            for(let i in req.files)
            {
                if(req.files[i].fieldname=='qrcode'){
                    req.body.qrcode = req.files[i].filename;
                }else{
                    if((req.files.length-1)==i){
                        filenames += req.files[i].filename;
                    }else{
                        filenames += req.files[i].filename + " @@@@@ ";
                    }
                    req.body.files = filenames;
                }
                if(flag == (req.files.length))
                {
                    await req.context.models.Products.update(
                        req.body,
                        {where: {id: req.params.id}}
                    )
                    .then(async (updatedRow) => {
                        console.log('req.body', req.body)
                        let products = await req.context.models.Products.find(req.body);
                        res.json(products);
                        return next(); 
                    });
                }
                flag++;
            }
        }else{
            await req.context.models.Products.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let products = await req.context.models.Products.find(req.body);
                res.json(products);
                return next(); 
            });
        }
    },
    updateStatusForProducts: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Products.update({
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
        let product = await req.context.models.Products.getById(req.params.id);
        if(product&&product.dataValues&&product.dataValues.files){
            var files = product.dataValues.files;
            files = files.split(' @@@@@ ');
            for(var i in files){
                fs.unlink(config.BASEURL+files[i], (err)=>{    
                    console.log(err)
                });
            }
        }
        await req.context.models.Products.delete(req.params.id);
        let products = await req.context.models.Products.getAll();
        return res.json(products);
    },
    deleteProducts: async (req,res,next) => {
        let product = await req.context.models.Products.getById(req.body.id);
        if(product&&product.dataValues&&product.dataValues.files){
            var files = product.dataValues.files;
            files = files.split(' @@@@@ ');
            for(var i in files){
                fs.unlink(config.BASEURL+files[i], (err)=>{    
                    console.log(err)
                });
            }
        }
        await req.context.models.Products.delete(req.body.id);
        let products = await req.context.models.Products.find(req.body);
        return res.json(products);
    },
}