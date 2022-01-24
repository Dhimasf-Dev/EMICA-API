import client from "../config/config-pg.js";
import shape from 'shape-json';

export const postBookingCancle = async(req, res) => {
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


export const postRescedule = async(req, res) => {
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


export const getAvailableTestBooking = async(req, res) => {
    try {
        appointment_type_id_param = req.params.appointment_type_id_param;
        start_date_param = req.params.start_date_param;
        end_date_param = req.params.end_date_param;
        ec_id_param = req.params.ec_id_param;
        product_id_param = req.params.product_id_param;
        


        if (isNaN(ec_id_param)) 
                    {
                      res.status(500).json({error: 'Error'});
                      return;
                    }


        //console.log(req.cookies);
        let s_category = req.body.category;
        let s_key = req.body.key;
        let SQL = "";
        let SQL1 = "";

        SQL1 = "UPDATE slot_of_time SET is_active=false WHERE start_time < now() and is_active=true";
        let ecs1 = await client.query(SQL1);

        FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';
        SQL="select a.start_time_iso,a.end_time_iso,a.combination,a.appointment_type_name,a.appointment_type_id,a.end_time,a.start_time,a.booking_date,a.product_id,a.product_name,a.ec_name,a.ec_id,"+
            "sum(a.count_true) as jml,sum(a.count_false) as jml_false from (select CONCAT(z.name,'-',d.name,'-',e.name,'-',to_char(a.slot_date,'YYYY-MM-DD')) as combination,z.name as appointment_type_name,a.em_appointment_system_id,b.appointment_type_id,a.is_active as "+
            "is_active_slot_time,to_char(a.end_time,'HH24:SS') as end_time,to_char(a.start_time,'HH24:SS') as start_time,"+
            "to_char(a.end_time,'"+FORMAT_ISO+"') as end_time_iso,to_char(a.start_time,'"+FORMAT_ISO+"') as start_time_iso,"+
            "a.id as slot_of_time_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_id,e.name as product_name,"+
            "d.name as ec_name,d.id as ec_id,case when a.is_active=true then 1 else 0 end as count_true,case when a.is_active=false then 1 else 0 end as count_false from slot_of_time a inner join x_emiproductschedule b on a.productschedule_id=b.id "+
            "inner join res_company c on b.company_id=c.id inner join designation_designation d on b.designation_id=d.id "+
            "inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
            "inner join appointment_type z on b.appointment_type_id=z.id"+
            " where e.id="+product_id_param+" and d.id="+ec_id_param+" and a.slot_date between '"+start_date_param+"' and '"+end_date_param+"' "+
            //"and b.appointment_type_id="+appointment_type_id_param+" and a.is_active=true and b.is_active=true"+
            "and b.appointment_type_id="+appointment_type_id_param+" and b.is_active=true"+
            ") a group by a.start_time_iso,a.end_time_iso,a.combination,a.appointment_type_name,a.appointment_type_id,a.end_time,a.start_time,a.booking_date, a.product_id,a.product_name,a.ec_name,a.ec_id order by a.start_time;"
        console.log(SQL);
        
        //return;
        let ecs = await client.query(SQL, function(err,rows) {

          if(!err) {
               // res.json(data.rows);



                           const arr = rows.rows;

                          var scheme = {
                              "$group[ec_ev_type_date](combination)": {
                                "ec_id": "ec_id",
                                "ec_name": "ec_name",
                                "product_id": "product_id",
                                "product_name": "product_name",
                                "appointment_type_id": "appointment_type_id",
                                "appointment_type_name": "appointment_type_name",
                                "booking_date": "booking_date",

                                "$group[start_time_s](start_time)": {
                                  "start_time": "start_time",
                                  "end_time": "end_time",
                                  "start_time_iso": "start_time_iso",
                                  "end_time_iso": "end_time_iso",
                                 "count": "jml",
                                 "count_false": "jml_false"
                                }
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


export const getBookingList = async(req, res) => {
    try {
        partner_id = req.params.partner_id;
        //type_id = req.params.type_id;
        
        //console.log(req.cookies);
        let s_category = req.body.category;
        let s_key = req.body.key;
        let SQL = "";
          let FORMAT_ISO = 'YYYY-MM-DD"T"HH24:MI:SS"+07:00';



        if (isNaN(partner_id)) 
                    {
                      res.status(500).json({error: 'Error'});
                      return;
                    }

          SQL ="select a.x_emiproduct_id as product_id,b.name as product_name,a.id as booking_id,"+         
                "a.name as booking_code,to_char(a.date,'YYYY-MM-DD') as date,to_char(c.start_time,'"+FORMAT_ISO+"') as start_time,"+
                "to_char(c.end_time,'"+FORMAT_ISO+"') as end_time,a.designation_id as ec_id,"+
                "d.name as ec_name,CONCAT(d.address,' ',d.address_2) as ec_address,d.designation_longitude as ec_longitude"+
                ",d.designation_latitude as ec_latitude,a.state as booking_status,to_char(a.x_cancel_date,'"+FORMAT_ISO+"') as cancel_date,a.reason as cancel_comment,"+
                "a.cancel_category_id,z.name as cancel_category_text,w.name as city_name,y.name as state_name,x.name as country_name,d.operational_hours "+
                "from em_appointment_system a inner join x_emiproduct b "+
                "on a.x_emiproduct_id=b.id left outer join slot_of_time c on a.slot_of_time_id=c.id "+
                "inner join designation_designation d on a.designation_id=d.id left outer join res_city e on d.city_id=e.id "+
                "inner join res_country_state y on d.state_id=y.id left outer join res_country x on d.country_id=x.id "+
                "left outer join x_cancelcategory z on a.cancel_category_id=z.id left outer join res_city w on d.city_id=w.id "+
                "where a.partner_id="+partner_id+";";
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


export const getAllAvailableTimesLot = async(req, res) => {
  try {
    id = req.params.id;
    type_id = req.params.type_id;
    

    if (isNaN(id)) 
                {
                  res.status(500).json({error: 'Error'});
                  return;
                }

    //console.log(req.cookies);
    let s_category = req.body.category;
    let s_key = req.body.key;
    let SQL = "";
    if (id==0)
    {
      
      SQL ="select a.id as timeslot_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,e.product_code as product_testdrive_code,e.name as product_testdrive_name,to_char(a.start_time,'YYYY-MM-DD HH24:MI:SS') as booking_start_time,to_char(a.end_time,'YYYY-MM-DD HH24:MI:SS') as booking_end_time,"+
            "d.id as ec_id,d.name as ec_name,c.name  as company_name,c.id as company_id,b.appointment_type_id as booking_type_id,f.name as booking_type_name,d.designation_latitude as ec_latitude,d.designation_longitude as ec_longitude,d.operational_hours,d.email_pic as ec_email_pic from slot_of_time a inner join "+ 
            "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
            "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
            "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id="+type_id+";";
        
      
    
    }
    else
    {

      SQL ="select a.id as timeslot_id,to_char(a.slot_date,'YYYY-MM-DD') as booking_date,e.id as product_testdrive_id,e.product_code as product_testdrive_code,e.name as product_testdrive_name,to_char(a.start_time,'YYYY-MM-DD HH24:MI:SS') as booking_start_time,to_char(a.end_time,'YYYY-MM-DD HH24:MI:SS') as booking_end_time,"+
            "d.id as ec_id,d.name as ec_name,c.name  as company_name,c.id as company_id,b.appointment_type_id as booking_type_id,f.name as booking_type_name,d.designation_latitude as ec_latitude,d.designation_longitude as ec_longitude,d.operational_hours,d.email_pic as ec_email_pic from slot_of_time a inner join "+ 
            "x_emiproductschedule b on a.productschedule_id=b.id inner join res_company c on b.company_id=c.id inner join designation_designation d on "+
            "b.designation_id=d.id inner join x_emiproduct e on b.x_emiproduct_id=e.id inner join appointment_type f on b.appointment_type_id=f.id "+
            "where a.is_active=true and b.is_active=true and a.em_appointment_system_id is null and b.appointment_type_id="+type_id+" and a.id="+id+";";
   
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


export const getAvailableTimeslot = async(req, res) => {
  try {
    id = req.params.id;
    type_id = req.params.type_id;
    

    if (isNaN(id)) 
                {
                  res.status(500).json({error: 'Error'});
                  return;
                }

    //console.log(req.cookies);
    let s_category = req.body.category;
    let s_key = req.body.key;
    let SQL = "";
    
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