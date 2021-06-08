export default {
    get: async (req,res,next) => {
        let permissions = await req.context.models.Permissions.find(req.body.query);
        return res.json(permissions);
    },
    create: async (req,res,next) => {
        let permission = req.body;
        permission.id = 0;
        await req.context.models.Permissions.create(permission).then(async permission => {
            let data = await req.context.models.Permissions.find(req.body.query);
            res.json(data);
            return next();
        });
    },
    getOne: async (req,res,next) => {
        let permission = await req.context.models.Permissions.getById(req.params.id);
        return res.json(permission);
    },
    find: async (req,res,next) => {
        let permissions = await req.context.models.Permissions.find(req.body.query);
        res.json(permissions);
        return next();
    },
    check: async (req,res,next) => {
        const { userid, permission, type } = req.body;
        let permissions = await req.context.models.Permissions.find({userid});
        await req.context.models.Permissions.findOne({where:{userid, permission, type}}).then(async e=>{
            if(e){
                await req.context.models.Permissions.delete(e.id).then(async data=>{
                    let index = permissions.findIndex(function(o){
                        return (o.permission == permission&&o.type==type);
                    })
                    if (index !== -1) permissions.splice(index, 1);
                    return res.json({status:'delete',permissions});
                })
            }else{
                await req.context.models.Permissions.create(req.body).then(async data=>{
                    permissions.push(req.body);
                    return res.json({status:'create',permissions});
                })
            }
        })
    },
    update: async (req,res,next) => {
        await req.context.models.Permissions.update(
            req.body,
            {where: {id: req.params.id}}
        )
        .then(async (updatedRow) => {
            let permissions = await req.context.models.Permissions.find(req.body.query);
            return res.json(permissions);
        });
    },
    updateStatusForPermissions: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Permissions.update({
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
        await req.context.models.Permissions.delete(req.params.id);
        let permissions = await req.context.models.Permissions.find(req.body.query);
        res.json(permissions);
    },
    deletePermissions: async (req,res,next) => {
        await req.context.models.Permissions.deletePermissions(req.body);
        res.send(true);
    },
}