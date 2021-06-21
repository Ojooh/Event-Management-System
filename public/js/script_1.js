
jQuery(document).ready(function ($) {
    var loginBtn = $(".loginBtn");
    var error = $('.error');


    loginBtn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        error.html("");
        var url = "/login";
        var username = $('#admin_email').val();
        var password = $('#admin_pass').val();
        var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
        var msg = "";

        if (username == "" || password == "") {
            msg = "<div class='alert alert-success w-100'>Enter a valid username and passsword</div>";
            error.html(msg);
        }
        else if (emailRegex.test(username) == false) {
            msg = "<div class='alert alert-success w-100'>Enter a valid username and password</div>";
            error.html(msg);
        }
        else {
            error.html("")
            var data = {
                'email': username,
                'password': password,
            }

            $.ajax({
                url: url,
                data: data,
                type: "post",
                beforeSend: function () {
                    Swal.fire({
                        title: 'Auto close alert!',
                        html: 'Please Hold on as your details are being confirmed',
                        timer: 40000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                        allowOutsideClick: false,
                    });
                },
                success: function (data) {
                    console.log(data);
                    if (data.success) {

                        Swal.fire(data.success, "Click OK to proceed to Dashoboard", "success").then(
                            function () {
                                location.replace(data.url);
                            }
                        )
                    }
                    else {
                        swal.close();
                        msg = "<div class='alert alert-success'>" + data.error + "</div>";
                        error.html(msg);
                    }

                }
            });
        }
    });

});


