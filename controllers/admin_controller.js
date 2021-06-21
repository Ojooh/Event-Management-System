const DB = require('./db_controller');
const bcrypt = require('bcrypt');
const moment = require('moment');
var helper = require("./helper");
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const validator = require('./validate');
const img_path = { "events": "public/images/event_files/", "cats": "public/images/cat_files/", "user": "public/images/user_files/", "slider": "public/images/slider/" };
const saltRounds = 10;


//Function To Render Dashboard
module.exports.getDashboard = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_orders = await DB.getOrders();
            var get_cats = await DB.getCategories();
            var get_cus = await DB.getCustomers();
            var get_events = await DB.getEvents();
            var array_dates = [];
            var array_sales = [];
            var addOrderPayements = [];
            var cat_name = [];
            var booked_seats = [];
            var totals = [];
            var response = get_orders;
            var timer = 0;
            var timer_1 = 0;


            while (timer < get_orders.length) {
                var ret = {};
                var net = {};
                var order_date = response[timer]["order_date"]

                var r = new Date(order_date);
                order_date = r.getFullYear() + "-" + String((parseInt(r.getMonth()) + 1)).padStart(2, '0') + "-" + r.getDate();
                array_dates.push(order_date);

                ret[order_date] = response[timer]["amount"];
                array_sales.push(ret);


                for (var g = 0; g < array_sales.length; g++) {
                    for (var i in array_sales[g]) {
                        var k = i;
                        var v = array_sales[g][i];
                    }
                    prev = net[k];
                    if (prev != undefined) {
                        net[k] = prev + parseInt(v);
                    } else {
                        net[k] = parseInt(v)
                    }


                }
                timer++;


            }
            addOrderPayements.push(net);
            var noRepeatDates = JSON.stringify([helper.array_unique(array_dates)]);


            while (timer_1 < get_cats.length) {
                var categories = get_cats[timer_1];
                cat_name.push(categories["cat_name"]);
                booked_seats.push(categories["cat_booked_seats"]);
                timer_1++;
            }

            var color = ["green", "gold", "aqua", "purple", "blue", "red", "cyan", "yellow", "magenta"];

            // Get total number of seats sold per category
            var result = await DB.addNumRows();
            totals.push(result[0]['total_booked_seats']);
            var facatys = { cat_name: cat_name, booked: booked_seats, color: color, totals: totals };

            var context = { user: user, isset: "dashboard", facts: facatys, orders: get_orders, cats: get_cats, customers: get_cus, events: get_events, op: JSON.stringify(addOrderPayements), nrp: noRepeatDates };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};


