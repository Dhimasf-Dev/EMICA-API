const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
var shape = require('shape-json');
const geolib = require('geolib');

var odoo = require('./config/config-odoo');

//var odoo = require('apiconfig/configodoo');
const client = require('./config/config-pg');


const data = JSON.stringify({
  todo: 'Buy the milk'
})

//var { Odoo } = require('./apiconfig/configodoo');

//const client = require('./apiconfig/configdb');
//const odoo = require('./apiconfig/configodoo');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use('/config', require('./apiconfig'));

app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to the API ver.20220115'
  });
});



app.post('/api/v2/saleorder/confirm-so-invoice', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                       

                        //let s_delivery = req.body.delivery;
                        
                         var jsonData = req.body;
                         var jsonParsed = JSON.parse(JSON.stringify(jsonData));
                         
                        // access elements
                        /*let s_name =jsonParsed.delivery[0].name;
                        let s_street =jsonParsed.delivery[0].street;
                        let s_zip =jsonParsed.delivery[0].zip;
                        let s_city =jsonParsed.delivery[0].city;
                        let s_state_name =jsonParsed.delivery[0].state_name;
                        let s_email =jsonParsed.delivery[0].email;
                        let s_phone =jsonParsed.delivery[0].phone;
                        let s_mobile =jsonParsed.delivery[0].mobile;
                        
                        
                        let s_sale_order_id = jsonParsed.so[0].sale_order_id;
                        let s_paymentoptions_id = jsonParsed.so[0].paymentoptions_id;
                        let s_deliveryoptions_id = jsonParsed.so[0].deliveryoptions_id;
                        */
                  

                        let s_name =jsonParsed.delivery.name;
                        let s_street =jsonParsed.delivery.street;
                        let s_zip =jsonParsed.delivery.zip;
                        let s_city =jsonParsed.delivery.city;
                        let s_state_name =jsonParsed.delivery.state_name;
                        let s_email =jsonParsed.delivery.email;
                        let s_phone =jsonParsed.delivery.phone;
                        let s_mobile =jsonParsed.delivery.mobile;
                        
                        
                        let s_sale_order_id = jsonParsed.so.sale_order_id;
                        let s_paymentoptions_id = jsonParsed.so.paymentoptions_id;
                        let s_deliveryoptions_id = jsonParsed.so.deliveryoptions_id;


                        let SQLFN ="select fn_createwrite_customer_contact_v2('IE',"+s_sale_order_id+",'"+s_name+"','"+s_street+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"',"+s_deliveryoptions_id+","+s_paymentoptions_id+");";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  


                              let sreturn = users.rows[0].fn_createwrite_customer_contact_v2;
                              let  myArray = sreturn.split("|");
                              let coding =  myArray[0];
                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }

                            
                             console.log(sreturn);
                            
                            console.log(s_sale_order_id);

                             s_sale_order_id = parseInt(s_sale_order_id);
                           if (coding=='1')
                           {
                                        let SQL_2 ="select fn_api_show_so_with_invoice('S',"+s_sale_order_id+");";
                                                              console.log(SQL_2);
                                                              let users_2 = client.query(SQL_2, function (err, result2) {
                                                                if (err) throw err;
                                                               // console.log(result);
                                                                //  res.json({retrnmessage : "ok"});
                                                                var tweet1 = JSON.parse(result2.rows[0].fn_api_show_so_with_invoice);
                                                               res.json(tweet1);
                                                            });
                           }
                           else
                           {
                        





                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              /*var inParams = [];
                              inParams.push({'order_id': s_sale_order_id,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  */  


                                            var inParams = [];
                                            inParams.push([s_sale_order_id]); //id to update
                                            //inParams.push({'image_ktp': s_image_ktp})
                                           // inParams.push({'name': s_name});
                                            var params = [];
                                            params.push(inParams);
                                            odoo.execute_kw('sale.order', 'action_confirm', params, function (err, value) {
                                                if (err) { 
                                                  return console.log(err);
                                                  res.json(err);
                                                  res.end(); 
                                                }
                                                console.log('Result: ', value);
                                                //res.json(value);
                                                     //res.json({returnmessage : sreturn});
                                                      let code = 1;
                                                      let message ='';

                                                      


                                                     if (value==true)
                                                      {
                                                         code = 0;
                                                              //let SQL_1 ="select fn_confirm_so('S',"+s_sale_order_id+","+s_paymentoptions_id+","+s_deliveryoptions_id+","+s_contactdelivery_id+",'"+s_paymentmethod_code+"');";
                                                             // console.log(SQL_1);

                                                              //let users_1 =  client.query(SQL_1);
                                                              
                                                             
                                                              let SQL ="select fn_api_show_so_with_invoice('S',"+s_sale_order_id+");";
                                                              console.log(SQL);
                                                              let users = client.query(SQL, function (err, result) {
                                                                if (err) throw err;
                                                               // console.log(result);
                                                                //  res.json({returnmessage : "ok"});
                                                                var tweet1 = JSON.parse(result.rows[0].fn_api_show_so_with_invoice);
                                                               res.json(tweet1);
                                                            });
                                                              /*let users = client.query(SQL);
                                                              let sreturn = users.rows[0].fn_api_show_invoice_v2;
                                                              //var tweet1 = JSON.parse(sreturn);
                                                              res.json({returnmessage : "ok"});
                                                              */
                                                      }
                                                    else
                                                        {
                                                         code = 1;
                                                       
                                                      
                                                        }
                                                    

                                            });
    


                          });

        
                        }


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/saleorder/confirm-so-invoice', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let s_sale_order_id = req.body.sale_order_id;
                        let s_paymentoptions_id = req.body.paymentoptions_id;
                        let s_deliveryoptions_id = req.body.deliveryoptions_id;
                        let s_contactdelivery_id = req.body.contactdelivery_id;
                        let s_paymentmethod_code = req.body.paymentmethod_code;
                        //let SQL ;
                        //let SQL_1;
                          //let s_image_ktp = req.body.image_ktp;
                           // let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                             s_sale_order_id = parseInt(s_sale_order_id);
                         //console.log(s_customer_id);
                         // return;    


                         let SQLFN ="select fn_get_payment_method('G',"+s_sale_order_id+",'"+s_paymentmethod_code+"');";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  


                              let sreturn = users.rows[0].fn_get_payment_method;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                              //res.json({returnmessage : sreturn});
                              let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];






                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push({'order_id': s_sale_order_id,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);



                                            var inParams = [];
                                            inParams.push([s_sale_order_id]); //id to update
                                            //inParams.push({'image_ktp': s_image_ktp})
                                           // inParams.push({'name': s_name});
                                            var params = [];
                                            params.push(inParams);
                                            odoo.execute_kw('sale.order', 'action_confirm', params, function (err, value) {
                                                if (err) { 
                                                  return console.log(err);
                                                  res.json(err);
                                                  res.end(); 
                                                }
                                                console.log('Result: ', value);
                                                //res.json(value);
                                                     //res.json({returnmessage : sreturn});
                                                      let code = 1;
                                                      let message ='';

                                                      


                                                     if (value==true)
                                                      {
                                                         code = 0;
                                                              let SQL_1 ="select fn_confirm_so('S',"+s_sale_order_id+","+s_paymentoptions_id+","+s_deliveryoptions_id+","+s_contactdelivery_id+",'"+s_paymentmethod_code+"');";
                                                              console.log(SQL_1);

                                                              let users_1 =  client.query(SQL_1);
                                                              
                                                             
                                                              let SQL ="select fn_api_show_invoice_v2('S',"+s_sale_order_id+");";
                                                              console.log(SQL);
                                                              let users = client.query(SQL, function (err, result) {
                                                                if (err) throw err;
                                                                //console.log("Database created");
                                                                var tweet1 = JSON.parse(result.rows[0].fn_api_show_invoice_v2);
                                                                res.json(tweet1);
                                                            });
                                                              /*let users = client.query(SQL);
                                                              let sreturn = users.rows[0].fn_api_show_invoice_v2;
                                                              //var tweet1 = JSON.parse(sreturn);
                                                              res.json({returnmessage : "ok"});
                                                              */
                                                      }
                                                    else
                                                        {
                                                         code = 1;
                                                       
                                                      
                                                        }
                                                    

                                            });

                               });     



            });

        



                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.get('/api/v1/sales/payment-method', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {

                      /*

                       let s_return='';
                       s_return = '[{"product_id": 107,"product_code": "BCATF","product_name": "BCA Transfer","unit_price": "4000.00"},'+
                       '{"product_id": 108,"product_code": "BCAVA","product_name": "BCA VA","unit_price": "4000.00"}]';
                      //let sreturn = users.rows[0].fn_api_show_so;
                      //console.log(s_return);
                      //return;
                       var tweet1 = JSON.parse(s_return);

                      res.json(tweet1);
                      //*/
                       //let id = req.params.id;
                        //console.log(req.cookies);
                        //let s_category = req.body.category;
                        //let s_key = req.body.key;
                        let SQL = "";

                        //if (isNaN(id)) 
                        //{
                        //  res.status(500).json({error: 'Error'});
                        //  return;
                        //}

                         SQL ="    select a.paymentID,a.price,a.code,a.name,a.group  from  (  select a.id as paymentID,COALESCE(y.fixed_price,0) as price,"+
                              "a.default_code as code,a.name_product as name,f.id,e.name as group  from product_product a  inner join product_variant_combination z "+
                              "on a.id=z.product_product_id  inner join product_template b on a.product_tmpl_id=b.id  inner join "+
                              "product_template_attribute_value c on c.id=z.product_template_attribute_value_id"+
                              " inner join product_attribute_value e on e.id=c.product_attribute_value_id "+
                              "  inner join product_attribute f on c.attribute_id=f.id  inner join product_pricelist_item y on a.id=y.product_id where b.default_code='ADMIN-FEE' and f.name='Payment Type'"+
                              "  ) a group by a.paymentID,a.price,a.code,a.name,a.group order by a.group;"; 
                         
                        console.log(SQL);
                       // return;
                        let ecs = await client.query(SQL, function(err,data) {

                          if(!err) {
                                      res.json(data.rows);


                            } else {
                              console.log(err);
                          }

                        });



              } catch (error) {
                  res.status(500).json({error: error.message});
              }
  
    
    }
  });
});



