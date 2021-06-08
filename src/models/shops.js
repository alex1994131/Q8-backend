import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const shops = (sequelize, DataTypes) => {
  const Shops = sequelize.define('shops', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    img: {
      type: DataTypes.STRING
    },
    status: {
      type: Sequelize.ENUM('','Active','Disabled'),
    }
  });

  Shops.getAll = async (offset, limit) => {
    let shops = await Shops.findAll({offset: offset, limit: limit});
    return shops;
  }

  Shops.getById = async (id) => {
    let customer = await Shops.findByPk(id);
    return customer;
  }

  Shops.find = async (data) => {
    let queryParams = data.queryParams;
    let conditions = {[Op.or]: {}};
    for(var field in queryParams.filter) {
      conditions[Op.or][field] = {
        [Op.like]: '%' +queryParams.filter[field]+ '%'
      }
    }
    let offset = queryParams.pageSize * (queryParams.pageNumber - 1);
    let limit = queryParams.pageSize;
    let shops, cnt;
    await Shops.findAndCountAll({
      where: conditions, 
      offset: offset, 
      limit: limit
    }).then(result => {
      cnt = result.count;
      shops = result.rows;
    });;
    return {totalCount: cnt, entities: shops};
  }

  Shops.delete = async (id) => {
    Shops.destroy({
      where: {
        id: id
      }
    });
  }

  Shops.deleteShops = async (ids) => {
    Shops.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Shops;
};

export default shops;
