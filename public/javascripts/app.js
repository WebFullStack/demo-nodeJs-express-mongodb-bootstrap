$(function(){
  $("form").validator({
    isErrorOnParent: true
  });

  $(".logout").click(logoutEvent);
});

var loginEvent = function(e) {
    e.preventDefault();
    var data = $(".login-form").serialize();
    $.ajax({
        url:'/users/login',
        type:'POST',
        data:data,
        success:function (data) {
            if (data) {
                $(".login-modal").modal('hide');
                $(".login-btn").addClass('hide');
                $(".logout-btn").removeClass('hide');
                $.cookie('user',data.user,{path:'/',expires:1});
                window.location.reload();
            } else {
                alert("login failed");
            }
        }
    })
};

var logoutEvent = function(e){
    e && e.preventDefault();
    $.ajax({
        url:'/users/logout',
        type:'POST',
        success:function(data){
            $.cookie('user',null,{path:'/',expires:-1});
            window.location.reload();
        }
    })
};
