app.controller('tab1Ctr', function($scope) {
    //タブ1画面のコントローラー
    var browserUrl;
    $scope.linkFrameClick = function() {
        browserUrl = 0;
    }
    linkFrame.onload = function() {
        if (monaca.isAndroid) {
            linkFrame.contentDocument.addEventListener('touchend', function(e) {
                if (document.getElementById) {
                    browserUrl = e.target.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no");
                }
            }, true);
        } else if (monaca.isIOS) {
            //iOSの処理
            linkFrame.document.addEventListener('touchend', function(e) {
                if (!document.all) {
                    browserUrl = e.srcElement.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no", "EnableViewPortScale=yes");
                }
            });
        } else {
            linkFrame.contentDocument.addEventListener('click', function(e) {
                if (document.getElementById) {
                    browserUrl = e.target.href;
                }
                if (browserUrl) {
                    //webviewのリンクを無効にする
                    e.target.removeAttribute("href");

                    //タッチした場所が外部リンクの場合標準ブラウザを立ち上げる
                    var browser = window.open(browserUrl, "_system", "location=no");
                }
            });
        }
    }
    tab1Page.addEventListener("show", function(event) {
        if (browserUrl) {
            if (monaca.isAndroid) {
                //android用
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else if (monaca.isIOS) {
                //iOS用
                linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else {
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            }
        }
    });

    tab1Page.addEventListener("pause", function(event) {
        if (browserUrl) {
            if (monaca.isAndroid) {
                //android用
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else if (monaca.isIOS) {
                //iOS用
                linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            } else {
                linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
            }
        }
    });
});