app.controller('tab2Ctr', function($scope, $timeout) {
    //メモ画面のコントローラー
    save.disabled = true;
    //保存されているメモのリスト
    var memoListItem = localStorage.getItem('memo');
    //削除インデックス
    var delindex = 0;
    if (memoListItem != null && memoListItem.length >= 1) {
        //Jsonで保存されているのでパースする
        memoListItem = JSON.parse(localStorage.getItem('memo'));
    };

    var itemCount = 0;

    $scope.ItemListDelegate = {
        configureItemScope: function(index, itemScope) {
            if (!itemScope.memo) {
                console.log('Item #' + (index + 1) + '作成');
                // 削除後のアイテムが生成されないように
                itemScope.memo = memoListItem[index].dataTime;
                itemScope.id = "listitem" + index;
            }
            return itemScope.memo;
        },

        countItems: function() {
            // Return number of items.
            if (memoListItem) {
                itemCount = memoListItem.length;
            }
            return itemCount;
        },

        calculateItemHeight: function(index) {
            // Return the height of an item in pixels.
            return 44;
        },

        destroyItemScope: function(index, itemScope) {
            // Optional method that is called when an item is unloaded.
            console.log('Item #' + (index + 1) + '削除');
        }
    };

    $scope.editChange = function() {
        if (memo.value) {
            //保存ボタンを有効化
            save.disabled = false;
        } else {
            //保存ボタンを無効化
            save.disabled = true;
        }
    }

    document.addEventListener("touchend", listItemTap, false);

    //リストの中の要素をタッチ
    function listItemTap(event) {
        //戻るボタンのタッチでエラーが出る為回避（タッチイベントの付け方を考えた方が良いかもしれない）
        if (event.target.offsetParent) {
            var　 touchObject = event.target.offsetParent.id;
            if (touchObject.substr(0, 8) === "listitem") {
                // タッチの情報を含むオブジェクト
                var memoObject = touchObject.replace(/listitem/gi, "");
                //
                var options = {
                    data: memoObject
                };
                navi.pushPage("html/memo.html", options);
            }
        }
    }

    $scope.listItemHold = function() {
        var　 touchObject = event.target.offsetParent.id;
        if (touchObject.substr(0, 8) === "listitem") {
            delindex = touchObject.replace(/listItem/gi, "");
            window.confirm = navigator.notification.confirm;
            navigator.notification.confirm("このメモを削除しますか？", memoDelete, "警告", ["はい", "いいえ"]);
        }
    }

    //保存ボタンタッチ
    $scope.save = function() {
        //現在日時
        var nowDataTime = new Date().toLocaleString();
        //Jsonに変換して保存
        if (memoListItem == null) {
            memoListItem = [];
        };
        memoListItem.push({ dataTime: nowDataTime, memo: memo.value });
        localStorage.setItem('memo', JSON.stringify(memoListItem));
        memo.value = "";
        //保存ボタンを無効化
        save.disabled = true;
        ons.notification.toast({ message: '保存しました。', timeout: 1000 });
    }

    function memoDelete(buttonIndex) {
        //はいがタップされたら削除する
        if (buttonIndex == 1) {
            memoListItem.splice(delindex, 1);
            //無理矢理消す
            //angular.element(memoList.childNodes[1].children[delindex].remove());
            //一度memoを全部削除して入れ直す。
            localStorage.removeItem('memo');
            localStorage.setItem('memo', JSON.stringify(memoListItem));
            $timeout(function() {
                $scope.ItemListDelegate.refresh();
            });
            ons.notification.toast({ message: '削除しました。', timeout: 1000 });
        }
    }

});