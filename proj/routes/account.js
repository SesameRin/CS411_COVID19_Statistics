/**
 * server side routerlication, handling database request passed by client.
 * The configuration below is for local host. To change it to remote, 
 * DO NOT CHANGE :  DB_HOST_IP, DB_SUR, DB_PSW. They are deliberately 
 * set the same as they are in local host.
 * Current Potential Bugs : 
 * 1. case where data base/table not exist : will it return err ?
 */

var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

// configure DB connection
const DB_CONFIG = require('./dbconfig');


let DB_HOST_IP = DB_CONFIG.DB_CONFIG.DB_HOST_IP;
let DB_USR = DB_CONFIG.DB_CONFIG.DB_USR;
let DB_PSW = DB_CONFIG.DB_CONFIG.DB_PSW;
let secretKey = DB_CONFIG.DB_CONFIG.SECRETKEY;

console.log(DB_HOST_IP);

// These are dev debugging variables. and should be deleted for release. 
// Forgive this C style testing.

let DEBUG_SQL_NODEBUG = 0;
let DEBUG_SQL_INSERT0 = (1 << 0);
let DEBUG_SQL_QUERY0 = (1 << 1);

let DEBUG_SQL = (DEBUG_SQL_NODEBUG);

// end of dev area

const path = require('path');
const mysql = require('mysql2');
const cors = require("cors");
var bodyParser = require('body-parser');

// parse routerlication/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }));

// parse routerlication/json
router.use(bodyParser.json());

/**
 * connection configuration
 */
var con = mysql.createConnection({
    host: DB_HOST_IP,
    user: DB_USR,
    password: DB_PSW
});


// router to contributors
router.get('/', function (req, res, next) {
    res.render('account', {
        menuBlockHeader: 'New User?',
        menuBlockMesg1: 'Log in PLZ',
        menuBlockMesg2: ''
    });
});

// this API tries to log the user in based on the token given
router.get('/trydashboard', (req, res) => {
    // Check if the Authorization header is present and contains a valid token
    const authHeader = req.headers.authorization;
    console.log(req.headers.authorization);
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        // console.log(token, secretKey);
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                res.json({ success: false, message: 'Invalid token' });
            } else {
                res.json({ success: true, message: 'Access granted to protected resource', username: decoded.username });
            }
        });
    } else {
        res.status(401).json({ success: false, message: 'Authorization header missing' });
    }
});


