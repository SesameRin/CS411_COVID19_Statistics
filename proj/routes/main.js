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
    mysql_main_unit_test();

});



/* GET home page. */
// router to main page
router.get('/', function (req, res, next) {
    // var stateList, stateNames;
    // var stateNamesQuery = `SELECT DISTINCT 
    // location
    // FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital ON vacc.location = hospital.STATE_NAME
    // WHERE location IS NOT NULL
    // ORDER BY location`;
    // con.query(stateNamesQuery, function(err, result) {
    //     if (err) throw err;
    //     stateList = result;
    //     stateNames = stateList.map(state => state.location);
    //     console.log(stateNames)
    // });
    res.render('main', {
        menuBlockHeader: 'COVID-19 Trends',
        menuBlockMesg1: 'A webpage showing Covid 19 trends from path to future.',
        menuBlockMesg2: 'From everyday experience to academic.',
        // stateNames : JSON.stringify(stateNames)
    });
    
});

router.post('/adquery1', function(req, res, next) {
    var queriedState = req.body.stateName; 
    var authHeader = req.headers.token;
    // console.log(req.headers);
    var  token, username;
    if(authHeader) {
        token = req.headers.token;
        username = req.headers.username;
    }
    // console.log(token,username);
    // console.log(isTokenValid);
    var sample_query = `SELECT location, bed_utl, vacc_ratio
    FROM
    (
        SELECT location, AVG(BED_UTILIZATION) AS bed_utl, AVG(daily_vaccinations_per_million) AS vacc_ratio
        FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital
        ON (vacc.location = hospital.STATE_NAME)
        GROUP BY location
        ) AS tab1
        WHERE bed_utl IS NOT NULL and vacc_ratio IS NOT NULL and location = '${queriedState}'
        ORDER BY location
        ;`;
        
        // console.log(sample_query)
        
        
        
    con.query(sample_query, function(err, result) {
        if (err) throw err;
        const isTokenValid = DB_CONFIG.isSignatureValid(token,username);
        if(isTokenValid) {
            // console.log('token is valid');
            // const insert_userQuery_table = `
            // INSERT INTO covidgcp.userQuery (username, queryContent, queryType, queryResult, resultIndex)
            // VALUES ('${username}', '${queriedState}', 'ADQ1', '${result[0]}', 1);
            // `;
            console.log(result[0]);
            // console.log(insert_userQuery_table);
            // con.query(insert_userQuery_table, function(err, result) {
            //     if (err) throw err;
            //     // console.log(result);
            // });

        }
        // console.log(result[0]);
        res.send(result[0]);
    });
});

// DUPLICATED
router.post('/adquery2', function(req, res, next) {
    // var queriedRatio = req.body.stateName; 
    console.log(req.body.stateName)

    var sample_query = `       
        SELECT 
            covid_trail1.States.State_Name, 
            count(covid_trail1.hospital.HOSPITAL_NAME) as num_hospitals
        FROM covid_trail1.hospital JOIN covid_trail1.States USING (State_Name)
        GROUP BY covid_trail1.States.State_Name
        ORDER BY covid_trail1.States.State_Name
        ;`;
        
        // console.log(sample_query)

    console.log(sample_query)

    con.query(sample_query, function(err, result) {
        if (err) throw err;
        console.log(result[0]);
        res.send(result[0]);
    });
});

router.post('/adquery2Trigger', function(req, res, next) {
    // var queriedRatio = req.body.stateName; 
    console.log(req.body.stateName)

    var sample_query = `       
        SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED; 
        SELECT 
            covid_trail1.States.State_Name, 
            count(covid_trail1.hospital.HOSPITAL_NAME) as num_hospitals
        FROM covid_trail1.hospital JOIN covid_trail1.States USING (State_Name)
        GROUP BY covid_trail1.States.State_Name
        ORDER BY covid_trail1.States.State_Name
        ;`;
        
        // console.log(sample_query)

    console.log(sample_query)

    con.query(sample_query, function(err, result) {
        if (err) throw err;
        console.log(result[0]);
        res.send(result[0]);
    });
});



function mysql_main_unit_test() {
    if (DEBUG_SQL & DEBUG_SQL_advanced1) {
        var sample_query = `SELECT location, bed_utl, vacc_ratio
        FROM
        (
        SELECT location, AVG(BED_UTILIZATION) AS bed_utl, AVG(daily_vaccinations_per_million) AS vacc_ratio
        FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital
        ON (vacc.location = hospital.STATE_NAME)
        GROUP BY location
        ) AS tab1
        WHERE bed_utl IS NOT NULL and vacc_ratio IS NOT NULL
        ORDER BY location
        ;`;
        con.query(sample_query, function(err, result) {
            if (err) throw err;
            console.log(result);
        });
    }
    if (DEBUG_SQL & DEBUG_SQL_stateName) {
        var stateList;
        var stateNamesQuery = `SELECT DISTINCT 
        location
        FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital ON vacc.location = hospital.STATE_NAME
        WHERE location IS NOT NULL
        ORDER BY location`;
        con.query(stateNamesQuery, function(err, result) {
            if (err) throw err;
            stateList = result;
            console.log(stateList);
            var stateNames = stateList.map(state => state.location);
            console.log(stateNames);
        });
    }
}


module.exports = router;
