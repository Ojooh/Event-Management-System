const DB = require('./db_controller');
var helper = require("./helper");


//Function To Render Login Page
module.exports.getHomePage = async (req, res, next) => {
    var count = 0;
    var start = 1;
    var section = 6;
    var slds = await DB.getSliders();
    var near = await DB.getNEAREvent(1);
    var week = await DB.getWEEKEvent(1);
    var prices = await DB.getCategories();
    var events = await DB.getEvents();
    var [eveys, cur_t] = helper.paginateArray(events, count);
    var near_date = helper.formatDateR(near[0].event_date);
    console.log(slds.length)
    var context = { type: "some", slds: slds, nry: near_date, nr: near[0], week: week, evs: eveys, prcs: prices };
    res.render('home/index', context);
};

//function for all events
module.exports.getALLevents = async (req, res, next) => {
    var count = 0;
    var start = 1;
    var section = 6;
    var slds = await DB.getSliders();
    var near = await DB.getNEAREvent(1);
    var week = await DB.getWEEKEvent(1);
    var prices = await DB.getCategories();
    var events = await DB.getEvents();
    var near_date = helper.formatDateR(near[0].event_date);
    console.log(slds.length)
    var context = { type: "all", slds: slds, nry: near_date, nr: near[0], week: week, evs: events, prcs: prices };
    res.render('home/index', context);
};