/**
 * connect to mysql.
 */
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected for account!");
    // if there is mydb (our default database), delete it
    con.query("DROP DATABASE IF EXISTS mydb;", function (err, result) {
        if (err) throw err;
        console.log("default database removed");
    });
    // create database
    con.query("CREATE DATABASE IF NOT EXISTS covidgcp;", function (err, result) {
        if (err) throw err;
        console.log("covidgcp database created");
    });
    // confirm data base created
    con.query("SELECT SCHEMA_NAME \
    FROM INFORMATION_SCHEMA.SCHEMATA \
    WHERE SCHEMA_NAME = 'covidgcp'", function (err, result) {
        if (err) throw err;
        if (result.length) console.log("covidgcp database created & confirmed"); // find data base
    });
    // create table
    var check_user_table = `SELECT EXISTS(
        SELECT * FROM information_schema.tables 
        WHERE table_schema = 'covidgcp' 
        AND table_name = 'users'
        );`;
    var sql_create_table = "CREATE TABLE covidgcp.users (username VARCHAR(20) PRIMARY KEY, password VARCHAR(50), email VARCHAR(50))";
    con.query(check_user_table, function (err, result) {
        if (err) throw err;
        // console.log(Object.values(result[0])[0]); 
        if (0 == Object.values(result[0])[0]) {
            con.query(sql_create_table, function (err, result) {
                if (err) throw err;
                console.log("covidgcp users table created");
            });
        }
    });

    // create paper search times table
    const paper_search_times_table = `
    CREATE TABLE IF NOT EXISTS covidgcp.paper_searchtimes (
        paper_id INT NOT NULL PRIMARY KEY,
        search_times INT
    );`;

    var check_searchtimes_table = `SELECT EXISTS(
        SELECT * FROM information_schema.tables 
    WHERE table_schema = 'covidgcp' 
    AND table_name = 'paper_searchtimes'
    ); `;

    con.query(check_searchtimes_table, function (err, result) {
        if (err) throw err;
        // console.log(Object.values(result[0])[0]); 
        if (0 == Object.values(result[0])[0]) {
            con.query(paper_search_times_table, function (err, result) {
                if (err) throw err;
                console.log("covidgcp searchtimes table created");
            });
        }
    });

    // create topsearched table
    const topsearched_table = `
    CREATE TABLE IF NOT EXISTS covidgcp.topsearched (
        paper_rank INT PRIMARY KEY,
        paper_title VARCHAR(255),
        search_times INT
    );`;

    var check_topsearched_table = `SELECT EXISTS(
        SELECT * FROM information_schema.tables 
    WHERE table_schema = 'covidgcp' 
    AND table_name = 'topsearched'
    ); `;

    con.query(check_topsearched_table, function (err, result) {
        if (err) throw err;
        // console.log(Object.values(result[0])[0]); 
        if (0 == Object.values(result[0])[0]) {
            con.query(topsearched_table, function (err, result) {
                if (err) throw err;
                console.log("covidgcp topsearched table created");
            });
        }
    });



    /**
     * data should include : (0) auto-incremented index (serve as primary key) + time (1) username (2) query content (3) query type (4) query result (5) query result index
     * CREATE TABLE queries (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        queryContent TEXT,
        queryType VARCHAR(50) ,
        queryResult TEXT,
        resultIndex INT
        );
     * Note : add primary key, just use an index to do it. (implemented like above)
    * table should also be in covidgcp database
     */
    check_user_table = `SELECT EXISTS(
            SELECT * FROM information_schema.tables 
        WHERE table_schema = 'covidgcp' 
        AND table_name = 'userQuery'
        ); `;
    const user_query_table = `
    CREATE TABLE IF NOT EXISTS covidgcp.userQuery(
            id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            username VARCHAR(255) NOT NULL,
            queryContent TEXT,
            queryType VARCHAR(50),
            resultName TEXT,
            queryResult TEXT
        );
    `;
    /**
     * INSERT INTO covidgcp.userQuery (username, queryContent, queryType, queryResult, resultIndex) 
     * VALUES ('john_doe', 'SELECT * FROM patients WHERE diagnosis="COVID-19"', 'SELECT', 'Returned 10 rows', 1);
     * This is an example of how to insert data into the table, note that time field is automatically filled with current time  
     */
    con.query(check_user_table, function (err, result) {
        if (err) throw err;
        // console.log(Object.values(result[0])[0]); 
        if (0 == Object.values(result[0])[0]) {
            con.query(user_query_table, function (err, result) {
                if (err) throw err;
                console.log("covidgcp userQuery table created");
            });
        }
    });

    // CREATE simple TRIGGER
    const deleteTriggerQuery1 = `
        DROP TRIGGER IF EXISTS covidgcp.update_topsearched_after_update;
    `;
    con.query(deleteTriggerQuery1, function (err, result) {
        if (err) {
            console.error("Error deleting the trigger1:", err);
        } else {
            // create simple TRIGGER
            const createTriggerQuery1 = `
            CREATE TRIGGER covidgcp.update_topsearched_after_update
            AFTER UPDATE ON covidgcp.paper_searchtimes
            FOR EACH ROW
            BEGIN
                IF NEW.search_times <> OLD.search_times THEN
                    -- Delete all rows from topsearched table
                    DELETE FROM covidgcp.topsearched;
                    
                    -- Insert top 5 searched papers into topsearched table
                    INSERT INTO covidgcp.topsearched (paper_rank, paper_title, search_times)
                    SELECT p.paper_rank, p.paper_title, p.search_times
                    FROM (
                        SELECT ps.paper_id, p.title AS paper_title, ps.search_times,
                            ROW_NUMBER() OVER (ORDER BY ps.search_times DESC, ps.paper_id ASC) AS paper_rank
                        FROM covidgcp.paper_searchtimes ps
                        JOIN covid_trail1.papers p ON ps.paper_id = p.paper_id
                        LIMIT 5
                    ) p;
                END IF;
            END;
            `;

            con.query(createTriggerQuery1, function (err, result) {
                if (err) {
                    console.error("Error creating the trigger:", err);
                } else {
                    console.log("Trigger1 created successfully");
                }
            });
        }
    });

    const deleteTriggerQuery2 = `
        DROP TRIGGER IF EXISTS covidgcp.update_topsearched_after_insert;
    `;
    con.query(deleteTriggerQuery2, function (err, result) {
        if (err) {
            console.error("Error deleting the trigger2:", err);
        } else {
            // create simple TRIGGER
            const createTriggerQuery2 = `
                CREATE TRIGGER covidgcp.update_topsearched_after_insert
                AFTER UPDATE ON covidgcp.paper_searchtimes
                FOR EACH ROW
                BEGIN
                -- Delete all rows from topsearched table
                DELETE FROM covidgcp.topsearched;
                
                -- Insert top 5 searched papers into topsearched table
                INSERT INTO covidgcp.topsearched (paper_rank, paper_title, search_times)
                SELECT p.paper_rank, p.paper_title, p.search_times
                FROM (
                    SELECT ps.paper_id, p.title AS paper_title, ps.search_times,
                        ROW_NUMBER() OVER (ORDER BY ps.search_times DESC, ps.paper_id ASC) AS paper_rank
                    FROM covidgcp.paper_searchtimes ps
                    JOIN covid_trail1.papers p ON ps.paper_id = p.paper_id
                    LIMIT 5
                ) p;
                END;
            `;

            con.query(createTriggerQuery2, function (err, result) {
                if (err) {
                    console.error("Error creating the trigger2:", err);
                } else {
                    console.log("Trigger2 created successfully");
                }
            });
        }
    });




    // delete stored proc
    var dropStoredProc = `   

    DROP PROCEDURE IF EXISTS covid_trail1.testProc;

    `;

    con.query(dropStoredProc, function (err, result) {
        if (err) throw err;
        console.log("Stored Procedure dropped");
    });



    // create stored proc
    const makeStoredProc = `
        CREATE PROCEDURE covid_trail1.testProc(BedNumThres INT)
        BEGIN
    
            DECLARE varStateName VARCHAR(100);
            DECLARE varVacNumber INT;
            DECLARE varBedUtil INT;
                
            Declare exit_loop BOOLEAN DEFAULT FALSE;
                
            DECLARE stuCur CURSOR FOR 
            (
                SELECT location, SUM(daily_vaccinations_per_million) AS vacc_ratio, SUM(BED_UTILIZATION) AS bed_utl
                FROM covid_trail1.vacc LEFT OUTER JOIN covid_trail1.hospital
                    ON (vacc.location = hospital.STATE_NAME)
                    GROUP BY location
            );
    
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET exit_loop = TRUE;
                
            DROP TABLE IF EXISTS NewTable;
                
            CREATE TABLE NewTable(
                StateName VARCHAR(100) PRIMARY KEY,
                VacNumber INT
            );
                
            Open stuCur;
            cloop:LOOP
                FETCH stuCur INTO varStateName, varVacNumber, varBedUtil;
                if exit_loop Then
                LEAVE cloop;
                end if;
                
                if varBedUtil <= BedNumThres Then
                    Insert INTO NewTable VALUE (varStateName, varVacNumber);
                end if;    
                
            END LOOP cloop;
            Close stuCur;
            
            SELECT COUNT(VacNumber) AS numStates, 
                AVG(VacNumber) AS VaccinationRate, 
                AVG(num_hospitals) AS AvNumHospitals
            FROM NewTable NATURAL JOIN
                (SELECT covid_trail1.States.State_Name AS numStates, count(covid_trail1.hospital.HOSPITAL_NAME) as num_hospitals
                FROM covid_trail1.hospital JOIN covid_trail1.States USING (State_Name)
                GROUP BY covid_trail1.States.State_Name
                ) numHosp;

        END;
    `;

    con.query(makeStoredProc, function (err, result) {
        if (err) throw err;
        console.log("Stored Procedure made");
    });



    // dev : run sql unit test
    // mysql_unit_test();

});