app.get('/api/v1/customer/list-deliveryaddress/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                                   // product_code = req.params.product_code;
                        let id = req.params.id;
                        //console.log(req.cookies);
                        //let s_category = req.body.category;
                        //let s_key = req.body.key;
                        let SQL = "";

                        if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

                         SQL ="select a.id as contact_id,a.type,a.name,a.email,a.phone,a.mobile,a.street,a.street2,a.zip,a.city_id,a.x_area_id,b.name as city_name,c.name as state_name,"+
                         "d.name as country_name,'SAME AS ID' as label from res_partner a left outer join res_city b on a.city_id=b.id "+
                          "left outer join res_country_state c on a.state_id=c.id left outer join res_country d on a.country_id=d.id "+
                          "where a.id="+id+" union all select a.id as contact_id,a.type,a.name,a.email,a.phone,a.mobile,a.street,a.street2,a.zip,a.city_id,b.name as city_name,"+
                            "c.name as state_name,d.name as country_name,'' as label from res_partner a left outer join res_city b on a.city_id=b.id "+
                          "left outer join res_country_state c on a.state_id=c.id left outer join res_country d on a.country_id=d.id "+
                          "where a.parent_id="+id+";"; 
                         
                        console.log(SQL);
                       // return;
                        let ecs = await client.query(SQL, function(err,data) {

                          if(!err) {
                                      res.json(data.rows);


                            } else {
                              console.log(err);
                          }

                        });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.get('/api/v1/saleorder/show-invoice/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {


    let id = req.params.id;
    //let product_template_code = req.params.product_template_code;

        let SQL ="select fn_api_show_invoice_v2('S',"+id+");";
        console.log(SQL);
        //console.log(SQL);
        //return;
        let users = await client.query(SQL);


    let sreturn = users.rows[0].fn_api_show_invoice_v2;
     var tweet1 = JSON.parse(sreturn);

    res.json(tweet1);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.get('/api/v2/saleorder/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {


    let id = req.params.id;
    //let product_template_code = req.params.product_template_code;

        let SQL ="select fn_api_show_so('S',"+id+");";
        console.log(SQL);
        //console.log(SQL);
        //return;
        let users = await client.query(SQL);


    let sreturn = users.rows[0].fn_api_show_so;
     var tweet1 = JSON.parse(sreturn);

    res.json(tweet1);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.get('/api/v1/saleorder/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                                   // product_code = req.params.product_code;
                        id = req.params.id;
                        //console.log(req.cookies);
                        let s_category = req.body.category;
                        let s_key = req.body.key;
                        let SQL = "";

                        if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

                         SQL ="select z.name as uom_name,y.default_code,b.amount_total as total_amount,u.id as cx_category_id,u.name as cx_category_name,a.id as so_line_id,b.id as sales_order_id,b.name as sale_order_name,d.name as customer_name,d.email as customer_email,d.mobile as customer_mobile,c.id as dealer_id,c.company_code as dealer_code,c.name as dealer_name,"+
                              "a.product_id,a.name as product_name,a.product_uom_qty as qty,a.product_uom,a.price_unit as unit_price,a.price_total as sub_total "+
                                      "from sale_order_line a inner join uom_uom z on a.product_uom=z.id inner join product_product y on a.product_id=y.id "+
                                      "inner join sale_order b on a.order_id=b.id inner join product_template x on y.product_tmpl_id=x.id inner join x_cx_category u on x.x_cx_category_id=u.id"+
                                      " inner join res_company c on b.company_id=c.id inner join res_partner d on b.partner_id=d.id where a.order_id="+id+";"; 
                         
                        console.log(SQL);
                       // return;
                        let ecs = await client.query(SQL, function(err,data) {

                          if(!err) {
                                      //res.json(data.rows);
                                      const arr = data.rows;


                                      var scheme = {
                                  "$group[sale_order](sales_order_id)": {
                                    "sale_order_name": "sale_order_name",
                                    
                                    "customer_name": "customer_name",
                                    "customer_email": "customer_email",
                                    "customer_mobile": "customer_mobile",
                                    "dealer_id": "dealer_id",
                                    "dealer_name": "dealer_name",
                                    "total_amount": "total_amount",
                                    //"total_amount_tax": "total_tax",
                                    //"total_amount_untax": "total_untax",
                                    
                                    //"$group[category](cx_category_id)": {
                                    //  "category": "cx_category_name",
                                            "$group[so_line_id](so_line_id)": {
                                              "default_code": "default_code",
                                                "product_name": "product_name",
                                                "qty": "qty",
                                                "uom_name": "uom_name",
                                               "unit_price": "unit_price",
                                               "sub_total": "sub_total"
                                                      }
                                    //}
                                  }
                                };



                                console.log(shape.parse(arr, scheme));
                              res.json(shape.parse(arr, scheme));
                              res.end();



                            } else {
                              console.log(err);
                          }

                        });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});



app.post('/api/v1/sales/product_stock_by_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                          let s_customer_id = '1';
                          let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                          let orders = req.body.orders;
                          
                           var objJson1 = JSON.parse(JSON.stringify(orders)); 
                         //var obj = JSON.parse(orders);
                         var keysArray = Object.keys(objJson1);
                          for (var i = 0; i < keysArray.length; i++) {
                             var key = keysArray[i]; // here is "name" of object property
                             var values = objJson1[key]; // here get value "by name" as it expected with objects
                          }
                          
                          var objJson2 = JSON.parse(JSON.stringify(values)); 
                          var attributes = JSON.parse(JSON.stringify(objJson2.attributes));
                          var s_color_variant_id=0;
                          var s_battery_variant_id=0;
                          var s_mirror_variant_id=0;
                          var s_wheels_variant_id=0;

                          let s_product_template_code = objJson2.product_code;

                          var objJson3 = JSON.parse(JSON.stringify(attributes)); 

                          //let s_variant_id_color = req.body.variant_id_color;
                          //let s_variant_id_battery = req.body.variant_id_battery;
                          //let s_variant_id_spion = req.body.variant_id_spion;
                          var keysArray3 = Object.keys(objJson3);
                          for (var j = 0; j < keysArray3.length; j++) {
                             var key3 = keysArray3[j]; // here is "name" of object property
                             var values3 = objJson3[key3]; // here get value "by name" as it expected with objects
                             //var values3_attribute_name = values3.attribute_name;
                             var values3_attribute_id = values3.attribute_id;
                             var values3_variant_id = values3.variant_id;
                             /*
                             if (values3_attribute_name=='Color')
                             {
                                s_color_variant_id = values3_variant_id;

                             }
                             if (values3_attribute_name=='Battery')
                             {

                                s_battery_variant_id = values3_variant_id;
                             }
                             if (values3_attribute_name=='Mirror')
                             {

                                s_mirror_variant_id = values3_variant_id;
                             }
                              
                             if (values3_attribute_name=='Wheels')
                             {

                                s_wheels_variant_id = values3_variant_id;
                             }
                              */


                             if (values3_attribute_id=='10')
                             {
                                s_color_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='11')
                             {
                                s_battery_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='4')
                             {
                                s_mirror_variant_id = values3_variant_id;

                             }
                              if (values3_attribute_id=='5')
                             {
                                s_wheels_variant_id = values3_variant_id;

                             }



                          }

                          
                          s_customer_id = parseInt(s_customer_id);
                          s_dealer_id = parseInt(s_dealer_id);
                          //
                          let s_state = 'draft';
                          let value;  
                          let param;


                       


                            let SQLFN ="select fn_get_product_stock('G',"+s_dealer_id+","+s_customer_id+",'"+s_product_template_code+"',"+s_color_variant_id+","+s_battery_variant_id+","+s_mirror_variant_id+","+s_wheels_variant_id+");";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                  //return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_stock;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 
                             let s_pricelist_id = myArray[6];
                             s_pricelist_id = parseInt(s_pricelist_id);

                            const stock = {
                              product_code: myArray[8],
                              qty_stock: myArray[7],
                              product_price: myArray[3]
                            }
                            console.log(sreturn);
                            console.log(stock);
                            res.json(stock);
                             return;

                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);

                                   
                                  
                              var inParams = [];
                              inParams.push({'order_id': value_tes,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);

                              
                               //PROMOTION
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);

                              });

                              let SQL ="select fn_api_show_so('S',"+value_tes+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });
                               
                              });
                              });
                             
            });
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/invoice/cancel', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let s_invoice_name = req.body.invoiceNumber;
                        let s_transactionId = req.body.transactionId;
                        let s_transactionTime = req.body.transactionTime;
                        let s_status = req.body.status;
                        let s_reason = req.body.reason;
                        let s_invoice_id;
                        let i_so_id;
                        //let s_coupon_code = req.body.coupon_code;
                        //    let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                          
                            //s_coupon_code = parseInt(s_coupon_code);
                         //console.log(s_customer_id);
                         //return;    

                        //let s_invoice_name ;
                                    let i_company_id ;
                                    let i_partner_id ;
                                    let i_journal_id ;
                                    let i_currency_id ;
                                    let f_amount_total ;
                                    let i_paymentmethod_id;
                                    let s_payment_type='inbound';
                                    let s_partner_type='customer';
                                    let s_communication;
                                    let s_ref;
                                    let i_partner_bank_id;

                         let SQL ="select fn_cancel_invoice('S','"+s_invoice_name+"','"+s_transactionId+"','"+s_transactionTime+"','"+s_status+"','"+s_reason+"');";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    
                                    let sreturn = result.rows[0].fn_cancel_invoice;
                                    console.log(sreturn);

                                    let  myArray = sreturn.split("|");

                                     s_invoice_id = myArray[2];
                                     i_company_id = myArray[3];
                                     i_partner_id = myArray[4];
                                     i_journal_id = myArray[5];
                                     i_currency_id = myArray[6];
                                     f_amount_total = myArray[7];
                                     i_so_id = myArray[8];

                                    i_company_id = parseInt(i_company_id);
                                    i_partner_id = parseInt(i_partner_id);
                                    i_journal_id = 24;
                                    i_payment_method_id = 4;
                                    i_partner_bank_id = 3;
                                    i_currency_id = parseInt(i_currency_id);
                                    s_invoice_id = parseInt(s_invoice_id);
                                    i_so_id = parseInt(i_so_id);
                                    //f_amount_total = parseInt(f_amount_total);
                                    //return;
                                    //var tweet1 = JSON.parse(result.rows[0].fn_get_payment_param);

                                    //res.json(tweet1);
                                  });  

                     
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              

                              var inParams = [];
                              inParams.push(s_invoice_id); 
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('account.move', 'button_draft', params, function (err, value) {
                              //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  

                                        var inParams = [];
                                        inParams.push(s_invoice_id); 
                                        var params = [];
                                        params.push(inParams);
                                        odoo.execute_kw('account.move', 'button_cancel', params, function (err, value) {
                                        //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                            if (err) { return console.log(err); }
                                            console.log('Result: ', value);


                                                          var inParams = [];
                                                inParams.push(i_so_id); 
                                                var params = [];
                                                params.push(inParams);
                                                odoo.execute_kw('sale.order', 'action_cancel', params, function (err, value) {
                                                //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                                    if (err) { return console.log(err); }
                                                    console.log('Result: ', value);







                                                    res.json(value);
                                                    });

                                            });

                                /*
                                let SQL ="select fn_api_show_so('S',"+s_order_id+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });       
                                  */
                             
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/invoice/payment-cancel-timeout', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let s_invoice_name = req.body.invoiceNumber;
                        let s_transactionId = req.body.transactionId;
                        let s_transactionTime = req.body.transactionTime;
                        let s_status = req.body.status;
                        let s_reason = req.body.reason;
                        let s_invoice_id;
                        //let s_coupon_code = req.body.coupon_code;
                        //    let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                          
                            //s_coupon_code = parseInt(s_coupon_code);
                         //console.log(s_customer_id);
                         //return;    

                        //let s_invoice_name ;
                        if (s_status=='PaymentSettled')
                        {
                                    let i_company_id ;
                                    let i_partner_id ;
                                    let i_journal_id ;
                                    let i_currency_id ;
                                    let f_amount_total ;
                                    let i_paymentmethod_id;
                                    let s_payment_type='inbound';
                                    let s_partner_type='customer';
                                    let s_communication;
                                    let s_ref;
                                    let i_partner_bank_id;
                          let sreturn ;          
                         let SQL ="select fn_get_payment_param_2('S','"+s_invoice_name+"','"+s_transactionId+"','"+s_transactionTime+"','"+s_status+"');";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    
                                     sreturn = result.rows[0].fn_get_payment_param_2;
                                    console.log(sreturn);
                                       let  myArray = sreturn.split("|");
                                  let code = myArray[0];

                                    if (code=='1')
                                    {
                                            const booking = {
                                                    code: '1',
                                                   message: myArray[1],
                                                    success: false
                                                  }
                                                  res.json(booking);
                                                    return;
                                    }
                                    else

                                    {



                                     s_invoice_id = myArray[2];
                                     i_company_id = myArray[3];
                                     i_partner_id = myArray[4];
                                     i_journal_id = myArray[5];
                                     i_currency_id = myArray[6];
                                     f_amount_total = myArray[7];

                                    i_company_id = parseInt(i_company_id);
                                    i_partner_id = parseInt(i_partner_id);
                                    i_journal_id = 24;
                                    i_payment_method_id = 4;
                                    i_partner_bank_id = 3;
                                    i_currency_id = parseInt(i_currency_id);
                                    s_invoice_id = parseInt(s_invoice_id);
                                      
                     
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              

                              var inParams = [];
                              //inParams.push(s_order_id); //id to update
                              //inParams.push(s_coupon_code); //id to update
                              //inParams.push([{'coupon_code':s_coupon_code}])
                              inParams.push({'partner_bank_id': i_partner_bank_id,'communication': s_invoice_name,'payment_type': s_payment_type,'partner_type': s_partner_type,'payment_method_id': i_payment_method_id,'amount': f_amount_total,'currency_id':i_currency_id,'journal_id':i_journal_id,'company_id':i_company_id,'ref':s_invoice_name,'partner_id':i_partner_id});
                              
                              //inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('cxpayment', 'process_payment', params, function (err, value) {
                              //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);

                                  //if (value=true)
                                  //{

                                        
                                let SQL_3 ="select fn_set_payment_reconcile('S',"+s_invoice_id+");";
                                  console.log(SQL_3);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs_3 = client.query(SQL_3, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_set_payment_reconcile);
                                    //var tweet1 = JSON.parse(result.rows[0].fn_set_payment_reconcile);
                                                 const booking = {
                                                    code: '0',
                                                   message: 'Success',
                                                    success: true
                                                  }
                                                  res.json(booking);
                                                    return;
                                    //res.json(tweet1);
                                  });       
                                  

                                                
                                  //}
                                  //else
                                  //{

                                  //   const booking = {
                                  //          code: '1',
                                    //        message: 'Not Sucess',
                                   ////         success: false
                                   //       }


                                  //}

                                
                             
                                 });
                               });
                        }
                                    
                                    //f_amount_total = parseInt(f_amount_total);
                                    //return;
                                    //var tweet1 = JSON.parse(result.rows[0].fn_get_payment_param);

                                    //res.json(tweet1);
                                  });

                                 
                        }


                        if (s_status=='Cancelled')
                        {
                                               let i_company_id ;
                                    let i_partner_id ;
                                    let i_journal_id ;
                                    let i_currency_id ;
                                    let f_amount_total ;
                                    let i_paymentmethod_id;
                                    let s_payment_type='inbound';
                                    let s_partner_type='customer';
                                    let s_communication;
                                    let s_ref;
                                    let i_partner_bank_id;

                         let SQL ="select fn_cancel_invoice('S','"+s_invoice_name+"','"+s_transactionId+"','"+s_transactionTime+"','"+s_status+"','"+s_reason+"');";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    
                                    let sreturn = result.rows[0].fn_cancel_invoice;
                                    console.log(sreturn);

                                    let  myArray = sreturn.split("|");

                                    let code = myArray[0];

                                    if (code=='1')
                                    {
                                            const booking = {
                                                    code: '1',
                                                   message: myArray[1],
                                                    success: false
                                                  }
                                                  res.json(booking);
                                                    return;
                                    }
                                    else
                                    {
                                     s_invoice_id = myArray[2];
                                     i_company_id = myArray[3];
                                     i_partner_id = myArray[4];
                                     i_journal_id = myArray[5];
                                     i_currency_id = myArray[6];
                                     f_amount_total = myArray[7];
                                     i_so_id = myArray[8];

                                    i_company_id = parseInt(i_company_id);
                                    i_partner_id = parseInt(i_partner_id);
                                    i_journal_id = 24;
                                    i_payment_method_id = 4;
                                    i_partner_bank_id = 3;
                                    i_currency_id = parseInt(i_currency_id);
                                    s_invoice_id = parseInt(s_invoice_id);
                                    i_so_id = parseInt(i_so_id);
                                    //f_amount_total = parseInt(f_amount_total);
                                    //return;
                                    //var tweet1 = JSON.parse(result.rows[0].fn_get_payment_param);

                                    //res.json(tweet1);

                                          odoo.connect(function (err) {
                                          if (err) { return console.log(err); }
                                          console.log('Connected to Odoo server.');
                                          

                                          var inParams = [];
                                          inParams.push(s_invoice_id); 
                                          var params = [];
                                          params.push(inParams);
                                          odoo.execute_kw('account.move', 'button_draft', params, function (err, value) {
                                          //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                              if (err) { return console.log(err); }
                                              console.log('Result: ', value);
                                              

                                                    var inParams = [];
                                                    inParams.push(s_invoice_id); 
                                                    var params = [];
                                                    params.push(inParams);
                                                    odoo.execute_kw('account.move', 'button_cancel', params, function (err, value) {
                                                    //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                                        if (err) { return console.log(err); }
                                                        console.log('Result: ', value);


                                                                      var inParams = [];
                                                            inParams.push(i_so_id); 
                                                            var params = [];
                                                            params.push(inParams);
                                                            odoo.execute_kw('sale.order', 'action_cancel', params, function (err, value) {
                                                            //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                                                if (err) { return console.log(err); }
                                                                console.log('Result: ', value);


                                                                 // if (value=true)
                                                                  //{
                                                                              const booking = {
                                                                    code: '0',
                                                                   message: 'Success',
                                                                    success: true
                                                                  }
                                                                  res.json(booking);
                                                                    return;
                                                                 // }



                                                                //res.json(value);
                                                                              });

                                                                      });

                                                          /*
                                                          let SQL ="select fn_api_show_so('S',"+s_order_id+");";
                                                            console.log(SQL);
                                                            //console.log(SQL);
                                                            //return;
                                                            //let ecs =  client.query(SQL);
                                                            let ecs = client.query(SQL, function (err, result) {
                                                              if (err) throw err;
                                                              console.log(result.rows[0].fn_api_show_so);
                                                              var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                                              res.json(tweet1);
                                                            });       
                                                            */
                                                       
                                                        });
                                                      });
                                          }

                                  });  

                     
                         
                        }

                        

                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});



app.post('/api/v1/invoice/payment', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let s_invoice_name = req.body.invoiceNumber;
                        let s_transactionId = req.body.transactionId;
                        let s_transactionTime = req.body.transactionTime;
                        let s_status = req.body.status;
                        let s_invoice_id;
                        //let s_coupon_code = req.body.coupon_code;
                        //    let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                          
                            //s_coupon_code = parseInt(s_coupon_code);
                         //console.log(s_customer_id);
                         //return;    

                        //let s_invoice_name ;
                                    let i_company_id ;
                                    let i_partner_id ;
                                    let i_journal_id ;
                                    let i_currency_id ;
                                    let f_amount_total ;
                                    let i_paymentmethod_id;
                                    let s_payment_type='inbound';
                                    let s_partner_type='customer';
                                    let s_communication;
                                    let s_ref;
                                    let i_partner_bank_id;

                         let SQL ="select fn_get_payment_param_2('S','"+s_invoice_name+"','"+s_transactionId+"','"+s_transactionTime+"','"+s_status+"');";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    
                                    let sreturn = result.rows[0].fn_get_payment_param_2;
                                    console.log(sreturn);

                                    let  myArray = sreturn.split("|");

                                     s_invoice_id = myArray[2];
                                     i_company_id = myArray[3];
                                     i_partner_id = myArray[4];
                                     i_journal_id = myArray[5];
                                     i_currency_id = myArray[6];
                                     f_amount_total = myArray[7];

                                    i_company_id = parseInt(i_company_id);
                                    i_partner_id = parseInt(i_partner_id);
                                    i_journal_id = 24;
                                    i_payment_method_id = 4;
                                    i_partner_bank_id = 3;
                                    i_currency_id = parseInt(i_currency_id);
                                    s_invoice_id = parseInt(s_invoice_id);
                                    //f_amount_total = parseInt(f_amount_total);
                                    //return;
                                    //var tweet1 = JSON.parse(result.rows[0].fn_get_payment_param);

                                    //res.json(tweet1);
                                  });  

                     
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              

                              var inParams = [];
                              //inParams.push(s_order_id); //id to update
                              //inParams.push(s_coupon_code); //id to update
                              //inParams.push([{'coupon_code':s_coupon_code}])
                              inParams.push({'partner_bank_id': i_partner_bank_id,'communication': s_invoice_name,'payment_type': s_payment_type,'partner_type': s_partner_type,'payment_method_id': i_payment_method_id,'amount': f_amount_total,'currency_id':i_currency_id,'journal_id':i_journal_id,'company_id':i_company_id,'ref':s_invoice_name,'partner_id':i_partner_id});
                              
                              //inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('cxpayment', 'process_payment', params, function (err, value) {
                              //odoo.execute_kw('account.payment.register', 'cx_create_payments', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);

                                  if (value=true)
                                  {
                                                 const booking = {
                                                    code: '1',
                                                   message: 'Success',
                                                    success: true
                                                  }
                                                   res.json(booking);
                                                    return;
                                                  }
                                  else
                                  {

                                     const booking = {
                                            code: '0',
                                           message: 'Not Sucess',
                                             success: false
                                          }


                                  }

                                /*
                                let SQL ="select fn_api_show_so('S',"+s_order_id+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });       
                                  */
                             
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/saleorder/voucher-redeem', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let s_order_id = req.body.order_id;
                        let s_coupon_code = req.body.coupon_code;
                        //    let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                         s_order_id = parseInt(s_order_id);
                         //s_coupon_code = parseInt(s_coupon_code);
                         //console.log(s_customer_id);
                         //return;    

                         //let s_coupon_code ='2661845166871005006';
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              //inParams.push(s_order_id); //id to update
                              //inParams.push(s_coupon_code); //id to update
                              //inParams.push([{'coupon_code':s_coupon_code}])
                              inParams.push({'order_id': s_order_id,'coupon_code':s_coupon_code});
                              
                              //inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.coupon.apply.code', 'process_coupon_so', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);

                                let SQL ="select fn_api_show_so('S',"+s_order_id+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });       

                             
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});

