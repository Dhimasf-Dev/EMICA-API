import client from "../config/config-pg.js";
import shape from 'shape-json';


export const postCustomer = async(req, res) => {
    // #swagger.tags = ['General']
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
    
        console.log(req.body.name);
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