module.exports.addEventForm = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {

            var context = { user: user, isset: "add_event" };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.addEvent = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validEvent(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                    let update = await DB.createEvent(req.body, "");
                } else {
                    let avatar = req.files.e_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.events + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                    let update = await DB.createEvent(req.body, db_path);
                    avatar.mv(dir);

                }
                res.json({ success: req.body.e_name + " Event Has Been Created Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.getEventsView = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_events = await DB.getAllEvents();

            var context = { user: user, isset: "events", events: get_events };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.editEvent = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var id = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_event = await DB.getEvent(id);

            var context = { user: user, isset: "edit_events", event: get_event[0] };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.updateEvent = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getEvent(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validEvent(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                    let update = await DB.updateEvent(req.body, edittee[0].event_image, ID);
                } else {
                    if (edittee[0].event_image != "") {
                        fs.unlinkSync(path.join(__dirname, '..', img_path.events, edittee[0].event_image));
                    }
                    let avatar = req.files.e_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.events + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    let datetime = moment().format('YYYY-MM-DD  HH:mm:ss.000');
                    let update = await DB.updateEvent(req.body, db_path, ID);
                    avatar.mv(dir);

                }
                res.json({ success: req.body.e_name + " Event Has Been Updated Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.deleteEvent = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getEvent(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            if (edittee[0].event_image != "") {
                fs.unlinkSync(path.join(__dirname, '..', img_path.cats, edittee[0].event_image));
            }

            let remove = await DB.deleteEvent(ID);
            res.redirect("/admin/view_events");
        }
    } else {
        var url = "/login"
        res.redirect(url);
    }
};

module.exports.addCategoryForm = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {

            var context = { user: user, isset: "add_category" };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.addCategory = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validCategory(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    let update = await DB.createCategory(req.body, "");
                } else {
                    let avatar = req.files.c_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.cats + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    let update = await DB.createCategory(req.body, db_path);
                    avatar.mv(dir);

                }
                res.json({ success: req.body.c_name + " Category Has Been Created Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.getCategoriesView = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_cats = await DB.getCategories();

            var context = { user: user, isset: "categories", cats: get_cats };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.editCategory = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var id = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_cat = await DB.getCategory(id);

            var context = { user: user, isset: "edit_category", cat: get_cat[0] };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.updateCategory = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCategory(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validCategory(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    let update = DB.updateCategory(req.body, edittee[0].cat_image, ID);
                } else {
                    // if (edittee[0].cat_image != "") {
                    //     fs.unlinkSync(path.join(__dirname, '..', img_path.cats, edittee[0].cat_image));
                    // }
                    let avatar = req.files.c_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.cats + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);

                    let update = DB.updateCategory(req.body, db_path, ID);
                    avatar.mv(dir);

                }
                res.json({ success: req.body.c_name + " Category Has Been Updated Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.deleteCategory = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCategory(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            if (edittee[0].cat_image != "") {
                fs.unlinkSync(path.join(__dirname, '..', img_path.cats, edittee[0].cat_image));
            }

            let remove = await DB.deleteCategory(ID);
            res.redirect("/admin/categories");
        }
    } else {
        var url = "/login"
        res.redirect(url);
    }
};

module.exports.getCustomers = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var get_cus = await DB.getCustomers();

            var context = { user: user, isset: "customers", cuss: get_cus };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.editCustomer = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var id = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var get_cus = await DB.getCustomer(id);

            var context = { user: user, isset: "edit_customer", cus: get_cus[0] };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.updateCustomer = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCustomer(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var [raby, state, message] = await validator.validCustomer(req);
            console.log(state)

            if (state) {
                let update = await DB.updateCustomer(req.body, ID);
                res.json({ success: req.body.c_fname + " Profile Has Been Updated Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.deleteCustomer = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCustomer(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {

            let remove = await DB.deleteCustomer(ID);
            res.redirect("/admin/customers");
        }
    } else {
        var url = "/login"
        res.redirect(url);
    }
};

module.exports.getOrders = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_ords = await DB.getCUSOrders();

            var context = { user: user, isset: "orders", ords: get_ords };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.deleteOrder = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {

            let remove = await DB.deleteOrder(ID);
            res.redirect("/admin/orders");
        }
    } else {
        var url = "/login"
        res.redirect(url);
    }
};

module.exports.getPayments = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_pays = await DB.getPayments();

            var context = { user: user, isset: "payments", pays: get_pays };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.deletePayment = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {

            let remove = await DB.deletePayment(ID);
            res.redirect("/admin/payments");
        }
    } else {
        var url = "/login"
        res.redirect(url);
    }
};

