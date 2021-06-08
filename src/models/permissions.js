import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const permissions = (sequelize, DataTypes) => {
  const Permissions = sequelize.define('permissions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userid: {
      type: DataTypes.INTEGER
    },
    permission: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    }
  });
//shop, category, subadmin
  Permissions.getAll = async (offset, limit) => {
    let permissions = await Permissions.findAll({offset: offset, limit: limit});
    return permissions;
  }

  Permissions.getById = async (id) => {
    let customer = await Permissions.findByPk(id);
    return customer;
  }


  Permissions.find = async (query) => {
    let where = {userid:query.userid};
    if(query.type){where.type = query.type;}
    let permission = await Permissions.findAll({
      where: where,
    });
    if(permission.length){
      return permission
    }else{
      return []
    }
  }

  Permissions.delete = async (id) => {
    Permissions.destroy({
      where: {
        id: id
      }
    });
  }

  Permissions.deletePermissions = async (ids) => {
    Permissions.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Permissions;
};

export default permissions;
