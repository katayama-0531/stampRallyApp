//表示するマスク画像URL（Android)
var maskA = "images/mask_android.png";
//表示するマスク画像URL（ios)
var maskI = "images/mask_ios.png";
//表示する画像URL1枚目
var img1 = new Image();
//表示する画像URL2枚目
var img2 = new Image();
//表示する画像URL3枚目
var img3 = new Image();
//表示中画像枚数
var imgCount = 0;
//マスクキャンバス
var ctx;
app.controller('menu2Ctr', function($scope, $http) {
    console.log("2つめメニュー");

    ctx = photCanvas.getContext('2d');
    var w = $('.wrapper').width();
    var h = $('.wrapper').height();
    $(".relative").attr('width', w);
    $(".relative").attr('height', h);
    /* Imageオブジェクトを生成 */
    var img = new Image();
    if (monaca.isAndroid) {
        img.src = maskA;
    }
    if (monaca.isIOS) {
        img.src = maskI;
    }
    img.onload = function() {
        photCanvas.width = img.width;
        photCanvas.height = img.height;
        /* 画像を描画 */
        ctx.drawImage(img, 0, 0);
    }

    //カメラ画面のコントローラー
    $scope.snapClick = function() {
        getMaskCamera();
    }

    $scope.albumClick = function() {
        getPhot();
    }

    $scope.saveClick = function() {
        modal.show();
        save($http);
    }
});

function getMaskCamera() {
    //カメラ起動
    navigator.camera.getPicture(onCameraSuccess, onCameraFail, {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        pictureSourceType: Camera.PictureSourceTypeCAMERA,
        correctOrientation: true,
        saveToPhotoAlbum: true
    });

    //撮影成功
    function onCameraSuccess(imageData) {
        modal.show();
        draw(imageData);
    }

    //撮影失敗
    function onCameraFail(message) {
        //撮影キャンセルもエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //alert('Error occured: ' + message);
    }
}

function getPhot() {
    //アルバム起動
    navigator.camera.getPicture(onAlbumSuccess, onAlbumFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
    });

    //取得成功
    function onAlbumSuccess(imageData) {
        modal.show();
        draw(imageData);
    }

    //取得失敗
    function onAlbumFail(message) {
        //アルバム開いてもキャンセルのエラーが表示されるので取りあえずコメントアウト（表示文字：no image selected)
        //alert('Error occured: ' + message);
    }
}

function draw(imageData) {
    var scale = 0.1;
    var maskImg = new Image();
    if (monaca.isAndroid) {
        maskImg.src = maskA;
    }
    if (monaca.isIOS) {
        maskImg.src = maskI;
    }

    if (monaca.isAndroid) {
        window.resolveLocalFileSystemURL(imageData, function(fileEntry) {
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
                        var dstHeight = image.height * scale;
                        photCanvas.width = dstWidth;
                        photCanvas.height = dstHeight;
                        /* 画像を描画 */
                        switch (imgCount) {
                            case 0:
                                Base64ToImage(dataUrl, function(img) {
                                    img1 = img;
                                    ctx.drawImage(img1, 0, 0, image.width, image.height, 0, 0, dstWidth, dstHeight);
                                    ctx.drawImage(maskImg, 0, 0);
                                    imgCount++;
                                    modal.hide();
                                });
                                break;
                            case 1:
                                Base64ToImage(dataUrl, function(img) {
                                    img2 = img;
                                    ctx.drawImage(img1, 0, 0, image.width, image.height, 0, 0, dstWidth, dstHeight);
                                    ctx.drawImage(img2, 0, 0, image.width, image.height, 0, 180, dstWidth, dstHeight);
                                    ctx.drawImage(maskImg, 0, 0);
                                    imgCount++;
                                    modal.hide();
                                });
                                break;
                            case 2:
                                Base64ToImage(dataUrl, function(img) {
                                    img3 = img;
                                    ctx.drawImage(img1, 0, 0, image.width, image.height, 0, 0, dstWidth, dstHeight);
                                    ctx.drawImage(img2, 0, 0, image.width, image.height, 0, 180, dstWidth, dstHeight);
                                    ctx.drawImage(img3, 0, 0, image.width, image.height, 0, 320, dstWidth, dstHeight);
                                    ctx.drawImage(maskImg, 0, 0);
                                    imgCount++;
                                    modal.hide();
                                });
                                break;
                            default:
                                break;
                        }
                    }
                };
                fileReader.onerror = function(event) {
                    modal.hide();
                    alert(event.toString());
                };

                fileReader.readAsDataURL(file);
            }, function(e) {
                alert("error");
                console.debug(e);
            });
        });
    } else {
        /* Imageオブジェクトを生成 */
        var img = new Image();
        img.src = imageData;
        ctx.width = img.width;
        ctx.height = img.height;
        img.onload = function() {
            var dstWidth = img.width * scale;
            var dstHeight = img.height * scale;
            photCanvas.width = dstWidth;
            photCanvas.height = dstHeight;
            /* 画像を描画 */
            switch (imgCount) {
                case 0:
                    img1.src = imageData;
                    ctx.drawImage(img1, 0, 0, img.width, img.height, 0, 0, dstWidth, dstHeight);
                    imgCount++;
                    break;
                case 1:
                    img2.src = imageData;
                    ctx.drawImage(img1, 0, 0, img.width, img.height, 0, 0, dstWidth, dstHeight);
                    ctx.drawImage(img2, 0, 0, img.width, img.height, 0, 170, dstWidth, dstHeight);
                    imgCount++;
                    break;
                case 2:
                    img3.src = imageData;
                    ctx.drawImage(img1, 0, 0, img.width, img.height, 0, 0, dstWidth, dstHeight);
                    ctx.drawImage(img2, 0, 0, img.width, img.height, 0, 180, dstWidth, dstHeight);
                    ctx.drawImage(img3, 0, 0, img.width, img.height, 0, 320, dstWidth, dstHeight);
                    imgCount++;
                    break;
                default:
                    break;
            }

            ctx.drawImage(maskImg, 0, 0);
            modal.hide();
        }
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
    var myCanvas = $("#photCanvas").get(0);
    var buffer = myCanvas.toDataURL("image/png");
    //保存する画像のファイル名
    var imgName = Date.now() + ".png";

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
        var data = "'" + photCanvas.toDataURL("image/jpeg") + "'";
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
                imgCount = 0;
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