app.post('/api/v0/saleorder/create', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {
                        //var sleep = require( 'sleep' );
                          let s_customer_id = '0';
                          let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                             let s_string ='';


                             s_string='{"sale_order_id": "173","sale_order_name": "S00173","amount_untaxed": "22500000","amount_tax": "0","amount_total": "22500000",'+
  '"customer_name": "Hafidz Maulana","purchase": {"items": [{"product_code": "A11112","product_name": "CPX Sporty Single Battery xx","label": "30.000.000",'+
        '"unit_price": "30000000","uom": "Units","qty": "1.00","sub_total": "30000000","attributes": [{variant_id": "28","variant_name": "Black","attribute_id": "10",'+
  '"attribute_name": "Color","label": "included"}]}],"total": "30000000"},"administrations": {"items": [],"total": "0"},"reductions": {"items": [{'+
  '"product_code": "EB-1","product_name": "Early Bird promo 7.5 mio","label": "-7.500.000","unit_price": "-7500000","uom": "Units","qty": "1.00","sub_total": "-7500000",'+
  '"type": "discount","attributes": []}],"total": "-7500000"}}';
        var tweet1 = JSON.parse(s_string);

                                    res.json(tweet1);
//res.json(s_string);
                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v3/saleorder/create', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {
                        //var sleep = require( 'sleep' );
                          let s_customer_id = '0';
                          let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                          let orders = req.body.orders;
                          
                           var objJson1 = JSON.parse(JSON.stringify(orders)); 
                         //var obj = JSON.parse(orders);
                         var keysArray = Object.keys(objJson1);
                          for (var i = 0; i < keysArray.length; i++) {
                             var key = keysArray[i]; // here is "name" of object property
                             var values = objJson1[key]; // here get value "by name" as it expected with objects
                          }
                          
                          var objJson2 = JSON.parse(JSON.stringify(values)); 
                          var attributes = JSON.parse(JSON.stringify(objJson2.attributes));
                          var s_color_variant_id=0;
                          var s_battery_variant_id=0;
                          var s_mirror_variant_id=0;
                          var s_wheels_variant_id=0;

                          let s_product_template_code = objJson2.product_code;

                          var objJson3 = JSON.parse(JSON.stringify(attributes)); 

                          //let s_variant_id_color = req.body.variant_id_color;
                          //let s_variant_id_battery = req.body.variant_id_battery;
                          //let s_variant_id_spion = req.body.variant_id_spion;
                          var keysArray3 = Object.keys(objJson3);
                          for (var j = 0; j < keysArray3.length; j++) {
                             var key3 = keysArray3[j]; // here is "name" of object property
                             var values3 = objJson3[key3]; // here get value "by name" as it expected with objects
                             //var values3_attribute_name = values3.attribute_name;
                             var values3_attribute_id = values3.attribute_id;
                             var values3_variant_id = values3.variant_id;

                             /*
                             if (values3_attribute_name=='Color')
                             {
                                s_color_variant_id = values3_variant_id;

                             }
                             if (values3_attribute_name=='Battery')
                             {

                                s_battery_variant_id = values3_variant_id;
                             }
                             if (values3_attribute_name=='Mirror')
                             {

                                s_mirror_variant_id = values3_variant_id;
                             }
                              
                             if (values3_attribute_name=='Wheels')
                             {

                                s_wheels_variant_id = values3_variant_id;
                             }

                              */
                              if (values3_attribute_id=='10')
                             {
                                s_color_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='11')
                             {
                                s_battery_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='4')
                             {
                                s_mirror_variant_id = values3_variant_id;

                             }
                              if (values3_attribute_id=='5')
                             {
                                s_wheels_variant_id = values3_variant_id;

                             }


                          }

                          
                          s_customer_id = parseInt(s_customer_id);
                          s_dealer_id = parseInt(s_dealer_id);
                          //
                          let s_state = 'draft';
                          let value;  
                          let param;


                       


                            let SQLFN ="select fn_get_product_id_guest('G',"+s_dealer_id+","+s_customer_id+",'"+s_product_template_code+"',"+s_color_variant_id+","+s_battery_variant_id+","+s_mirror_variant_id+","+s_wheels_variant_id+");";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_id_guest;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 
                             let s_pricelist_id = myArray[6];
                             s_pricelist_id = parseInt(s_pricelist_id);
                             
                             let s_product_code = myArray[7];

                             let s_variant_id = myArray[8];
                             let s_variant_name = myArray[9];
                             let s_attribute_id = myArray[10];
                             let s_attribute_name = myArray[11];
                             let s_label_subtotal_product = myArray[12];
                             let s_string ='';


                             s_string='{"sales_order_id":"0","sale_order_name": "","amount_untaxed": "0",  "amount_tax": "0",  "amount_total": "0",  "customer_name": "","purchase": {"items": [{                "product_code": "'+s_product_code+'","product_name": "'+s_product_name+'",'+
    '"unit_price": "'+s_unitprice+'",                "uom": "Units",                "qty": "1.00","label":"'+s_label_subtotal_product+'",                "sub_total": "'+s_pricetotal+'",'+
    '"attributes": [                    {                        "variant_id": "'+s_variant_id+'",                        "variant_name": "'+s_variant_name+'",'+
'                        "attribute_id": "'+s_attribute_id+'","attribute_name": "'+s_attribute_name+'","label":"included"                    }                ]'+
'}        ],        "total": "'+s_unitprice+'"    },    "administrations": {        "items": [],        "total": "0"    },    "reductions": {        "items": ['+
'            {                "product_code": "EB-1",                "product_name": "Early Bird promo 7.5 mio",                "unit_price": "-7500000",'+
                '"uom": "Units",                "qty": "1.00",                "sub_total": "-7500000","label": "-7.500.000","type":"discount",                "attributes": []            }        ],'+
        '"total": "-7500000"    }}';
        var tweet1 = JSON.parse(s_string);

                                    res.json(tweet1);
//res.json(s_string);
                             /*
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);

                                   
                                  
                              var inParams = [];
                              inParams.push({'order_id': value_tes,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);

                              var s_finish ='';
                               //PROMOTION
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);
                                  //res.json('Done');
                                  var s_finish ='selesai';





                              let SQL ="select fn_api_show_so('S',"+value_tes+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });
                                 



                              });
                               // sleep.sleep(5);
                              //setTimeout(() => { console.log("Wait 2 second!"); }, 2000);
                              //sleep(2000);
                              //setTimeout(3000);

                             


                               
                              });
                              });
                             
            });

          */
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/saleorder/set-paymentmethod', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {
                        //var sleep = require( 'sleep' );
                          let s_sale_order_id = req.body.sale_order_id;
                          let s_product_code = req.body.product_code;

                          //let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                          //let orders = req.body.orders;
                          s_sale_order_id = parseInt(s_sale_order_id);
                          //s_product_id = parseInt(s_product_id);



                            let SQLFN ="select fn_get_payment_method('G',"+s_sale_order_id+",'"+s_product_code+"');";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  


                              let sreturn = users.rows[0].fn_get_payment_method;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                              //res.json({returnmessage : sreturn});
                              let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];



                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              /*var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);
                              */
                                   
                                /*  */
                              var inParams = [];
                              inParams.push({'order_id': s_sale_order_id,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);
                              

                              /*
                              var s_finish ='';
                               //SO LINE
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);
                                  //res.json('Done');
                                  var s_finish ='selesai';
                              */




                              let SQL ="select fn_api_show_so('S',"+s_sale_order_id+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });
                                 



                              //});
                               // sleep.sleep(5);
                              //setTimeout(() => { console.log("Wait 2 second!"); }, 2000);
                              //sleep(2000);
                              //setTimeout(3000);

                              /*for (let i = 0; i < 20; i++) {
                                if (s_finish === 'selesai') { break; }
                                 console.log("Looping ke-"+i);
                                //text += "The number is " + i + "<br>";
                                sleep.sleep(1);
                              }*/


                               
                              //});
                              });
                             
            });
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v4/saleorder/create', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {
                        //var sleep = require( 'sleep' );
                          let s_customer_id = req.body.customer_id;
                          let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                          let orders = req.body.orders;
                          
                           var objJson1 = JSON.parse(JSON.stringify(orders)); 
                         //var obj = JSON.parse(orders);
                         var keysArray = Object.keys(objJson1);
                          for (var i = 0; i < keysArray.length; i++) {
                             var key = keysArray[i]; // here is "name" of object property
                             var values = objJson1[key]; // here get value "by name" as it expected with objects
                          }
                          
                          var objJson2 = JSON.parse(JSON.stringify(values)); 
                          var attributes = JSON.parse(JSON.stringify(objJson2.attributes));
                          var s_color_variant_id=0;
                          var s_battery_variant_id=0;
                          var s_mirror_variant_id=0;
                          var s_wheels_variant_id=0;

                          let s_product_template_code = objJson2.product_code;

                          var objJson3 = JSON.parse(JSON.stringify(attributes)); 

                          //let s_variant_id_color = req.body.variant_id_color;
                          //let s_variant_id_battery = req.body.variant_id_battery;
                          //let s_variant_id_spion = req.body.variant_id_spion;
                          var keysArray3 = Object.keys(objJson3);
                          for (var j = 0; j < keysArray3.length; j++) {
                             var key3 = keysArray3[j]; // here is "name" of object property
                             var values3 = objJson3[key3]; // here get value "by name" as it expected with objects
                             //var values3_attribute_name = values3.attribute_name;
                             var values3_attribute_id = values3.attribute_id;
                             var values3_variant_id = values3.variant_id;
                             /*
                             if (values3_attribute_name=='Color')
                             {
                                s_color_variant_id = values3_variant_id;

                             }
                             if (values3_attribute_name=='Battery')
                             {

                                s_battery_variant_id = values3_variant_id;
                             }
                             if (values3_attribute_name=='Mirror')
                             {

                                s_mirror_variant_id = values3_variant_id;
                             }
                              
                             if (values3_attribute_name=='Wheels')
                             {

                                s_wheels_variant_id = values3_variant_id;
                             }
                              */
                               if (values3_attribute_id=='10')
                             {
                                s_color_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='11')
                             {
                                s_battery_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='4')
                             {
                                s_mirror_variant_id = values3_variant_id;

                             }
                              if (values3_attribute_id=='5')
                             {
                                s_wheels_variant_id = values3_variant_id;

                             }

                          }

                          
                          s_customer_id = parseInt(s_customer_id);
                          s_dealer_id = parseInt(s_dealer_id);
                          //
                          let s_state = 'draft';
                          let value;  
                          let param;
                           let SQLFN;

                       
                            if (s_customer_id==0)
                            {
                                  SQLFN ="select fn_get_product_id_guest('G',"+s_dealer_id+","+s_customer_id+",'"+s_product_template_code+"',"+s_color_variant_id+","+s_battery_variant_id+","+s_mirror_variant_id+","+s_wheels_variant_id+");";

                                   console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_id_guest;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 
                             let s_pricelist_id = myArray[6];
                             s_pricelist_id = parseInt(s_pricelist_id);
                             
                             let s_product_code = myArray[7];

                             let s_variant_id = myArray[8];
                             let s_variant_name = myArray[9];
                             let s_attribute_id = myArray[10];
                             let s_attribute_name = myArray[11];
                             let s_label_subtotal_product = myArray[12];
                             let s_string ='';
                             let g_total = s_unitprice-7500000;

                             s_string='{"sales_order_id":"0","sale_order_name": "","amount_untaxed": "'+g_total+'",  "amount_tax": "0",  "amount_total": "'+g_total+'",  "customer_name": "","purchase": {"items": [{                "product_code": "'+s_product_code+'","product_name": "'+s_product_name+'",'+
    '"unit_price": "'+s_unitprice+'",                "uom": "Units",                "qty": "1.00","label":"'+s_label_subtotal_product+'",                "sub_total": "'+s_pricetotal+'",'+
    '"attributes": [                    {                        "variant_id": "'+s_variant_id+'",                        "variant_name": "'+s_variant_name+'",'+
'                        "attribute_id": "'+s_attribute_id+'","attribute_name": "'+s_attribute_name+'","label":"included"                    }                ]'+
'}        ],        "total": "'+s_unitprice+'"    },    "administrations": {        "items": [],        "total": "0"    },    "reductions": {        "items": ['+
'            {                "product_code": "EB-1",                "product_name": "Early Bird promo 7.5 mio",                "unit_price": "-7500000",'+
                '"uom": "Units",                "qty": "1.00",                "sub_total": "-7500000","label": "-7.500.000","type":"discount",                "attributes": []            }        ],'+
        '"total": "-7500000"    }}';
        var tweet1 = JSON.parse(s_string);

                                    res.json(tweet1);
                            }

                            else
                            {

                             SQLFN ="select fn_get_product_id_v2('G',"+s_dealer_id+","+s_customer_id+",'"+s_product_template_code+"',"+s_color_variant_id+","+s_battery_variant_id+","+s_mirror_variant_id+","+s_wheels_variant_id+");";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                  //return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_id_v2;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 
                             let s_pricelist_id = myArray[6];
                             s_pricelist_id = parseInt(s_pricelist_id);

                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);

                                   
                                  
                              var inParams = [];
                              inParams.push({'order_id': value_tes,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);

                              var s_finish ='';
                               //PROMOTION
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);
                                  //res.json('Done');
                                  var s_finish ='selesai';





                              let SQL ="select fn_api_show_so('S',"+value_tes+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });
                                 



                              });
                               // sleep.sleep(5);
                              //setTimeout(() => { console.log("Wait 2 second!"); }, 2000);
                              //sleep(2000);
                              //setTimeout(3000);

                              /*for (let i = 0; i < 20; i++) {
                                if (s_finish === 'selesai') { break; }
                                 console.log("Looping ke-"+i);
                                //text += "The number is " + i + "<br>";
                                sleep.sleep(1);
                              }*/


                               
                              });
                              });
                             
            });


            }
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v2/saleorder/create', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {
                        //var sleep = require( 'sleep' );
                          let s_customer_id = req.body.customer_id;
                          let s_dealer_id = req.body.dealer_id;
                          //let s_pricelist_id = req.body.pricelist_id;
                          let orders = req.body.orders;
                          
                           var objJson1 = JSON.parse(JSON.stringify(orders)); 
                         //var obj = JSON.parse(orders);
                         var keysArray = Object.keys(objJson1);
                          for (var i = 0; i < keysArray.length; i++) {
                             var key = keysArray[i]; // here is "name" of object property
                             var values = objJson1[key]; // here get value "by name" as it expected with objects
                          }
                          
                          var objJson2 = JSON.parse(JSON.stringify(values)); 
                          var attributes = JSON.parse(JSON.stringify(objJson2.attributes));
                          var s_color_variant_id=0;
                          var s_battery_variant_id=0;
                          var s_mirror_variant_id=0;
                          var s_wheels_variant_id=0;

                          let s_product_template_code = objJson2.product_code;

                          var objJson3 = JSON.parse(JSON.stringify(attributes)); 

                          //let s_variant_id_color = req.body.variant_id_color;
                          //let s_variant_id_battery = req.body.variant_id_battery;
                          //let s_variant_id_spion = req.body.variant_id_spion;
                          var keysArray3 = Object.keys(objJson3);
                          for (var j = 0; j < keysArray3.length; j++) {
                             var key3 = keysArray3[j]; // here is "name" of object property
                             var values3 = objJson3[key3]; // here get value "by name" as it expected with objects
                             //var values3_attribute_name = values3.attribute_name;
                             var values3_attribute_id = values3.attribute_id;
                             var values3_variant_id = values3.variant_id;
                             /*
                             if (values3_attribute_name=='Color')
                             {
                                s_color_variant_id = values3_variant_id;

                             }
                             if (values3_attribute_name=='Battery')
                             {

                                s_battery_variant_id = values3_variant_id;
                             }
                             if (values3_attribute_name=='Mirror')
                             {

                                s_mirror_variant_id = values3_variant_id;
                             }
                              
                             if (values3_attribute_name=='Wheels')
                             {

                                s_wheels_variant_id = values3_variant_id;
                             }
                              */
                               if (values3_attribute_id=='10')
                             {
                                s_color_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='11')
                             {
                                s_battery_variant_id = values3_variant_id;

                             }

                              if (values3_attribute_id=='4')
                             {
                                s_mirror_variant_id = values3_variant_id;

                             }
                              if (values3_attribute_id=='5')
                             {
                                s_wheels_variant_id = values3_variant_id;

                             }

                          }

                          
                          s_customer_id = parseInt(s_customer_id);
                          s_dealer_id = parseInt(s_dealer_id);
                          //
                          let s_state = 'draft';
                          let value;  
                          let param;


                       


                            let SQLFN ="select fn_get_product_id_v2('G',"+s_dealer_id+","+s_customer_id+",'"+s_product_template_code+"',"+s_color_variant_id+","+s_battery_variant_id+","+s_mirror_variant_id+","+s_wheels_variant_id+");";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                  //return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_id_v2;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }
                             console.log(sreturn);
                             //return;

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }

                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 
                             let s_pricelist_id = myArray[6];
                             s_pricelist_id = parseInt(s_pricelist_id);

                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);

                                   
                                  
                              var inParams = [];
                              inParams.push({'order_id': value_tes,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);

                              var s_finish ='';
                               //PROMOTION
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);
                                  //res.json('Done');
                                  var s_finish ='selesai';





                              let SQL ="select fn_api_show_so('S',"+value_tes+");";
                                  console.log(SQL);
                                  //console.log(SQL);
                                  //return;
                                  //let ecs =  client.query(SQL);
                                  let ecs = client.query(SQL, function (err, result) {
                                    if (err) throw err;
                                    console.log(result.rows[0].fn_api_show_so);
                                    var tweet1 = JSON.parse(result.rows[0].fn_api_show_so);

                                    res.json(tweet1);
                                  });
                                 



                              });
                               // sleep.sleep(5);
                              //setTimeout(() => { console.log("Wait 2 second!"); }, 2000);
                              //sleep(2000);
                              //setTimeout(3000);

                              /*for (let i = 0; i < 20; i++) {
                                if (s_finish === 'selesai') { break; }
                                 console.log("Looping ke-"+i);
                                //text += "The number is " + i + "<br>";
                                sleep.sleep(1);
                              }*/


                               
                              });
                              });
                             
            });
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/saleorder/create', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                          let s_customer_id = req.body.customer_id;
                          let s_dealer_id = req.body.dealer_id;
                          let s_pricelist_id = req.body.pricelist_id;
                          //let s_currency_id = req.body.currency_id;

                          let s_product_class_body = req.body.product_class_body;
                          let s_product_class_spion = req.body.product_class_spion;

                          
                          s_customer_id = parseInt(s_customer_id);
                          s_dealer_id = parseInt(s_dealer_id);
                          s_pricelist_id = parseInt(s_pricelist_id);
                          let s_state = 'draft';
                          let value;  
                          let param;


                       


                            let SQLFN ="select fn_get_product_id('G',"+s_dealer_id+","+s_pricelist_id+",'"+s_product_class_body+"','"+s_product_class_spion+"','BATTERY','POWEROUTPUT','WHEELS');";
                                  console.log(SQLFN);
                                  //console.log(SQL);
                                 // return;
                                  let users = await client.query(SQLFN);
                                  
                              //console.log(users); 
                              //res.send(users);
                              //res.json({
                              //users
                              //message: 'Post Inserted...'
                              //});

                              let sreturn = users.rows[0].fn_get_product_id;
                              let  myArray = sreturn.split("|");

                              const booking = {
                              code: myArray[0],
                             message: myArray[1],
                              id: myArray[2]
                            }

                              let s_code = myArray[0];
                              s_code = parseInt(s_code);

                              if (s_code==1)
                              {
                                res.json(booking);
                                return;
                              }
                              let s_product_id = myArray[2];
                              s_product_id = parseInt(s_product_id);
                              let s_unitprice = myArray[3];
                              s_unitprice = parseFloat(s_unitprice);
                              let s_pricetotal = s_unitprice;
                                   //res.json({returnmessage : sreturn});
                             let s_uom_id = myArray[4];
                              s_uom_id = parseInt(s_uom_id);
                              let s_product_name = myArray[5];
                             // s_uom_id = parseInt(s_uom_id);
                             //console.log(myArray[2]);
                             //return; 

                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              
                              var inParams = [];
                              inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'create', params, function (err, value_tes) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_tes);
                                  //res.json(value_tes);

                                   
                                  
                              var inParams = [];
                              inParams.push({'order_id': value_tes,'product_id': s_product_id,'name':s_product_name,'product_uom':s_uom_id,'product_uom_qty':1,'price_unit':s_unitprice,'price_total':s_pricetotal})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order.line', 'create', params, function (err, value_child) {
                              if (err) { return console.log(err); }
                                  console.log('Result Child: ', value_child);
                                  //res.json(value_child);

                              
                               //PROMOTION
                               var inParams = [];
                               inParams.push([value_tes]); //id to update
                              //inParams.push({'partner_id': s_customer_id,'sale_order_type': 1,'company_id':s_dealer_id,'pricelist_id':s_pricelist_id,'show_update_pricelist':true,'state':s_state})
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('sale.order', 'recompute_coupon_lines', params, function (err, value_promotion) {
                              if (err) { return console.log(err); }
                                  console.log('Result: ', value_promotion);

                              });



                                      //SQL ="select a.name as sale_order_name,d.name as customer_name,c.name as company_name,a.order_id,a.product_id,a.name,a.product_uom "+
                                      //"from sale_order_line a "+
                                      //"inner join sale_order b on a.order_id=b.id"+
                                      //" inner join res_company c on b.company_id=c.id inner join res_partner d on b.partner_id=d.id where a.order_id="+value_tes+";"; 
                                       SQL ="select z.name as uom_name,y.default_code,b.amount_total as total_amount,u.id as cx_category_id,u.name as cx_category_name,a.id as so_line_id,b.id as sales_order_id,b.name as sale_order_name,d.name as customer_name,d.email as customer_email,d.mobile as customer_mobile,c.id as dealer_id,c.company_code as dealer_code,c.name as dealer_name,"+
                                  "a.product_id,a.name as product_name,a.product_uom_qty as qty,a.product_uom,a.price_unit as unit_price,a.price_total as sub_total "+
                                      "from sale_order_line a inner join uom_uom z on a.product_uom=z.id inner join product_product y on a.product_id=y.id "+
                                      "inner join sale_order b on a.order_id=b.id inner join product_template x on y.product_tmpl_id=x.id inner join x_cx_category u on x.x_cx_category_id=u.id"+
                                      " inner join res_company c on b.company_id=c.id inner join res_partner d on b.partner_id=d.id where a.order_id="+value_tes+";";
                                      console.log(SQL);
                                     // return;
                                      let ecs =  client.query(SQL, function(err,data) {

                                        if(!err) {
                                              //res.json(data.rows);


                                  const arr = data.rows;

                                               
                               var scheme = {
                                  "$group[sale_order](sales_order_id)": {
                                    "sale_order_name": "sale_order_name",
                                    
                                    "customer_name": "customer_name",
                                    "customer_email": "customer_email",
                                    "customer_mobile": "customer_mobile",
                                    "dealer_id": "dealer_id",
                                    "dealer_name": "dealer_name",
                                    "total_amount": "total_amount",
                                    //"total_amount_tax": "total_tax",
                                    //"total_amount_untax": "total_untax",
                                    
                                    //"$group[category](cx_category_id)": {
                                    //  "category": "cx_category_name",
                                            "$group[so_line_id](so_line_id)": {
                                              "default_code": "default_code",
                                                "product_name": "product_name",
                                                "qty": "qty",
                                                "uom_name": "uom_name",
                                               "unit_price": "unit_price",
                                               "sub_total": "sub_total"
                                                      }
                                    //}
                                  }
                                };
                                  

                                console.log(shape.parse(arr, scheme));
                              res.json(shape.parse(arr, scheme));
                              res.end();


                                          } else {
                                            console.log(err);
                                        }
                                      });
                              });
                              });
                             
            });
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/booking-testdrive/send-assigned-sales', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

 
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([113]); //id to update
                              //inParams.push({'image_ktp': s_image_ktp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('em.appointment.system', 'assigned_to_sales_person', params, function (err, value) {
                              //odoo.execute_kw('product.repair', 'send_finish_email', params, function (err, value) {  
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  res.json(value);
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/booking-testdrive/send-confirmation-email', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

 
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([209]); //id to update
                              //inParams.push({'image_ktp': s_image_ktp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('em.appointment.system', 'send_confirmation_email', params, function (err, value) {
                              //odoo.execute_kw('product.repair', 'send_finish_email', params, function (err, value) {  
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  res.json(value);
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/res-partner/ktp-image', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let a_customer_id = req.body.customer_id;
                          let s_image_ktp = req.body.image_ktp;
                            let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                            let s_customer_id = parseInt(a_customer_id);
                         //console.log(s_customer_id);
                         // return;    
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([s_customer_id]); //id to update
                              inParams.push({'image_ktp': s_image_ktp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('res.partner', 'write', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);
                                       //res.json({returnmessage : sreturn});
                                        let code = 1;
                                        let message ='';
                                       if (value==true)
                                        {
                                           code = 0;
                                          
                                        }
                                      else
                                          {
                                           code = 1;
                                         
                                        
                                          }
                                      
                                      const upload = {
                                          code: code,
                                        
                                          id: a_customer_id
                                          }
                                  // res.end(JSON.stringify(users)); 
                                  res.json({upload : upload});
                                    
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});


