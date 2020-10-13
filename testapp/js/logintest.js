(function(){

var socialAuthLogin = {};

socialAuthLogin.baseDjangoUrl = "/login/"


socialAuthLogin.openPop = function(url){

    var promise = new Promise(function(resolve, reject) {
    
        window.open(url, "named");

        var lateHanlder = setTimeout(function(){
            reject(Error("It broke, too late"), 10000);
        });

        var listener = window.addEventListener('message', function (event) {
            console.log("worked", event.data);
            clearTimeout(lateHanlder);
            resolve(event.data);
        });
    
    });

    return promise;

}


socialAuthLogin.loginDjango = function(providerName, callback){
    var authKey = Math.random() * 10000;
    var url = socialAuthLogin.baseDjangoUrl + providerName + "?authkey="+authKey + "&next=/popuptoken?authkey="+authKey;
    var promise = new Promise(function(resolve, reject) {

        socialAuthLogin.openPop(url)
        .then(function(res){
            resolve(res);
        })
        .catch(function(err){
            reject(err);
        })
    });

    return promise;


}


window.socialAuthLogin = socialAuthLogin;



})();