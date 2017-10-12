app.controller('menu2Ctr', function($scope, $http) {
    console.log("2つめメニュー");

    var ctx = photCanvas.getContext('2d');
    var w = $('.wrapper').width();
    var h = $('.wrapper').height();
    $(".relative").attr('width', w);
    $(".relative").attr('height', h);
    /* Imageオブジェクトを生成 */
    var img = new Image();
    if (monaca.isAndroid) {
        img.src = "images/mask_android.png";
    }
    if (monaca.isIOS) {
        img.src = "images/mask_iOS.png";
    }
    img.onload = function() {
        photCanvas.width = img.width;
        photCanvas.height = img.height;
        /* 画像を描画 */
        ctx.drawImage(img, 0, 0);
    }

    //カメラ画面のコントローラー
    $scope.snapClick = function() {
        getCamera();
    }

    $scope.albumClick = function() {
        getPhot();
    }

    $scope.saveClick = function() {
        save($http);
    }
});

function getCamera() {
    //カメラ起動
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        pictureSourceType: Camera.PictureSourceTypeCAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: true
    });

    //撮影成功
    function onSuccess(imageData) {
        modal.show();
        draw(imageData);
    }

    //撮影失敗
    function onFail(message) {
        alert('撮影に失敗しました。　エラーメッセージ: ' + message);
    }
}

function getPhot() {
    //アルバム起動
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    //取得成功
    function onSuccess(imageData) {
        modal.show();
        draw(imageData);
    }

    //取得失敗
    function onFail(message) {
        alert('Error occured: ' + message);
    }
}

var imgData;
var b64;

function draw(imageData) {
    var ctx = photCanvas.getContext('2d');
    var maskImg = new Image();
    if (monaca.isAndroid) {
        maskImg.src = "images/mask_android.png";
    }
    if (monaca.isIOS) {
        maskImg.src = "images/mask_iOS.png";
    }
    var scale = 0.1;

    if (monaca.isAndroid) {
        var fname = imageData;

        var errorHandler = function(e) {
            alert("error");
            console.debug(e);
        };

        window.resolveLocalFileSystemURL(fname, function(fileEntry) {
            fileEntry.file(function(file) {

                var fileReader = new FileReader();
                fileReader.onload = function(event) {
                    dataUrl = fileReader.result;
                    var image = new Image();
                    image.src = dataUrl;
                    ctx.width = image.width;
                    ctx.height = image.height;
                    image.onload = function() {
                        var dstWidth = image.width * scale;
                        var dstHeight = image.height * scale
                        photCanvas.width = dstWidth;
                        photCanvas.height = dstHeight;
                        /* 画像を描画 */
                        ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, dstWidth, dstHeight);
                        ctx.drawImage(maskImg, 0, 0);
                        b64 = photCanvas.toDataURL("image/jpeg");
                        modal.hide();
                    }
                };
                fileReader.onerror = function(event) {
                    modal.hide();
                    alert(event.toString());
                };

                fileReader.readAsDataURL(file);
            }, errorHandler);
        });
    } else {
        /* Imageオブジェクトを生成 */
        var img = new Image();
        imgData = imageData;
        img.src = imageData;
        ctx.width = img.width;
        ctx.height = img.height;
        img.onload = function() {
            console.log("w:"+ img.width + "/h:" + img.height);
            var dstWidth = img.width * scale;
            var dstHeight = img.height * scale
            photCanvas.width = dstWidth;
            photCanvas.height = dstHeight;
            /* 画像を描画 */
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, dstWidth, dstHeight);
            ctx.drawImage(maskImg, 0, 0);
            b64 = photCanvas.toDataURL("image/jpeg");
            modal.hide();
        }
    }
}

var imgName = Date.now() + ".png";

function save($http) {
    var myCanvas = $("#photCanvas").get(0);
    var buffer = myCanvas.toDataURL("image/png");

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fs) {
        fs.root.getFile(imgName, { create: true, exclusive: false },
            function(entry) {
                entry.createWriter(
                    function(writer) {
                        console.log("書き込み中");
                        var cb = function() {
                            console.log("書き込み終了");
                        }

                        writer.onwrite = cb;
                        writer.onerror = function(e) {
                            modal.hide();
                            console.log("書き込み失敗");
                            console.log("ファイルへの書き込みに失敗しました。: " + e.toString());
                        }
                        writer.write(buffer);

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
        var data = "'" + b64 + "'";
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
                modal.hide();
                alert('保存しました。');
            } else {
                modal.hide();
                alert('アップロードに失敗しました。');
                console.log(e);
            }
        }).
        error(function(data, status) {
            modal.hide();
            alert("アップロード中にエラーが発生しました。");
            console.log(data);
        });

    } else {
        modal.hide();
        alert('撮影されていません。');
    }

}