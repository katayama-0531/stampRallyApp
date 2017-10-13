app.controller('memoCtr', function($scope) {
    //メモ詳細画面のコントローラー
    var options = $scope.navi.topPage.data;
    //jsonで保存されているのでパースする
    var mlItem = JSON.parse(localStorage.getItem('memo'));
    memoTitle.innerText = mlItem[options].dataTime;
    description.innerText = mlItem[options].memo;

    $scope.reSave = function() {
        //jsonに変換して保存
        mlItem[options] = { dataTime: mlItem[options].dataTime, memo: description.value }
        localStorage.setItem('memo', JSON.stringify(mlItem));
        navi.popPage();
    }
});