app.post('/api/v1/res-partner/npwp-image', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
                  try {

                        let a_customer_id = req.body.customer_id;
                          let s_image_npwp = req.body.image_npwp;
                            let s_name = req.body.name;
                           //let myArray = a_customer_id.split(",");
                            let s_customer_id = parseInt(a_customer_id);
                         //console.log(s_customer_id);
                         // return;    
                          odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([s_customer_id]); //id to update
                              inParams.push({'image_npwp': s_image_npwp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('res.partner', 'write', params, function (err, value) {
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);
                                       //res.json({returnmessage : sreturn});
                                        let code = 1;
                                        let message ='';
                                       if (value==true)
                                        {
                                           code = 0;
                                          
                                        }
                                      else
                                          {
                                           code = 1;
                                         
                                        
                                          }
                                      
                                      const upload = {
                                          code: code,
                                        
                                          id: a_customer_id
                                          }
                                  // res.end(JSON.stringify(users)); 
                                  res.json({upload : upload});
                                    
                              });
            });


                       
          } catch (error) {
            res.status(500).json({error: error.message});
          }
  
    
    }
  });
});

/*
app.get('/api/v1/res-partner/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
        


           
            odoo.connect(function (err) {
                if (err) { return console.log(err); }
                console.log('Connected to Odoo server.');
                var ImageSend = ImageBase64.decode('ascii');

                var inParams = [];
                inParams.push([37]); //id to update
                inParams.push({'image_ktp': ImageSend})
                var params = [];
                params.push(inParams);
                odoo.execute_kw('res.partner', 'write', params, function (err, value) {
                    if (err) { return console.log(err); }
                    console.log('Result: ', value);
                    res.json(value);
                });
            });
            
     */       
            /*
            odoo.connect(function (err) {
                if (err) { return console.log(err); }
                console.log('Connected to Odoo server.');
                var inParams = [];
                inParams.push([7]); //id to update
               // inParams.push({'name': 'New Partner Updated'});
                var params = [];
                params.push(inParams);
                odoo.execute_kw('sale.order', 'action_confirm', params, function (err, value) {
                    if (err) { return console.log(err); }
                    console.log('Result: ', value);
                    res.json(value);
                });
            });

            */
            /*
            odoo.connect(function (err) {
                if (err) { return console.log(err); }
                console.log('Connected to Odoo server.');
                var inParams = [];
                inParams.push([70]); //id to update
                inParams.push({'name': 'Edited Partner'})
                var params = [];
                params.push(inParams);
                odoo.execute_kw('res.partner', 'write', params, function (err, value) {
                    if (err) { return console.log(err); }
                    console.log('Result: ', value);
                    res.json(value);
                });
            });
            */
            /*
              odoo.connect(function (err) {
                  if (err) { return console.log(err); }
                  console.log('Connected to Odoo server.');
                  var inParams = [];
                  inParams.push([['is_company', '=', true]]);
                  //inParams.push(['name']); 
                  //inParams.push(0);  //offset
                  //inParams.push(10);  //Limit
                  var params = [];
                  params.push(inParams);
                  odoo.execute_kw('res.partner', 'search', params, function (err, value) {
                      if (err) { return console.log(err); }
                      var inParams = [];
                      inParams.push(value); //ids
                      var params = [];
                      params.push(inParams);
                      odoo.execute_kw('res.partner', 'read', params, function (err2, value2) {
                          if (err2) { return console.log(err2); }
                          console.log('Result: ', value2);
                          res.json(value2);
                      });
                  });
              });
            
            */
            /*
            odoo.connect(function (err) {
                if (err) { return console.log(err); }
                console.log('Connected to Odoo server.');
                var inParams = [];
                inParams.push('read');
                inParams.push(false); //raise_exception
                var params = [];
                params.push(inParams);
                odoo.execute_kw('res.partner', 'check_access_rights', params, function (err, value) {
                    if (err) { return console.log(err); }
                    console.log('Result: ', value);
                    res.json(value);
                });
            });
            */
            /*
            odoo.connect(function (err) {
                if (err) { return console.log(err); }
                console.log('Connected to Odoo server.');
                var inParams = [];
                inParams.push([['is_company', '=', true]]);
                var params = [];
                params.push(inParams);
                odoo.execute_kw('res.partner', 'search', params, function (err, value) {
                    if (err) { return console.log(err); }
                    console.log('Result: ', value);
                    res.json(value);
                });
            });
            */
            /*
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            if (id==0)
            {
               SQL ="select a.id,a.name,a.address,address_2,a.zip_code,a.city,c.name as province_name,a.designation_latitude as latitude,a.designation_longitude as longitude,"+
                    "a.operational_hours,b.name as company_name,b.company_registry as company_code,a.company_id from designation_designation a left outer join res_company b on "+
                    "a.company_id=b.id left outer join res_country_state c on a.state_id=c.id where a.is_active=true;";  
            
            }
            else
            {
              SQL ="select a.id,a.name,a.address,address_2 ,a.zip_code,a.city,c.name as province_name,a.designation_latitude as latitude,a.designation_longitude as longitude,"+
                    "a.operational_hours,b.name as company_name,b.company_registry as company_code,a.company_id from designation_designation a left outer join res_company b on "+
                    "a.company_id=b.id left outer join res_country_state c on a.state_id=c.id where a.is_active=true and a.id="+id+";";  

            }
            
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });

            */
/*            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});
*/


