import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const products = (sequelize, DataTypes) => {
  const Products = sequelize.define('products', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    category: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING
    },
    operation_time: {
      type: DataTypes.STRING
    },
    details: {
      type: DataTypes.TEXT
    },
    seller: {
      type: DataTypes.INTEGER
    },
    off: {
      type: DataTypes.STRING
    },
    link: {
      type: DataTypes.STRING
    },
    number: {
      type: DataTypes.STRING
    },
    brand: {
      type: DataTypes.STRING
    },
    qrcode: {
      type: DataTypes.STRING
    },
    files:{
      type: DataTypes.TEXT
    },
    rating: {
      type: DataTypes.DOUBLE
    },
    price: {
      type: DataTypes.DOUBLE
    },
    featured: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: Sequelize.ENUM('','Active','Disabled','Pending'),
    }
  });

  Products.getAll = async (offset, limit) => {
    let products = await Products.findAll({offset: offset, limit: limit});
    return products;
  }

  Products.getById = async (id) => {
    let seller = await Products.findByPk(id);
    return seller;
  }

  Products.find = async ({category}) => {
    let products = await Products.findAll({
      where: { category:parseInt(category?category:0) },
    });
    if(products.length){
      return products
    }else{
      return []
    }
  }

  Products.delete = async (id) => {
    Products.destroy({
      where: {
        id: id
      }
    });
  }

  Products.deleteProducts = async (ids) => {
    Products.destroy({
      where: {
        id: {
          [Op.or]: ids
        }
      }
    })
  }


  return Products;
};

export default products;
