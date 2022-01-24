import client from "../config/config-pg.js";
import shape from 'shape-json';


export const postDeliveryAddress = async(req, res) => {
    try {
        //console.log(req.cookies);
        let s_a = "E";
        let s_sale_order_id =req.body.sale_order_id;
        let s_shipping_contact_id_ = req.body.shipping_contact_id_;
        //let s_customer_id = req.body.customer_id;
        //let s_contact_id = req.body.contact_id;
        
        //console.log(req.body.name);
        //  return;
        
            let SQL ="select fn_change_deliveryaddress ('E',"+s_sale_order_id+","+s_shipping_contact_id_+");";
            console.log(SQL);
            //console.log(SQL);
            //return;
            let users = await client.query(SQL);
            
        //console.log(users); 
        //res.send(users);
        //res.json({
        //users
        //message: 'Post Inserted...'
        //});
    
        let sreturn = users.rows[0].fn_change_deliveryaddress;
            let  myArray = sreturn.split("|");
             //res.json({returnmessage : sreturn});
        const saleorder = {
        code: myArray[0],
        message: myArray[1],
        id: myArray[2]
      }
    
        // res.end(JSON.stringify(users)); 
        res.json({saleorder : saleorder});
      } catch (error) {
        res.status(500).json({error: error.message});
      }
}


export const postDeliveryOptions = async(req, res) => {
    try {
        //console.log(req.cookies);
        let s_a = "E";
        let s_so_id =req.body.order_id;
        let s_deliveryoption_id = req.body.deliveryoption_id;
        //let s_customer_id = req.body.customer_id;
        let s_contact_id = req.body.contact_id;
        
        //console.log(req.body.name);
        //  return;
        
            let SQL ="select fn_change_deliveryoptions ('E',"+s_so_id+","+s_deliveryoption_id+");";
            console.log(SQL);
            //console.log(SQL);
            //return;
            let users = await client.query(SQL);
            
        //console.log(users); 
        //res.send(users);
        //res.json({
        //users
        //message: 'Post Inserted...'
        //});
    
        let sreturn = users.rows[0].fn_change_deliveryoptions;
            let  myArray = sreturn.split("|");
             //res.json({returnmessage : sreturn});
        const saleorder = {
        code: myArray[0],
        message: myArray[1],
        id: myArray[2]
      }
    
        // res.end(JSON.stringify(users)); 
        res.json({saleorder : saleorder});
      } catch (error) {
        res.status(500).json({error: error.message});
      }
}