app.get('/api/v1/customer/get-deliverylist/:customer_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
           // product_code = req.params.product_code;
            customer_id = req.params.customer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(customer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


              SQL ="select a.id,a.name,a.street,a.street2,a.zip,a.city,c.name as province_name,a.email,a.phone,a.mobile,b.name as company_name"+
                    ",b.id as company_id,a.x_identity_type,a.x_identity_number,a.x_driving_license from res_partner a  left outer join res_company b on a.company_id=b.id left outer join res_country_state c on a.state_id=c.id"+
                    " where a.active=true and a.customer_rank>0 and a.parent_id="+customer_id+"";  
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/sales/voucher-list/:dealer_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
           // product_code = req.params.product_code;
            dealer_id = req.params.dealer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(dealer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


             if (dealer_id==0)
            {
              SQL ="select a.voucher_id,a.name as voucher_name,count(id) as jml_valid,a.company_id,a.company_code,a.company_name,min(code) as voucher_code from "+
                  "(select b.id as voucher_id,a.id,a.code,b.name,b.active,a.create_date,b.validity_duration,b.company_id,d.company_code,d.name"+
                  " as company_name,(a.create_date + b.validity_duration * INTERVAL '1 day') as expiration_date,"+
                  "c.rule_products_domain from coupon_coupon a inner join coupon_program b on a.program_id=b.id inner join coupon_rule c on b.rule_id=c.id "+
                  "inner join res_company d on b.company_id=d.id where a.state='new' and b.program_type='coupon_program' and b.company_id=3 and b.active=true"+
                  ") a group by a.voucher_id,a.name,a.company_id,a.company_code,a.company_name;";  
             }
             else
             {
                 SQL ="select a.voucher_id,a.name as voucher_name,count(id) as jml_valid,a.company_id,a.company_code,a.company_name,min(code) as voucher_code from "+
                  "(select b.id as voucher_id,a.id,a.code,b.name,b.active,a.create_date,b.validity_duration,b.company_id,d.company_code,d.name"+
                  " as company_name,(a.create_date + b.validity_duration * INTERVAL '1 day') as expiration_date,"+
                  "c.rule_products_domain from coupon_coupon a inner join coupon_program b on a.program_id=b.id inner join coupon_rule c on b.rule_id=c.id "+
                  "inner join res_company d on b.company_id=d.id where b.company_id="+dealer_id+" and a.state='new' and b.program_type='coupon_program' and b.company_id=3 and b.active=true"+
                  ") a group by a.voucher_id,a.name,a.company_id,a.company_code,a.company_name;"; 
             }
            console.log(SQL);
           // return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/sales/stockonhand-permodel/:company_id/:product_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            product_code = req.params.product_code;
            company_id = req.params.company_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(company_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

            if (product_code=='0')
            {
               SQL ="select a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id where c.usage='internal' where a.company_id="+company_id+") a group by a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
            
            }
            else
            {
            SQL ="select a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id where c.usage='internal' and d.default_code='"+product_code+"' where a.company_id="+company_id+") a group by a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
             }
            console.log(SQL);
           // return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/stock-per-productmodel/:dealer_id/:product_model_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            product_model_code = req.params.product_model_code;
            dealer_id = req.params.dealer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(dealer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (dealer_id==0)
            {
              if (product_model_code=='0')
              {
               SQL ="select a.uom_id,a.product_model_code,a.product_model_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_template_name,a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select e.uom_id,z.x_model_code as product_model_code,z.name as product_model_name,y.id as product_class_id,y.name as product_class_name,e.id as product_template_id,e.name as product_template_name,c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id left outer join x_product_unit z on e.x_unit_model=z.id left outer join product_classification y on e.product_class=y.id "+
                    "where d.active=true and c.usage='internal') a group by a.uom_id,a.product_model_code,a.product_template_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_model_name,a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
              }
              else
              {
                   SQL ="select a.uom_id,a.product_model_code,a.product_model_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_template_name,a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select z.x_model_code as product_model_code,z.name as product_model_name,y.id as product_class_id,y.name as product_class_name,e.id as product_template_id,e.name as product_template_name,c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id left outer join x_product_unit z on e.x_unit_model=z.id left outer join product_classification y on e.product_class=y.id "+
                    "where d.active=true and c.usage='internal' and z.x_model_code='"+product_model_code+"') a group by a.uom_id,a.product_model_code,a.product_template_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_model_name,a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
            
              }
            
            }
            else
            {
              if (product_model_code=='0')
              {
               SQL ="select a.uom_id,a.product_model_code,a.product_model_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_template_name,a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select e.uom_id,z.x_model_code as product_model_code,z.name as product_model_name,y.id as product_class_id,y.name as product_class_name,e.id as product_template_id,e.name as product_template_name,c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id left outer join x_product_unit z on e.x_unit_model=z.id left outer join product_classification y on e.product_class=y.id "+
                    "where d.active=true and a.company_id="+dealer_id+" and c.usage='internal') a group by a.uom_id,a.product_model_code,a.product_template_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_model_name,a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
                }
                else
                {
                    SQL ="select a.uom_id,a.product_model_code,a.product_model_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_template_name,a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as jml from ("+
                    "select e.uom_id,z.x_model_code as product_model_code,z.name as product_model_name,y.id as product_class_id,y.name as product_class_name,e.id as product_template_id,e.name as product_template_name,c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id left outer join x_product_unit z on e.x_unit_model=z.id left outer join product_classification y on e.product_class=y.id "+
                    "where d.active=true and a.company_id="+dealer_id+" and c.usage='internal' and z.x_model_code='"+product_model_code+"') a group by a.uom_id,a.product_model_code,a.product_template_name,a.product_class_id,a.product_class_name,a.product_template_id,a.product_model_name,a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
             
                }
             }
            console.log(SQL);
           // return;

            let ecs = await client.query(SQL,function (err,rows,fields) {
                    if (err) {
                        console.log(err);
                    } else {


                               const arr = rows.rows;

                              var scheme = {
                                  "$group[productClass](product_class_id)": {
                                    //"product_model_code": "product_model_code",
                                    //"product_model_name": "product_model_name",
                                    //"product_class_id": "product_class_id",
                                    "productClassName": "product_class_name",
                                    "$group[productIds](product_id)": {
                                      //"product_id": "product_id",
                                      "product_code": "product_code",
                                      "product_name": "product_name",
                                      //"location_id": "location_id",
                                      //"location_name": "location_name",
                                      //"dealer_id": "dealer_id",
                                      //"dealer_code": "dealer_code",
                                      "uom_id": "uom_id",
                                      "qty": "jml"
                                    }
                                  }
                                };
                                console.log(shape.parse(arr, scheme));
                              res.json(shape.parse(arr, scheme));
                              res.end();

                    }
                });


           /* let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });

            */
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/stockonhand/:dealer_id/:product_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            product_code = req.params.product_code;
            dealer_id = req.params.dealer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            if (product_code=='0')
            {
               SQL ="select a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as qty_stock from ("+
                    "select c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id where d.active=true and b.id="+dealer_id+" and c.usage='internal') a group by a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
            
            }
            else
            {
            SQL ="select a.id as product_id,a.default_code as product_code,a.name as product_name,"+
                    "a.dealer_id,a.dealer_code,a.dealer_name,a.location_id,a.location_name,sum(a.quantity-a.reserved_quantity) as qty_stock from ("+
                    "select c.id as location_id,c.complete_name as location_name,d.id,d.default_code,e.name,b.id as dealer_id,b.company_code as dealer_code,"+
                    "b.name as dealer_name,a.quantity,a.reserved_quantity from stock_quant a inner join res_company b on a.company_id=b.id "+
                    "inner join stock_location c on a.location_id=c.id inner join product_product d on a.product_id=d.id inner join product_template e "+
                    "on d.product_tmpl_id=e.id where d.active=true and b.id="+dealer_id+" and c.usage='internal' and d.default_code='"+product_code+"') a group by a.location_name,a.location_id,a.id,a.default_code,a.name,a.dealer_id,a.dealer_code,a.dealer_name;";  
             }
            console.log(SQL);
           // return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/product-template/:dealer_id/:product_template_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            product_template_code = req.params.product_template_code;
            dealer_id = req.params.dealer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            if (product_template_code=='0')
            {
               SQL ="select a.id as product_template_id,a.default_code as product_template_code,a.name as product_tempate_name,b.name as product_class_name from product_template a inner join product_classification b on a.product_class=b.id where a.sale_ok=true and a.active=true;";  
            
            }
            else
            {
              SQL ="select a.id as product_template_id,a.default_code as product_template_code,a.name as product_tempate_name,b.name as product_class_name from product_template a inner join product_classification b on a.product_class=b.id where a.sale_ok=true and a.default_code='"+product_template_code+"' and a.active=true;";  
            }
            console.log(SQL);
           // return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/pricelist-producttemplate/:dealer_id/:product_template_code', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = "E";
    let dealer_id = req.params.dealer_id;
    let product_template_code = req.params.product_template_code;
    //let i_booking_id =req.body.booking_id;
    //let s_slot_of_time_id = req.body.slot_of_time_id;
    //let s_customer_id = req.body.customer_id;
    //let s_update_by = req.body.update_by;
    
    //console.log(req.body.name);
    //  return;
    
        //let SQL ="select fn_api_producttemplate_pricelist ('S',"+dealer_id+",'"+product_template_code+"');";
        let SQL ="select fn_api_producttemplate_pricelist('S',"+dealer_id+",'"+product_template_code+"');";
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

    let sreturn = users.rows[0].fn_api_producttemplate_pricelist;
    //sreturn = "["+sreturn+"]";
     var tweet1 = JSON.parse(sreturn);
    //let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    //const booking = {
    //code: myArray[0],
    //message: myArray[1],
    //id: myArray[2]
  //}//

    // res.end(JSON.stringify(users)); 
    res.json(tweet1);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.get('/api/v0/product/pricelist-producttemplate/:dealer_id/:product_template_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            dealer_id = req.params.dealer_id;
            product_template_id = req.params.product_template_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            let s_return ="";
            if (isNaN(dealer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        } 


                  if (product_template_id=='0')
                {
                  SQL ="select a.currency_id,a.pricelist_id,a.product_template_id,a.product_template_code,a.product_template_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name "+
                  "from (select a.currency_id,a.id as pricelist_id,a.name as pricelist_name,d.id as product_id,d.default_code as product_code,"+
                  "e.id as product_template_id,e.default_code as product_template_code,e.name as product_template_name,"+
                  "b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a "+
                  "left outer join res_company b on a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                  "on c.product_id=d.id inner join product_template e on d.product_tmpl_id=e.id where c.applied_on='0_product_variant'  and c.active=true and a.active=true "+
                  "and a.company_id="+dealer_id+""+
                  ") a group by a.currency_id,a.pricelist_id,a.product_template_id,a.product_template_code,a.product_template_name,a.dealer_id,a.dealer_code,a.dealer_name;"; 
                  }
                  else

                  {
                  SQL ="select a.currency_id,a.pricelist_id,a.product_template_id,a.product_template_code,a.product_template_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name "+
                  "from (select a.currency_id,a.id as pricelist_id,a.name as pricelist_name,d.id as product_id,d.default_code as product_code,"+
                  "e.id as product_template_id,e.default_code as product_template_code,e.name as product_template_name,"+
                  "b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a "+
                  "left outer join res_company b on a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                  "on c.product_id=d.id inner join product_template e on d.product_tmpl_id=e.id where c.applied_on='0_product_variant'  and c.active=true and a.active=true "+
                  "and a.company_id="+dealer_id+""+
                  ") a group by a.currency_id,a.pricelist_id,a.product_template_id,a.product_template_code,a.product_template_name,a.dealer_id,a.dealer_code,a.dealer_name;"; 

                  }
            
            
            let ecs_1;
            //console.log(SQL);
            //return;
            let ecs = client.query(SQL, function(err,data) {
            let arr = data.rows;
            let arr_res=[];
            var tweets = JSON.parse(JSON.stringify(data.rows));
            var queries_made = 0;
            var queries_success = 0;
              if(!err) {
                    
                    let prev_distance ="";
                    s_return = s_return +"[";
                    //for (var i in arr) {
                    tweets.forEach(function(tweet){    
                        //arr_res.push(arr[i].id);
                       
                        //let ids = arr[i].product_template_id;
                        //let s_name = arr[i].product_template_name;
                          let ids = tweet.product_template_id;
                          let s_name = tweet.product_template_name;
                       
                          
                          if (queries_made==0) 
                          {
                            s_return = s_return +"{";
                          }
                          else
                          {
                            s_return = s_return +",{";
                          }
                           //s_return = s_return +"{";
                           s_return = s_return +'"id": '+ids+',"name": "'+s_name+'"';
                          
                                  SQL_1="select c.name from product_template a inner join product_template_attribute_line b on a.id=b.product_tmpl_id inner join "+
                                  "product_attribute c on b.attribute_id=c.id where a.active=true and a.id="+ids+"";
                                  //console.log(SQL_1);
                                  client.query(SQL_1, function(err, result) {
                                  let arr_1 = result.rows;
                                  //console.log(result.rows);
                                  var tweet1 = JSON.parse(JSON.stringify(result));
                                  //s_return = s_return +" "+result.rows;
                                  // console.log(tweet1);
                                  //result.forEach(p => {
                                     // s_return = s_return +'"'+s_name_1+'":[]';
                                  //   s_return = s_return +'{p.name}:[]';
                                  //});
                                  //tweet1[j].Label
                                  for (var j in arr_1) {
                                  let s_name_1 = arr_1[j].name;
                                                if (j==0)
                                                {
                                                  s_return = s_return +"{";
                                                }
                                                else
                                                {
                                                  s_return = s_return +",{";
                                                }
                                                //s_return = s_return +'"'+s_name_1+'"';
                                                s_return = s_return +'name": "'+s_name_1+'"';
                                                s_return = s_return +"}";
                                        //console.log(s_name_1);        
                                                
                                  }
                                  

                                  queries_success++;
                                  if(queries_made==queries_success)
                                    res.end();
                                  });  
                                  
                           s_return = s_return +"}";
                           queries_made++;

                   // }
                   });
                    s_return = s_return +"]";
                    console.log(s_return);
                    const obj = JSON.parse(s_return);
                    res.json(obj);
                    
                    //res.json(data.rows);  





                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/pricelist-productmodel/:dealer_id/:product_model_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            dealer_id = req.params.dealer_id;
            product_model_id = req.params.product_model_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(dealer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (dealer_id==0)
            {
              if (product_model_id=='0')
                {
                  SQL ="select a.pricelist_id,a.currency_id,a.product_model_id,a.product_model_code,a.product_model_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name from "+
                    "(select a.currency_id,a.id as pricelist_id,z.id as product_model_id,z.x_model_code as product_model_code,z.name as product_model_name,a.name as pricelist_name,d.id as product_id,"+
                    "e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name "+
                    "as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on "+
                    "a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                    "on c.product_id=d.id inner join product_template e on c.product_tmpl_id=e.id inner join x_product_unit z on e.x_unit_model=z.id "+
                    "where c.applied_on='0_product_variant' and c.active=true and a.active=true and now() between c.date_start and c.date_end "+
                    ") a group by a.currency_id,a.pricelist_id,a.product_model_id,a.product_model_code,a.product_model_name,a.dealer_id,a.dealer_code,a.dealer_name;";  
                }
                else
                {
                    SQL ="select a.pricelist_id,a.currency_id,a.product_model_id,a.product_model_code,a.product_model_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name from "+
                    "(select a.currency_id,a.id as pricelist_id,z.id as product_model_id,z.x_model_code as product_model_code,z.name as product_model_name,a.name as pricelist_name,d.id as product_id,"+
                    "e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name "+
                    "as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on "+
                    "a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                    "on c.product_id=d.id inner join product_template e on c.product_tmpl_id=e.id inner join x_product_unit z on e.x_unit_model=z.id "+
                    "where c.applied_on='0_product_variant' and z.x_model_code='"+product_model_id+"' and c.active=true and a.active=true and now() between c.date_start and c.date_end "+
                    ") a group by a.currency_id,a.pricelist_id,a.product_model_id,a.product_model_code,a.product_model_name,a.dealer_id,a.dealer_code,a.dealer_name;";  
                }
            
            }
            else
            { 
                  if (product_model_id=='0')
                {
                  SQL ="select a.pricelist_id,a.currency_id,a.product_model_id,a.product_model_code,a.product_model_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name from"+
                    "(select a.currency_id,a.id as pricelist_id,z.id as product_model_id,z.x_model_code as product_model_code,z.name as product_model_name,a.name as pricelist_name,d.id as product_id,"+
                    "e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name "+
                    "as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on "+
                    "a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                    "on c.product_id=d.id inner join product_template e on c.product_tmpl_id=e.id inner join x_product_unit z on e.x_unit_model=z.id "+
                    "where c.applied_on='0_product_variant' and c.active=true and a.active=true and now() between c.date_start and c.date_end and a.company_id="+dealer_id+""+
                    ") a group by a.currency_id,a.pricelist_id,a.product_model_id,a.product_model_code,a.product_model_name,a.dealer_id,a.dealer_code,a.dealer_name;";  
                  }
                  else

                  {
                    SQL ="select a.pricelist_id,a.currency_id,a.product_model_id,a.product_model_code,a.product_model_name,min(a.unit_price) as min_unit_price,a.dealer_id,a.dealer_code,a.dealer_name from"+
                    "(select a.currency_id,a.id as pricelist_id,z.id as product_model_id,z.x_model_code as product_model_code,z.name as product_model_name,a.name as pricelist_name,d.id as product_id,"+
                    "e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name "+
                    "as dealer_name,c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on "+
                    "a.company_id=b.id inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d "+
                    "on c.product_id=d.id inner join product_template e on c.product_tmpl_id=e.id inner join x_product_unit z on e.x_unit_model=z.id "+
                    "where c.applied_on='0_product_variant' and z.x_model_code='"+product_model_id+"' and c.active=true and a.active=true and now() between c.date_start and c.date_end and a.company_id="+dealer_id+""+
                    ") a group by a.currency_id,a.pricelist_id,a.product_model_id,a.product_model_code,a.product_model_name,a.dealer_id,a.dealer_code,a.dealer_name;";  

                  }
             }
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/pricelist/:dealer_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            dealer_id = req.params.dealer_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";

            if (isNaN(dealer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (dealer_id==0)
            {
               SQL ="select a.name as pricelist_name,d.id as product_id,e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,"+
                    "c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on  a.company_id=b.id "+
                    "inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d on c.product_id=d.id "+
                    "inner join product_template e on c.product_tmpl_id=e.id where c.applied_on='0_product_variant' and c.active=true and a.active=true "+
                    "and now() between c.date_start and c.date_end;";  
            
            }
            else
            {
                  SQL ="select a.name as pricelist_name,d.id as product_id,e.default_code as product_code,e.name as product_name,b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,"+
                    "c.fixed_price as unit_price,c.date_start,c.date_end from product_pricelist a left outer join res_company b on  a.company_id=b.id "+
                    "inner join product_pricelist_item c on a.id=c.pricelist_id inner join product_product d on c.product_id=d.id "+
                    "inner join product_template e on c.product_tmpl_id=e.id where c.applied_on='0_product_variant' and c.active=true and a.active=true "+
                    "and now() between c.date_start and c.date_end and b.id="+dealer_id+";";  
             }
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/dealer/:type/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            type = req.params.type;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            
            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (type==0)
              {

              if (id==0)
              {
                 SQL ="select a.id as dealer_id,a.company_code as dealer_code,a.name as dealer_name,a.email,a.phone,b.street,b.street2,b.city,b.zip,c.name as province_name,a.dealer_latitude,a.dealer_longitude,d.name as company_type_name from res_company a inner join "+
                      "res_partner b on a.partner_id=b.id inner join res_country_state c on b.state_id=c.id inner join x_companytype d on a.x_companytype_id=d.id where a.x_companytype_id =1;";  
              
              }
              else
              {
                 SQL ="select a.id as dealer_id,a.company_code as dealer_code,a.name as dealer_name,a.email,a.phone,b.street,b.street2,b.city,b.zip,c.name  as province_name,a.dealer_latitude,a.dealer_longitude,d.name as company_type_name from res_company a inner join "+
                      "res_partner b on a.partner_id=b.id inner join res_country_state c on b.state_id=c.id inner join x_companytype d on a.x_companytype_id=d.id where a.x_companytype_id =1 a.id="+id+";";  
              
              }
            }
            else
            {


              if (id==0)
              {
                 SQL ="select a.id as dealer_id,a.company_code as dealer_code,a.name as dealer_name,a.email,a.phone,b.street,b.street2,b.city,b.zip,c.name as province_name,a.dealer_latitude,a.dealer_longitude,d.name as company_type_name from res_company a inner join "+
                      "res_partner b on a.partner_id=b.id inner join res_country_state c on b.state_id=c.id inner join x_companytype d on a.x_companytype_id=d.id where a.x_companytype_id =1;";  
              
              }
              else
              {
                 SQL ="select a.id as dealer_id,a.company_code as dealer_code,a.name as dealer_name,a.email,a.phone,b.street,b.street2,b.city,b.zip,c.name  as province_name,a.dealer_latitude,a.dealer_longitude,d.name as company_type_name from res_company a inner join "+
                      "res_partner b on a.partner_id=b.id inner join res_country_state c on b.state_id=c.id inner join x_companytype d on a.x_companytype_id=d.id where a.x_companytype_id =1 a.id="+id+";";  
              
              }


            }
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/ec/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (id==0)
            {
               SQL ="select a.id,a.name,a.address,address_2,a.zip_code,a.city,c.name as province_name,a.designation_latitude as latitude,a.designation_longitude as longitude,"+
                    "a.operational_hours,b.name as company_name,b.company_registry as company_code,a.company_id from designation_designation a left outer join res_company b on "+
                    "a.company_id=b.id left outer join res_country_state c on a.state_id=c.id where a.is_active=true;";  
            
            }
            else
            {
              SQL ="select a.id,a.name,a.address,address_2 ,a.zip_code,a.city,c.name as province_name,a.designation_latitude as latitude,a.designation_longitude as longitude,"+
                    "a.operational_hours,b.name as company_name,b.company_registry as company_code,a.company_id from designation_designation a left outer join res_company b on "+
                    "a.company_id=b.id left outer join res_country_state c on a.state_id=c.id where a.is_active=true and a.id="+id+";";  

            }
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/booking-testdrive/ec-ev-available/:start_date/:end_date', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            start_date = req.params.start_date;
            end_date = req.params.end_date;
            //console.log(req.cookies);
            //var nim = req.params.nim;

            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
           
    

                    SQL = "select a.address as street,a.address_2 as street2,a.city_id,x.name as city,c.name as state,y.id as product_id,y.name as product_name,y.product_code,a.id as location_id,a.name as location_name,a.address ,a.zip_code as zip,a.city,c.name as province_name,a.designation_latitude as latitude,a.designation_longitude as longitude,a.operational_hours,b.name as company_name,b.company_registry as company_code,a.company_id from designation_designation a "+
                    "left outer join res_company b on "+
                    "a.company_id=b.id left outer join res_country_state c on a.state_id=c.id inner join x_emiproductschedule z "+
                    "on a.id=z.designation_id inner join x_emiproduct y on z.x_emiproduct_id=y.id inner join res_city x on a.city_id=x.id where a.is_active=true;";


            let ecs = await client.query(SQL,function (err,rows,fields) {
                    if (err) {
                        console.log(err);
                    } else {


                               const arr = rows.rows;

                              var scheme = {
                                  "$group[ecs](location_id)": {
                                    "ec_id": "location_id",
                                    "ec_name": "location_name",
                                    "street": "street",
                                    "street2": "street2",
                                    "city_id": "city_id",
                                    "city": "city",
                                    "state": "state",
                                    "latitude": "latitude",
                                    "longitude": "longitude",
                                    "operational_hours": "operational_hours",
                                    "company_name": "company_name",
                                    
                                    "$group[testdrive_products](product_id)": {
                                      "product_id": "product_id",
                                      "product_code": "product_code",
                                      "product_name": "product_name"
                                    }
                                  }
                                };
                                console.log(shape.parse(arr, scheme));
                              res.json(shape.parse(arr, scheme));
                              res.end();

                    }
                });


            
        
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/customer/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            //if (isInteger(id)==false)
            if (isNaN(id)) 
            //if (typeof id != "number") 
            {
                res.status(500).json({error: 'Error'});
              return;
            }

            /*if (id==0)
            {
               SQL ="select a.id,a.name,a.street,a.street2,a.zip,a.city,c.name as province_name,a.email,a.phone,a.mobile,b.name as company_name"+
                    ",b.id as company_id,a.x_identity_type,a.x_identity_number,a.x_driving_license from res_partner a  left outer join res_company b on a.company_id=b.id left outer join res_country_state c on a.state_id=c.id"+
                    " where a.active=true and a.customer_rank>0 order by id";  
            
            }
            else
            {*/
               SQL ="select a.id,a.name,a.street,a.street2,a.zip,a.city,c.name as province_name,a.email,a.phone,a.mobile,b.name as company_name"+
                    ",b.id as company_id,a.x_identity_type,a.x_identity_number,a.x_driving_license from res_partner a  left outer join res_company b on a.company_id=b.id left outer join res_country_state c on a.state_id=c.id"+
                    " where a.active=true and a.customer_rank>0 and a.id="+id+"";  

            //}
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});



app.get('/api/v1/testdrive-product/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

            if (id==0)
            {
            
               SQL ="select a.id as product_testdrive_id,a.product_code as product_testdrive_code,a.name as product_testdrive_name from x_emiproduct a where a.is_active=true;";  
            }
            else
            {
               SQL ="select a.id as product_testdrive_id,a.product_code as product_testdrive_code,a.name as product_testdrive_name from x_emiproduct a where a.is_active=true and a.id="+id+";";  

            }
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/bookingtype/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            if (id==0)
            {
              SQL ="select a.id as bookingtype_id,a.appointment_type_code as bookingtype_code,a.name as bookingtype_name from appointment_type a ;";  
            }
            else
            {
               SQL ="select a.id as bookingtype_id,a.appointment_type_code as bookingtype_code,a.name as bookingtype_name from appointment_type a where  a.id="+id+";";  

            }
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


// app.get('/api/v1/city/:id/:state_id', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             id = req.params.id;
//             state_id = req.params.state_id;
//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";


//             if (isNaN(id)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }


//             if (id==0)
//             {
//               if (state_id==0)
//               {
//                 SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,b.code as state_code, a.state_id,a.x_area_id,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where 1=1;";  
//               }
//               else
//               {
//                // SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id from res_city a where a.state_id="+state_id+";";  
//                    SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,a.x_area_id,b.code as state_code,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where a.state_id="+state_id+";";  
             
//               }
//             }
//             else
//             {
                
//                 SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,a.x_area_id,b.code as state_code,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where a.id="+id+";";  
               
//             }
//             console.log(SQL);
//             let ecs = await client.query(SQL, function(err,data) {

//               if(!err) {
//                     res.json(data.rows);

//                     if(isNaN (res.x_area_id)){
//                       res.json({msg: "outside dealer coverage area"})
//                     }
//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });


// app.get('/api/v1/province/:id', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             id = req.params.id;
//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";


//             if (isNaN(id)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }


//             if (id==0)
//             {
//                SQL ="select a.id as province_id,a.name as province_name from res_country_state a where a.country_id=100;";  
            
//             }
//             else
//             {
//                SQL ="select a.id as province_id,a.name as province_name from res_country_state a where a.country_id=100 and a.id="+id+";";  

//             }
//             console.log(SQL);
//             let ecs = await client.query(SQL, function(err,data) {

//               if(!err) {
//                     res.json(data.rows);
//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });



// app.get('/api/v2/booking-testdrive/get-available-timeslot/:appointment_type_id_param/:product_id_param/:ec_id_param/:start_date_param/:end_date_param', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             appointment_type_id_param = req.params.appointment_type_id_param;
//             start_date_param = req.params.start_date_param;
//             end_date_param = req.params.end_date_param;
//             ec_id_param = req.params.ec_id_param;
//             product_id_param = req.params.product_id_param;
            


//             if (isNaN(ec_id_param)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }


//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";
//             let SQL1 = "";

//             SQL1 = "UPDATE slot_of_time SET is_active=false WHERE start_time < now() and is_active=true";
//             let ecs1 = await client.query(SQL1);

//             FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';
//             SQL="select a.start_time_iso,a.end_time_iso,a.combination,a.appointment_type_name,a.appointment_type_id,a.end_time,a.start_time,a.booking_date,a.product_id,a.product_name,a.ec_name,a.ec_id,"+
//                 "sum(a.count_true) as jml,sum(a.count_false) as jml_false from (select CONCAT(z.name,'-',d.name,'-',e.name,'-',to_char(a.slot_date,'YYYY-MM-DD')) as combination,z.name as appointment_type_name,a.em_appointment_system_id,b.appointment_type_id,a.is_active as "+
//                 "is_active_slot_time,to_char(a.end_time,'HH24:SS') as end_time,to_char(a.start_time,'HH24:SS') as start_time,"+
//                 "to_char(a.end_time,'"+FORMAT_ISO+"') as end_time_iso,to_char(a.start_time,'"+FORMAT_ISO+"') as start_time_iso,"+
//                 "a.id as slot_of_time_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_id,e.name as product_name,"+
//                 "d.name as ec_name,d.id as ec_id,case when a.is_active=true then 1 else 0 end as count_true,case when a.is_active=false then 1 else 0 end as count_false from slot_of_time a inner join x_emiproductschedule b on a.productschedule_id=b.id "+
//                 "inner join res_company c on b.company_id=c.id inner join designation_designation d on b.designation_id=d.id "+
//                 "inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
//                 "inner join appointment_type z on b.appointment_type_id=z.id"+
//                 " where e.id="+product_id_param+" and d.id="+ec_id_param+" and a.slot_date between '"+start_date_param+"' and '"+end_date_param+"' "+
//                 //"and b.appointment_type_id="+appointment_type_id_param+" and a.is_active=true and b.is_active=true"+
//                 "and b.appointment_type_id="+appointment_type_id_param+" and b.is_active=true"+
//                 ") a group by a.start_time_iso,a.end_time_iso,a.combination,a.appointment_type_name,a.appointment_type_id,a.end_time,a.start_time,a.booking_date, a.product_id,a.product_name,a.ec_name,a.ec_id order by a.start_time;"
//             console.log(SQL);
            
//             //return;
//             let ecs = await client.query(SQL, function(err,rows) {

//               if(!err) {
//                    // res.json(data.rows);



//                                const arr = rows.rows;

//                               var scheme = {
//                                   "$group[ec_ev_type_date](combination)": {
//                                     "ec_id": "ec_id",
//                                     "ec_name": "ec_name",
//                                     "product_id": "product_id",
//                                     "product_name": "product_name",
//                                     "appointment_type_id": "appointment_type_id",
//                                     "appointment_type_name": "appointment_type_name",
//                                     "booking_date": "booking_date",

//                                     "$group[start_time_s](start_time)": {
//                                       "start_time": "start_time",
//                                       "end_time": "end_time",
//                                       "start_time_iso": "start_time_iso",
//                                       "end_time_iso": "end_time_iso",
//                                      "count": "jml",
//                                      "count_false": "jml_false"
//                                     }
//                                   }
//                                 };
//                                 console.log(shape.parse(arr, scheme));
//                               res.json(shape.parse(arr, scheme));
//                               res.end();


//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });


// app.get('/api/v1/booking-testdrive/get-available-timeslot/:appointment_type_id_param/:product_id_param/:ec_id_param/:booking_date_param', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             appointment_type_id_param = req.params.appointment_type_id_param;
//             booking_date_param = req.params.booking_date_param;
//             ec_id_param = req.params.ec_id_param;
//             product_id_param = req.params.product_id_param;
            


//             if (isNaN(appointment_type_id_params)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }

//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";
            
//             SQL="select z.name as appointment_type_name,a.em_appointment_system_id,b.appointment_type_id,a.is_active as is_active_slot_time,to_char(a.end_time,'HH:SS') as end_time,to_char(a.start_time,'HH:SS') as start_time,a.id as slot_of_time_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_id,e.name as product_name,d.name as ec_name,"+
//                     "d.id as ec_id from slot_of_time a inner join "+
//                     "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
//                     "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id inner join appointment_type z on b.appointment_type_id=z.id "+
//                     "where d.id="+ec_id_param+" and a.slot_date='"+booking_date_param+"' and b.appointment_type_id="+appointment_type_id_param+";"
//             console.log(SQL);
//             let ecs = await client.query(SQL, function(err,rows) {

//               if(!err) {
//                    // res.json(data.rows);



//                                const arr = rows.rows;

//                               var scheme = {
//                                   "$group[ec_locations](ec_id)": {
//                                     "ec_id": "ec_id",
//                                     "ec_name": "ec_name",
//                                     "product_id": "product_id",
//                                     "product_name": "product_name",
//                                     "appointment_type_id": "appointment_type_id",
//                                     "appointment_type_name": "appointment_type_name",
//                                     "booking_date": "booking_date",

//                                     "$group[slot_time_ids](slot_of_time_id)": {
//                                       "slot_of_time_id": "slot_of_time_id",
//                                       "start_time": "start_time",
//                                       "end_time": "end_time",
//                                       "is_active_slot_time": "is_active_slot_time",
//                                       "booking_id": "em_appointment_system_id"
//                                     }
//                                   }
//                                 };
//                                 console.log(shape.parse(arr, scheme));
//                               res.json(shape.parse(arr, scheme));
//                               res.end();


//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });

// app.get('/api/v1/booking-testdrive/get-available-timeslot-ec', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             id = req.params.id;
//             type_id = req.params.type_id;
            

//             if (isNaN(id)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }

//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";
            
//               SQL ="select to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,"+
//                     "d.id as ec_id from slot_of_time a inner join "+ 
//                     "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
//                     "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
//                     "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id=1 group by a.slot_date,e.id,d.id;";
//             console.log(SQL);
//             let ecs = await client.query(SQL, function(err,data) {

//               if(!err) {
//                     res.json(data.rows);
//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });


// app.get('/api/v1/allavailabletimeslot/:type_id/:id', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             id = req.params.id;
//             type_id = req.params.type_id;
            

//             if (isNaN(id)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }

//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";
//             if (id==0)
//             {
              
//               SQL ="select a.id as timeslot_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,e.product_code as product_testdrive_code,e.name as product_testdrive_name,to_char(a.start_time,'YYYY-MM-DD HH24:MI:SS') as booking_start_time,to_char(a.end_time,'YYYY-MM-DD HH24:MI:SS') as booking_end_time,"+
//                     "d.id as ec_id,d.name as ec_name,c.name  as company_name,c.id as company_id,b.appointment_type_id as booking_type_id,f.name as booking_type_name,d.designation_latitude as ec_latitude,d.designation_longitude as ec_longitude,d.operational_hours,d.email_pic as ec_email_pic from slot_of_time a inner join "+ 
//                     "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
//                     "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
//                     "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id="+type_id+";";
                
              
            
//             }
//             else
//             {

//               SQL ="select a.id as timeslot_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,e.product_code as product_testdrive_code,e.name as product_testdrive_name,to_char(a.start_time,'YYYY-MM-DD HH24:MI:SS') as booking_start_time,to_char(a.end_time,'YYYY-MM-DD HH24:MI:SS') as booking_end_time,"+
//                     "d.id as ec_id,d.name as ec_name,c.name  as company_name,c.id as company_id,b.appointment_type_id as booking_type_id,f.name as booking_type_name,d.designation_latitude as ec_latitude,d.designation_longitude as ec_longitude,d.operational_hours,d.email_pic as ec_email_pic from slot_of_time a inner join "+ 
//                     "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
//                     "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
//                     "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id="+type_id+" and a.id="+id+";";
           
//             }
//             console.log(SQL);
//             let ecs = await client.query(SQL, function(err,data) {

//               if(!err) {
//                     res.json(data.rows);
//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });


// app.post('/api/v1/saleorder/set-deliveryaddress', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//           try {
//     //console.log(req.cookies);
//     let s_a = "E";
//     let s_sale_order_id =req.body.sale_order_id;
//     let s_shipping_contact_id_ = req.body.shipping_contact_id_;
//     //let s_customer_id = req.body.customer_id;
//     //let s_contact_id = req.body.contact_id;
    
//     //console.log(req.body.name);
//     //  return;
    
//         let SQL ="select fn_change_deliveryaddress ('E',"+s_sale_order_id+","+s_shipping_contact_id_+");";
//         console.log(SQL);
//         //console.log(SQL);
//         //return;
//         let users = await client.query(SQL);
        
//     //console.log(users); 
//     //res.send(users);
//     //res.json({
//     //users
//     //message: 'Post Inserted...'
//     //});

//     let sreturn = users.rows[0].fn_change_deliveryaddress;
//         let  myArray = sreturn.split("|");
//          //res.json({returnmessage : sreturn});
//     const saleorder = {
//     code: myArray[0],
//     message: myArray[1],
//     id: myArray[2]
//   }

//     // res.end(JSON.stringify(users)); 
//     res.json({saleorder : saleorder});
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
  
    
//     }
//   });
// });



// app.post('/api/v1/saleorder/deliveryoptions', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//           try {
//     //console.log(req.cookies);
//     let s_a = "E";
//     let s_so_id =req.body.order_id;
//     let s_deliveryoption_id = req.body.deliveryoption_id;
//     //let s_customer_id = req.body.customer_id;
//     let s_contact_id = req.body.contact_id;
    
//     //console.log(req.body.name);
//     //  return;
    
//         let SQL ="select fn_change_deliveryoptions ('E',"+s_so_id+","+s_deliveryoption_id+");";
//         console.log(SQL);
//         //console.log(SQL);
//         //return;
//         let users = await client.query(SQL);
        
//     //console.log(users); 
//     //res.send(users);
//     //res.json({
//     //users
//     //message: 'Post Inserted...'
//     //});

//     let sreturn = users.rows[0].fn_change_deliveryoptions;
//         let  myArray = sreturn.split("|");
//          //res.json({returnmessage : sreturn});
//     const saleorder = {
//     code: myArray[0],
//     message: myArray[1],
//     id: myArray[2]
//   }

//     // res.end(JSON.stringify(users)); 
//     res.json({saleorder : saleorder});
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
  
    
//     }
//   });
// });


// app.post('/api/v1/booking-testdrive/reschedule', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//           try {
//     //console.log(req.cookies);
//     let s_a = "E";
//     let i_booking_id =req.body.booking_id;
//     let s_slot_of_time_id = req.body.slot_of_time_id;
//     //let s_customer_id = req.body.customer_id;
//     let s_update_by = req.body.update_by;
    
//     //console.log(req.body.name);
//     //  return;
    
//         let SQL ="select sp_booking_testdrive_reschedule ('"+s_a+"',"+i_booking_id+","+s_slot_of_time_id+",'"+s_update_by+"');";
//         console.log(SQL);
//         //console.log(SQL);
//         //return;
//         let users = await client.query(SQL);
        
//     //console.log(users); 
//     //res.send(users);
//     //res.json({
//     //users
//     //message: 'Post Inserted...'
//     //});

//     let sreturn = users.rows[0].sp_booking_testdrive_reschedule;
//         let  myArray = sreturn.split("|");
//          //res.json({returnmessage : sreturn});
//     const booking = {
//     code: myArray[0],
//     message: myArray[1],
//     id: myArray[2]
//   }

//     // res.end(JSON.stringify(users)); 
//     res.json({booking : booking});
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
  
    
//     }
//   });
// });


// app.post('/api/v2/booking-testdrive/cancel', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//       //const booking = {
//       //  code: "1",
//       //  message: "Forbidden",
//       //  id: "0"
//       //}
//       //var data = {
//       //  'status':403,
//       //  'values':booking
//     //};
//     //res.json(data);
//     } else {
      
//           try {
//     //console.log(req.cookies);
//     let s_a = "C";
//     let i_booking_id =req.body.booking_id;
//     let s_cancel_category_id = req.body.cancel_category_id;
//     let s_cancel_comment = req.body.cancel_comment;
//     let s_update_by = req.body.update_by;
    
//     //console.log(req.body.name);
//     //  return;
    
//         let SQL ="select fn_booking_testdrive_cancel_v2 ('"+s_a+"',"+i_booking_id+","+s_cancel_category_id+",'"+s_cancel_comment+"','"+s_update_by+"');";
//         console.log(SQL);
//         //return;
//         let users = await client.query(SQL);
        
//     //console.log(users); 
//     //res.send(users);
//     //res.json({
//     //users
//     //message: 'Post Inserted...'
//     //});

//     let sreturn = users.rows[0].fn_booking_testdrive_cancel_v2;
//         let  myArray = sreturn.split("|");
//          //res.json({returnmessage : sreturn});
//     const booking = {
//     code: myArray[0],
//     message: myArray[1],
//     id: myArray[2],
//     productId: myArray[3]
//     ,
//     productName: myArray[4],
//     bookingId: myArray[2],
//     bookingCode: myArray[5],
//     date: myArray[6],
//     startTime: myArray[7],
//     endTime: myArray[8],
//     ecId: myArray[9],
//     ecName: myArray[10],
//     ecAddress: myArray[11],
//     ecLongitude: myArray[13],
//     ecLatitude: myArray[12],
//     ecCity: myArray[14],
//     ecState: myArray[15],
//     ecCountry: myArray[16],
//     ecOperationalHours: myArray[17],
//     CancelCategoryID : myArray[18],
//     CancelCategoryText : myArray[19],
//     Comment : myArray[20],
//     CancelDate : myArray[21],
    
//     ecAddress2 : myArray[22],
//   }

//     // res.end(JSON.stringify(users)); 
//     res.json({cancellation : booking});
//   } catch (error) {
//   res.status(500).json({error: error.message});

//    // var data = {
//    //     'status':500,
//    //     'values':booking
//    // };
//    // res.json(data);
//   }
  
    
//     }
//   });
// });


app.post('/api/v1/booking-testdrive/cancel', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
      //const booking = {
      //  code: "1",
      //  message: "Forbidden",
      //  id: "0"
      //}
      //var data = {
      //  'status':403,
      //  'values':booking
    //};
    //res.json(data);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = "C";
    let i_booking_id =req.body.booking_id;
    let s_cancel_category_id = req.body.cancel_category_id;
    let s_cancel_comment = req.body.cancel_comment;
    let s_update_by = req.body.update_by;
    
    //console.log(req.body.name);
    //  return;
    
        let SQL ="select sp_booking_testdrive_cancel ('"+s_a+"',"+i_booking_id+","+s_cancel_category_id+",'"+s_cancel_comment+"','"+s_update_by+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
        
    //console.log(users); 
    //res.send(users);
    //res.json({
    //users
    //message: 'Post Inserted...'
    //});

    let sreturn = users.rows[0].sp_booking_testdrive_cancel;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const booking = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({booking : booking});
  } catch (error) {
  res.status(500).json({error: error.message});

   // var data = {
   //     'status':500,
   //     'values':booking
   // };
   // res.json(data);
  }
  
    
    }
  });
});

app.post('/api/v1/booking-testdrive', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
                  //console.log(req.cookies);
                  let s_a = "I";
                  //let i_booking_id =req.body.booking_id;
                  let s_slot_of_time_id = req.body.slot_of_time_id;
                  let s_customer_id = req.body.customer_id;
                  let s_update_by = req.body.update_by;
                  

                    odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([210]); //id to update
                              //inParams.push({'image_ktp': s_image_ktp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('em.appointment.system', 'send_confirmation_email', params, function (err, value) {
                              //odoo.execute_kw('product.repair', 'send_finish_email', params, function (err, value) {  
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  res.json(value);
                              });
                            });
                          
/*
                  //console.log(req.body.name);
                  //  return;
                  
                      let SQL ="select sp_booking_testdrive ('"+s_a+"',0,"+s_slot_of_time_id+","+s_customer_id+",'"+s_update_by+"');";
                      console.log(SQL);
                      //return;
                      let users = await client.query(SQL);
                      
                  //console.log(users); 
                  //res.send(users);
                  //res.json({
                  //users
                  //message: 'Post Inserted...'
                  //});

                  let sreturn = users.rows[0].sp_booking_testdrive;
                      let  myArray = sreturn.split("|");
                       //res.json({returnmessage : sreturn});
                  const booking = {
                  code: myArray[0],
                  message: myArray[1],
                  id: myArray[2]
                }


                  // res.end(JSON.stringify(users)); 
                  res.json({booking : booking});
                  */
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});

app.post('/api/v2/booking-testdrive/reschedule', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = "E";
    let i_booking_id =req.body.booking_id;
    let s_ec_id = req.body.ec_id;
    let s_customer_id = req.body.customer_id;
    let s_product_id = req.body.product_id;
    let s_appointment_type_id = req.body.appointment_type_id;
    let s_booking_date = req.body.booking_date;
    let s_booking_time = req.body.booking_time;
    
    //console.log(req.body.name);
    //  return;
    
        let SQL ="select fn_booking_testdrive_reschedule_v2 ('"+s_a+"',"+i_booking_id+","+s_ec_id+","+s_product_id+","+s_appointment_type_id+",'"+s_booking_date+"','"+s_booking_time+"','"+s_customer_id+"');";
       console.log(SQL);
       //return;
        let users = await client.query(SQL);
        
    //console.log(users); 
    //res.send(users);
    //res.json({
    //users
    //message: 'Post Inserted...'
    //});

    let sreturn = users.rows[0].fn_booking_testdrive_reschedule_v2;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const booking = {
    code: myArray[0],
    message: myArray[1],
    productId: myArray[3]
    ,
    productName: myArray[4],
    bookingId: myArray[2],
    bookingCode: myArray[5],
    date: myArray[6],
    startTime: myArray[7],
    endTime: myArray[8],
    ecId: myArray[9],
    ecName: myArray[10],
    ecAddress: myArray[11],
    ecLongitude: myArray[13],
    ecLatitude: myArray[12],
    ecCityName: myArray[14],
    ecStateName: myArray[15],
    ecCountryName: myArray[16],
    ecOperationalHours: myArray[17]
  }

    // res.end(JSON.stringify(users)); 
    res.json({booking : booking});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/v2/booking-testdrive', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = "I";
    //let i_booking_id =req.body.booking_id;
    let s_ec_id = req.body.ec_id;
    let s_customer_id = req.body.customer_id;
    let s_product_id = req.body.product_id;
    let s_appointment_type_id = req.body.appointment_type_id;
    let s_booking_date = req.body.booking_date;
    let s_booking_time = req.body.booking_time;
    
    //console.log(req.body.name);
    //  return;
    
        let SQL ="select fn_booking_testdrive_v2 ('"+s_a+"',0,"+s_ec_id+","+s_product_id+","+s_appointment_type_id+",'"+s_booking_date+"','"+s_booking_time+"','"+s_customer_id+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
        
    //console.log(users); 
    //res.send(users);
    //res.json({
    //users
    //message: 'Post Inserted...'
    //});

    let sreturn = users.rows[0].fn_booking_testdrive_v2;
    let  myArray = sreturn.split("|");
    let booking_id = parseInt(myArray[2]);
         //res.json({returnmessage : sreturn});
    const booking = {
    code: myArray[0],
    message: myArray[1],
    productId: myArray[3],
    productName: myArray[4],
    bookingId: myArray[2],
    bookingCode: myArray[5],
    date: myArray[6],
    startTime: myArray[7],
    endTime: myArray[8],
    ecId: myArray[9],
    ecName: myArray[10],
    ecAddress: myArray[11],
    ecLongitude: myArray[13],
    ecLatitude: myArray[12],  
    ecCityName: myArray[14],
    ecStateName: myArray[15],
    ecCountryName: myArray[16],
    ecOperationalHours: myArray[17]
  }

              odoo.connect(function (err) {
                              if (err) { return console.log(err); }
                              console.log('Connected to Odoo server.');
                              //var ImageSend = ImageBase64.decode('ascii');

                              var inParams = [];
                              inParams.push([booking_id]); //id to update
                              //inParams.push({'image_ktp': s_image_ktp})
                             // inParams.push({'name': s_name});
                              var params = [];
                              params.push(inParams);
                              odoo.execute_kw('em.appointment.system', 'send_confirmation_email', params, function (err, value) {
                              //odoo.execute_kw('product.repair', 'send_finish_email', params, function (err, value) {  
                                  if (err) { return console.log(err); }
                                  console.log('Result: ', value);
                                  //res.json(value);
                              });
                            });

    // res.end(JSON.stringify(users)); 
    res.json({booking : booking});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.get('/api/v1/product-model/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            categ_id = req.params.categ_id;
            company_id = req.params.company_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
              let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

             if (id==0)
             {

              SQL="select a.id as product_model_id,a.x_model_code as product_model_code,a.name as product_model_name FROM x_product_unit a;";

              }
            else
            {
               
              SQL="select a.id as product_model_id,a.x_model_code as product_model_code,a.name as product_model_name FROM x_product_unit a where a.id="+id+";";

            }
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});

app.get('/api/v1/product-class/:id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            categ_id = req.params.categ_id;
            company_id = req.params.company_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
              let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

             if (id==0)
             {

              SQL="select a.id as product_class_id,a.name as product_class_name FROM product_classification a;";

              }
            else
            {
               
              SQL="select a.id as product_class_id,a.name as product_class_name FROM product_classification a where a.id="+id+";";

            }
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/:id/:company_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            categ_id = req.params.categ_id;
            company_id = req.params.company_id;
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
              let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';


            if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

             if (id=='0')
             {

                if (company_id==0)
               {
                      SQL ="select x.id as product_model_id,x.name as product_model,c.id as product_category_id,c.name as product_category_name,y.id as product_class_id,y.name as product_class"+
                      " ,b.id as product_id,a.default_code as product_code,a.name as product_name"+
                      ",z.id as dealer_id,z.company_code as dealer_code,z.name as dealer_name from product_template a inner join product_product b on a.id=b.product_tmpl_id inner join product_category c "+
                      "on a.categ_id=c.id inner join res_company z on a.company_id=z.id inner join product_classification y on a.product_class=y.id "+
                      "inner join x_product_unit x on a.x_unit_model=x.id where a.sale_ok=true and a.x_unit_specification=true;";
                 }
                else
                {
                      SQL ="select a.categ_id as product_category_id,c.name as product_category_name,b.id as product_id,a.default_code as product_code,a.name as product_name,z.name as dealer_name from product_template a inner join product_product b on a.id=b.product_tmpl_id inner join product_category c on a.categ_id=c.id inner join res_company z on a.company_id=z.id where a.sale_ok=true and a.company_id="+company_id+" and a.x_unit_specification=true;";
                
                }
            }
            else
            {
               if (company_id==0)
             {
                   SQL ="select a.categ_id as product_category_id,c.name as product_category_name,a.default_code as product_code,a.name as product_name,z.name as dealer_name from product_template a inner join product_product b on a.id=b.product_tmpl_id inner join product_category c on a.categ_id=c.id inner join res_company z on a.company_id=z.id where a.sale_ok=true and b.default_code='"+id+"'  and a.x_unit_specification=true;";
            
             }
             else
             {
                SQL ="select a.categ_id as product_category_id,c.name as product_category_name,a.default_code as product_code,a.name as product_name,z.name as dealer_name from product_template a inner join product_product b on a.id=b.product_tmpl_id inner join product_category c on a.categ_id=c.id inner join res_company z on a.company_id=z.id where a.sale_ok=true and b.default_code='"+id+"' and a.company_id="+company_id+" and a.x_unit_specification=true;";
             
              }
              

            }
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});

// app.get('/api/v1/booking-testdrive/list-percustomer/:partner_id', verifyToken,async function (req, res) {  
//   jwt.verify(req.token, 'secretkey', async function (err, authData) {
//     if(err) {
//       res.sendStatus(403);
//     } else {
      
//         try {
//             partner_id = req.params.partner_id;
//             //type_id = req.params.type_id;
            
//             //console.log(req.cookies);
//             let s_category = req.body.category;
//             let s_key = req.body.key;
//             let SQL = "";
//               let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';



//             if (isNaN(partner_id)) 
//                         {
//                           res.status(500).json({error: 'Error'});
//                           return;
//                         }

//               SQL ="select a.x_emiproduct_id as product_id,b.name as product_name,a.id as booking_id,"+         
//                     "a.name as booking_code,to_char(a.date,'YYYY-MM-DD') as date,to_char(c.start_time,'"+FORMAT_ISO+"') as start_time,"+
//                     "to_char(c.end_time,'"+FORMAT_ISO+"') as end_time,a.designation_id as ec_id,"+
//                     "d.name as ec_name,CONCAT(d.address,' ',d.address_2) as ec_address,d.designation_longitude as ec_longitude"+
//                     ",d.designation_latitude as ec_latitude,a.state as booking_status,to_char(a.x_cancel_date,'"+FORMAT_ISO+"') as cancel_date,a.reason as cancel_comment,"+
//                     "a.cancel_category_id,z.name as cancel_category_text,w.name as city_name,y.name as state_name,x.name as country_name,d.operational_hours "+
//                     "from em_appointment_system a inner join x_emiproduct b "+
//                     "on a.x_emiproduct_id=b.id left outer join slot_of_time c on a.slot_of_time_id=c.id "+
//                     "inner join designation_designation d on a.designation_id=d.id left outer join res_city e on d.city_id=e.id "+
//                     "inner join res_country_state y on d.state_id=y.id left outer join res_country x on d.country_id=x.id "+
//                     "left outer join x_cancelcategory z on a.cancel_category_id=z.id left outer join res_city w on d.city_id=w.id "+
//                     "where a.partner_id="+partner_id+";";
//             console.log(SQL);
//             //return;
//             let ecs = await client.query(SQL, function(err,data) {

//               if(!err) {
//                     res.json(data.rows);
//                 } else {
//                   console.log(err);
//               }

//             });
//             } catch (error) {
//               res.status(500).json({error: error.message});
//             }
  
    
//     }
//   });
// });


app.get('/api/v1/booking-list-percustomer/:partner_id', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            partner_id = req.params.partner_id;
            //type_id = req.params.type_id;
            
            //console.log(req.cookies);
            let s_category = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            

            if (isNaN(partner_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }

              SQL ="select to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,"+
                    "d.id as ec_id from slot_of_time a inner join "+ 
                    "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
                    "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
                    "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id=1 group by a.slot_date,e.id,d.id;";
            console.log(SQL);
            let ecs = await client.query(SQL, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.post('/api/v2/dealer/getdefaultdealer', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            let s_customer_id = req.body.customer_id;
            let s_name = req.body.name;


            const booking = {
                              code: '1',
                             message: 'Error Paramter',
                              id: '0'
                            }

            if (isNaN(s_customer_id)) 
                        {
                          //res.status(500).json({error: 'Error'});
                          res.json(booking);
                          return;
                        }

          //  id = req.params.id;
          //  categ_id = req.params.categ_id;
          //  company_id = req.params.company_id;
            //console.log(req.cookies);
          //  let s_category = req.body.category;
          //  let s_key = req.body.key;
          //  let SQL = "";
          //    let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';
            // if (id==0)
            // {
            //
            //  SQL="select fn_getlist_dealer_default('G',1,-6.29107,106.57134);";

             // }
            //else
            //{
               
            //  SQL="select fn_getlist_dealer_default('G',1,-6.29107,106.57134);";

            //}
            SQL ="sp_get_default_list_dealer";
            SQL ="select id,name from res_company;";
            //const v = obj.query.call(this, {
            //    entity: "sp_get_default_list_dealer",
            //    type: `proc`
            //}, values, queryResult.one | queryResult.none);

            //const result = await db.proc('sp_get_default_list_dealer', [userName]);
            console.log(SQL);
            //return;
            //let ecs = await client.proc(SQL, function(err,data) {
            let ecs = await client.query.call({entity:SQL,type:'proc'}, function(err,data) {

              if(!err) {
                    res.json(data.rows);
                } else {
                  console.log(err);
              }

            });
            

            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.post('/api/v2/dealer/getlist-and-default', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
          let s_return='';
          console.log('-----------------------------------------------------------');
          console.log('/api/v2/dealer/getlist-and-default');
            //id = req.params.id;
            //categ_id = req.params.categ_id;
            //company_id = req.params.company_id;
            //console.log(req.cookies);
            let s_customer_id = req.body.customer_id;
            let s_latitude = req.body.latitude;
            let s_longitude = req.body.longitude;


            const booking = {
                              code: '1',
                             message: 'Error Parameter',
                              id: '0'
                            }

            if (s_customer_id=='') 
                        {
                          //res.status(500).json({error: 'Error'});
                          //res.json(booking);
                          //return;
                          s_customer_id='0';
                        }
            if (s_latitude=='') 
                        {
                          s_latitude='0';
                        }
              if (s_longitude=='') 
                        {
                          s_longitude='0';
                        }


            let SQL = "";
            let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';
            
            if (s_customer_id=='0')
            {
                   SQL="select 0 as customer_id,'' as customer_name,b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,d.street as dealer_address,"+
                "d.street2 as dealer_address2,e.name as city_name,f.name as state_name,g.name as country_name,0 as distance,'' as operational_hours,d.zip as zip_code,"+
                "'0 km' as distance_label,b.dealer_latitude,b.dealer_longitude,true as is_default FROM  res_company b INNER JOIN res_partner d ON b.partner_id=d.id "+
              "LEFT OUTER JOIN res_city e ON d.city_id=e.id LEFT OUTER JOIN res_country_state f ON d.state_id=f.id LEFT OUTER JOIN res_country g ON d.country_id=g.id"+
              " WHERE b.id=3;";
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {
            let datass =data.rows;
              if(!err) {
                    console.log(datass);
                    res.json(datass);
                    console.log('-----------------------------------------------------------');
                } else {
                  console.log(err);
              }

            });

            

              return;
            }
          

            let SQL_1 ="select fn_getlist_dealer_default ('"+s_customer_id+"',"+s_latitude+","+s_longitude+");";
            console.log(SQL_1);
            //return;
            let users = await client.query(SQL_1);
            //client.query(SQL_1);
            let sreturn = users.rows[0].fn_getlist_dealer_default;
                    let  myArray = sreturn.split("|");
                     //res.json({returnmessage : sreturn});
                const dealer = {
                code: myArray[0],
                message: myArray[1],
                id: myArray[2]
              }
              console.log(sreturn);
              ///return;
              if (myArray[0]=='1')
              {
                   res.json(dealer);
                return;
              }

              SQL="select c.id as customer_id,c.name as customer_name,b.id as dealer_id,b.company_code as dealer_code,b.name as dealer_name,d.street as dealer_address,"+
                  "d.street2 as dealer_address2,e.name as city_name,f.name as state_name,g.name as country_name,a.distance,'' as operational_hours,d.zip as zip_code,"+
                  "CONCAT(to_char(a.distance/1000, 'FM999999999.00'),' km') as distance_label,a.dealer_latitude,a.dealer_longitude,is_default "+
                  "FROM x_defaultdealer a INNER JOIN res_company b on a.company_id=b.id INNER JOIN res_partner c ON a.partner_id=c.id "+
                  "INNER JOIN res_partner d ON b.partner_id=d.id LEFT OUTER JOIN res_city e ON d.city_id=e.id LEFT OUTER JOIN res_country_state f ON d.state_id=f.id "+
                  "LEFT OUTER JOIN res_country g ON d.country_id=g.id WHERE a.partner_id="+s_customer_id+" order by a.distance";
            console.log(SQL);
            //return;
            let ecs = await client.query(SQL, function(err,data) {
            let datas =data.rows;
              if(!err) {
                    res.json(datas);
                } else {
                  console.log(err);
              }

            });
            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/product/nested-object', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            id = req.params.id;
            //lat = req.params.lat;
            //long = req.params.long;

             //console.log(id);
             //return;
           /* if (isNaN(id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }
                        */
            let s_return ="";
            //let s_key = req.body.key;
            let SQL = "";
            
           // let dist = geolib.getPreciseDistance(
            //    { latitude: 51.5103, longitude: 7.49347 },
            //    { latitude: "51° 31' N", longitude: "7° 28' E" }
            //);
             //     res.json(dist);
            //client.query("DELETE FROM x_defaultdealer WHERE partner_id="+customer_id+"");
            SQL ="select id,company_code,name,dealer_latitude,dealer_longitude from res_company order by id;";
            
            let ecs = await client.query(SQL, function(err,data) {
            let arr = data.rows;
            let arr_res=[];
            //key_val_arr.push({id: 4, name: "lenovo"});


              if(!err) {
                    let prev_distance ="";
                     s_return = s_return +"[";
                  for (var i in arr) {

                        //arr_res.push(arr[i].id);
                       
                        let ids = arr[i].id;
                        let s_name = arr[i].name;
                         //SQLKU ="INSERT INTO x_defaultdealer(company_id,partner_id,distance) VALUES("+ids+","+customer_id+","+distance+");";
                         //client.query(SQLKU);
                          if (i==0)
                          {
                            s_return = s_return +"{";
                          }
                          else
                          {
                            s_return = s_return +",{";
                          }
                           //s_return = s_return +"{";
                           s_return = s_return +'"id": '+ids+',"name": "'+s_name+'"';
                           s_return = s_return +"}";

                    }
                       s_return = s_return +"]";
                      //return;
                      //JSON.parse(s_return);
                       // res.json(arr_res);
                     //   JSON.parse(s_return);
                     const obj = JSON.parse(s_return);
                       res.json(obj);
                } else {
                  console.log(err);
              }
            
            });
            
            
            } catch (error) {
              res.status(500).json({errora: error.message});
            }
  
    
    }
  });
});


