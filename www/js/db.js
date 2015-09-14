function createDb(){
    db = window.openDatabase("heyorcadb", "1.0", "HeyOrca Database", 1000000);
    db.transaction(populateDB, errorCB, successCreateDB);
    return db;
}
function populateDB(tx){
    db.transaction(selectAll, errorInitializationCB);
}
function selectAll(tx){
    tx.executeSql("SELECT * FROM registration", [], selectAllSuccess, errorInitializationCB);
}
function errorInitializationCB(err){
    db.transaction(createTable,errorCB,successCB);
}
function successCB() {
}
function successCreateDB() {

}
function errorCB(err) {
    alert("Error processing in SQL: "+err.message);
}
function createTable(tx){
    tx.executeSql('DROP TABLE IF EXISTS registration',[],function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS registration (ID unique, code VARCHAR, logout VARCHAR)');
        getCode(tx);
    },errorCB);
}
function selectAllSuccess(tx, results){
    if(results.rows.length==0){
        db.transaction(createTable,errorCB,successCB);
        $("#splashscreen").fadeOut("slow",function(){
            showLogin();
        });
    }else{
        getCode(tx);
    }
}
function insertKey(code, tx){
    tx.executeSql("INSERT INTO registration values (?,?,?)",
        [1, code,'N'],successCB(),function(tx){
            tx.executeSql("UPDATE registration SET code = '"+code+"'  where id=1");
        });

}
function logOut(tx){
    tx.executeSql("UPDATE registration SET logout = 'Y'  where id=1",[],function(){
        location.reload();
    },errorCB);
}
function logIn(tx){
    tx.executeSql("UPDATE registration SET logout = 'N'  where id=1");
}
function returnCode(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],function(tx,results){
        if(results.rows.length==0){
            return null;
        }else{
            for(var i=0; i<results.rows.length; i++) {
                var code = results.rows.item(i).code;
                return code;
            }
        }
    },errorCB);
}
function getCode(tx){
    tx.executeSql("SELECT * FROM registration WHERE ID = 1",[],function(tx,results){
        if(results.rows.length==0){
            $(".pages").hide();
//            sweetAlert("It's your first login. Welcome aboard :)");
            hideLoading();
            $("#splashscreen").fadeOut("slow",function(){
                $("#login").fadeIn();
                setActivePage("login");
            });
        }else{
            for(var i=0; i<results.rows.length; i++) {
                var code = results.rows.item(i).code;
                var prevCode = code;
                $("#currentcode").val(prevCode);
                var loggedOut = results.rows.item(i).logout;
//               alert("Am I logged out?!: "+loggedOut);
                if(loggedOut=="Y"){
                    hideLoading();
                    $("#splashscreen").fadeOut("slow",function(){
                        showLogin();
                    });
                }else{
                    sendAjax("2");
                }
            }
        }

    },errorCB);
}