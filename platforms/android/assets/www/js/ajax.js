/**
 * Created by nono on 9/3/15.
 */
function sendAjax(type) {
    var termsOk = true;
    if(type ==1 && $("#termsaccept").prop('checked')==false){
        termsOk = false;
    }
    if(termsOk){
        showLoading();
        // get inputs
        var article = new Object();
        if(type == "1"){
            article.identity = $('#username').val();
            article.password = $('#password').val();
            article.device_id = device.uuid;
            var dataFeed  = {identity:article.identity,password:article.password,device_id:article.device_id};
        }else{
            article.device_id = device.uuid;
            article.auth_code = $("#currentcode").val();
            var dataFeed  = {device_id:article.device_id,auth_code: article.auth_code};
        }


    //	article.categories = $('#categories').val().split(";");
    //	article.tags = $('#tags').val().split(";");

        $.ajax({
//            url: "http://app.heyorca.com:8080/app/login",
            url: "http://app.heyorca.com:8080/app/login",
            type: 'POST',
            dataType: 'json',
            data: dataFeed,
//            contentType: 'application/json',
//            mimeType: 'application/json',
            success: function (data) {
                hideLoading();
                console.log(data);
                if(data.success == false){
                    sweetAlert({
                            title: "",
                            text: data.data,
                            html: true
                    });
//                    $(".confirm").trigger('blur');
//                    $(".confirm").blur();
                    $("#password").val("");
                    showLogin();
                }else{
                    if(type==2){
                        updateAuthCode($("#currentcode").val(),data.data.device_authentication_code);
                    }
                    $("#currentuserid").val(data.data.id);
//                    $("#device_code").val(data.data.device_authentication_code);
                    db.transaction(function(tx) {
                        logIn(tx);
                    });
                    db.transaction(function(tx) {
                        insertKey(data.data.device_authentication_code,tx);
                    });

                    if($("#login").is(":visible")){
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
                            setActivePage("teams");
                        });

                    }
                    if($("#splashscreen").is(":visible")){
                        $("#splashscreen").fadeOut("slow",function(){
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
                            setActivePage("teams");
                        });

                    }

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
        setActivePage("app");
        $("#backbutton").show();
        $("#app").show();
    });

}
function updateAuthCode(prevCode, newCode){
    console.log("in updateAuthCode Prev code is: "+prevCode);
    console.log("in updateAuthCode New code is: "+newCode);
    var updateToken = new Object();
    updateToken.device_id= device.uuid;
    updateToken.auth_code = prevCode;
    updateToken.updated_auth_code = newCode;
    $.ajax({
        url: "http://app.heyorca.com:8080/app/update_auth_code",
        type: 'POST',
        dataType: 'json',
        data: {device_id: device.uuid, auth_code: prevCode, updated_auth_code: newCode},
        //            contentType: 'application/json',
        //            mimeType: 'application/json',
        success: function (data) {
            $("#currentcode").val(newCode);
            db.transaction(function(tx) {
                insertKey(newCode,tx);
            });

        },
        error:function(data,status,er) {
        }
    });
}