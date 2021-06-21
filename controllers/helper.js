
module.exports.array_unique = (inputArr) => {
    let key = ''
    const tmpArr2 = {}
    let val = ''
    const _arraySearch = function (needle, haystack) {
        let fkey = ''
        for (fkey in haystack) {
            if (haystack.hasOwnProperty(fkey)) {
                if ((haystack[fkey] + '') === (needle + '')) {
                    return fkey
                }
            }
        }
        return false
    }
    for (key in inputArr) {
        if (inputArr.hasOwnProperty(key)) {
            val = inputArr[key]
            if (_arraySearch(val, tmpArr2) === false) {
                tmpArr2[key] = val
            }
        }
    }
    return tmpArr2
};


var nameRegex = /^[A-Za-z.\s_-]*$/;
var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
var telRegex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
var passRegex = /^([a-z0-9]).{6,}$/;
const DB = require('./db_controller.js');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'davidmatthew708@gmail.com',
        pass: 'jehovaheloini'
    }
});

module.exports.sendMail = (options) => {
    transporter.sendMail(options, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}




//Is Any Input Empty
module.exports.isEmpty = (input) => {
    if (input == "") {
        return true;
    } else {
        return false;
    }
};

//Is Name Input Valid
module.exports.validateName = (name) => {
    var bul = nameRegex.test(name);
    return bul;
};

//Is Email Input Valid
module.exports.validateEmail = (email) => {
    var bul = emailRegex.test(email);
    console.log(bul);
    return bul;
};

//Is Telephone Input Valid
module.exports.validateTel = (tel) => {
    var bul = telRegex.test(tel);
    return bul;
};

//Is Password Input Valid
module.exports.validatePass = (password) => {
    var bul = passRegex.test(password);
    return bul;
};

//Is dob Input Valid
module.exports.validateAge = (dob) => {
    var d = new Date();
    var date_divide = dob.split("-");
    var user_year = date_divide[0];
    var current_year = d.getFullYear();
    var new_age = parseInt(current_year) - parseInt(user_year);

    if (new_age > 18) {
        return false;
    } else {
        return true
    }
};


//Is Email Input Exist
module.exports.emailExist = async (email) => {
    var user_e = await DB.getUserByEmail(email)
    // console.log("helpey");
    // console.log(user_e)
    if (user_e.length > 0) {
        // console.log("helper" + true);
        return true
    } else {
        // console.log("helper" + false);
        return false
    }

};

//Is Kid Email Input Exist
module.exports.kidIsEmailExist = async (email) => {
    var kid = await DB.getKidByEmail(email)
    // console.log("helpey");
    // console.log(user_e)
    if (kid.length > 0) {
        // console.log("helper" + true);
        return true
    } else {
        // console.log("helper" + false);
        return false
    }

};

//Genearte User ID
module.exports.generateUserId = async (title, width) => {
    if (title == 'KDS') {
        var user = await User.getKidLastId();
    } else {
        var user = await User.getLastId();
    }

    if (user.length < 1) {
        var t = 1;
    } else {
        var t = parseInt(user[0].id) + 1
    }

    n = t.toString() + '';
    n = n.toString();
    pad_id = n.length >= width ? n : new Array(width - n.length + 1).join(0) + n;
    return title + "-" + pad_id;
};


//Generate User Type
module.exports.generateUserType = (title) => {
    if (title == 'ADMS') {
        return "Super Admin";
    } else if (title == 'ADM') {
        return "Administrator Editor";
    } else if (title == 'KDS') {
        return "Kid"
    } else if (title == 'SPN') {
        return 'Sponsor';
    } else if (title == 'ENV') {
        return 'Envoy';
    }
};

//Is Image
module.exports.isImage = (file) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        return true;
    } else {
        return false;
    }
};

//Is Doc
module.exports.isDoc = (file) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return true;
    } else {
        return false;
    }
};

//function to split Array
module.exports.splitArray = (arr, n) => {
    var run = true;
    var supreme = [];
    var count = arr.length;
    var v = 0
    var f = n

    while (run) {
        var A = [];

        for (var t = v; t < f; t++) {
            A.push(arr[t]);

        }
        if (A.length > 0) {
            supreme.push(A);
        }

        count = count - n;
        v = v + n;

        if (count > n) {
            f = f + n;
        } else {
            f = arr.length;
        }

        if (count < 0) {
            run = false;
        }

    }
    return supreme;
};


// function to paginate Array
module.exports.paginateArray = (rar, n) => {
    if (rar.length > 6) {
        var thedy = this.splitArray(rar, 6);
        return [thedy[n], thedy.length];
    } else if (rar.length > 0 && rar.length < 6) {
        var supreme = [];
        supreme.push(rar);
        return [supreme, 1];
    } else {
        return [rar, -1]
    }
};


module.exports.formatDateR = (date) => {
    var d = new Date(date);
    var yy = d.getFullYear();
    var mm = (parseInt(d.getMonth()) + 1).toString();
    var dd = d.getDate();
    var HH = d.getHours();
    var MM = d.getMinutes();
    var SS = d.getSeconds();
    return yy + "/" + mm + "/" + dd + " " + HH + ":" + MM + ":" + SS;
};


