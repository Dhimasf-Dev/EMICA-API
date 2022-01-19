// const express = require('express'); 
//const { getUsers, Register, Login, Logout } = require('../controllers/users.js'); 
// const { verifyToken } = require('../middleware/verify-token,js');
// const { refreshToken } = require('../controllers/refresh-token.js'); 
// const { getPaymentMethod, getProducts} = require('../controllers/product.js'); 
// const { getProvince} = require('../controllers/general.js');
import express from "express";
import { getUsers, Register, Login, Logout } from "../controllers/users.js";
import { verifyToken } from "../middleware/verify-token.js";
import { refreshToken } from "../controllers/refresh-token.js";
import { getPaymentMethod, getProducts} from "../controllers/product.js";
import { getProvince, getCity} from "../controllers/general.js";
import { postCustomer} from "../controllers/customer.js";
import { getDefaulDealer} from "../controllers/dealer.js";

const router = express.Router();

//Users
//router.get('/users', verifyToken, getUsers);
//router.post('/users', Register);
router.post('/login', Login);
//router.get('/token', refreshToken);
//router.delete('/logout', Logout);

//General
router.get('/general/province/:id', verifyToken, getProvince);
router.get('/general/city/:id', verifyToken, getCity);
router.get('/general/default-dealer/:id', verifyToken, getCity);

//Products
router.get('/sales/product/stockByModel/:dealer_id/:product_model_code', verifyToken, getProducts);
router.get('/sales/payment-method', verifyToken, getPaymentMethod);


//Customer
router.post('/general/customer', verifyToken, postCustomer);

export default router;