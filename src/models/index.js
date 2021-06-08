import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'mysql',
    port: process.env.DATABASE_PORT,
    logging: false,
  },
);

const models = {
  Users: sequelize.import('./users'),
  Shops: sequelize.import('./shops'),
  Brands: sequelize.import('./brands'),
  Forgets: sequelize.import('./forgets'),
  Products: sequelize.import('./products'),
  Categories: sequelize.import('./categories'),
  Memberships: sequelize.import('./memberships'),
  Permissions: sequelize.import('./permissions'),
};

export { sequelize };

export default models;
