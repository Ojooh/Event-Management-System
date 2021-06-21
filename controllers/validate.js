// const User = require('./db_controller');
var helper = require("./helper");

module.exports.validEvent = async (req,) => {

    if (helper.isEmpty(req.body.e_name)) {
        return [null, false, { message: 'Event Name Input is not Valid only whitespace and character' }];
    } else if (helper.isEmpty(req.body.e_venue)) {
        return [null, false, { message: 'Event Venue Input is not Valid only whitespace and character' }];
    } else if (helper.isEmpty(req.body.e_date)) {
        return [null, false, { message: 'Event Date Input is not Valid' }];
    } else if (helper.isEmpty(req.body.e_extra)) {
        return [null, false, { message: 'Event Extra Input is not Valid' }];
    } else if (req.files && helper.isImage(req.files.e_image) == false) {
        return [null, false, { message: 'File Sent is not an Image' }];
    } else {
        return [null, true, { message: 'New Event Sucesfully Created' }];
    }
};

module.exports.validCategory = async (req,) => {

    if (helper.isEmpty(req.body.c_name)) {
        return [null, false, { message: 'Category Name Input is not Valid' }];
    } else if (helper.isEmpty(req.body.c_desc)) {
        return [null, false, { message: 'Category Description Input is not Valid' }];
    } else if (helper.isEmpty(req.body.c_qty) || req.body.c_qty <= 0 || isNaN(req.body.c_qty)) {
        return [null, false, { message: 'Category Quantity Input is not Valid must be greater than 0' }];
    } else if (helper.isEmpty(req.body.c_price) || req.body.c_price <= 0 || isNaN(req.body.c_price)) {
        return [null, false, { message: 'Category Price Input is not Valid must be greater than 0' }];
    } else if (helper.isEmpty(req.body.c_fee) || req.body.c_fee <= 0 || isNaN(req.body.c_fee)) {
        return [null, false, { message: 'Category Fee Input is not Valid must be greater than 0' }];
    } else if (req.files && helper.isImage(req.files.c_image) == false) {
        return [null, false, { message: 'File Sent is not an Image' }];
    } else {
        return [null, true, { message: 'New Category Sucesfully Created' }];
    }
};

module.exports.validCustomer = async (req,) => {
    if (helper.isEmpty(req.body.c_fname) || helper.validateName(req.body.c_fname) == false) {
        return [null, false, { message: 'First Name field is not Valid.' }];
    } else if (helper.isEmpty(req.body.c_lname) || helper.validateName(req.body.c_lname) == false) {
        return [null, false, { message: 'Last Name Input is not Valid.' }];
    } else if (helper.isEmpty(req.body.c_email) || helper.validateEmail(req.body.c_email) == false) {
        return [null, false, { message: 'Email Field Input is not Valid' }];
    } else if (helper.isEmpty(req.body.c_phone) || isNaN(req.body.c_phone)) {
        return [null, false, { message: 'Phone Number Field Input is not Valid' }];
    } else if (helper.isEmpty(req.body.c_country)) {
        return [null, false, { message: 'Country Field Input is Not Valid' }];
    } else if (helper.isEmpty(req.body.c_state)) {
        return [null, false, { message: 'State Field Input is Not Valid' }];
    } else {
        return [null, true, { message: 'New Customer Sucesfully Created' }];
    }
};

module.exports.validUser = async (req, ) => {
    var exist = await helper.emailExist(req.body.U_email);

    if (helper.isEmpty(req.body.U_fname) || helper.validateName(req.body.U_fname) == false) {
        return [null, false, { message: 'User First Name Input is Invalid only character and Whitespace Allowed.' }];
    } else if (helper.isEmpty(req.body.U_lname) || helper.validateName(req.body.U_lname) == false) {
        return [null, false, {message: 'User Last Name Input is Invalid only character and Whitespace Allowed.' }];
    } else if (helper.isEmpty(req.body.U_email) || helper.validateEmail(req.body.U_email) == false) {
        return [null, false, { message: 'User Email Input is Invalid.' }];
    } else if (req.body.type == "add" && exist) {
        return [null, false, { message: 'Email Input already Exist In Database' }];
    } else if (!helper.isEmpty(req.body.U_pass) &&  helper.validatePass(req.body.U_pass) == false) {
        return [null, false, { message: 'User Password Input is Invalid only must be more than 6 characters."' }];
    } else if (helper.isEmpty(req.body.U_contact) && isNaN(req.body.U_contact)) {
        return [null, false, { message: 'User Contact Field must be number.' }];
    } else if (req.files && helper.isImage(req.files.U_image) == false) {
        return [null, false, { message: 'File Sent is not an Image' }];
    } else {
        return [null, true, { message: 'New User Sucesfully Created' }];
    }
};

module.exports.validSlider = async (req, ) => {
    if (helper.isEmpty(req.body.s_name)) {
        return [null, false, { message: 'Slider Name field is compulsory.' }];
    } else if ((req.body.type == "add") && (!req.files || helper.isImage(req.files.s_image) == false)) {
        return [null, false, { message: 'File Sent is not an Image' }];
    } else {
        return [null, true, { message: 'New Slider Sucesfully Validated' }];
    }
};