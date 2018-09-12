function authbox_render(is_auth)
{
    var $authbox = $("div[name='authbox']");

    if (is_auth) {
        $authbox.html("<h2>IS AUTHICATED</h2>\
<h2>Logout</h2>\
<button type=\"button\" name=\"logout_submit\">Logout</button>\
");
        $("button[name='logout_submit']").click(logout_cb);
    }
    else {
        $authbox.html("<h2>IS NOT AUTHENTICATED</h2>\
<h2>Login</h2>\
\
<form name=\"form_login\" method=\"post\" action=\"/chat/accounts/login/\">\
<div>\
  <td><label for=\"id_username\">Username:</label></td>\
  <td><input type=\"text\" name=\"username\" maxlength=\"254\" autofocus required id=\"id_username\" /></td>\
</div>\
<div>\
  <td><label for=\"id_password\">Password:</label></td>\
  <td><input type=\"password\" name=\"password\" id=\"id_password\" required /></td>\
</div>\
\
<div>\
    <button name=\"login_submit\" type=\"button\">Login</button>\
  <input type=\"hidden\" name=\"next\" value=\"\" />\
</div>\
</form>");
        $("button[name='login_submit']").click(login_cb);
    }
}

function login_success_cb(content, y, xhr)
{
    console.log(Cookies.get());
    console.log(content['csrf']);

    Cookies.set('csrftoken', content['csrf']);
    authbox_render(true);
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type)) {
            xhr.setRequestHeader("X-CSRFToken", Cookies.get('csrftoken'));
        }
    }
});

function logout_success_cb()
{
    authbox_render(false);
}

function logout_cb(e) {
    console.log('here');
    $.ajax({
        type: "GET",
        url: "/chat/accounts/logout",
        success: logout_success_cb});

    chatSocket.send(JSON.stringify({
        'type': 'logout'
        }));
}

function login_cb(e) {
    var $form = $("form[name='form_login']");
    var user = $form.find("input[name='username']").val();
    var passwd = $form.find("input[name='password']").val();
    $.ajax({
        type: "POST",
        cache: 'FALSE',
        error: function() {
            console.log('error fired');
        },
        statusCode: {
            302: function() {
                console.log( "page redir" );
                return(false);
            }
        },
        url: "/chat/accounts/login/?next=/chat/login_landing/",
        data: {username: user,
               password: passwd},
        success: login_success_cb
    });
}

function check_ajax_success_cb(content, b, c) {
    console.log("check_ajax_success_cb");
    $("div[name='check-ajax-res']").html(
        content.is_auth == true ? "IS AUTH" : "IS NOT AUTH");
}

function check_ajax_cb(e) {
    $("div[name='check-ajax-res']").html("TO BE SET");
    var $form = $("form[name='form-check-ajax']");
    $.ajax({
        type: "POST",
        cache: 'FALSE',
        error: function() {
            console.log('error fired');
        },
        statusCode: {
            302: function() {
                console.log( "page redir" );
                return(false);
            }
        },
        url: "/chat/check_ajax/",
        success: check_ajax_success_cb
    });
}

authbox_render(user_is_auth);
$("button[name='check-ajax']").click(check_ajax_cb);

