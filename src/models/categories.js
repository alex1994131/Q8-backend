import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const categories = (sequelize, DataTypes) => {
  const Categories = sequelize.define('categories', {
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
    shop: {
      type: DataTypes.INTEGER
    },
    status: {
      type: Sequelize.ENUM('','Active','Disabled'),
    }
  });

  Categories.getAll = async (offset, limit) => {
    let categories = await Categories.findAll({offset: offset, limit: limit});
    return categories;
  }

  Categories.getById = async (id) => {
    let customer = await Categories.findByPk(id);
    return customer;
  }

  Categories.find = async ({shop}) => {
    let products = await Categories.findAll({
      where: { shop:parseInt(shop?shop:0) },
    });
    if(products.length){
      return products
    }else{
      return []
    }
  }

  Categories.delete = async (id) => {
    Categories.destroy({
      where: {
        id: id
      }
    });
  }

  Categories.deleteCategories = async (ids) => {
    Categories.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }

  return Categories;
};

export default categories;
