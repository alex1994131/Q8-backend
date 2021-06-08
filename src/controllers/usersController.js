import md5 from 'md5';
import fs from "fs";
import nodemailer from "nodemailer";
import phoneToken from "generate-sms-verification-code";
import config from "../../config";

export default {
    login: async (req,res,next) => {
        let user = await req.context.models.Users.findByLogin(req.body.email, md5(req.body.password), req.body.mode);
        if(user) {
            let token = md5(req.body.email + req.body.password + (new Date()).getTime());
            await req.context.models.Users.update(
                {authToken: token},
                {where: {id: user.id}}
            )
            .then(async updatedRow=>{
                let permission = await req.context.models.Permissions.find({userid:user.id});
                user.dataValues.permission = permission;
                res.json({status:true, authToken: token, user: user});
                return next();
            })
            .catch(()=>{
                res.status(404).send({ message: 'An error occurred.'});
                return next();
            });
        }else{
            res.status(200).send({status:false, message: "Email or password incorrect."});
            return next();
        }
    },
    register: async (req,res,next) => {
        delete req.body.valied;
        req.body.password = md5(req.body.password);
        req.body.id = 0;
        let token = md5(req.body.email + req.body.password + (new Date()).getTime());
        req.body.authToken = token;
        return await req.context.models.Users.create(req.body)
        .then(function(user) {
            if(user) {
                res.status(200).send({status:true, authToken: token, user: user});
                return next();
            } else {
                res.status(200).send({status:false, message: "Server error."});
                return next();
            }
        }).catch(function (error) {
            res.status(200).send({status:false, message: 'Email Already Exist!'});
            return next();
        });
    },
    forgetpassword: async (req,res,next) => {
        const { email, token } = req.body;
        let forgets = await req.context.models.Forgets.getByEmail(email);
        if(forgets&&forgets.dataValues&&forgets.dataValues.token&&token==forgets.dataValues.token){
            return res.status(200).send({status:true, message:'Success'});
        }else{
            return res.status(200).send({status:false, message:'Please again.'});
        }
    },
    resetpassword: async (req,res,next) => {
        const { email, password } = req.body;
        let pass = md5(password);
        await req.context.models.Users.update(
            {password:pass},
            {where: {email: email}}
        )
        .then(async (updatedRow) => {
            return res.status(200).send({status:true, message:'resetpassword'});
        });
    },
    sendmail: async (req,res,next) => {
        const { email } = req.body;
        var token = await phoneToken(4, {type: 'number'}).toString()
        var transporter = nodemailer.createTransport({
            host: config.MAIL.HOST,
            port: config.MAIL.PORT,
            secure: config.MAIL.SECURE,
            auth: {
                user: config.MAIL.email,
                pass: config.MAIL.pass
            }
        });  

        const mail = {
            from: config.MAIL.email,
            to: email,
            subject: '<div>Q8expo forget password</div>',
            html: `$<div>verify code</div><div>${token}</div>`
        };
        
        await transporter.sendMail(mail, async (err, info) => {
            if (err) {
                console.log(err);
                transporter.close();
                return res.json({status : false , message : 'please again.'})
            }else {
                await req.context.models.Forgets.create({email, token}).then(async forgets => {
                    transporter.close();
                    return res.json({status : true , message : 'success'})
                });
            }
        });
        // await req.context.models.Forgets.delete(email);
        // await req.context.models.Forgets.create({email, token, id:0}).then(async forgets => {
        //     return res.json({status : true })
        // });
    },
    get: async (req,res,next) => {
        let users = await req.context.models.Users.getAll();
        return res.json(users);
    },
    create: async (req,res,next) => {
        req.body.password = md5(req.body.password);
        let user = req.body;
        user.id = 0;
        if(req.files&&req.files.length){
            user.img = req.files[0].filename;
            await req.context.models.Users.create(user).then(async user => {
                let data = await req.context.models.Users.getAll();
                res.json(data);
                return next();
            });
        }else{
            console.log('req.body', req.body)
            await req.context.models.Users.create(user).then(async user => {
                let data = await req.context.models.Users.getAll();
                res.json(data);
                return next();
            }).catch(e=>console.log(e))
        }
    },
    getOne: async (req,res,next) => {
        let user = await req.context.models.Users.getById(req.params.id);
        return res.json(user);
    },
    find: async (req,res,next) => {
        let users = await req.context.models.Users.find(req.body);
        res.json(users);
        return next();
    },
    update: async (req,res,next) => {
        if(req.files&&req.files.length){
            let user = await req.context.models.Users.getById(req.params.id);
            if(user&&user.dataValues&&user.dataValues.img){
                fs.unlink(config.BASEURL+user.dataValues.img, (err)=>{    
                    console.log(err)
                });
            }
            let filename = req.files[0].filename;
            req.body.img = filename;
            await req.context.models.Users.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let users = await req.context.models.Users.getAll();
                return res.json(users);
            }).catch(e=>console.log('e', e))
        }else{
            await req.context.models.Users.update(
                req.body,
                {where: {id: req.params.id}}
            )
            .then(async (updatedRow) => {
                let users = await req.context.models.Users.getAll();
                return res.json(users);
            });
        }

    },
    updateStatusForUsers: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Users.update({
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
        let user = await req.context.models.Users.getById(req.params.id);
        if(user&&user.dataValues&&user.dataValues.img){
            fs.unlink(config.BASEURL+user.dataValues.img, (err)=>{    
                console.log(err)
            });
        }
        await req.context.models.Users.delete(req.params.id);
        let users = await req.context.models.Users.getAll();
        res.json(users);
    },
    deleteUsers: async (req,res,next) => {
        await req.context.models.Users.deleteUsers(req.body);
        res.send(true);
    },
}