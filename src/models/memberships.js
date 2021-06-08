import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const memberships = (sequelize, DataTypes) => {
  const Memberships = sequelize.define('memberships', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    desc: {
      type: DataTypes.STRING
    },
    date: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.DOUBLE
    },
    status: {
      type: Sequelize.ENUM('','Active','Disabled'),
    }
  });

  Memberships.getAll = async (offset, limit) => {
    let memberships = await Memberships.findAll({offset: offset, limit: limit});
    return memberships;
  }

  Memberships.getById = async (id) => {
    let customer = await Memberships.findByPk(id);
    return customer;
  }

  Memberships.find = async (data) => {
    let queryParams = data.queryParams;
    let conditions = {[Op.or]: {}};
    for(var field in queryParams.filter) {
      conditions[Op.or][field] = {
        [Op.like]: '%' +queryParams.filter[field]+ '%'
      }
    }
    let offset = queryParams.pageSize * (queryParams.pageNumber - 1);
    let limit = queryParams.pageSize;
    let memberships, cnt;
    await Memberships.findAndCountAll({
      where: conditions, 
      offset: offset, 
      limit: limit
    }).then(result => {
      cnt = result.count;
      memberships = result.rows;
    });;
    return {totalCount: cnt, entities: memberships};
  }

  Memberships.delete = async (id) => {
    Memberships.destroy({
      where: {
        id: id
      }
    });
  }

  Memberships.deleteMemberships = async (ids) => {
    Memberships.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Memberships;
};

export default memberships;
