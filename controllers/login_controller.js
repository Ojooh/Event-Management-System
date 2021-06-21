const DB = require('./db_controller');
const bcrypt = require('bcrypt');
const moment = require('moment');
var express = require('express');
var app = express();

//Function To Render Login Page
module.exports.loginPage = (req, res, next) => {

    res.render('login/login');
};

//Function to Handle Login Post
module.exports.logIn = async (req, res, next) => {
    let { email, password } = req.body
    var user = await DB.getUserByEmail(email);
    var url = "/login";

    if (user.length > 0 && user[0].is_active == '1') {
        bcrypt.compare(password, user[0].user_pass, async (err, reslt) => {
            if (err) {
                res.json({ error: 'Invalid Credentials! Please trys again.', url: url });
            } else if (reslt == true) {
                let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                await DB.updateLastLogin(user[0].user_id, datetime);
                if (user[0].user_type == 'ADMS' || user[0].user_type == 'ADM') {
                    url = '/admin';
                    msg = 'Credentials Valid'
                } else {
                    url = '/login';
                    msg = 'Not allowed to view this page';
                }
                req.session.loggedin = true;
                req.session.username = email;
                res.json({ success: 'Login Details Correct', url: url, msg: msg });
            } else {
                res.json({ error: 'Invalid Credentials! Please try again.', url: url });
            }
        });


    } else {
        res.json({ error: 'Invalid Credentials! Please try again.', url: url });
    }

}

//Function to Handle Log Out
module.exports.logOut = (req, res, next) => {
    req.session.loggedin = false;
    req.session.username = "";
    res.redirect("/login");
}