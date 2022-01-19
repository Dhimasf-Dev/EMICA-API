import client from "../config/config-pg.js";
import shape from 'shape-json';


export const getDefaulDealer = async(req, res) => {
    // #swagger.tags = ['General']
    
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
