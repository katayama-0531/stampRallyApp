//表示するマスク画像URL（Android)
var maskA = "images/mask_android.png";
//表示するマスク画像URL（ios)
var maskI = "images/mask_ios.png";
//選択中の画像
var choiceCanvase = 0;
//設定中の画像枚数
var imgCount = 0;
//各image
var mask = document.createElement("canvas");
var image1 = new Image();
var image2 = new Image();
var image3 = new Image();

app.controller('menu2-5Ctr', function($scope, $http) {
    console.log("2つめメニュー");
    var w = $('.wrapper').width();
    var h = $('.wrapper').height();
    $(".relative").attr('width', w);
    $(".relative").attr('height', h);
    /* Imageオブジェクトを生成 */
    maskLoad();
    //画像を貼る予定のキャンバスのタッチイベント
    $scope.canvasClick = function($event) {
        if (imgCount == 3) {
            setTimeout(function() {
                ons.notification.confirm({
                    message: "既に3枚画像が選択されています。全ての選択を解除しますか？",
                    buttonLabels: ["はい", "いいえ"],
                    cancelable: true,
                    title: "写真の選択",
                    callback: canvasResetCallback
                });
            }, 0);
        } else {
            //$eventの結果はブラウザによって若干の違いがある
            var touchPointY = ($event.offsetY) ? $event.offsetY : $event.layerY;
            if (touchPointY >= 0 && touchPointY < 180) {
                choiceCanvase = 1;
            } else if (touchPointY >= 180 && touchPointY < 355) {
                choiceCanvase = 2;
            } else if (touchPointY >= 355 && touchPointY < maskCanvas.height) {
                choiceCanvase = 3;
            }
            setTimeout(function() {
                ons.notification.confirm({
                    message: "アルバムの写真を使用するか撮影するか選択してください",
                    buttonLabels: ["アルバム", "撮影"],
                    cancelable: true,
                    title: "写真の選択",
                    callback: canvasConfirmCallback
                });
            }, 0);
        }
    }

    $scope.saveClick = function() {
        modal.show();
        save($http);
    }
});

function maskLoad() {
    /* Imageオブジェクトを生成 */
    var img = new Image();
    if (monaca.isAndroid) {
        img.src = maskA;
    } else if (monaca.isIOS) {
        img.src = maskI;
    } else {
        img.src = maskA;
    }
    img.onload = function() {
        //キャンバスは高さと幅を指定しておかないとiOSで表示できない
        var width = parseInt(img.width);
        var height = parseInt(img.height);
        maskCanvas.width = width;
        maskCanvas.height = height;
        /* 画像を描画 */
        maskCanvas.getContext('2d').drawImage(img, 0, 0);
        mask = maskCanvas;
    }
}

function canvasConfirmCallback(buttonIndex) {
    switch (buttonIndex) {
        case 0:
            getPhot();
            break;
        case 1:
            getMaskCamera();
            break;
        default:
            break;
    }
}

function canvasResetCallback(buttonIndex) {
    switch (buttonIndex) {
        case 0:
            imgCount = 0;
            maskLoad();
            modal.hide();
            break;
        default:
            break;
    }
}

function getMaskCamera() {
    modal.show();
    //カメラ起動
    navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        pictureSourceType: Camera.PictureSourceTypeCAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: true
    });

    //撮影成功
    function onCameraSuccess(imageData) {
        draw(imageData);
    }

    //撮影失敗
    function onCameraFail(message) {
        //撮影キャンセルもエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //ons.notification.alert({ message: message, title: "エラー", cancelable: true });
        modal.hide();
    }
}

function getPhot() {
    modal.show();
    //アルバム起動
    navigator.camera.getPicture(onAlbumSuccess, onAlbumFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    //取得成功
    function onAlbumSuccess(imageData) {
        draw(imageData);
    }

    //取得失敗
    function onAlbumFail(message) {
        //アルバム開いてもキャンセルのエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //ons.notification.alert({ message: message, title: "エラー", cancelable: true });
        modal.hide();
    }
}

function draw(imageData) {
    /* Imageオブジェクトを生成 */
    var img = new Image();
    img.src = imageData;
    img.onload = function() {
        /* 画像を描画 (ここで１枚のキャンバスに新たに描画していく)*/
        //合成の形式を指定する(数値はマスク画像から適当に指定している)
        //TODO:このままでは画像を1枚ずつ変更ができない
        var context = maskCanvas.getContext('2d');
        context.globalCompositeOperation = "destination-over";
        switch (choiceCanvase) {
            case 1:
                if (!image1.src) {
                    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, maskCanvas.width, 180);
                } else {
                    console.log(mask.width)
                    var maskCan = mask.getContext('2d')
                    maskCan.drawImage(image1, 0, 0, img.width, img.height, 0, 0, maskCanvas.width, 180);
                    context.globalCompositeOperation = "sorce-in";
                    context.drawImage(img, 0, 0, mask.width, mask.height);

                }
                image1 = img;
                imgCount++;
                break;
            case 2:
                context.drawImage(img, 0, 0, img.width, img.height, 0, 180, maskCanvas.width, 335 - 180);
                image2 = img;
                imgCount++;
                break;
            case 3:
                context.drawImage(img, 0, 0, img.width, img.height, 0, 335, maskCanvas.width, maskCanvas.height　 - 335);
                image3 = img;
                imgCount++;
                break;
            default:
                break;
        }
        modal.hide();
        context = null;
    }
}
//64base→img変換
function Base64ToImage(base64img, callback) {
    var img = new Image();
    img.onload = function() {
        callback(img);
    };
    img.src = base64img;
}

function save($http) {
    var buffer = maskCanvas.toDataURL("image/png");
    //保存する画像のファイル名
    var imgName = Date.now() + ".png";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(imgName, { create: true, exclusive: false },
            function(entry) {
                entry.createWriter(
                    function(writer) {
                        var cb = function() {
                            console.log("書き込み終了");
                        }

                        writer.onwrite = cb;
                        writer.onerror = function(e) {
                            modal.hide();
                            console.log("ファイルへの書き込みに失敗しました。: " + e.toString());
                        }
                        //サーバーに保存するのでほんたいには保存しない
                        //writer.write(buffer);

                        //サーバーに保存する
                        upload(imgName, $http);
                    },
                    function() {
                        modal.hide();
                        console.log("create write error");
                    }
                );
            },
            function() {
                modal.hide();
            }
        );
    }, function() {
        modal.hide();
    });
}

// アップロード
function upload(image, $http) {

    if (image != '') {
        var data = "'" + maskCanvas.toDataURL("image/jpeg") + "'";
        var id = localStorage.getItem('ID');
        //サーバーへの保存処理
        var postData = null;
        if (id) {
            postData = {
                userId: id,
                image_data: data
            };
        }
        //Ajax通信でphpにアクセス
        var url = "http://japan-izm.com/dat/kon/test/stamp/api/imageSave.php",
            config = {
                timeout: 5000
            };
        $http.post(url, postData, config).
        success(function(e, status) {
            if (e["response"] == true) {
                choiceCanvase = 0;
                modal.hide();
                ons.notification.alert({ message: "保存しました。", title: "完了", cancelable: true });
                //選択した画像をリセット

            } else {
                modal.hide();
                ons.notification.alert({ message: "アップロードに失敗しました。", title: "エラー", cancelable: true });
                console.log(e);
            }
        }).
        error(function(data, status) {
            modal.hide();
            ons.notification.alert({ message: "アップロード中にエラーが発生しました。", title: "エラー", cancelable: true });
            console.log(data);
        });

    } else {
        modal.hide();
    }

}