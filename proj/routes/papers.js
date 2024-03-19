var express = require('express');
var router = express.Router();

// router to papers
router.get('/', function (req, res, next) {
  res.render('papers', {
    menuBlockHeader: 'Papers',
    menuBlockMesg1: 'Academic paper statistic related to COVID-19',
    menuBlockMesg2: ''
  });
});

// configure DB connection
const DB_CONFIG = require('./dbconfig');

let DB_HOST_IP = DB_CONFIG.DB_CONFIG.DB_HOST_IP;
let DB_USR = DB_CONFIG.DB_CONFIG.DB_USR;
let DB_PSW = DB_CONFIG.DB_CONFIG.DB_PSW;

let DEBUG_SQL_NODEBUG = 0;
let DEBUG_SQL_stateName = (1 << 0);
let DEBUG_SQL_advanced1 = (1 << 1);

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

// satisfied paper count
router.post('/papersearch', function (req, res, next) {
  var searchTitle = req.body.titleName;
  var searchAuthor = req.body.authorName;
  var searchJournal = req.body.journalName;

  var authHeader = req.headers.token;
  var token, username;
  if (authHeader) {
    token = req.headers.token;
    username = req.headers.username;
  }

  // console.log(req.body.titleName);
  // console.log(req.body.authorName);
  // console.log(req.body.journalName);


  var sample_query = `       
        SELECT count(p.paper_id) as papercnt
        FROM covid_trail1.papers p
        WHERE p.title LIKE '%${searchTitle}%' and p.authors LIKE '%${searchAuthor}%' and p.journal LIKE '%${searchJournal}%'
        ;`;


  con.query(sample_query, function (err, result) {
    if (err) throw err;
    const isTokenValid = DB_CONFIG.isSignatureValid(token, username);
    if (isTokenValid) {
      const insert_userQuery_table1 = `
                INSERT INTO covidgcp.userQuery (username, queryContent, queryType, queryResult, resultName)
                VALUES ('${username}', '${searchTitle},${searchAuthor},${searchJournal}', 'PaperSearch', '${result[0].papercnt}', 'paper_count');
                `;

      con.query(insert_userQuery_table1, function (err, result) {
        if (err) throw err;
        // console.log(result);
      });
    }
    // console.log(result);
    res.send(result[0]);
  });
});

// satisfied 10 papers
// router.post('/papersearch1', function (req, res, next) {
//   var searchTitle = req.body.titleName;
//   var searchAuthor = req.body.authorName;
//   var searchJournal = req.body.journalName;

//   var authHeader = req.headers.token;
//   var token, username;
//   if (authHeader) {
//     token = req.headers.token;
//     username = req.headers.username;
//   }

//   var sample_query = `       
//         SELECT p.title as papertitle, p.authors as paperauthor, p.journal as paperjournal, p.publish_time as papertime, p.paper_id as paperid
//         FROM covid_trail1.papers p
//         WHERE p.title LIKE '%${searchTitle}%' and p.authors LIKE '%${searchAuthor}%' and p.journal LIKE '%${searchJournal}%'
//         ORDER BY p.paper_id
//         ;`;

//   con.query(sample_query, function (err, result) {
//     if (err) throw err;
//     if (result.length) {
//       // Loop through the result array
//       result.forEach(function (row) {
//         // Extract paper_id from the row
//         var paper_id = row.paperid;

//         // Prepare the update query
//         var update_query = `
//           INSERT INTO covidgcp.paper_searchtimes (paper_id, search_times)
//           VALUES (?, 1)
//           ON DUPLICATE KEY UPDATE search_times = search_times + 1;
//         `;

//         // Execute the update query
//         con.query(update_query, [paper_id], function (err, update_result) {
//           if (err) throw err;
//         });
//       });

//       var get_searchtimes_query = `
//         SELECT ps.search_times as papertimes
//         FROM covidgcp.paper_searchtimes ps
//       `
//       con.query(get_searchtimes_query, function (err, searchtimes_result) {
//         if (err) throw err;
//         // console.log(searchtimes_result[0]);
//       });
//     };
//     // console.log(result.slice(0, Math.min(result.length, 10)));


//     res.send(result.slice(0, Math.min(result.length, 10)));
//   });
// });

function updateSearchTimes(paper_id) {
  return new Promise((resolve, reject) => {
    // Prepare the update query
    var update_query = `
      INSERT INTO covidgcp.paper_searchtimes (paper_id, search_times)
      VALUES (?, 1)
      ON DUPLICATE KEY UPDATE search_times = search_times + 1;
    `;

    // Execute the update query
    con.query(update_query, [paper_id], function (err, update_result) {
      if (err) {
        reject(err);
      } else {
        // Retrieve the updated search_times value
        con.query("SELECT search_times FROM covidgcp.paper_searchtimes WHERE paper_id = ?", [paper_id], function (err, searchTimesResult) {
          if (err) {
            reject(err);
          } else {
            resolve(searchTimesResult[0].search_times);
          }
        });
      }
    });
  });
}

router.post('/papersearch1', function (req, res, next) {
  var searchTitle = req.body.titleName;
  var searchAuthor = req.body.authorName;
  var searchJournal = req.body.journalName;

  var authHeader = req.headers.token;
  var token, username;
  if (authHeader) {
    token = req.headers.token;
    username = req.headers.username;
  }

  var sample_query = `       
        SELECT p.title as papertitle, p.authors as paperauthor, p.journal as paperjournal, p.publish_time as papertime, p.paper_id as paperid
        FROM covid_trail1.papers p
        WHERE p.title LIKE '%${searchTitle}%' and p.authors LIKE '%${searchAuthor}%' and p.journal LIKE '%${searchJournal}%'
        ORDER BY paper_id asc
        ;`;

  con.query(sample_query, function (err, result) {
    if (err) throw err;
    if (result.length) {
      // Create an array to store the promises for each update query
      let promises = [];

      let maxIterations = Math.min(result.length, 10);
      for (let i = 0; i < maxIterations; i++) {
        let row = result[i];
        // Your code to process the row goes here
        // Extract paper_id from the row
        var paper_id = row.paperid;
        // console.log(paper_id);

        // Call the updateSearchTimes function and store the promise
        promises.push(updateSearchTimes(paper_id).then(searchtimes => {
          row.searchtimes = searchtimes;
        }));
      }

      // Wait for all promises to resolve
      Promise.all(promises).then(() => {
        // Send the updated result with search_times included
        // console.log(result.slice(0, Math.min(result.length, 10)));
        res.send(result.slice(0, Math.min(result.length, 10)));
      }).catch((err) => {
        // Handle errors
        console.error(err);
        res.status(500).send("An error occurred while processing your request.");
      });

    } else {
      // Send an empty array if no results are found
      res.send([]);
    }
  });
});

router.post('/paperrank', function (req, res, next) {

  var sample_query = `       
        SELECT t.paper_rank as paperrank, t.paper_title as papertitle, t.search_times as searchtimes
        FROM covidgcp.topsearched t
        ;`;


  con.query(sample_query, function (err, result) {
    if (err) throw err;
    res.send(result.slice(0, Math.min(result.length, 5)));
  });
});




module.exports = router;
