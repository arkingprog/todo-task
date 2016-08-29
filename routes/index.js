var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated()) {
        res.render('../client/index', {isAuth: true,username:req.user.dataValues.username});
        return;
    }
    res.render('../client/index', {isAuth: false,username:null});

});

module.exports = router;