app.get('/api/v1/dealer/getlist-and-default/:customer_id/:lat/:long', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
        try {
            customer_id = req.params.customer_id;
            lat = req.params.lat;
            long = req.params.long;


            if (isNaN(customer_id)) 
                        {
                          res.status(500).json({error: 'Error'});
                          return;
                        }


            //console.log(req.cookies);
            //let s_clat = req.params.lat;ategory = req.body.category;
            let s_key = req.body.key;
            let SQL = "";
            let dist = geolib.getPreciseDistance(
                { latitude: 51.5103, longitude: 7.49347 },
                { latitude: "51° 31' N", longitude: "7° 28' E" }
            );
             //     res.json(dist);
            client.query("DELETE FROM x_defaultdealer WHERE partner_id="+customer_id+"");
            SQL ="select id,company_code,name,dealer_latitude,dealer_longitude from res_company order by id;";
            
            let ecs = await client.query(SQL, function(err,data) {
            let arr = data.rows;
            let arr_res=[];
            //key_val_arr.push({id: 4, name: "lenovo"});


              if(!err) {
                    let prev_distance ="";
                  for (var i in arr) {
                        //arr_res.push(""+ arr[i].id,arr[i].name);
                        let distance = geolib.getPreciseDistance(
                            { latitude: lat, longitude: long },
                            { latitude: parseFloat(arr[i].dealer_latitude), longitude: parseFloat(arr[i].dealer_longitude) }
                        );
                        
                        let ids = arr[i].id;
                        SQLKU ="INSERT INTO x_defaultdealer(company_id,partner_id,distance) VALUES("+ids+","+customer_id+","+distance+");";
                        //console.log(SQLKU);
                        //return;
                        //arr_res.push({x:arr[i].id,dealer_name:arr[i].name,dealer_latitude:arr[i].dealer_latitude,dealer_longitude:arr[i].dealer_longitude,d:distance,default:terdekat});
                        client.query(SQLKU);
                      //console.log(arr[i]);
                        //res.json(arr[i]);          
                    }

                      //return;
                          res.json('ok');
                } else {
                  console.log(err);
              }

            });
            

            } catch (error) {
              res.status(500).json({error: error.message});
            }
  
    
    }
  });
});