/**
 * handling ports error with chrome
 */
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

router.use(cors(corsOptions)); // Use this after the variable declaration


/**
 * handle regigration request issued by users
 */
router.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    con.connect(function (err) {
        if (err) throw err;
        console.log("register : Data Base Connected!");
        var sql_insert = `INSERT INTO covidgcp.users(username, password, email) VALUES('${username}', '${password}', '${email}')`;
        var check_user_table = `SELECT EXISTS(
    SELECT * FROM information_schema.tables 
            WHERE table_schema = 'covidgcp' 
            AND table_name = 'users'
); `;
        con.query(check_user_table, function (err, result) {
            if (err) throw err;
            // console.log(Object.values(result[0])[0]); 
            if (Object.values(result[0])[0]) { // table exists
                var sql_username_exist = `SELECT EXISTS(
    SELECT username FROM covidgcp.users WHERE username = '${username}'
); `;
                con.query(sql_username_exist, function (err, result) {
                    if (err) throw err;
                    if (0 == Object.values(result[0])[0]) { // username not exist
                        con.query(sql_insert, function (err, result) {
                            if (err) throw err;
                            res.send("Success");
                            console.log(`user registered with username : ${username}, email ${email} `);
                        });
                    }
                    else {
                        res.send("Failed : username has been registered");
                        console.log('username exists');
                    }
                });

            } else {
                res.send("Failed : Table doesn't exist");
            }

        });
    });
});

