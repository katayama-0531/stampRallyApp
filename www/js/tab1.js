app.controller('tab1Ctr', function($scope) {
    //タブ1画面のコントローラー
    var browserUrl;
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
        }
        if (monaca.isIOS) {
            //iOSの処理
            linkFrame.document.addEventListener('touchend', function(e) {
                if (!document.all) {
                    browserUrl = e.srcElement.href;
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
    document.addEventListener("pause", function(event) {
        var page = event.target;
        if (page != null) {
            if (page.matches('#tab1Page')) {
                if (monaca.isAndroid) {
                    //android用
                    linkFrame.contentDocument.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
                }
                if (monaca.isIOS) {
                    //iOS用
                    linkFrame.document.getElementsByTagName("a")[0].setAttribute("href", browserUrl);
                }
            }
        }
    }, false);
});