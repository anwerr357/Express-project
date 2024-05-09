import express, {Router} from "express";
import routerUser from './users.mjs'
import routerProduct from './products.mjs'


const  router = Router();
router.use(routerProduct);
router.use(routerUser);

export default router ;