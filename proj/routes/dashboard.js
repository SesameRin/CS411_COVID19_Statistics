var express = require('express');
var router = express.Router();

// configure DB connection
const DB_CONFIG = require('./dbconfig');

let DB_HOST_IP = DB_CONFIG.DB_CONFIG.DB_HOST_IP;
let DB_USR = DB_CONFIG.DB_CONFIG.DB_USR;
let DB_PSW = DB_CONFIG.DB_CONFIG.DB_PSW;

let DEBUG_SQL_NODEBUG = 0;
let DEBUG_SQL_stateName = (1<<0);
let DEBUG_SQL_advanced1 = (1<<1);

let DEBUG_SQL = DEBUG_SQL_NODEBUG;


const path = require('path');
const mysql = require('mysql2');
const cors = require("cors");
var bodyParser = require('body-parser');


// parse routerlication/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse routerlication/json
router.use(bodyParser.json());

/**
 * connection configuration for main page
 */
var con = mysql.createConnection({
    host: DB_HOST_IP,
    user: DB_USR,
    password: DB_PSW
});


/**
 * connect to mysql.
 */
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected for main!");
    // mysql_main_unit_test();

});

// this API redirect the user to dash board
router.get('/', (req, res) => {
    res.render('dashboard', { menuBlockHeader : 'DashBoard', 
                menuBlockMesg1 : 'Welcome!', 
                menuBlockMesg2 : 'You are our first new user!'});
    // This following code will not work
    // instead we should 
    //      for each resource in dashboard(protected page)
    //      we check whether we have permission (by in client side, we send tokens and verify it in server side)
    //      then we give corresponding resources back to user


    // Check if the Authorization header is present and contains a valid token
    // const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization);
    // if (authHeader) {
    //     const token = authHeader.split(' ')[1];
    //     jwt.verify(token, secretKey, (err, decoded) => {
    //         if (err) {
    //             res.status(401).json({ success: false, message: 'Invalid token' });
    //         } else {

                
    //         }
    //     });
    // } else {
    //     // soft failure for auto-generated GET
    //     // It can prevents attack to force oursite to dashboard
    //     res.json({ success: false, message: 'Authorization header missing' });
    // }
});

router.get('/userQueryForm', (req, res) => {
    var authHeader = req.headers.token;
    // console.log(req.headers);
    var  token, username;
    if(authHeader) {
        token = req.headers.token;
        username = req.headers.username;
    }
    // console.log(token, username);

    // const queryUserQueryForm = ``;
    
    // if token is valid, then we do a query to get userQueryForm data for this user
    const queryUserQueryForm = `SELECT * FROM covidgcp.userQuery WHERE username = '${username}'`;
    con.query(queryUserQueryForm, function (err, result, fields) {
        if (err) throw err;
        var isTokenValid = DB_CONFIG.isSignatureValid(token,username);
        if(!isTokenValid) {
            res.json({ success: false, message: 'Invalid token' });
        }else{
            res.json({ success: true, message: 'UserQueryForm data', data: result });
        }
        // console.log(result);
    });
});

router.post('/clearUserQueryForm', function(req, res, next) {
    // console.log(req.headers);
    var authHeader = req.headers.token;
    var  token, username;
    if(authHeader) {
        token = req.headers.token;
        username = req.headers.username;
    }
    // console.log(token, username);
    
    // const queryUserQueryForm = ``;
    
    // if token is valid, then we do a query to get userQueryForm data for this user
    const queryUserQueryForm = `DELETE FROM covidgcp.userQuery WHERE username = '${username}'`;
    console.log(queryUserQueryForm);
    con.query(queryUserQueryForm, function (err, result, fields) {
        if (err) throw err;
        // var isTokenValid = DB_CONFIG.isSignatureValid(token,username);
        // if(!isTokenValid) {
            // res.json({ success: false, message: 'Invalid token' });
        // }else{
            res.json({ success: true, message: 'UserQueryForm data', data: result });
        // }
        // console.log(result);
    });
});



module.exports = router;

