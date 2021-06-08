import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const brands = (sequelize, DataTypes) => {
  const Brands = sequelize.define('brands', {
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

  Brands.getAll = async (offset, limit) => {
    let brands = await Brands.findAll({offset: offset, limit: limit});
    return brands;
  }

  Brands.getById = async (id) => {
    let customer = await Brands.findByPk(id);
    return customer;
  }

  Brands.find = async (data) => {
    let queryParams = data.queryParams;
    let conditions = {[Op.or]: {}};
    for(var field in queryParams.filter) {
      conditions[Op.or][field] = {
        [Op.like]: '%' +queryParams.filter[field]+ '%'
      }
    }
    let offset = queryParams.pageSize * (queryParams.pageNumber - 1);
    let limit = queryParams.pageSize;
    let brands, cnt;
    await Brands.findAndCountAll({
      where: conditions, 
      offset: offset, 
      limit: limit
    }).then(result => {
      cnt = result.count;
      brands = result.rows;
    });;
    return {totalCount: cnt, entities: brands};
  }

  Brands.delete = async (id) => {
    Brands.destroy({
      where: {
        id: id
      }
    });
  }

  Brands.deleteBrands = async (ids) => {
    Brands.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Brands;
};

export default brands;
