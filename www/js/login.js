var app = ons.bootstrap();
app.controller('AppController', function($scope, $http, $timeout) {
    //ログイン画面のコントローラー
    // メンバ
    this.menu = null;
    var id = localStorage.getItem('ID');
    $scope.loginClick = function() {
        login(id, $http);
    }

    document.addEventListener('pageinit', function(page) {
        var module = angular.module('app', ['onsen.directives']);
        //ログインの通信の為の準備
        module.config(function($httpProvider) {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;application/json;charset=utf-8';
        });
        if (page.target.id == "loginPage") {
            login(id, $http);
            id=null;
        }
    });

    document.addEventListener('hide', function(event) {
        //ページが見えなくなった時
        var page = event.target;
        if (page.matches('#stampPage')) {
            //スタンプページ
            gps.innerHTML = "";
            gpsButton.innerHTML = "現在位置取得";
            stamp.innerHTML = "";
            mapCanvas.innerHTML = null;
            stampImg.src = "";
            stampImg.className = "";
            stampImg2.src = "";
            stampImg2.className = "";
            gpsButton.disabled = false;

        }

        if (page.matches('#qrScanPage')) {
            resultMessage.innerHTML = "";
        }
    });

});

function login(id, $http) {
    //ログイン処理
    var postData = null;
    if (id) {
        postData = {
            userId: id
        };
    }
    //Ajax通信でphpにアクセス
    var url = "http://japan-izm.com/dat/kon/test/stamp/api/login.php",
        config = {
            timeout: 5000
        };
    $http.post(url, postData, config).
    success(function(data, status) {
        if (data[0] == "success") {
            localStorage.setItem("ID", data[1]);
            navi.replacePage("html/menu.html");
        } else {
            alert("ログインできませんでした。");
            console.log(data);
            retry();
        }
    }).
    error(function(data, status) {
        alert("エラーが発生しました。");
        console.log(data);
        retry();
    });
}

function retry() {
    document.getElementsByTagName("h3")[0].innerHTML = "ログイン画面"
    loginBtn.disabled = false;
}