/**
 * handle login request issued by users
 * 
 * out of data : 
 */
router.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    con.connect(function (err) {
        if (err) throw err;
        console.log("login : Data Base Connected!");
        var check_user_table = `SELECT EXISTS(
    SELECT * FROM information_schema.tables 
            WHERE table_schema = 'covidgcp' 
            AND table_name = 'users'
); `;
        con.query(check_user_table, function (err, result) {
            if (err) throw err;
            // console.log(Object.values(result[0])[0]); 
            if (Object.values(result[0])[0]) { // table exists
                var sql_username_exist = `SELECT EXISTS(
    SELECT username FROM covidgcp.users WHERE(username = '${username}' AND password = '${password}') OR(email = '${username}' AND password = '${password}')
); `;
                con.query(sql_username_exist, function (err, result) {
                    if (err) throw err;
                    if (Object.values(result[0])[0]) { // login success
                        // we return a token
                        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
                        res.json({ success: true, message: 'Authentication successful', token });
                        // res.send("Success");
                        // console.log(`user with username / email : ${ username } and password: ${ password } logged in `);
                    }
                    else {
                        res.send("Failed : incorrect username/password");
                        console.log('please enter the correct username/password');
                    }
                });

            } else {
                res.send("Failed : Table doesn't exist");
            }

        });
    });
});