app.post('/api/emica/customer', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
      		try {
    //console.log(req.cookies);
		let s_a = req.body.a;
	        let s_name = req.body.name;
		let i_id =req.body.id;
		let s_display_name = req.body.display_name;
		let s_street = req.body.street;
                let s_street2 = req.body.street2;
                let s_zip =req.body.zip;
                let s_city = req.body.city;
		let s_state_name = req.body.state_name;
                let s_email = req.body.email;
                let s_phone =req.body.phone;
                let s_mobile = req.body.mobile;

		//console.log(req.body.name);
		//	return;
    		let SQL ="select sp_customer ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"');";
    		console.log(SQL);
    		//  return;
    		let users = await client.query(SQL);
		//console.log(users);	
      		//res.send(users);
			//res.json({
			//users
        		//message: 'Post Inserted...'
      			//});
		let sreturn = users.rows[0].sp_customer;
	      let  myArray = sreturn.split("|");
	       //res.json({returnmessage : sreturn});
		const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/v2/set-customer-ktp', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    //let s_a = req.body.a;
    let s_name = req.body.name;
    let i_id =req.body.id;

    let s_x_identity_number =req.body.x_identity_number;
    let s_x_identity_type =req.body.x_identity_type;

    //console.log(req.body.name);
    //  return;
        let SQL ="select fn_write_customer_ktp_v2 ('E',"+i_id+",'"+s_x_identity_number+"','"+s_x_identity_type+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_write_customer_ktp_v2;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/v1/set-customer-ktp', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    //let s_a = req.body.a;
    let s_name = req.body.name;
    let i_id =req.body.id;

    let s_x_identity_number =req.body.x_identity_number;
  

    //console.log(req.body.name);
    //  return;
        let SQL ="select fn_write_customer_ktp ('E',"+i_id+",'"+s_x_identity_number+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_write_customer_ktp;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/v1/customer/contact', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = req.body.a;
    let i_parent_id = req.body.parent_id;
    let s_parent_type = req.body.parent_type;
    let s_name = req.body.name;
    let i_id =req.body.id;
    let s_display_name = req.body.display_name;
    let s_street = req.body.street;
    let s_street2 = req.body.street2;
    let s_zip =req.body.zip;
    let s_city = req.body.city;
    let s_state_name = req.body.state_name;
    let s_email = req.body.email;
    let s_phone =req.body.phone;
    let s_mobile = req.body.mobile;

    let s_x_identity_type = req.body.x_identity_type;
    let s_x_identity_number =req.body.x_identity_number;
    let s_x_driving_license = req.body.x_driving_license;
    let s_image_npwp_url=req.body.image_npwp_url;
    let s_image_ktp_url = req.body.image_ktp_url;
    let s_npwp_number = req.body.npwp_number;
    
    //console.log(req.body.name);
    //  return;
        //let SQL ="select fn_createwrite_customer_v1 ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"','"+s_x_identity_type+"','"+s_x_identity_number+"','"+s_x_driving_license+"');";
        let SQL ="select fn_createwrite_customer_contact ('"+s_a+"',"+i_parent_id+",'"+s_parent_type+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"','"+s_x_identity_type+"','"+s_x_identity_number+"','"+s_x_driving_license+"','"+s_image_ktp_url+"','"+s_image_npwp_url+"','"+s_npwp_number+"');";
      
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_createwrite_customer_contact;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});

