const { urlencoded } = require('body-parser');
const mysql = require('mysql');

// const con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'bp'
// });

const con = mysql.createConnection({
    host: 'localhost',
    user: 'myvibes_user1',
    password: '~Patient123',
    database: 'myvibes_bp'
});


con.connect(function (err) {
    if (err) throw err;
});

//GET user by email field
module.exports.getUserByEmail = (email) => {
    const query = "SELECT * FROM users WHERE user_email = '" + email + "';";
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//UPDATE last login
module.exports.updateLastLogin = (id, last_login) => {
    const query = "UPDATE users SET last_login = '" + last_login + "'WHERE user_id = '" + id + "';";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//SELECT aLL oRDERS
module.exports.getOrders = () => {
    const query = "SELECT * FROM order_details;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT CUSTOMER ORDERS
module.exports.getCUSOrders = () => {
    const query = `SELECT order_details.id, order_details.order_no, users.user_email, categories.cat_name, events.event_name, order_details.booked_seats, order_details.amount, order_details.order_date, order_details.status
                    FROM order_details
                    INNER JOIN users on order_details.customer_id = users.user_id
                    INNER JOIN categories on order_details.category_id=categories.cat_id
                    INNER JOIN events on order_details.event_id = events.event_id WHERE order_details.is_active = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
}

//SELECT aLL categories
module.exports.getCategories = () => {
    const query = "SELECT * FROM categories;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT aLL categories
module.exports.getCustomers = () => {
    const query = "SELECT * FROM users WHERE is_active = 1 AND is_admin = 0 AND user_type = 'CUS';";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT aLL Admins
module.exports.getAdmins = () => {
    const query = "SELECT * FROM users WHERE (is_active = 1 AND is_admin = 1) AND (user_type = 'ADMS' OR user_type = 'ADM');";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT aLL events
module.exports.getEvents = () => {
    const query = "SELECT * FROM events;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//SELECT THE NEAREST EVENT TO TODAY
module.exports.getNEAREvent = (n) => {
    const query = `SELECT * FROM events WHERE is_active = 1 and event_date >= CURRENT_TIMESTAMP ORDER BY event_date ASC LIMIT ` + n + ``;
    console.log(query)
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
}


//SELECT THE event for the week
module.exports.getWEEKEvent = (n) => {
    const query = `SELECT * FROM events WHERE is_active = 1 and WEEK(event_date) = WEEK(CURRENT_TIMESTAMP) ORDER BY event_date ASC`;
    console.log(query)
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
}

//SELECT aLL sliders
module.exports.getSliders = () => {
    const query = "SELECT * FROM slider;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT AND ADD TOTAL NUMBER OF ROWS
module.exports.addNumRows = () => {
    const query = "SELECT SUM(cat_booked_seats) as total_booked_seats FROM categories;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//SELECT ALL EVENTS
module.exports.getAllEvents = () => {
    const query = "SELECT * FROM events WHERE is_active = 1 ORDER BY event_id DESC;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//Update event with id
module.exports.createEvent = (listy, image,) => {
    var url = listy.e_name.replace(" ", "-");
    const query = `INSERT INTO events (event_name, event_url, event_extras, event_venue, event_image, event_date)
                    VALUES ('` + listy.e_name + `', '` + url + `', '` + listy.e_extra + `', '` + listy.e_venue + `', '` + image + `', '` + listy.e_date + `')`;
    console.log(url);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//SELECT event with id
module.exports.getEvent = (id) => {
    const query = "SELECT * FROM events WHERE event_id='" + id + "' AND is_active = 1;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//Update event with id
module.exports.updateEvent = (listy, image, id) => {
    const query = `UPDATE events SET event_name="` + listy.e_name + `", event_image="` + image + `", event_extras="` + listy.e_extra + `", 
                    event_venue = "` + listy.e_venue + `", event_date = "` + listy.e_date + `" WHERE event_id = "` + id + `"`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete event with id
module.exports.deleteEvent = (id) => {
    const query = `UPDATE events SET is_active = 0 WHERE event_id = '` + id + `'`;

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//INSERT category with id
module.exports.createCategory = (listy, image,) => {
    const query = `INSERT INTO categories (cat_name, cat_desc, cat_quantity, cat_price, cat_booking_fee, cat_image)
                    VALUES ('` + listy.c_name + `', '` + listy.c_desc + `', '` + listy.c_qty + `', '` + listy.c_price + `', '` + listy.c_fee + `', '` + image + `')`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT category with id
module.exports.getCategory = (id) => {
    const query = "SELECT * FROM categories WHERE cat_id='" + id + "';";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//UPDATE category with id
module.exports.updateCategory = (listy, image, id) => {

    const query = `UPDATE categories SET cat_name="` + listy.c_name + `", cat_desc="` + listy.c_desc + `", cat_quantity="` + listy.c_qty + `",
                    cat_price="` + listy.c_price + `", cat_booking_fee="` + listy.c_fee + `", cat_image="` + image + `" WHERE cat_id="` + id + `";`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete category with id
module.exports.deleteCategory = (id) => {
    const query = `DELETE FROM categories WHERE cat_id = '` + id + `'`;

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT customer with id
module.exports.getCustomer = (id) => {
    const query = "SELECT * FROM users WHERE user_id='" + id + "' AND is_active = 1;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//UPDATE customer with id
module.exports.updateCustomer = (listy, id) => {

    const query = `UPDATE users SET user_email="` + listy.c_email + `", user_f_name="` + listy.c_fname + `", user_l_name="` + listy.c_lname + `", user_phone="` + listy.c_phone + `", user_country="` + listy.c_country + `", user_state="` + listy.c_state + `" WHERE user_id="` + id + `";`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete customer with id
module.exports.deleteCustomer = (id) => {
    const query = `UPDATE users SET is_active = 0 WHERE user_id = '` + id + `'`;

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete customer with id
module.exports.deleteOrder = (id) => {
    const query = `UPDATE order_details SET is_active = 0 WHERE id = '` + id + `'`;

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT payment with id
module.exports.getPayments = () => {
    const query = "SELECT payements.payment_id, payements.invoice, users.user_f_name, users.user_l_name, payements.amount, payements.payment_method, payements.payment_date FROM payements INNER JOIN users on payements.customer_id = users.user_id WHERE payements.is_active = 1;";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete payment with id
module.exports.deletePayment = (id) => {
    const query = `UPDATE payements SET is_active = 0 WHERE payment_id = '` + id + `'`;

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//INSERT new admin user
module.exports.createUser = (listy, pass, img) => {
    const query = `INSERT INTO users (user_name, user_f_name, user_l_name, user_email, user_pass, user_phone, user_type, user_image, is_active, is_admin)
                    VALUES ('@` + listy.U_fname + `', '` + listy.U_fname + `', '` + listy.U_lname + `', '` + listy.U_email + `', '` + pass + `', '` + listy.U_contact + `', '` + listy.U_type + `', '` + img + `', '1', '1')`;
    console.log(query)
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//UPDATE customer with id
module.exports.updateUser = (listy, pass, img, id) => {

    const query = `UPDATE users SET user_email="` + listy.U_email + `", user_f_name="` + listy.U_fname + `", user_l_name="` + listy.U_lname + `", user_phone="` + listy.U_contact + `", user_type="` + listy.U_type + `", user_image="` + img + `", user_pass="` + pass + `" WHERE user_id="` + id + `";`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};


//delete users with id
module.exports.deleteUser = (id) => {
    const query = `UPDATE users SET is_active = 0 WHERE user_id = '` + id + `'`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//INSERT new slider user
module.exports.createSlider = (listy, img) => {
    const query = `INSERT INTO slider (slider_name, slider_txt1, slider_txt2, slider_image) 
                    VALUES ('` + listy.s_name + `' ,'` + listy.s_txt1 + `', '` + listy.s_txt2 + `', '` + img + `')`;
    console.log(query)
    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//SELECT slider with id
module.exports.getSlider = (id) => {
    const query = "SELECT * FROM slider WHERE slider_id='" + id + "';";

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//UPDATE slider with id
module.exports.updateSlider = (listy, img, id) => {
    const query = `UPDATE slider SET slider_name = '` + listy.s_name + `', slider_image = '` + img + `', slider_txt1 = '` + listy.s_txt1 + `', slider_txt2 = '` + listy.s_txt2 + `' WHERE slider_id = '` + id + `'`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};

//delete SLIDER with id
module.exports.deleteSlider = (id) => {
    const query = `DELETE FROM slider WHERE slider_id =  '` + id + `'`;
    console.log(query);

    return new Promise((resolve, reject) => {
        con.query(query, (err, result) => {
            if (err) {
                return reject(err);
            } else {
                resolve(result);
            }

        });
    });
};