router.post('/updatePassword', (req, res) => {
    const username = req.body.username;
    const original_password = req.body.original_password;
    const new_password = req.body.new_password;
    console.log("Test1");
    // TODO: CHANGE THIS FROM THE LOGIN INFORMATION TO THE UPDATE INFORMATION
    con.connect(function (err) {
        if (err) throw err;
        console.log("login : Data Base Connected!");
        var check_user_table = `SELECT EXISTS(
    SELECT * FROM information_schema.tables 
            WHERE table_schema = 'covidgcp' 
            AND table_name = 'users'
); `;
        con.query(check_user_table, function (err, result) {
            if (err) throw err;
            // console.log(Object.values(result[0])[0]); 
            if (Object.values(result[0])[0]) { // table exists
                var sql_username_exist = `SELECT EXISTS(
    SELECT username FROM covidgcp.users WHERE(username = '${username}' AND password = '${original_password}') OR(email = '${username}' AND password = '${original_password}')
); `;
                con.query(sql_username_exist, function (err, result) {
                    if (err) throw err;
                    if (Object.values(result[0])[0]) { // login success
                        // we return a token
                        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
                        res.json({ success: true, message: 'Authentication successful', token });
                        var sql_command = `UPDATE covidgcp.users 
                                SET password = '${new_password}'
WHERE(username = '${username}' AND password = '${original_password}')
OR(email = '${username}' AND password = '${original_password}')`;
                        con.query(sql_command, function (err, restult) {
                            if (err) {
                                throw err;
                            }
                            else {
                                console.log("New Password was updated successfully.");
                            }
                        });
                    }
                    else {
                        res.send("Failed : incorrect username/password");
                        console.log('please enter the correct username/password');
                    }
                });

            } else {
                res.send("Failed : Table doesn't exist");
            }

        });
    });
});



/**
 * Unit tests : testing account related functionalities.
 */
function mysql_unit_test() {
    var username = 'covidgcp@illinois.edu';
    var password = 'covidgcp';
    var email = 'covidgcp@illinois.edu';

    if (DEBUG_SQL & DEBUG_SQL_INSERT0) {
        con.connect(function (err) {
            if (err) throw err; of
            console.log("Data Base Connected!");
            var sql_insert = `INSERT INTO covidgcp.users(username, password, email) VALUES('${username}', '${password}', '${email}')`;
            var check_user_table = `SELECT EXISTS(
    SELECT * FROM information_schema.tables 
                WHERE table_schema = 'covidgcp' 
                AND table_name = 'users'
); `;
            con.query(check_user_table, function (err, result) {
                if (err) throw err;
                // console.log(Object.values(result[0])[0]); 
                if (Object.values(result[0])[0]) { // table exists
                    var sql_username_exist = `SELECT EXISTS(
    SELECT username FROM covidgcp.users WHERE username = '${username}'
); `;
                    con.query(sql_username_exist, function (err, result) {
                        if (err) throw err;
                        if (0 == Object.values(result[0])[0]) { // username not exist
                            con.query(sql_insert, function (err, result) {
                                if (err) throw err;
                                console.log(`user registered with username : ${username}, email ${email} `);
                            });
                        }
                        else {
                            console.log('username exists');
                        }
                    });

                }

            });
        });
    }
    if (DEBUG_SQL & DEBUG_SQL_QUERY0) {
        con.connect(function (err) {
            if (err) throw err;
            console.log("Data Base Connected!");
            var sql_insert = `INSERT INTO covidgcp.users(username, password, email) VALUES('${username}', '${password}', '${email}')`;
            var check_user_table = `SELECT EXISTS(
    SELECT * FROM information_schema.tables 
                WHERE table_schema = 'covidgcp' 
                AND table_name = 'users'
); `;
            con.query(check_user_table, function (err, result) {
                if (err) throw err;
                // console.log(Object.values(result[0])[0]); 
                if (Object.values(result[0])[0]) { // table exists
                    var sql_username_exist = `SELECT EXISTS(
    SELECT username FROM covidgcp.users WHERE(username = '${username}' AND password = '${password}') OR(email = '${username}' AND password = '${password}')
); `;
                    con.query(sql_username_existof, function (err, result) {
                        if (err) throw err;
                        if (Object.values(result[0])[0]) { // login success
                            console.log(`user with username / email : ${username} and password: ${password} logged in `);
                        }
                        else {
                            console.log('please enter the correct username/password');
                        }
                    });

                }

            });
        });
    }
}

// account is a virtual page which consists of two states : dashboard and login
// Henece we have two routers for the two sub-pages.
// The strategy is :
// First we try to log in to dash board, by checking local storage (tokens if there are any stored in browser).
//      if no tokens are found, we go to login page
//      otherwise we go to dashboard page



module.exports = router;

