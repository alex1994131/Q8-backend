export default {
    get: async (req,res,next) => {
        let memberships = await req.context.models.Memberships.getAll();
        return res.json(memberships);
    },
    create: async (req,res,next) => {
        let membership = req.body;
        membership.id = 0;
        await req.context.models.Memberships.create(membership).then(async membership => {
            let data = await req.context.models.Memberships.getAll();
            res.json(data);
            return next();
        });
    },
    getOne: async (req,res,next) => {
        let membership = await req.context.models.Memberships.getById(req.params.id);
        return res.json(membership);
    },
    find: async (req,res,next) => {
        let memberships = await req.context.models.Memberships.find(req.body);
        res.json(memberships);
        return next();
    },
    update: async (req,res,next) => {
        await req.context.models.Memberships.update(
            req.body,
            {where: {id: req.params.id}}
        )
        .then(async (updatedRow) => {
            let memberships = await req.context.models.Memberships.getAll();
            return res.json(memberships);
        });
    },
    updateStatusForMemberships: async (req,res,next) => {
        let ids = req.body.ids;
        let status = req.body.status;
        for(let i = 0;i < ids.length; i ++) {
            req.context.models.Memberships.update({
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
        await req.context.models.Memberships.delete(req.params.id);
        let memberships = await req.context.models.Memberships.getAll();
        res.json(memberships);
    },
    deleteMemberships: async (req,res,next) => {
        await req.context.models.Memberships.deleteMemberships(req.body);
        res.send(true);
    },
}