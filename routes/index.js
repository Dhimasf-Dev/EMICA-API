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
import { getDefaultDealer} from "../controllers/dealer.js";
import { postBookingCancle, postRescedule, getAvailableTestBooking, getBookingList, getAllAvailableTimesLot, getAvailableTimeslot } from "../controllers/booking-system.js"
import { postDeliveryAddress, postDeliveryOptions } from "../controllers/sale-order.js"


const router = express.Router();

//Users
//router.get('/users', verifyToken, getUsers);
router.post('/users/register', Register);
router.post('/api/emi/login', Login);
//router.get('/token', refreshToken);
//router.delete('/logout', Logout);

//General
router.get('/general/province/:id', verifyToken, getProvince);
router.get('/general/city/:id/:state_id', verifyToken, getCity);
router.get('/general/default-dealer/:id', verifyToken, getDefaultDealer);

//Products
router.get('/sales/product/stockByModel/:dealer_id/:product_model_code', verifyToken, getProducts);
router.get('/sales/payment-method', verifyToken, getPaymentMethod);


//Customer
router.post('/general/customer', verifyToken, postCustomer);

//Booking System
router.post('/booking-testdrive/cancel', verifyToken, postBookingCancle)
router.post('/booking-testdrive/reschedule', verifyToken, postRescedule)
router.get('/booking-testdrive/get-available-timeslot/:appointment_type_id_param/:product_id_param/:ec_id_param/:start_date_param/:end_date_param', verifyToken, getAvailableTestBooking)
router.get('/booking-testdrive/list-percustomer/:partner_id', verifyToken, getBookingList) 
router.get('/allavailabletimeslot/:type_id/:id', verifyToken, getAllAvailableTimesLot)
router.get('/booking-testdrive/get-available-timeslot-ec', verifyToken, getAvailableTimeslot)


//Sale Order
router.post('/saleorder/set-deliveryaddress', verifyToken, postDeliveryAddress)
router.post('/saleorder/deliveryoptions', verifyToken, postDeliveryOptions)

export default router;