app.post('/api/v1/customer', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = req.body.a;
          let s_name = req.body.name;
    let i_id =req.body.id;
    let s_display_name = req.body.display_name;
    let s_street = req.body.street;
    let s_street2 = req.body.street2;
    let s_zip =req.body.zip;
    let s_city = req.body.city;
    let s_state_name = req.body.state_name;
    let s_email = req.body.email;
    let s_phone =req.body.phone;
    let s_mobile = req.body.mobile;

    let s_x_identity_type = req.body.x_identity_type;
    let s_x_identity_number =req.body.x_identity_number;
    let s_x_driving_license = req.body.x_driving_license;
    let s_image_npwp_url=req.body.image_npwp_url;
    let s_image_ktp_url = req.body.image_ktp_url;
    let s_npwp_number = req.body.npwp_number;

    //console.log(req.body.name);
    //  return;
        //let SQL ="select fn_createwrite_customer_v1 ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"','"+s_x_identity_type+"','"+s_x_identity_number+"','"+s_x_driving_license+"');";
        let SQL ="select fn_createwrite_customer_v2 ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"','"+s_x_identity_type+"','"+s_x_identity_number+"','"+s_x_driving_license+"','"+s_image_ktp_url+"','"+s_image_npwp_url+"','"+s_npwp_number+"');";
      
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_createwrite_customer_v1;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/v2/customer', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = req.body.a;
          let s_name = req.body.name;
    let i_id =req.body.id;
    let s_display_name = req.body.display_name;
    let s_street = req.body.street;
    let s_street2 = req.body.street2;
    let s_zip =req.body.zip;
    let s_city = req.body.city;
    let s_state_name = req.body.state_name;
    let s_email = req.body.email;
    let s_phone =req.body.phone;
    let s_mobile = req.body.mobile;

    let s_x_identity_type = req.body.x_identity_type;
    let s_x_identity_number =req.body.x_identity_number;
    let s_x_driving_license = req.body.x_driving_license;
    let s_image_npwp_url=req.body.image_npwp_url;
    let s_image_ktp_url = req.body.image_ktp_url;
    let s_npwp_number = req.body.npwp_number;


    //console.log(req.body.name);
    //  return;
        let SQL ="select fn_createwrite_customer_v2 ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"','"+s_x_identity_type+"','"+s_x_identity_number+"','"+s_x_driving_license+"','"+s_image_ktp_url+"','"+s_image_npwp_url+"','"+s_npwp_number+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_createwrite_customer_v2;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/emica/customer', verifyToken,async function (req, res) {  
  jwt.verify(req.token, 'secretkey', async function (err, authData) {
    if(err) {
      res.sendStatus(403);
    } else {
      
          try {
    //console.log(req.cookies);
    let s_a = req.body.a;
          let s_name = req.body.name;
    let i_id =req.body.id;
    let s_display_name = req.body.display_name;
    let s_street = req.body.street;
                let s_street2 = req.body.street2;
                let s_zip =req.body.zip;
                let s_city = req.body.city;
    let s_state_name = req.body.state_name;
                let s_email = req.body.email;
                let s_phone =req.body.phone;
                let s_mobile = req.body.mobile;

    //console.log(req.body.name);
    //  return;
        let SQL ="select fn_createwrite_customer ('"+s_a+"',"+i_id+",'"+s_name+"','"+s_display_name+"','"+s_street+"','"+s_street2+"','"+s_zip+"','"+s_city+"','"+s_state_name+"','"+s_email+"','"+s_phone+"','"+s_mobile+"');";
        console.log(SQL);
        //return;
        let users = await client.query(SQL);
    //console.log(users); 
          //res.send(users);
      //res.json({
      //users
            //message: 'Post Inserted...'
            //});
    let sreturn = users.rows[0].fn_createwrite_customer;
        let  myArray = sreturn.split("|");
         //res.json({returnmessage : sreturn});
    const customer = {
    code: myArray[0],
    message: myArray[1],
    id: myArray[2]
  }

    // res.end(JSON.stringify(users)); 
    res.json({customer : customer});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
  
    
    }
  });
});


app.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});


app.post('/api/emi/login', (req, res) => {
//  // Mock user
    let ip = req.headers['x-forwarded-for'] ||
     req.socket.remoteAddress ||
     null;
//  if (ip != '::ffff:103.59.235.250') {
//res.json({success:'False',message:'Wrong IP Address, Your IP : '+ip+''});
//	  return;
//  };
 if (req.body.email != 'emi.api@gmail.com') {
res.json({success:'False',message:'Wrong Email, Your Email : '+req.body.email+''});
          return;
  };
if (req.body.password != 'ApiEMI123') {
res.json({success:'False',message:'Wrong Password'});
          return;
  };


  const user = {
    ip: ip, 
    username: req.body.username,
    email: req.body.email
  }

  jwt.sign({user}, 'secretkey', { expiresIn: '24h' }, (err, token) => {
    res.json({
      user,
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

app.listen(3000, () => console.log('Server started on port 3000'));
