import routerx from 'express-promise-router';
import users from './users';
import categories from './categories';
import memberships from './memberships';
import permissions from './permissions';
import products from './products';
import brands from './brands';
import shops from './shops';

const router = routerx();
router.use('/permissions', permissions);
router.use('/memberships', memberships);
router.use('/categories', categories);
router.use('/products', products);
router.use('/brands', brands);
router.use('/users', users);
router.use('/shops', shops);


export default router;