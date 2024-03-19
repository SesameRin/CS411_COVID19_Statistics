var express = require('express');
var router = express.Router();


// router to contributors
router.get('/', function(req, res, next) {
    res.render('contributors', { menuBlockHeader : 'Contributors', 
    menuBlockMesg1 : 'Active members that contribute to this project', 
    menuBlockMesg2 : '' });
  });

module.exports = router;