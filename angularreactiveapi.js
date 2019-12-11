const express = require('express');
const router = express.Router();
const app = express();
const pg = require('pg');
const path = require('path');
var cors = require('cors')


app.use(cors());


app.use(express.json());       // to support JSON-encoded bodies


const connectionString = 'postgres://postgres:Otsi@123@localhost:5432/nodejs';
var results = [];

const client = new pg.Client(connectionString);
client.connect();

router.get('/getdbvalues', (req, res) => {



    client.query('SELECT * from angularregistration ORDER BY userid;')
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        // console.log(response['rows']);
            res.json(results)
        }
    });


})

router.post('/validatelogin', (req, res) => {


    postval = req.body
    console.log(postval);
    
    client.query('select email,username,admin,userid from angularregistration where email =$1 and password=$2',[postval.email,postval.password])
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        console.log(response['rows']);
        //to verify user loginn
        if(results.length==0)
            res.json({fail:true,data:results})
        else
             res.json({fail:false,data:results})
        }
    });


})

router.post('/getvaluestoedit', (req, res) => {

    client.query('select userid,email,username,password,address,contactby from angularregistration ')
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        console.log(response['rows']);
        res.json(results)
        }
    });
  /*   postval = req.body
    console.log(postval);
    if(postval.admin=='true')
    {
    client.query('select userid,email,username,password,address,contactby from angularregistration ')
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        console.log(response['rows']);
        res.json(results)
        }
    });
    }
    else{
        client.query('select userid,email,username,password,address,contactby from angularregistration where userid =$1 ',[postval.userid])
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        console.log(response['rows']);
        res.json(results)
        }
    });
    } */


})

router.post('/checkmailinsert', (req, res) => {

    
    postval = req.body

    client.query('SELECT * from angularregistration where email=$1 ORDER BY userid;', [postval.email])
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        // console.log(response['rows']);
            
            if(results.length==0)
            {
                client.query('insert into angularregistration (username, email , password,address,contactby) values($1,$2,$3,$4,$5)', [postval.username, postval.email, postval.password, postval.address, postval.contactby])
                .then(setTimeout((response,err) => {
           
                    if(err)
                    { console.log(err);
                        
                        throw err
                    }
                    else
                    {
                        res.json('stored in db')
                    }
                },1000)
                    );
            }
            else
            {
               
                    res.json('email already exists')
               
            }
        }
    })
})



router.post('/updateuser/:id', (req, res) => {

    
    postval = req.body
    client.query('SELECT * from angularregistration where email=$1 and userid != $2 ORDER BY userid;', [postval.email,req.params.id])
    .then((response,err) => {
           
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        // console.log(response['rows']);
            
            if(results.length==0)
            {
                    
                    client.query('UPDATE angularregistration SET username=($1),password=($2),address=($3),contactby=($4),email=($5) WHERE userid=($6) ',  [postval.username, postval.password, postval.address, postval.contactby,postval.email,req.params.id])
                    .then((response,err) => {
                        
                        if(err)
                        {
                            console.log(err);
                            
                            throw err
                        }
                        else{
                            results = response['rows']
                        // console.log(response['rows']);
                            
                            res.json('updated sucessfull')
                        }
                    })
                }
                else{
                    res.json('email already exists')
                }
            }

    })
})
/*

router.post('/postdbval', (req, res, err) => {

    postval = req.body
    console.log(req.body);
    client.query('insert into angularregistration (username, email , password,address,contactby) values($1,$2,$3,$4,$5)', [postval.username, postval.email, postval.password, postval.address, postval.contactby])
    .then((response,err) => {
           
        if(err)
        { console.log(err);
            
            throw err
        }
        else
        {
            res.json('stored in db')
        }
    }
        );

})*/

router.post('/putdbval/:id', (req, res) => {
    postval = req.body
    console.log(req.body, 'obj');
    client.query('UPDATE emp SET username=($1),team=($2) WHERE id=($3)',
        [postval.username, postval.team, req.params.id]);
    res.json('updated in db   ' + req.params.id)


})

router.delete('/del/:id', (req, res) => {


    client.query('delete from emp WHERE id=($1)', [req.params.id]);

    res.json('deleted in db')
})


//countries drop downs
router.get('/dropdown/countries',(req,res,)=>{
    
  
    
        client.query('SELECT * from countries').then((response,err) => {
           
            if(err)
            {
                console.log(err);
                
                throw err
            }
            else{
                results = response['rows']
            // console.log(response['rows']);
                res.json(results)
            }
        });


})


router.get('/dropdown/states/:varid',(req,res,)=>{
    
  
    
    client.query('select * from countries inner join states on states.country_id=countries.id where country_name=$1',[req.params.varid]).then((response,err) => {
       
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        // console.log(response['rows']);
            res.json(results)
        }
    });


})

router.get('/dropdown/cities/:varid',(req,res,)=>{
    
  
    
    client.query('select * from cities inner join states on cities.state_id=states.id where state_name=$1',[req.params.varid]).then((response,err) => {
       
        if(err)
        {
            console.log(err);
            
            throw err
        }
        else{
            results = response['rows']
        // console.log(response['rows']);
            res.json(results)
        }
    });


})













app.use('/', router)

    .listen(2020)
