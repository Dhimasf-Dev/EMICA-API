//const client = require('../config/config-pg.js');
//const shape = require('shape-json');
import client from "../config/config-pg.js";
import shape from 'shape-json';

export const getPaymentMethod = async(req, res) => {
  // #swagger.tags = ['Sales']

  try {
      
      const paymentMethod =[
        {
          "product_id": 107,
          "product_code": "BCATF",
          "product_name": "BCA Transfer",
          "unit_price": "4000.00",
        },
        {
          "product_id": 108,
          "product_code": "BCAVA",
          "product_name": "BCA VA",
          "unit_price": "4000.00",
        }
      ]
      res.json(paymentMethod);
  } catch (error) {
      console.log(error);
  }
}

export const getProducts = async(req, res) => {
    // #swagger.tags = ['Sales']
    try {
        //console.log(req);
        
        let product_model_code = req.params.product_model_code;
        let dealer_id = req.params.dealer_id;
        
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
        
         let ecs = await client.query(SQL,function (err,rows,fields) {
                if (err) {
                    console.log(err);
                } else {
                    const arr = rows.rows;
                    var scheme = {
                          "$group[productClass](product_class_id)": {
                            "productClassName": "product_class_name",
                            "$group[productIds](product_id)": {
                              "product_code": "product_code",
                              "product_name": "product_name",
                              "uom_id": "uom_id",
                              "qty": "jml"
                            }
                          }
                        };
                      //console.log(arr);
                      res.json(shape.parse(arr, scheme));
                      res.json(arr);
                      res.end(); 
                }
            });

        } catch (error) {
          res.status(500).json({error: error.message});
        }
}