module.exports.addUserForm = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {

            var context = { user: user, isset: "add_user" };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.addUser = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var [raby, state, message] = await validator.validUser(req);
            console.log(state);

            if (state) {
                if (!req.files) {
                    bcrypt.hash(req.body.U_pass, saltRounds, (err, hash) => {
                        let insert = DB.createUser(req.body, hash, "");
                    });
                } else {
                    let avatar = req.files.U_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.user + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    bcrypt.hash(req.body.U_pass, saltRounds, (err, hash) => {
                        let insert = DB.createUser(req.body, hash, db_path);
                    });

                    avatar.mv(dir);

                }
                var mailOptions = {
                    from: 'davidmatthew708@gmail.com',
                    to: req.body.U_email,
                    subject: 'MyVybes Admin Login Credentials',
                    text: 'username : ' + req.body.U_email + ' <br> Passowrd : ' + req.body.U_pass,
                };
                helper.sendMail(mailOptions);
                res.json({ success: req.body.U_fname + " User Profile Has Been Created Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.getAdmins = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var get_uss = await DB.getAdmins();

            var context = { user: user, isset: "admins", uss: get_uss };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.editUser = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var id = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var get_usr = await DB.getCustomer(id);

            var context = { user: user, isset: "edit_user", usr: get_usr[0] };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.updateUser = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCustomer(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var [raby, state, message] = await validator.validUser(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    if (req.body.U_pass != "") {
                        bcrypt.hash(req.body.U_pass, saltRounds, (err, hash) => {
                            let update = DB.updateUser(req.body, hash, "", ID);
                        });
                    } else {
                        let update = DB.updateUser(req.body, edittee[0].user_pass, "", ID);
                    }
                } else {
                    if (edittee[0].user_image != "") {
                        fs.unlinkSync(path.join(__dirname, '..', img_path.user, edittee[0].user_image));
                    }
                    let avatar = req.files.U_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.user + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    if (req.body.U_pass != "") {
                        bcrypt.hash(req.body.U_pass, saltRounds, (err, hash) => {
                            let insert = DB.updateUser(req.body, hash, db_path, ID);
                        });
                    } else {
                        let update = DB.updateUser(req.body, edittee[0].user_pass, db_path, ID);
                    }


                    avatar.mv(dir);
                }
                res.json({ success: req.body.U_fname + " User Profile Has Been Update Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.deleteUser = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getCustomer(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            if (edittee[0].user_image != "") {
                fs.unlinkSync(path.join(__dirname, '..', img_path.slider, edittee[0].user_image));
            }
            let remove = await DB.deleteUser(ID);
            res.redirect("/admin/users");
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.addSliderForm = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {

            var context = { user: user, isset: "add_slider" };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.addSlider = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validSlider(req);
            console.log(state);

            if (state) {
                let avatar = req.files.s_image;
                let [name, ext] = avatar.name.split(".");
                let new_name = uuidv4() + "." + ext
                let dir = img_path.slider + new_name;
                let db_path = new_name;
                console.log(dir);
                console.log(db_path);
                let insert = DB.createSlider(req.body, db_path);

                avatar.mv(dir);

                res.json({ success: req.body.s_name + " Slider Profile Has Been Created Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.getSliders = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var get_sld = await DB.getSliders();

            var context = { user: user, isset: "sliders", slds: get_sld };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.editSlider = async (req, res, next) => {
    console.log(req.session.loggedin)
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var id = req.params.id;

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS")) {
            var get_sld = await DB.getSlider(id);

            var context = { user: user, isset: "edit_slider", sld: get_sld[0] };
            res.render('admin/index', context);
        } else {
            res.redirect("/login");
        }
    } else {
        res.redirect("/login");
    }
};

module.exports.updateSlider = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getSlider(ID);

        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            var [raby, state, message] = await validator.validSlider(req);
            console.log(state)

            if (state) {
                if (!req.files) {
                    let update = DB.updateSlider(req.body, edittee[0].slider_image, ID);
                } else {
                    if (edittee[0].slider_image != "") {
                        fs.unlinkSync(path.join(__dirname, '..', img_path.slider, edittee[0].slider_image));
                    }
                    let avatar = req.files.s_image;
                    let [name, ext] = avatar.name.split(".");
                    let new_name = uuidv4() + "." + ext
                    let dir = img_path.slider + new_name;
                    let db_path = new_name;
                    console.log(dir);
                    console.log(db_path);
                    let update = DB.updateSlider(req.body, db_path, ID);

                    avatar.mv(dir);
                }
                res.json({ success: req.body.s_name + " Slider Profile Has Been Updated Successfully." });

            } else {
                res.json({ error: message.message })
            }

            // res.render('admin/addAdministrator', context);
        } else {
            var url = "/login"
            res.json({ url: url });
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};

module.exports.deleteSlider = async (req, res, next) => {
    if (req.session.loggedin) {
        var email = req.session.username;
        var user = await DB.getUserByEmail(email);
        var ID = req.params.id;
        var edittee = await DB.getSlider(ID);
        if ((user.length > 0 && user[0].is_active == '1') && (user[0].user_type == "ADMS" || user[0].user_type == "ADM")) {
            if (edittee[0].slider_image != "") {
                fs.unlinkSync(path.join(__dirname, '..', img_path.slider, edittee[0].slider_image));
            }
            let remove = await DB.deleteSlider(ID);
            res.redirect("/admin/sliders");
        }
    } else {
        var url = "/login"
        res.json({ url: url });
    }
};


