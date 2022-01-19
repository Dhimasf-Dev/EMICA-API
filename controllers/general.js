//const client = require('../config/config-pg.js');
//const shape = require('shape-json');
import client from "../config/config-pg.js";
import shape from 'shape-json';

export const getProvince = async(req, res) => {
    // #swagger.tags = ['General']
    try {
        let id = req.params.id;
        let s_category = req.body.category;
        let s_key = req.body.key;
        let SQL = "";
        console.log(id);
        if (isNaN(id)) 
                    {
                      res.status(500).json({error: 'Error'});
                      return;
                    }

        if (id==0)
        {
           SQL ="select a.id as province_id,a.name as province_name from res_country_state a where a.country_id=100;";  
        }
        else
        {
           SQL ="select a.id as province_id,a.name as province_name from res_country_state a where a.country_id=100 and a.id="+id+";";  
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

export const getCity = async(req, res) => {
  // #swagger.tags = ['General']
  try {
    id = req.params.id;
    state_id = req.params.state_id;
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
      if (state_id==0)
      {
        SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,b.code as state_code,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where 1=1;";  
      }
      else
      {
       // SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id from res_city a where a.state_id="+state_id+";";  
           SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,b.code as state_code,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where a.state_id="+state_id+";";  
     
      }
    }
    else
    {
        
        SQL ="select a.id as city_id,a.x_city_code as city_code,a.name as city_name,a.state_id,b.code as state_code,b.name as state_name from res_city a inner join res_country_state b on a.state_id=b.id where a.id="+id+";";  
       
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
