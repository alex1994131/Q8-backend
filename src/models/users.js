import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const users = (sequelize, DataTypes) => {
  const Users = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    fullname: {
      type: DataTypes.STRING,
    },
    username: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    img: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    authToken: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING,
    },
    gender: {
      type : DataTypes.STRING,
    },
    membership: {
      type : DataTypes.STRING,
    },
    status: {
      type : Sequelize.ENUM('','Active','Susspended','Pending'),
    },
    role:{
      type : Sequelize.ENUM('Admin','Seller','Customer','Sub-Admin')
    }
  });

  Users.findByLogin = async (email, password, mode) => {
    let role = '';
    if (mode=='web'){
      role = 'Customer';
    }else if(mode=='app'){
      role = 'Admin';
    }
    let user = await Users.findOne({
      where: { email: email, password: password, role:{ [Op.not]: role} },
    });

    return user;
  };

  Users.getAll = async (offset, limit) => {
    let users = await Users.findAll({offset: offset, limit: limit});
    return users;
  }

  Users.getById = async (id) => {
    let user = await Users.findByPk(id);
    return user;
  }

  Users.find = async (data) => {
    let queryParams = data.queryParams;
    let conditions = {[Op.or]: {}};
    for(var field in queryParams.filter) {
      conditions[Op.or][field] = {
        [Op.like]: '%' +queryParams.filter[field]+ '%'
      }
    }
    let offset = queryParams.pageSize * (queryParams.pageNumber - 1);
    let limit = queryParams.pageSize;
    let users, cnt;
    await Users.findAndCountAll({
      where: conditions, 
      offset: offset, 
      limit: limit
    }).then(result => {
      cnt = result.count;
      users = result.rows;
    });;
    return {totalCount: cnt, entities: users};
  }

  Users.delete = async (id) => {
    Users.destroy({
      where: {
        id: id
      }
    });
  }

  Users.deleteUsers = async (ids) => {
    Users.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }
  return Users;
};

export default users;
