/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
//        var element = document.getElementById('deviceProperties');
//        element.innerHTML = 'Device Model: '    + device.model    + '<br />' +
//            'Device Cordova: '  + device.cordova  + '<br />' +
//            'Device Platform: ' + device.platform + '<br />' +
//            'Device UUID: '     + device.uuid     + '<br />' +
//            'Device Version: '  + device.version  + '<br />';
        showLoading();
        db = createDb();
        document.addEventListener("backbutton", onBackKeyDown, false);
        app.receivedEvent('deviceready');


    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

    }
};
function onBackKeyDown(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    if($("#activepage").val()=="teams" || $("activepage").val()=="login"){
        sweetAlert({
            title: "Are you sure?",
            text: "The application will be closed!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes!",
            closeOnConfirm: false },
            function(){
                navigator.app.exitApp();
            });
    }else if($("#activepage").val()=="app"){
        $("#app").fadeOut("slow",function(){
            setActivePage("teams");
            $("#backbutton").hide();
            $("#teams").fadeIn();
        });
    }else if($("#activepage").val()=="preview"){
        $("#preview").fadeOut("slow",function(){
            document.getElementById("imagecontainer").innerHTML = '<img id="smallImage"/>';
//            $("#backbutton").hide();
            setActivePage("app");
            $("#app").fadeIn("slow");
        });
    }
    if($("#activepage").val()=="outlink"){
        history.go(-1);
        navigator.app.backHistory();
    }

}
function showLoading(){
    $("#loading").show();
}
function hideLoading(){
    $("#loading").hide();
}
function showLogin(){
    $(".pages").hide();
    setActivePage("login");
    $("#login").fadeIn("slow");
}
function showTeams(){
    $(".pages").hide();
    setActivePage("teams");
    $("#teams").fadeIn("slow");
}
function setActivePage(page){
    $("#activepage").val(page);
}
function getActivePage(){
    return $("#activepage").val();
}