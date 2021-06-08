import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const forgets = (sequelize, DataTypes) => {
  const Forgets = sequelize.define('forgets', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    }
  });

  Forgets.getAll = async (offset, limit) => {
    let forgets = await Forgets.findAll({offset: offset, limit: limit});
    return forgets;
  }

  Forgets.getById = async (id) => {
    let customer = await Forgets.findByPk(id);
    return customer;
  }
  
  Forgets.getByEmail = async (email) => {
    let forgets = {};
    await Forgets.findAll({
      limit: 1,
      where: {email},
      order: [ [ 'createdAt', 'DESC' ]]
    }).then(async(entries)=>{
      forgets = await entries[0];
    });
    return forgets;
  }

  Forgets.find = async (data) => {
    let queryParams = data.queryParams;
    let conditions = {[Op.or]: {}};
    for(var field in queryParams.filter) {
      conditions[Op.or][field] = {
        [Op.like]: '%' +queryParams.filter[field]+ '%'
      }
    }
    let offset = queryParams.pageSize * (queryParams.pageNumber - 1);
    let limit = queryParams.pageSize;
    let forgets, cnt;
    await Forgets.findAndCountAll({
      where: conditions, 
      offset: offset, 
      limit: limit
    }).then(result => {
      cnt = result.count;
      forgets = result.rows;
    });;
    return {totalCount: cnt, entities: forgets};
  }

  Forgets.delete = async (email) => {
    Forgets.destroy({
      where: {
        email: email
      }
    });
  }

  Forgets.deleteForgets = async (ids) => {
    Forgets.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Forgets;
};

export default forgets;
