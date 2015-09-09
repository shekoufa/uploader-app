/**
 * Created by nono on 9/3/15.
 */

function sendAjax() {
    if($("#termsaccept").prop('checked')){
        showLoading();
        // get inputs
        var article = new Object();
        article.identity = $('#username').val();
        article.password = $('#password').val();
    //	article.categories = $('#categories').val().split(";");
    //	article.tags = $('#tags').val().split(";");
        $.ajax({
            url: "http://app.heyorca.com:8080/app/login",
            type: 'POST',
            dataType: 'json',
            data: {identity:article.identity,password:article.password},
//            contentType: 'application/json',
//            mimeType: 'application/json',
            success: function (data) {
                console.log(data);
                hideLoading();
                if(data.success == false){
                    sweetAlert({
                            title: "",
                            text: data.data,
                            html: true
                    });
//                    $(".confirm").trigger('blur');
//                    $(".confirm").blur();
                    $("#password").val("");
                }else{
                    $("#currentuserid").val(data.data.id);
                    $("#login").fadeOut("slow",function(){
                        $("#fullname").html(data.data.first_name);
                        if(data.data.profilepic_thumb == null){
//                            $("#profilephoto").attr("src",);
                        }else{
                            $("#profilephoto").attr("src",data.data.profilepic_thumb);
//                            $("#profilephoto").css("height","64px");
                            $("#profilephoto").show();
                        }
                        var teams = data.data.editable_teams;
                        var divStr = "";
                        for (var i in teams){
                             divStr = divStr + '<div ontouchstart="setTeamId('+teams[i].id+');" id="team-div'+teams[i].id+'" class="team-div" style="border: 2px solid darkgray; display: inline-block; overflow: hidden; padding: 10px; margin: 5px auto; ' +
                                 'width: 40%; margin-right:5px; min-height:120px;' +
                                 'border-radius: 25px;">' +
                                '<div style="border-radius: 50px; overflow: hidden;margin-bottom: 15px;">';
                                if(teams[i].image_url==""){
                                    divStr = divStr + '<img style="margin-right: 10px;" width="64" src="img/team.png"/>';
                                }else{
                                    divStr = divStr + '<img style="margin-right: 10px;border-radius: 50%" width="64" src="'+teams[i].image_url+'"/>';
                                }
                                divStr+="</div>";
                                divStr = divStr + '<label style="min-width: 65%;">'+teams[i].title+'</label>'+
                                '</div>';

                        }
                        $("#team-holder").html(divStr);
                        $("#teams").show();
                        $("#app-wrapper").fadeIn("slow");
                        $("#activepage").val("app");
                    })
                }
            },
            error:function(data,status,er) {
                hideLoading();
                sweetAlert("There is a connection problem. Check your internet connection is healthy.");
            }
        });
    }else{
        sweetAlert("Don't you agree with our Terms of Service and Privacy Policy?!");
    }
};
function setTeamId(teamId){
    $(".team-div").removeClass("current-team");
    $("#team-div"+teamId).addClass("current-team");
    $("#currentteamid").val(""+teamId+"");
    $("#teams").fadeOut("slow",function(){
        $("#app").show();
    });

}
