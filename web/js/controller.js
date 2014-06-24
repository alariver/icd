/**
 * Created with JetBrains WebStorm.
 * User: changzhenghe
 * Date: 11/3/13
 * Time: 8:42 PM
 * To change this template use File | Settings | File Templates.
 */
    // Config rems-user Controller
icdModule.controller('ConfigUserController',['$scope','$state',function($scope,$state) {
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }
}]);




// Config rems-target Controller
icdModule.controller('ConfigTargetController',['$scope',function($scope) {



    // rems-target fsm
    // save button fsm
    $scope.saveFsm = StateMachine.create({
        initial:    'enable',
        events:     [
            {name: 'showbutton',  from: 'hide',   to: 'show'},
            {name: 'enablebutton',    from: ['show','clicked'],   to: 'enable'},
            {name: 'clickbutton',     from: 'enable', to: 'clicked'},
            {name: 'disablebutton',   from: ['clicked','enable'], to: 'show'},
            {name: 'hidebutton',  from: ['clicked','enable','show'],  to: 'hide'}
        ],
        callbacks: {
            onshow: function(event, from, to) {


            },
            onhide: function(event, from, to) {

            },
            onenable: function(event, from, to) {

            },
            onclicked: function(event, from, to) {
                console.log('saveBtn clicked.');
                this.enablebutton();
            }
        }
    });

    // delete button fsm
    $scope.deleteFsm = StateMachine.create({
        initial:    'hide',
        events:     [
            {name: 'showbutton',  from: 'hide',   to: 'show'},
            {name: 'enablebutton',    from: ['show','clicked'],   to: 'enable'},
            {name: 'clickbutton',     from: 'enable', to: 'clicked'},
            {name: 'disablebutton',   from: ['clicked','enable'], to: 'show'},
            {name: 'hidebutton',  from: ['clicked','enable','show'],  to: 'hide'}
        ],
        callbacks: {
            onshow: function(event, from, to) {


            },
            onhide: function(event, from, to) {

            },
            onenable: function(event, from, to) {

            },
            onclicked: function(event, from, to) {
                console.log('delete Button clicked.');
                this.enablebutton();
            }
        }
    });

    // 添加新的客户端
    $scope.addNewTgt = function(event) {
        console.log('添加新的客户端 clicked. ');
        $scope.currentObject.selectedIdx = -1;
        $scope.currentObject.selectedTgt = {};

    }



    // Event Handler
    $scope.saveTarget = function() {
//        console.dir($scope);
        $scope.saveFsm.clickbutton();
    }

    $scope.deleteTgt = function() {
        $scope.deleteFsm.clickbutton();
    }
}]);

// Modal Controller
icdModule.controller('ModalInstanceCtrl',['$scope','$modalInstance','currentDuichang',function($scope,$modalInstance,currentDuichang){
    $scope.currentDuichang = currentDuichang;

    $scope.ok = function() {
        $modalInstance.close($scope.currentDuichang);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    }

    // Calendar
  /*  $scope.today = function () {
        $scope.currentDuichang.duicengs[0].openDate = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = !$scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.currentDuichang.duicengs[0].openDate = null;
    };

    // Disable weekend selection
    $scope.disabled = function (date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function () {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
        console.log(' calendar open??');
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        'year-format': "'yyyy'",
        'starting-day': 1
    };

    $scope.formats = ['yyyy-MM-dd','dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];*/

}]);

// 添加新堆场 对应的Controller
icdModule.controller('ModelController',['$scope','$modal','$log','HeapSvc',function($scope,$modal,$log,HeapSvc){
    // 添加堆场

    $scope.currentDuichang = {
        duichangName: 'test',
        area: 0,
        layers: 0,
        high: 0,
        duicengs: []
    };
    $scope.currentDuichang.duicengs.push({
        duicengName: '',
        openDate: new Date,
        stopDate: '',
        layer: 1,
        area: 0,
        high: 0,
        kuangliang: 0,
        rdpw: 0.00,
        rdjsl: 0,
        xyjsl: 0,
        bfjsl: 0,
        khsjsl: 0
    });

    $scope.addDuichang = function() {
        var modalInstance = $modal.open({
            templateUrl: 'addDuichang.html',
            controller: 'ModalInstanceCtrl',
            resolve: {
                currentDuichang: function() {
                    return  $scope.currentDuichang;
                }
            }
        });
        modalInstance.result.then(function(duichang){
            console.log('modal ok:'+duichang);
//            console.dir(duichang);
            // 添加堆场
            HeapSvc.addHeap(duichang).success(function(response) {
                console.log('添加堆场正常:');
//                console.dir(response);
                $scope.managedTargets.push(duichang);
            }).error(function(){
                    console.log('添加堆场操作异常');
                });
        }, function(){
            console.log(' modal cancel.');
        });
    };


    // 添加堆场END
}]);

function isChildOf(scope,scopeid) {

    if (scope.$id == scopeid){
        //console.log('isChildOf return true :'+scope.$id + ' == '+scopeid+ ' --- '+true);
        return true;
    }
    else{
        if (scope.$parent != undefined) {
            //console.log(' recursive call.');
            return isChildOf(scope.$parent,scopeid);
        }
        else {
            //console.log('not found match, return false.');
            return false;
        }

    }

};



//浸出指标 Controller
icdModule.controller('HeapLeachingFormCtrl',['$rootScope','$scope','HeapLeachingProc','HeapSvc','$filter',
    function($rootScope,$scope,hlp,heap,$filter){
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    $scope.currentLeachingParam = {};           // 正在编辑的浸出指标数据      currentObject.CurrLeachingParam

    // 所有堆场数据              2014.2.6 保存到rootScope中
    heap.allHeaps().success(function(response){
        //$scope.availHeaps = response['data'];
        $rootScope.availHeaps = response['data'];
    }).error(function(){
            $.growl('获取堆场数据定义，服务器通讯异常.');
        });

    // 改变日期后，后台查询浸出数据
    $scope.changeJlrqLeach = function(date) {
        hlp.getLeachingParamsByDay(date).success(function(response){
            $scope.currentObject.CurrLeachingParam.datas = response['data'] || [];

            $scope.currentLeachingParam = {};   // 日期改变，清空一切

            // 控制pannel的collapse状态
            angular.forEach($scope.currentObject.CurrLeachingParam.datas,function(value,key){
                value.isCollapsed = true;
            });
        }).error(function() {
                $.growl('获取浸出数据通讯异常。');
            })
    };

    // 添加新数据
    $scope.addItem = function() {
        $scope.currentLeachingParam = {};
    };

    // 保存当前正在编辑的数据
    $scope.saveItem = function() {
        if (!$scope.currentLeachingParam.refHeapInfo) { // 当前编辑form，没有选定的堆层
            console.log(' 当前编辑界面没有需要保存数据.');
            return;
        }
        // 某些数据项需要预处理  日期， select
        $scope.currentLeachingParam.jlrq = $scope.currentObject.CurrLeachingParam.jlrq;

        $scope.currentLeachingParam.duichangID = $scope.currentLeachingParam.refHeapInfo.duichangID;

        if (!$scope.currentLeachingParam.jlrq || !$scope.currentLeachingParam.duichangID) {
            console.log(' 当前编辑界面没有需要保存数据.');
            return;
        }



        if ($scope.currentLeachingParam.pid ) {    // 修改数据
            $scope.currentLeachingParam.haveBeenModified = true;
        }
        else {                                  // 添加数据
            $scope.currentObject.CurrLeachingParam.datas = $scope.currentObject.CurrLeachingParam.datas || [];
            if ($.inArray($scope.currentLeachingParam,$scope.currentObject.CurrLeachingParam.datas)==-1){
                $scope.currentObject.CurrLeachingParam.datas.push($scope.currentLeachingParam);
            }

        }

        //
        $scope.currentLeachingParam = {};
    };

    $scope.predicateChange = function() {
        if (!$scope.currentLeachingParam.refHeapInfo || !$scope.currentLeachingParam.refHeapInfo.duichangID) {
            return;
        }
        angular.forEach($scope.currentObject.CurrLeachingParam.datas,function(value,key){
            // 当前输入的日期是字符串， value中存储的jlrq为date  需要做转换再比较
            if ($filter('date')(value.jlrq,dateFormat)
                == $scope.currentObject.CurrLeachingParam.jlrq
                && $scope.currentLeachingParam.refHeapInfo.duichangID == value.duichangID
               ) {

                var tval = $scope.currentLeachingParam.refHeapInfo;
                console.log('------------ exist data found. ------------');

                $scope.currentLeachingParam = value;
                $scope.currentLeachingParam.refHeapInfo = tval;
                // 需要避免 无限循环的watch

            }
        });
    };

    // 修改本日所有数据（dirty）
    $scope.saveLeachingDatas = function() {

        // 当前编辑的数据，先进行保存处理
        $scope.saveItem();

        angular.forEach($scope.currentObject.CurrLeachingParam.datas,function(value,key){
//            console.dir("======>DEBUG:");
//            console.dir(value);
            if (! value.pid || value.haveBeenModified == true) {  // Add or Update
                hlp.saveLeachingParam(value)
                    .success(function(response){
                        value.pid = response['data'].pid;
                        value.haveBeenModified = false;
//                        console.dir(value);
                    })
                    .error(function() {
                        console.log('保存浸出数据错误，通讯异常。');
                    });
            }
            else {                                          // Does not need to Update, Do Nothing.

            }
        });
    };

    // 修改指定数据
    $scope.selectToModify = function(item) {
        console.log('-------- selectToModify ---------');
        $scope.currentLeachingParam = item;
        angular.forEach($scope.availHeaps,function(value,key) {
            if (item.refHeapInfo && value.duichangID == item.refHeapInfo.duichangID) {
                $scope.currentLeachingParam.refHeapInfo = value;
            }
        });
        //$scope.currentSprayParam.duicengInfo = item.refLayerInfo;
    };

}]);


// 喷淋指标
icdModule.controller('HeapSprayFormCtrl',['$rootScope','$scope','HeapLeachingProc','HeapSvc','$filter',function($rootScope,$scope,svc,heapSvc,$filter) {

    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    $scope.currentSprayParam = {};          // 正在编辑的堆层喷淋指标数据

    // 添加新数据
    $scope.addItem = function() {
        $scope.currentSprayParam = {};
    };

    // 修改指定数据
    $scope.selectToModify = function(item) {
        $scope.currentSprayParam = item;
        angular.forEach($scope.availDuicengs,function(value,key) {
            if (item.refLayerInfo && value.duicengID == item.refLayerInfo.duicengID) {
                $scope.currentSprayParam.duicengInfo = value;
            }
        });
        //$scope.currentSprayParam.duicengInfo = item.refLayerInfo;
    };

    $scope.predicateChange = function() {
        if (!$scope.currentSprayParam.duicengInfo || !$scope.currentSprayParam.duicengInfo.duicengID) {
            return;
        }
        angular.forEach($scope.currentObject.CurrSprayParams.datas,function(value,key){
            // 当前输入的日期是字符串， value中存储的jlrq为date  需要做转换再比较
            if ($filter('date')(value.jlrq,dateFormat)
                == $scope.currentObject.CurrSprayParams.jlrq
                && $scope.currentSprayParam.duicengInfo.duicengID == value.duicengID
                &&  $scope.currentSprayParam.sprayType == value.sprayType) {

                var tval = $scope.currentSprayParam.duicengInfo;
                console.log('------------ exist data found. ------------');

                $scope.currentSprayParam = value;
                $scope.currentSprayParam.duicengInfo = tval;
                // 需要避免 无限循环的watch

            }
        });
    };



    // 获取堆层数据
    // 所有已经定义的堆层                2014.2.6 保存到rootScope中
    heapSvc.allLayers().success(function(response) {
        //$scope.availDuicengs = response['data'];
        $rootScope.availDuicengs = response['data'];
    }).error(function(){
            console.log('获取堆层操作通讯失败.')
        });

    $scope.changeJlrqSpray = function(date) {
        svc.getSprayParamsByDay(date).success(function(response){
            $scope.currentObject.CurrSprayParams.datas = response['data'] || [];

            $scope.currentSprayParam = {};      // 日期修改后，一切清空

            // 控制pannel的collapse状态
            angular.forEach($scope.currentObject.CurrSprayParams.datas,function(value,key){
                value.isCollapsed = true;
            });
        }).error(function(){
                console.log(' 获取 喷淋数据通讯错误。');
            });
    };

    // 保存当前正在编辑的数据
    $scope.saveItem = function() {

        if (!$scope.currentSprayParam.duicengInfo) { // 当前编辑form，没有选定的堆层
            console.log(' 当前编辑界面没有需要保存数据.');
            return;
        }

        // 某些数据项需要预处理  日期， select
        $scope.currentSprayParam.jlrq = $scope.currentObject.CurrSprayParams.jlrq;
        $scope.currentSprayParam.duicengID = $scope.currentSprayParam.duicengInfo.duicengID;
        $scope.currentSprayParam.duichangID = $scope.currentSprayParam.duicengInfo.duichangID;


        if (!$scope.currentSprayParam.jlrq || !$scope.currentSprayParam.duicengID) {
            console.log(' 当前编辑界面没有需要保存数据.');
            return;
        }


        // 需要检查spray Type 设置
        //duicengInfo
        $scope.currentSprayParam.refLayerInfo = $scope.currentSprayParam.duicengInfo;

        if ($scope.currentSprayParam.pid ) {    // 修改数据
            $scope.currentSprayParam.haveBeenModified = true;

        }
        else {                                  // 添加数据

            $scope.currentObject.CurrSprayParams.datas = $scope.currentObject.CurrSprayParams.datas || [];

            // 不存在，则添加
            if($.inArray($scope.currentSprayParam,$scope.currentObject.CurrSprayParams.datas) == -1){
                console.log('-----   save Item ------');
//                console.dir($scope.currentSprayParam);
                $scope.currentObject.CurrSprayParams.datas.push($scope.currentSprayParam);
            };

        }


        //
        $scope.currentSprayParam = {};

    };

    // 修改本日所有数据（dirty）
    $scope.saveSprayDatas = function() {

        // 当前编辑的数据，先进行保存处理
        $scope.saveItem();

        angular.forEach($scope.currentObject.CurrSprayParams.datas,function(value,key){
//            console.dir("======>DEBUG:");
//            console.dir(value);
            if (! value.pid || value.haveBeenModified == true) {  // Add or Update
                svc.saveSprayParam(value)
                .success(function(response){
                    console.log('------------- save spray param success --------------'+response['data'].pid);
                    value.pid = response['data'].pid;
                    value.haveBeenModified = false;
                    console.dir(value);
                })
                    .error(function() {
                        console.log('保存喷淋数据错误，通讯异常。');
                    });
            }
            else {                                          // Does not need to Update, Do Nothing.

            }
        });
    };

}]);

// 引入水
icdModule.controller('HeapInputWaterFormCtrl',['$scope','HeapLeachingProc',function($scope,svc){
    //$scope.pagePosition.subPageKey = $scope.pagePosition.subPageTitle = '引入水量';

    // 将本页Form的$dirty绑定到dataEditPages对象上
    $scope.$on('hechzhevent001',function(event,scopeid){

        if ( isChildOf($scope,scopeid) === true) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            $scope.$watch('HeapInputWaterForm.$dirty',function(){
                angular.forEach($scope.dataEditPages[$scope.pagePosition.pageKey].subPages, function(value,key){
                    if (value['title'] == $scope.pagePosition.subPageKey) {
                        value['dirty'] = $scope.HeapInputWaterForm.$dirty;
                    }
                });

            });
        }


    });

    // 数据保存的function 定义在上层Controller中，function执行成功后，将broadcast datasaved 事件，
    // 此处监听此事件，修改form $dirty状态
    $scope.$on('datasaved',function(){
        if ($scope.pagePosition.subPageKey == '引入水量') {
            $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey].formName.$dirty = false;
        }
    });

    // Reset
    $scope.resetData = function() {
        if ($scope.currentObject.CurrHeapInputWater.rdrq && $scope.currentObject.CurrHeapInputWater.rdrq != null) {
            $scope.changeJlrq($scope.currentObject.CurrHeapInputWater.rdrq);
        }
        else {
            $scope.currentObject.CurrHeapInputWater = {};
        }
    };


}]);

/*
因为要将form.$dirty绑定到scope属性中，为访问form，单独定义controller
 */
icdModule.controller('HeapInputOreFormCtrl',['$scope','HeapLeachingProc',function($scope,svc){
    console.log('-------------- in HeapInputOreFormCtrl -------------'+$scope.$id);

    //$scope.pagePosition.subPageKey = $scope.pagePosition.subPageTitle = '入堆矿石';

    $scope.getFormName = function(){
        console.log($scope.HeapInputOreForm.$name);
//        console.dir($scope);
    }
    // Bingding Form的Dirty状态, 上级Controller在 includeContentLoaded 事件后，会broadcast hechzhevent001 事件
    $scope.$on('hechzhevent001',function(event,scopeid){

        if ( isChildOf($scope,scopeid) === true) {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            $scope.$watch('HeapInputOreForm.$dirty',function(){
                angular.forEach($scope.dataEditPages[$scope.pagePosition.pageKey].subPages, function(value,key){
                    if (value['title'] == $scope.pagePosition.subPageKey) {
                        value['dirty'] = $scope.HeapInputOreForm.$dirty;
                    }
                });

            });
        }


    });

    // 数据保存的function 定义在上层Controller中，function执行成功后，将broadcast datasaved 事件，
    // 此处监听此事件，修改form $dirty状态
    $scope.$on('datasaved',function(){
        if ($scope.pagePosition.subPageKey == '入堆矿石') {
            $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey].formName.$dirty = false;
        }
    });

    // Reset
    $scope.resetData = function() {
        if ($scope.currentObject.CurrHeapInputOre.jlrq && $scope.currentObject.CurrHeapInputOre.jlrq != null) {
            $scope.changeJlrq($scope.currentObject.CurrHeapInputOre.jlrq);
        }
        else {
            $scope.currentObject.CurrHeapInputOre = {};
        }
    };


}]);

// 溶液池
icdModule.controller('HeapPoolFormCtrl',function($scope){

});

// 萃取一期
icdModule.controller('Ext1FormCtrl',function($scope){
    //$scope.currentObject.CurrExtractionOne.period = 1;
});

// 萃取二期
icdModule.controller('Ext2FormCtrl',function($scope){
    //$scope.currentObject.CurrExtractionTwo.period = 2;
});

// 电积工艺
icdModule.controller('ElectrowinFormCtrl',function($scope) {

});

// 萃取电积工艺Controller
icdModule.controller('EditSxewController',['$scope','$state','HeapLeachingProc', function($scope, $state,svc){
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    $scope.currentObject.CurrExtractionOne = {};
    $scope.currentObject.CurrExtractionOne['period'] = 1;

    $scope.currentObject.CurrExtractionTwo = {};
    $scope.currentObject.CurrExtractionTwo['period'] = 2;

    $scope.currentObject.CurrElectrowin = {};


    // 处理 电积工艺、萃取一期、萃取二期 日期选择修改动作——检查后台，是否数据已经存在
    $scope.jlrqChange = function(date, pageTitle) {
        var svcMethodName_jlrqchg = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_jlrqchg'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];

        console.log(' method :'+svcMethodName_jlrqchg + '\t current object:'+tgtObjName + '\tdate:'+$scope.currentObject[tgtObjName].jlrq);

        // 从服务器端获取新选定”入堆日期“的数据.
        svc[svcMethodName_jlrqchg]($scope.currentObject[tgtObjName].jlrq)
            .success(function(response){
                console.log("============= $http get success =============");
                if (response['retCode']==0) {
                    $scope.currentObject[tgtObjName] = response['data'];
                    console.log('---------- after $http get :'+$scope.currentObject[tgtObjName].jlrq);

                }
                else {        // 还没有本日数据
                    if ($scope.currentObject[tgtObjName].period) {
                        var tperiod = $scope.currentObject[tgtObjName].period;
                    }
                    $scope.currentObject[tgtObjName] = {};
                    $scope.currentObject[tgtObjName].jlrq = date;
                    if (tperiod) {
                        $scope.currentObject[tgtObjName].period = tperiod;
                    }
                }

            })
            .error(function(e){
                console.log("====== $http ERROR ============");
//                console.dir(e);
                $.growl('服务器通讯失败。');
            })
        ;
    };

    // 处理萃取电积工艺段，数据保存工作
    $scope.saveData = function (data) {
        console.log($scope.pagePosition.pageKey + '->' + $scope.pagePosition.subPageKey + ' save Data.');
//        console.dir(data);

        var svcMethodName_save = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_save'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];
        ;
        //hio.beginDate = new Date;
        //hio.endDate = new Date;
        svc[svcMethodName_save](data).success(function (response) {
            $scope.currentObject[tgtObjName] = response['data'];
            $scope.$broadcast('datasaved');
        })
            .error(function () {
                $.growl('保存' + $scope.pagePosition.subPageKey + '数据通讯错误。');
            });
    };
}]);

// 堆浸工段 Controller
icdModule.controller('EditHlpController',['$scope', 'HeapLeachingProc', '$state', function($scope,svc,$state){

    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    console.log('EditHlpController scope id:'+$scope.$id);

    //$scope.pagePosition.processName =  '堆浸工段';
    //$scope.pagePosition.pageKey = 'heapLeachingProc';

    // ng-include 内容装载完成后，发送event,反向通知
    $scope.$on('$includeContentLoaded',function(event){
        $scope.$broadcast('hechzhevent001',event.targetScope.$id);
    });

    // 入堆矿石量
    $scope.currentObject.CurrHeapInputOre = {};     // Form 中操作的入堆矿石量相关数据

    // 引入水
    $scope.currentObject.CurrHeapInputWater = {};

    // 喷淋指标
    $scope.currentObject.CurrSprayParams = {};      // 因为喷淋数据特殊（单日，多条数据），特别处理

    // 浸出指标
    $scope.currentObject.CurrLeachingParam = {};    // 每日  每堆 数据行  datas

    // 溶液池指标
    $scope.currentObject.CurrSolPoolParams = {};


    // 各子页面，选择”数据日期“后，调用
    $scope.changeJlrq = function(date) {
        console.log(" changeRdrq,pagePosition.subPageKey: "+$scope.pagePosition.subPageKey+ ' -->'+date);
        var svcMethodName_rdrqchg = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_rdrqchg'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];

        console.log(' method :'+svcMethodName_rdrqchg + '\t current object:'+tgtObjName + '\tdate:'+$scope.currentObject[tgtObjName].jlrq);

        // 从服务器端获取新选定”入堆日期“的数据.
        svc[svcMethodName_rdrqchg]($scope.currentObject[tgtObjName].jlrq)
            .success(function(response){
                console.log("============= $http get success =============");
                if (response['retCode']==0) {
                    $scope.currentObject[tgtObjName] = response['data'];
                    console.log('---------- after $http get :'+$scope.currentObject[tgtObjName].rdrq);

                }
                else {        // 还没有本日数据
                    $scope.currentObject[tgtObjName] = {};
                    $scope.currentObject[tgtObjName].jlrq = date;
                }

            })
            .error(function(e){
                console.log("====== $http ERROR ============");
//                console.dir(e);
                $.growl('服务器通讯失败。');
            })
        ;

    };

    // 保存数据
    $scope.saveData = function(data) {
        console.log($scope.pagePosition.pageKey + '->'+$scope.pagePosition.subPageKey + ' save Data.'+'\t pid:'+data.pid);

        var svcMethodName_save = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_save'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];;
        //hio.beginDate = new Date;
        //hio.endDate = new Date;
        svc[svcMethodName_save](data).success(function(response){
            $scope.currentObject[tgtObjName] = response['data'];
            $scope.$broadcast('datasaved');
        })
            .error(function(){
                $.growl('保存'+ $scope.pagePosition.subPageKey +'数据通讯错误。');
            });
    };

    $scope.getFormName = function(){
//        console.log('??????????????????????????????????????');
        console.log($scope.HeapInputOreForm.$name);
    }

}]);

// 环保中和-生产台账 Controller
icdModule.controller('NeutrolizationFormCtrl',function($scope){

});

// 环保中和工段
icdModule.controller('EditNeutroController',['$scope','$state','HeapLeachingProc',function($scope,$state,svc){
    // 检查是否登录
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    $scope.currentObject.CurrNeutroParam = {};

    // 各子页面，选择”数据日期“后，调用
    $scope.changeJlrq = function(date) {
        console.log(" changeRdrq,pagePosition.subPageKey: "+$scope.pagePosition.subPageKey+ ' -->'+date);
        var svcMethodName_jlrqchg = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_jlrqchg'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];

        console.log(' method :'+svcMethodName_jlrqchg + '\t current object:'+tgtObjName + '\tdate:'+$scope.currentObject[tgtObjName].jlrq);

        // 从服务器端获取新选定”入堆日期“的数据.
        svc[svcMethodName_jlrqchg]($scope.currentObject[tgtObjName].jlrq)
            .success(function(response){
                console.log("============= $http get success =============");
                if (response['retCode']==0) {
                    $scope.currentObject[tgtObjName] = response['data'];
                    console.log('---------- after $http get :'+$scope.currentObject[tgtObjName].rdrq);

                }
                else {        // 还没有本日数据
                    $scope.currentObject[tgtObjName] = {};
                    $scope.currentObject[tgtObjName].jlrq = date;
                }

            })
            .error(function(e){
                console.log("====== $http ERROR ============");
//                console.dir(e);
                $.growl('服务器通讯失败。');
            })
        ;

    };

    // 保存数据
    $scope.saveData = function(data) {
        console.log($scope.pagePosition.pageKey + '->'+$scope.pagePosition.subPageKey + ' save Data.');

        var svcMethodName_save = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['svcMethodName_save'];
        var tgtObjName = $scope.dataEditPages[$scope.pagePosition.pageKey].subPages[$scope.pagePosition.subPageKey]['tgtObjName'];;
        //hio.beginDate = new Date;
        //hio.endDate = new Date;
        svc[svcMethodName_save](data).success(function(response){
            $scope.currentObject[tgtObjName] = response['data'];
            $scope.$broadcast('datasaved');
        })
            .error(function(){
                $.growl('保存'+ $scope.pagePosition.subPageKey +'数据通讯错误。');
            });
    };
}]);

icdModule.controller('NeutroExcelUploadCtrl',['$scope','$timeout',function($scope,$timeout) {
    $scope.url = "HeapExcelUpload?ftype=neutro";
    $('#heapfileupload3').fileupload({
        url: $scope.url,
//        dataType: 'json',

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress3 .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').
        bind('fileuploadalways',function(e,data) {
//            console.dir(data);
            if (data.textStatus != 'success') {
                alert('excel导入失败：'+data.textStatus+'\t,请检查excel文件格式。');
            }
            else {
                alert('Excel 文件导入成功。');
            }
        });
}]);

icdModule.controller('SxewExcelUploadCtrl',['$scope','$timeout',function($scope,$timeout) {
    $scope.url = "HeapExcelUpload?ftype=extractelectrowin";
    $('#heapfileupload2').fileupload({
        url: $scope.url,
//        dataType: 'json',

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress2 .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').
        bind('fileuploadalways',function(e,data) {
//            console.dir(data);
            if (data.textStatus != 'success') {
                alert('excel导入失败：'+data.textStatus+'\t,请检查excel文件格式。');
            }
            else {
                alert('Excel 文件导入成功。');
            }
        });
}]);

icdModule.controller('HeapExcelUploadCtrl',['$scope','$timeout',function($scope,$timeout) {
    $scope.url = "HeapExcelUpload?ftype=heap";
    $('#heapfileupload').fileupload({
        url: $scope.url,
//        dataType: 'json',

        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled').
        bind('fileuploadalways',function(e,data) {
//            console.dir(data);
            if (data.textStatus != 'success') {
                alert('excel导入失败：'+data.textStatus+'\t,请检查excel文件格式。');
            }
        });
}]);

// Edit Controller        | 数据编辑
icdModule.controller('EditController',['$scope','$state','$timeout',function($scope,$state,$timeout){
    // 检查是否登录
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    console.log('EditController scope id:'+$scope.$id);

    $scope.pagePosition = {};           // 用于保存 scope 对应的page(child controller将会在其中存取数据)

    // 是否允许多个Accordian同时打开
    $scope.oneAtATime = true;

    // 当前正在操作的对象
    $scope.currentObject = {};

    // Edit 页面当前打开的Accordian
    $scope.currAccordian = {};

    // 左边栏 accordian中的点击、选择
    // 通过修改 Model， 触发View的变换
    $scope.subPageClick = function($event,pages,page) {

        angular.forEach(pages,function(value,key){
             value.active=false;
        });

        page.active=true;
    };


    // 右边 主编辑区域 tab 选择，检查是否有未保存数据.
    // TODO: 待完成form后实现
    $scope.tabSelect = function(subPage) {
        console.log(' tabSelect , '+subPage.title);
        $scope.pagePosition.subPageKey = subPage['title'];

    };

    $scope.tabDeselect = function(subPage) {
        console.log('deselect....');
//        console.dir(subPage);
        if (subPage.dirty ) {
            if (confirm('当前页面数据已经修改，真的不管了？')) {
                subPage.dirty = false;
            }
            else {  // 不切换tab了
                $timeout(function(){
                    angular.forEach($scope.dataEditPages[$scope.pagePosition.pageKey].subPages,function(value,key){
                        console.log(' 关闭active状态：'+value.title);
                        value.active = false;
                    });
                    subPage.active = true;
                });


            }
        }
    };

    $scope.DEBUG = function() {
//        console.dir($scope.dataEditPages);

    }

    // 用于控制TabSet
    $scope.dataEditPages = {
        heapLeachingProc:
        {
            processName: '堆浸工段',
            subPages: {
                "入堆矿石":{
                    title:"入堆矿石",
                    active:false,
                    disable:false,
                    templateUrl:'edit-hlp-input-form.html',
                    formName: 'HeapInputOreForm',
                    dirty: false ,
                    svcMethodName_rdrqchg: 'getInputOreByDay',
                    tgtObjName: 'CurrHeapInputOre',
                    svcMethodName_save: 'saveInputOre'
                },
                "引入水量":{
                    title:"引入水量",
                        active:false,
                    disable:false,
                    templateUrl:'edit-HeapInputWaterForm.html' ,
                    formName: 'HeapInputWaterForm',
                    dirty: false ,
                    svcMethodName_rdrqchg: 'getInputWaterByDay',
                    tgtObjName: 'CurrHeapInputWater',
                    svcMethodName_save: 'saveInputWater'
                },
                "喷淋指标":{
                    title:"喷淋指标",
                        active:false,
                    disable:false,
                    templateUrl:'edit-hlp-spray.html',
                    formName: 'HeapSprayForm',
                    dirty: false ,
                    svcMethodName_rdrqchg: 'getSprayParamsByDay',
                    tgtObjName: 'CurrSprayParams',
                    svcMethodName_save: 'saveSprayParams'
                },
                "溶液池指标":{
                    title:"溶液池指标",
                    active:false,
                    disable:false,
                    templateUrl:'edit-hlp-pool.html',
                    formName: 'HeapPoolForm',
                    dirty: false ,
                    svcMethodName_rdrqchg: 'getSolPoolParamByDay',
                    tgtObjName: 'CurrSolPoolParams',
                    svcMethodName_save: 'saveSolPoolParams'
                },
                "浸出指标":{
                    title:"浸出指标",
                        active:false,
                    disable:false,
                    templateUrl:'edit-hlp-leaching.html',
                    formName: '',                         // not use
                    dirty: false,
                    svcMethodName_rdrqchg: '',            // not use
                    tgtObjName: '',                       // not use
                    svcMethodName_save: ''                // not use
                }
            }

        },
        sxewProc:
        {
            processName: '萃取电积工段',
            subPages: {
                "萃取一期":{
                    title:"萃取一期",
                        active:false,
                    disable:false,
                    templateUrl:'edit-sxew-ext1.html',
                    formName: 'ext1Form',
                    dirty: false,
                    svcMethodName_jlrqchg: 'getExtracParam1ByDay',
                    tgtObjName:'CurrExtractionOne',
                    svcMethodName_save:'saveExtracParam'
                },
                "萃取二期":{
                    title:"萃取二期",
                        active:false,
                    disable:false,
                    templateUrl:'edit-sxew-ext2.html',
                    formName: 'ext2Form',
                    dirty: false,
                    svcMethodName_jlrqchg: 'getExtracParam2ByDay',
                    tgtObjName:'CurrExtractionTwo',
                    svcMethodName_save:'saveExtracParam'
                },
                "电积工艺":{
                    title:"电积工艺",
                        active:false,
                    disable:false,
                    templateUrl:'edit-sxew-ew.html',
                    formName: 'ElectrowinForm',
                    dirty: false,
                    svcMethodName_jlrqchg: 'getElectrowDataByDay',
                    tgtObjName:'CurrElectrowin',
                    svcMethodName_save:'saveElectroParam'
                }
            }


        },
        neutrolizationProc:
        {
            processName: "环保中和工段",
            subPages: {
                "生产台账":{
                    title:"生产台账",
                        active:false,
                    disable:false,
                    templateUrl:'edit-m-account.html',
                    formName: 'NeutrolizationForm',
                    dirty: false,
                    svcMethodName_jlrqchg: 'getNeutroDataByDay',
                    tgtObjName:'CurrNeutroParam',
                    svcMethodName_save:'saveNeutroParam'
                }
            }

        },
        other:
        {
            processName: '其他数据',
            subPages: {
                '堆场铜盘点':{
                    title:'堆场铜盘点',
                        active:false,
                    disable:false,
                    templateUrl:'',
                    formName: 'HeapsCuForm',
                    dirty: false
                }
            }

        }
    };


    // 初始化 Edit 页面 各Accordian的打开状态
    $scope.currAccordian.heapLeachingProc = false;             // 堆浸工段
    $scope.currAccordian.sxewProc = false;           // 萃取电积工段
    $scope.currAccordian.neutrolizationProc = false;            // 环保中和工段
    $scope.currAccordian.other = false;             // 其他数据录入、编辑


    // Accordian 发生改变后， 改变state 触发页面变化
    $scope.$watch('currAccordian',function(newValue,oldValue,scope){
//            console.log('  accordion changed.');

        if (newValue.heapLeachingProc == true) {
            $state.go('edit.hlp');
            $scope.pagePosition.pageKey = 'heapLeachingProc';

        }
        else if (newValue.sxewProc == true) {
            $state.go('edit.sxew');
            $scope.pagePosition.pageKey = 'sxewProc';
        }
        else if (newValue.neutrolizationProc == true) {
            $state.go('edit.neutrolization');
            $scope.pagePosition.pageKey = 'neutrolizationProc';
        }
        else if (newValue.other == true) {
            $state.go('edit.other');
            $scope.pagePosition.pageKey = 'other';
        }

    },true);
}]);
// Edit Controller End.

// Favorite Links Controller
icdModule.controller('ConfigFavLinkCtrl',['$scope','$state','linkSvc','$rootScope',function($scope,$state,linkSvc,$rootScope) {
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }

    $scope.editLink = {};


    linkSvc.getAllLinks().success(function(response) {
        $rootScope.allLinks = response['data'];
    }).error(function(){
            $.growl('查询常用链接数据失败，服务器通讯异常.');
        });

    $scope.selectLink = function(link) {
        $scope.editLink = link;
    };

    $scope.deleteLink = function(idx,pid) {
        linkSvc.removeLink(pid).success(function(response) {
            $rootScope.allLinks.splice(idx,1);
        }).error(function(){
                $.growl('删除失败,服务器通讯异常。');
            });
    };

    $scope.addNewLink = function() {
        $scope.editLink = {};

    };

    $scope.saveLink = function() {
        if ($scope.editLink.pid) {  // update
            linkSvc.updateLink($scope.editLink).success(function(response) {
                $scope.editLink = response['data'];
            });
        }
        else {
            linkSvc.addLink($scope.editLink).success(function(response) {
                $scope.editLink = response['data'];
                $rootScope.allLinks.push($scope.editLink);
            });

        }
    }
}]);
// Favorite Links Controller

// Config Controller
icdModule.controller('ConfigController',['$scope','$state','userUtil','HeapSvc','$modal','$log',
    function($scope,$state,userUtil,HeapSvc,$modal,$log){

        if (! $scope.headShowSwitch.login) {
            $.growl('请先正确登陆系统，再进行操作。');
            $state.go('home');
            return;
        }
        $scope.$on('duichangselect',function(event,treeID,selectedNode) {
            console.log(' Select Node 堆场名称:'+selectedNode.duichangName);
            $scope.currentObject.selectedTgt = selectedNode;
        });

//        console.log("amcharts ready?"+$scope.amchartsReady);
//
        // 是否允许多个Accordian同时打开
        $scope.oneAtATime = true;

        // 用户列表
        userUtil.query().success(function(response) {
            console.log('-------- User List Get OK --------');
//            console.dir(response['data']);
            $scope.managedUsers = response['data'];
        }).error(function(){
            console.log('-------------- ERROR --------------');
        });

        // 堆场列表
        HeapSvc.query().success(function(response){
            //console.log('---------- Duichang List Get OK ---------');
            $scope.managedTargets = response['data'];
        }).error(function(){
                console.log('------------------- ERROR2 -----------------');
            });


        // 获取当前可进行管理操作的目标对象列表
//        ManagedTargets.then(function(result){
//            $scope.managedTargets = result;
//        })

        $scope.currentObject = {};

        // 当前正在操作（选定）的用户
        $scope.currentObject.selectedMgrUser = {};

        // 当前正在操作（选定）的目标系统
        $scope.currentObject.selectedTgt = {};

        // 目标对象选定操作Handler
        $scope.selectTarget = function(idx) {
            console.log(' selectTarget event handler...');
            $scope.currentObject.selectedIdxTgt = idx;
            $scope.currentObject.selectedTgt = $scope.managedTargets[idx];

        }


        // config 页面当前打开的Accordian
        $scope.currAccordian = {};


        // 初始化 Config 页面 各Accordian的打开状态
        $scope.currAccordian.isUserAdmin = true;             // User Config Accordian
        $scope.currAccordian.isTargetAdmin = false;           // Target Config Accordian
        $scope.currAccordian.isDownloadAdmin = false;            // 下载
        $scope.currAccordian.isFavLinkAdmin = false;             // Rems Config Accordian




        // rems-target fsm end.


       $scope.addUser = function() {
           $scope.currentObject.selectedMgrUser = {};
           $("#uname").focus();
       }

        $scope.deleteUser = function() {
           userUtil.delete({"userid":$scope.currentObject.selectedMgrUser.userid})
               .success(function(response){

                   angular.forEach($scope.managedUsers,function(value, key){
                       console.log(" Iteration: key->"+key+"\t value->"+value);
                       console.log(value.userid+"\t"+value.userName);
                       if ($scope.currentObject.selectedMgrUser.userid === value.userid) {
                           console.log("\t Iteration: key->"+key+"\t value->"+value);
                           $scope.managedUsers.splice(key,1);
                       }
                   });
               $scope.currentObject.selectedMgrUser = {};


           }).error(function(){
               $.growl(' 调用服务异常，请联系软件支持人员.');
               console.log(' -----> delete user error.');
           });
        }

        $scope.saveUser = function() {
            userUtil.save($scope.currentObject.selectedMgrUser).success(function(data){
//               console.dir(data);
                if (isNaN($scope.currentObject.selectedMgrUser.userid)) {
                    // Add
                    $scope.currentObject.selectedMgrUser = data['data'];
                    $scope.managedUsers.push(data['data']);

                }

            })
                .error(function(data,status){

                });
        }


        // 用户选定操作Handler
        $scope.selectUser = function(idx) {

            console.log(' selectUser event Handler...');

            console.log(">>"+$state.$current+' --- '+$scope.currentObject.selectedMgrUser.userid+'--'+$scope.managedUsers[idx].userid);
            if ($state.$current == 'config.privs' && !($scope.currentObject.selectedMgrUser.userid == $scope.managedUsers[idx].userid)) {
                console.log('-------------- in privs page, we change the user ...');
                $scope.currentObject.selectedIdxUser = idx;
                $scope.currentObject.selectedMgrUser = $scope.managedUsers[idx];
                $scope.currentObject.selectedMgrUser['loginPasswd2'] = $scope.currentObject.selectedMgrUser.loginPasswd;

            }
            else {
                $scope.currentObject.selectedIdxUser = idx;
                $scope.currentObject.selectedMgrUser = $scope.managedUsers[idx];
                $scope.currentObject.selectedMgrUser['loginPasswd2'] = $scope.currentObject.selectedMgrUser.loginPasswd;
            }



            //console.dir($scope.selectedMgrUser);

            //console.log($scope.managedUsers.get(idx).userName);
        }




        // Accordian Click Event Handler
        $scope.accClick = function(event) {
//           console.dir(event);

        }



        // Accordian 发生改变后， 改变state 触发页面变化
        $scope.$watch('currAccordian',function(newValue,oldValue,scope){
//            console.log('  accordion changed.');
            if (newValue.isUserAdmin == true) {
                $state.go('config.user');
            }
            else if (newValue.isTargetAdmin == true) {
                $state.go('config.target');
            }
            else if (newValue.isDownloadAdmin == true) {
//                $state.go('config.downloads');
            }
            else {
                $state.go('config.favlinks');
            }
//            else if (newValue.isRemsAdmin == true) {
//                $state.go('config.rems');
//            }

        },true);


        /*
         用户相关 gpe-user.html

         */


        /*
         gpe-user.html End.
         */

    }]);


// 显示浸出明细Modal窗口的Controller
icdModule.controller('ldModalInstanceCtrl',['$scope','$modalInstance','leachings',function($scope,$modalInstance, leachings) {
    console.log('------------- ldModalInstanceCtrl ------------');
//    console.dir(leachings);
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };

    // 直接使用leachings，不能正常显示
    $scope.arrs = leachings;
}]);
/*var ldModalInstanceCtrl = function($scope,$modalInstance, leachings) {
    console.log('------------- ldModalInstanceCtrl ------------');
//    console.dir(leachings);
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };

    // 直接使用leachings，不能正常显示
    $scope.arrs = leachings;
};*/

// 显示溶液池参数Modal窗口的Controller
icdModule.controller('spModalInstanceCtrl',['$scope','$modalInstance','poolParams',function($scope,$modalInstance, poolParams) {
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };


    $scope.param = poolParams;
}]);
/*var spModalInstanceCtrl = function($scope,$modalInstance, poolParams) {
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };


    $scope.param = poolParams;
};*/

// 显示萃取参数Modal窗口的Controller
icdModule.controller('extrModalInstanceCtrl',['$scope','$modalInstance','extractParams',function($scope,$modalInstance, extractParams) {
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };
    $scope.arrs = extractParams;
}]);
/*var extrModalInstanceCtrl = function($scope,$modalInstance, extractParams) {
    $scope.ok = function () {
        console.log(' ----- modal exit ------');
        $modalInstance.close();
    };
    $scope.arrs = extractParams;
}*/

// 工艺流程部分， 堆浸工艺
icdModule.controller('DashHeapController',['$scope','$state','dashboardSvc','$rootScope','$filter',
    function($scope,$state,dashboardSvc,$rootScope,$filter){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    $scope.dataOK = false;

    $scope.filteredHeaps = function() {
        return _.filter($scope.availHeaps,function(heap){
//            console.log(' logicDuichangID:'+heap.logicDuichangID);
            if (!heap.logicDuichangID || heap.logicDuichangID == '' || heap.logicDuichangID == 0) {
                return true;
            }
            return false;
        });
    };

    $scope.chartDraw = function(heap) {
        if (!$scope.relatedHeapData) {
            return;
        }

        var data = $scope.relatedHeapData.migratedData(heap);
        var minPeriod = "";
        var dataDateFormat = "YYYY-MM-DD";
        if ($scope.timeDimension.radioModel == 'Day'){
            dataDateFormat = "YYYY-MM-DD";
            minPeriod = 'DD';
        }
        else if($scope.timeDimension.radioModel == 'Month') {
            dataDateFormat = "YYYY-MM";
            minPeriod = 'MM';
        }
        else if ($scope.timeDimension.radioModel == 'Year') {
            dataDateFormat = "YYYY";
            minPeriod = 'YYYY';
        }

        //PH
        if ($scope.chartCaches['heap-ph-'+heap.duichangID]) {
            $scope.chartCaches['heap-ph-'+heap.duichangID].dataProvider = data;
            $scope.chartCaches['heap-ph-'+heap.duichangID].validateData();
        }
        else {
            var phChart = easyLineChart(data,{
                items:[
                    {
                        unit:'ph',
                        prop:'sprayph',
                        title:'喷淋液PH'
                    },
                    {
                        unit:'ph',
                        prop:'leachph',
                        title:'浸出液PH'
                    }
                ],
                category: {
                    prop: 'jlrq',
                    parseDates: true,
                    'minPeriod': minPeriod,
                    'dataDateFormat': dataDateFormat
                },
                container: 'heap-ph-'+heap.duichangID,
                refresh: true
            });
            $scope.chartCaches['heap-ph-'+heap.duichangID] = phChart;
        }
        console.log('-------- PH OK --------');
        // 酸浓度
        easyLineChart(data,{
            items:[
                {
                    unit:'g/L',
                    prop:'spraysld',
                    title:'喷淋液酸浓度'
                },
                {
                    unit:'g/L',
                    prop:'leachsld',
                    title:'浸出液酸浓度'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-sld-'+heap.duichangID,
            refresh: true
        });
        // 电位
        easyLineChart(data,{
            items:[
                {
                    unit:'mV',
                    prop:'sprayeh',
                    title:'喷淋液电位'
                },
                {
                    unit:'mV',
                    prop:'leacheh',
                    title:'浸出液电位'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-eh-'+heap.duichangID,
            refresh: true
        });
        // 铜离子浓度对比
        easyLineChart(data,{
            items:[
                {
                    unit:'g/L',
                    prop:'spraycu',
                    title:'喷淋液Cu2+'
                },
                {
                    unit:'g/L',
                    prop:'leachcu',
                    title:'浸出液Cu2+'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-cund-'+heap.duichangID,
            refresh: true
        });
        // 铁离子浓度对比
        easyLineChart(data,{
            items:[
                {
                    unit:'g/L',
                    prop:'sprayfe',
                    title:'喷淋液Tfe'
                },
                {
                    unit:'g/L',
                    prop:'leachfe',
                    title:'浸出液Tfe'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-fend-'+heap.duichangID,
            refresh: true
        });
        // 溶液量对比
        easyLineChart(data,{
            items:[
                {
                    unit:'M3',
                    prop:'sprayryQty' +
                        '',
                    title:'喷淋液溶液'
                },
                {
                    unit:'M3',
                    prop:'leachryQty',
                    title:'浸出液溶液'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-ryqty-'+heap.duichangID,
            refresh: true
        });
        // 浸出铜
        easyLineChart(data,{
            items:[

                {
                    unit:'Kg',
                    prop:'leachcuqty',
                    title:'浸出铜'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'heap-cuqty-'+heap.duichangID,
            refresh: true
        });
    }


        // 切换堆场
    $scope.tabSelect = function(heap) {
        console.log('tabSelect :'+heap.duichangName);
        angular.forEach($rootScope.availHeaps,function(value,key){
            value.active = false;
        });
        heap.active = true;
        if ($scope.relatedHeapData && $scope.relatedHeapData.migratedData) {
            $scope.chartDraw(heap);
        }


        //$scope.selectedHeap = heap;
    };

    $scope.chartCaches = {};

    // Chart
    /*
     chartDef = {
     items: [{
     'unit': '单位',
     'prop': '属性名称',
     'title': '标题'
     }...],
     category: {
     'prop': '用于x轴的属性',
     'parseDates': true|false,
     'minPeriod': DD|MM|YYYY,
     'dataDateFormat','YYYY-MM-DD'
     },
     container: 'div id',
     refresh: true|false         // refresh chart?
     }

     */



    // Chart End.

    var fn = {
        migratedData: function(heap) {
            var leach = this.showLeachData(heap);
            var spray = this.showSprayData(heap);
//            console.dir(leach);
            console.dir(spray);
            var arrs = [];
            angular.forEach(spray,function(value,key){
                var item = {};
                item.jlrq = value.jlrq;
                item.sprayph = value.ph;
                item.sprayfe = value.fe;
                item.spraysld = value.sld;
                item.spraycu = value.cu;
                item.sprayeh = value.eh;
                item.sprayryQty = value.ryQty;
                var leachItem = _.findWhere(leach,{
                    'jlrq':value.jlrq
                });
                if (leachItem) {
                    item.leachph = leachItem.ph;
                    item.leachfe = leachItem.fe;
                    item.leachsld = leachItem.sld;
                    item.leachcu = leachItem.cu;
                    item.leacheh = leachItem.eh;
                    item.leachryQty = leachItem.ryQty;
                    item.leachcuqty = leachItem.cuqty;
                }
                else {
//                    console.log(' date '+value.jlrq+', cannog find 浸出对应数据.');
                    item.leachph = 0;
                    item.leachfe = 0;
                    item.leachsld = 0;
                    item.leachcu = 0;
                    item.leacheh = 0;
                    item.leachryQty = 0;
                    item.leachcuqty = 0;
                }
                arrs.push(item);
            });
//            console.dir(arrs);
            return arrs;
        },
        showLeachData: function(heap){                          // 用于chart显示的浸出数据
            if ($scope.timeDimension.radioModel == 'Day') {         // Day Level Data
                var arrs = [];

                angular.forEach(_.where(this.leachingOuts,{'duichangID': heap.duichangID}),function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = value.jlrq;             // monthly
                    itemObj.ph = value.jcph;                 // PH
                    itemObj.fe = value.jctfend;                 // 铁浓度
                    itemObj.sld = value.jcsld;                // 酸浓度
                    itemObj.cu = value.jccund;                 // 铜浓度
                    itemObj.eh = value.jceh;                 // 电位
                    itemObj.ryQty = value.jcryQty;              // 溶液量
                    itemObj.cuqty = value.jccu;
                    itemObj.duichangID = heap.duichangID;

                    arrs.push(itemObj);

                });
//                console.log(' showLeachData, dimension: Day ,duichangID:'+heap.duichangID);
//                console.dir(arrs);
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });

            }
            else if($scope.timeDimension.radioModel == 'Month') {  // Month Level Data
                var groupedData = _.groupBy(_.where(this.leachingOuts,{
                    'duichangID':heap.duichangID
                }), function(element){
                    return $filter('date')(element.jlrq, 'yyyy-MM'); //element.jlrq.getFullYear()+'-'+element.jlrq.getMonth();
                });

                var arrs = [];
                angular.forEach(groupedData,function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = key;             // monthly
                    itemObj.ph = 0;                 // PH
                    itemObj.fe = 0;                 // 铁浓度
                    itemObj.sld = 0;                // 酸浓度
                    itemObj.cu = 0;                 // 铜浓度
                    itemObj.eh = 0;                 // 电位
                    itemObj.ryQty = 0;              // 液量
                    itemObj.cuqty = 0;              // 浸出铜

                    itemObj.ryQty =  _.reduce(value,function(memo,e){
                        return memo + e.jcryQty;
                    },0);
                    itemObj.ph = _.reduce(value,function(memo,e){
                        return memo + e.jcph * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.ph = itemObj.ph/value.length;
                    itemObj.fe = _.reduce(value,function(memo,e){
                        return memo + e.jctfend * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.fe = itemObj.fe/value.length;
                    itemObj.sld = _.reduce(value,function(memo,e){
                        return memo + e.jcsld * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.sld /= value.length;
                    itemObj.cu = _.reduce(value,function(memo,e){
                        return memo + e.jccund * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.cu /= value.length;
                    itemObj.eh = _.reduce(value,function(memo,e){
                        return memo + e.jceh * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.eh /= value.length;

                    itemObj.cuqty = _.reduce(value,function(memo,e){
                        return memo + e.jccu;
                    },0);

                    arrs.push(itemObj);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else if($scope.timeDimension.radioModel == 'Year') {
                var groupedData = _.groupBy(_.where(this.leachingOuts,{
                    'duichangID':heap.duichangID
                }), function(element){
                    return element.jlrq.getFullYear();
                });

                var arrs = [];
                angular.forEach(groupedData,function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = key;             // monthly
                    itemObj.ph = 0;                 // PH
                    itemObj.fe = 0;                 // 铁浓度
                    itemObj.sld = 0;                // 酸浓度
                    itemObj.cu = 0;                 // 铜浓度
                    itemObj.eh = 0;                 // 电位
                    itemObj.ryQty = 0;              // 液量
                    itemObj.cuqty = 0;              // 浸出铜

                    itemObj.ryQty =  _.reduce(value,function(memo,e){
                        return memo + e.jcryQty;
                    },0);
                    itemObj.ph = _.reduce(value,function(memo,e){
                        return memo + e.jcph * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.ph = itemObj.ph/value.length;
                    itemObj.fe = _.reduce(value,function(memo,e){
                        return memo + e.jctfend * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.fe = itemObj.fe/value.length;
                    itemObj.sld = _.reduce(value,function(memo,e){
                        return memo + e.jcsld * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.sld /= value.length;
                    itemObj.cu = _.reduce(value,function(memo,e){
                        return memo + e.jccund * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.cu /= value.length;
                    itemObj.eh = _.reduce(value,function(memo,e){
                        return memo + e.jceh * e.jcryQty / itemObj.ryQty;
                    },0);
//                    itemObj.eh /= value.length;

                    itemObj.cuqty = _.reduce(value,function(memo,e){
                        return memo + e.jccu;
                    },0);

                    arrs.push(itemObj);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else {
                console.log('Time Dimension Only Support Day|Month|Year');
            }
        },
        showSprayData: function(heap) {                         // 用于chart显示的喷淋数据
            if ($scope.timeDimension.radioModel == 'Day') {         // Day Level Data
                var arrs = [];

                // 目前的数据结构，每一个堆场，同一天都会有两种类型的喷淋数据: 硐坑水、喷淋液
                //
                var groupedData = _.groupBy(_.where(this.sprayParams,{
                    'duichangID':heap.duichangID
                }),function(element) {
                    return $filter('date')(element.jlrq,'yyyy-MM-dd');
                });
                angular.forEach(groupedData,function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = key;             // monthly
                    itemObj.ph = 0;                 // 喷淋液PH
                    itemObj.fe = 0;                 // 喷淋液铁浓度
                    itemObj.sld = 0;                // 喷淋液酸浓度
                    itemObj.cu = 0;                 // 喷淋液铜浓度
                    itemObj.eh = 0;                 // 喷淋液电位
                    itemObj.ryQty = 0;              // 喷淋溶液量

                    itemObj.ryQty =  _.reduce(value,function(memo,e){
                        return memo + e.sprayQty;
                    },0);

                    itemObj.ph = _.reduce(value,function(memo,e){
                        return memo + e.ph * e.sprayQty / itemObj.ryQty;
                    },0);

                    itemObj.fe = _.reduce(value,function(memo,e){
                        return memo + e.tfend * e.sprayQty / itemObj.ryQty;
                    },0);
//                    itemObj.fe = itemObj.fe/value.length;
                    itemObj.sld = _.reduce(value,function(memo,e){
                        return memo + e.sld * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.sld /= value.length;
                    itemObj.cu = _.reduce(value,function(memo,e){
                        return memo + e.cu2nd * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.cu /= value.length;
                    itemObj.eh = _.reduce(value,function(memo,e){
                        return memo + e.eh * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.eh /= value.length;


                    arrs.push(itemObj);
                });
                // 将日期字符串转换回Date
                angular.forEach(arrs,function(value,key) {
                    if (!_.isDate(value.jlrq))
                        value.jlrq = new Date(Date.parse(value.jlrq));
                });

                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });

                /*angular.forEach(_.where(this.sprayParams,{'duichangID': heap.duichangID}),function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = value.jlrq;             // monthly
                    itemObj.ph = value.ph;                 // 喷淋液PH
                    itemObj.fe = value.tfend;                 // 喷淋液铁浓度
                    itemObj.sld = value.sld;                // 喷淋液酸浓度
                    itemObj.cu = value.cu2nd;                 // 喷淋液铜浓度
                    itemObj.eh = value.eh;                 // 喷淋液电位
                    itemObj.ryQty = value.sprayQty;              // 喷淋溶液量

                    arrs.push(itemObj);

                });

                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });*/

            }
            else if ($scope.timeDimension.radioModel == 'Month') {  // Month Level Data
                var groupedData = _.groupBy(_.where(this.sprayParams,{
                    'duichangID':heap.duichangID
                }), function(element){
                    return $filter('date')(element.jlrq, 'yyyy-MM');
                    //return element.jlrq.getFullYear()+'-'+element.jlrq.getMonth();
                });

                var arrs = [];
                angular.forEach(groupedData,function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = key;             // monthly
                    itemObj.ph = 0;                 // 喷淋液PH
                    itemObj.fe = 0;                 // 喷淋液铁浓度
                    itemObj.sld = 0;                // 喷淋液酸浓度
                    itemObj.cu = 0;                 // 喷淋液铜浓度
                    itemObj.eh = 0;                 // 喷淋液电位
                    itemObj.ryQty = 0;              // 喷淋溶液量

                    itemObj.ryQty =  _.reduce(value,function(memo,e){
                        return memo + e.sprayQty;
                    },0);

                    itemObj.ph = _.reduce(value,function(memo,e){
                        return memo + e.ph * e.sprayQty / itemObj.ryQty;
                    },0);

                    itemObj.fe = _.reduce(value,function(memo,e){
                        return memo + e.tfend * e.sprayQty / itemObj.ryQty;
                    },0);
//                    itemObj.fe = itemObj.fe/value.length;
                    itemObj.sld = _.reduce(value,function(memo,e){
                        return memo + e.sld * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.sld /= value.length;
                    itemObj.cu = _.reduce(value,function(memo,e){
                        return memo + e.cu2nd * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.cu /= value.length;
                    itemObj.eh = _.reduce(value,function(memo,e){
                        return memo + e.eh * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.eh /= value.length;

                    arrs.push(itemObj);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Year') {   // Year Level Data
                var groupedData = _.groupBy(_.where(this.sprayParams,{
                    'duichangID':heap.duichangID
                }), function(element){
                    return element.jlrq.getFullYear();
                });

                var arrs = [];
                angular.forEach(groupedData,function(value,key){
                    var itemObj = {};
                    itemObj.jlrq = key;             // monthly
                    itemObj.ph = 0;                 // 喷淋液PH
                    itemObj.fe = 0;                 // ??????
                    itemObj.sld = 0;                // ??????
                    itemObj.cu = 0;                 // ??????
                    itemObj.eh = 0;                 // ?????
                    itemObj.ryQty = 0;              // ?????

                    itemObj.ryQty =  _.reduce(value,function(memo,e){
                        return memo + e.sprayQty;
                    },0);

                    itemObj.ph = _.reduce(value,function(memo,e){
                        return memo + e.ph * e.sprayQty / itemObj.ryQty;
                    },0);

                    itemObj.fe = _.reduce(value,function(memo,e){
                        return memo + e.tfend * e.sprayQty / itemObj.ryQty;
                    },0);
//                    itemObj.fe = itemObj.fe/value.length;
                    itemObj.sld = _.reduce(value,function(memo,e){
                        return memo + e.sld * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.sld /= value.length;
                    itemObj.cu = _.reduce(value,function(memo,e){
                        return memo + e.cu2nd * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.cu /= value.length;
                    itemObj.eh = _.reduce(value,function(memo,e){
                        return memo + e.eh * e.sprayQty / itemObj.ryQty;;
                    },0);
//                    itemObj.eh /= value.length;

                    arrs.push(itemObj);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else {
                return {};
            }
        }
    };

    $scope.timeDimension = {};
    $scope.timeDimension.radioModel = 'Day';

    // 获取数据
    dashboardSvc.getDashHeapAboutData()
        .success(function(response) {
            console.log('-------- getHeapAboutAllData success ---------');
            $scope.relatedHeapData = response['data'];
            for (key in fn) {
                $scope.relatedHeapData[key] = fn[key];

            }
            $scope.dataOK = true;
        })
        .error(function(){
            $.growl(' 获取堆浸工艺更多数据失败，服务器端通讯异常。');
        });


}]);

// 生产工艺-堆浸Controller  (原来用于显示示意图部分堆浸工段，现修改为历史数据查询堆浸工段）
icdModule.controller('HistoryHeapCtrl',['$scope','$state','dashboardSvc','$rootScope',function($scope,$state,dashboardSvc,$rootScope){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    if (!$scope.jlrq || $scope.jlrq == undefined) {
        $scope.jlrq = new Date();
    }

    $scope.relatedHeapData = {};

    $scope.doCompute = function(newValue,oldValue,scope) {
        console.log('    doCompute  ================');
        console.dir($scope.relatedHeapData);
        if ($scope.relatedHeapData.orderedPoolParamData && $scope.relatedHeapData.orderedInputWaterData) {
            console.log(' --  in $watch function doCompute --');
            $scope.viewModel.selectedHeapLeachDataVM[$scope.heap] = $scope.relatedHeapData.selectedHeapLeachData($scope.heap);
            $scope.viewModel.orderedPoolParamDataVM = $scope.relatedHeapData.orderedPoolParamData();
            $scope.viewModel.orderedInputWaterDataVM = $scope.relatedHeapData.orderedInputWaterData();
            $scope.viewModel.orderedInputOreDataVM = $scope.relatedHeapData.orderedInputOreData();
            $scope.viewModel.selectedHeapSprayPenlinyeVM[$scope.heap] = $scope.relatedHeapData.selectedHeapSprayPenlinye($scope.heap);
            $scope.viewModel.selectedHeapSprayDongkengshuiVM[$scope.heap] = $scope.relatedHeapData.selectedHeapSprayDongkengshui($scope.heap);
        }
        else {
            $.growl(' 数据还未装载结束，请重试');
        }
    };

    $scope.chartOrGrid = 'grid';
    // 是否允许多个Accordian同时打开
    $scope.oneAtATime = true;

    // 数据修改，更新所有chart
    $scope.validateAllChart = function(){
        var key;
        // 喷淋
        for (key in $scope.sprayHistChart) {
            //console.log('---------->> sprayHistChart memory :'+key + '\t instance of'+ typeof $scope.sprayHistChart[key]);
            $scope.sprayHistChart[key].dataProvider = $scope.viewModel.selectedHeapSprayDataVM[key];
            $scope.sprayHistChart[key].validateData();
            $scope.sprayHistChart[key].invalidateSize();
        }

        for (key in $scope.inputOreHistChart) {
            $scope.inputOreHistChart[key].dataProvider = $scope.viewModel.orderedInputOreDataVM;
            $scope.inputOreHistChart[key].validateData();
            $scope.inputOreHistChart[key].invalidateSize();
        }

        for (key in $scope.inputWaterHistChart) {
            $scope.inputWaterHistChart[key].dataProvider = $scope.viewModel.orderedInputWaterDataVM;
            $scope.inputWaterHistChart[key].validateData();
            $scope.inputWaterHistChart[key].invalidateSize();
        }

        for (key in $scope.poolParamHistChart) {
            $scope.poolParamHistChart[key].dataProvider = $scope.viewModel.orderedPoolParamDataVM;
            $scope.poolParamHistChart[key].validateData();
            $scope.poolParamHistChart[key].invalidateSize();
        }

        for (key in $scope.leachParamHistChart) {
            $scope.leachParamHistChart[key].dataProvider = $scope.viewModel.selectedHeapLeachDataVM[key];
            $scope.leachParamHistChart[key].validateData();
            $scope.leachParamHistChart[key].invalidateSize();
        }
    }

    // 绘图
    // 喷淋            chart
    $scope.sprayHistChart = function(heap,type) {
//        if ($scope.sprayHistChart[heap]) {   // chart already drawed, we'll validateData..
//            $scope.sprayHistChart[heap].dataProvider = $scope.relatedHeapData.selectedHeapSprayData(heap);
//            $scope.sprayHistChart[heap].validateData();
//            console.log('----------- validateData for spray chart -----------');
//            return;
//        }
        var chartData;
        if (type == 1) {
            chartData = $scope.viewModel.selectedHeapSprayPenlinyeVM[heap];
        }
        else {
            chartData = $scope.viewModel.selectedHeapSprayDongkengshuiVM[heap];
        }


        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "./js/amcharts/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "jlrq";

        // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
        //chart.addListener("dataUpdated", zoomChart);

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.minorGridEnabled = true;
        categoryAxis.axisColor = "#DADADA";

        // first value axis (on the left)
        var valueAxis1 = new AmCharts.ValueAxis();
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        valueAxis1.title = "g/L,ph"
        chart.addValueAxis(valueAxis1);

        // second value axis (on the right)
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        valueAxis2.title="m3,kg"
        chart.addValueAxis(valueAxis2);

        // third value axis (on the left, detached)
        /*valueAxis3 = new AmCharts.ValueAxis();
        valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
        valueAxis3.gridAlpha = 0;
        valueAxis3.axisColor = "#B0DE09";
        valueAxis3.axisThickness = 2;
        chart.addValueAxis(valueAxis3);*/

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = "喷淋量";
        graph1.valueField = "sprayQty";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = valueAxis2;
        graph1.balloonText = '喷淋 [[value]] M3';
        graph1.connect = false;
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "smoothedLine";
        graph2.title = "PH值";
        graph2.valueField = "ph";                   // ph
        graph2.bullet = "square";
        graph2.hideBulletsCount = 30;
        graph2.bulletBorderThickness = 1;
        graph2.valueAxis = valueAxis1;
        graph2.balloonText = 'PH值 [[value]]';
        graph2.connect = false;
        chart.addGraph(graph2);

        // third graph
        var graph3 = new AmCharts.AmGraph();
        graph3.type = "smoothedLine";
        graph3.valueField = "eh";                   // eh
        graph3.title = "电位";
        graph3.bullet = "triangleUp";
        graph3.hideBulletsCount = 30;
        graph3.bulletBorderThickness = 1;
        graph3.valueAxis = valueAxis1;
        graph3.balloonText = '电位 [[value]] mV';
        graph3.connect = false;
        chart.addGraph(graph3);

        // forth graph
        var graph4 = new AmCharts.AmGraph();
        graph4.type = "smoothedLine";
        graph4.valueField = "sld";                   // sld
        graph4.title = "酸浓度";
        graph4.bullet = "triangleUp";
        graph4.hideBulletsCount = 30;
        graph4.bulletBorderThickness = 1;
        graph4.valueAxis = valueAxis1;
        graph4.balloonText = '酸浓度 [[value]] g/L';
        graph4.connect = false;
        chart.addGraph(graph4);

        // fifth graph
        var graph5 = new AmCharts.AmGraph();
        //graph5.type = "smoothedLine";
        graph5.valueField = "cu2nd";                   // Cu2+
        graph5.title = "Cu2+浓度";
        graph5.bullet = "triangleUp";
        graph5.hideBulletsCount = 30;
        graph5.bulletBorderThickness = 1;
        graph5.valueAxis = valueAxis1;
        graph5.balloonText = 'Cu2+ [[value]] g/L';
        graph5.connect = false;

        chart.addGraph(graph5);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.marginLeft = 110;
        legend.useGraphSettings = true;
        chart.addLegend(legend);

        // WRITE
        chart.write(heap.duichangID);
        chart.invalidateSize();

        // function memory...
//        $scope.sprayHistChart[heap] = chart;
    };

    // 入堆矿石    chart
    $scope.inputOreHistChart = function(heap) {
        if (!$scope.relatedHeapData) {
            console.log('数据还未初始化...');
            return;
        }
        if ($scope.inputOreHistChart[heap.duichangID]) {   // chart already drawed, we'll validateData..
            $scope.inputOreHistChart[heap.duichangID].dataProvider = $scope.viewModel.orderedInputOreDataVM;
            $scope.inputOreHistChart[heap.duichangID].validateData();
            $scope.inputOreHistChart[heap.duichangID].invalidateSize();
            console.log('----------- validateData for inputOre chart -----------');
            return;
        }
        var chartData = $scope.relatedHeapData.orderedInputOreData();

        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "./js/amcharts/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "rdrq";

        // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
        //chart.addListener("dataUpdated", zoomChart);

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.minorGridEnabled = true;
        categoryAxis.axisColor = "#DADADA";

        // first value axis (on the left)
        var valueAxis1 = new AmCharts.ValueAxis();
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        valueAxis1.title = "吨"
        chart.addValueAxis(valueAxis1);

        // second value axis (on the right)
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        valueAxis2.title="品位"
        chart.addValueAxis(valueAxis2);

        // third value axis (on the left, detached)
        /*valueAxis3 = new AmCharts.ValueAxis();
         valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
         valueAxis3.gridAlpha = 0;
         valueAxis3.axisColor = "#B0DE09";
         valueAxis3.axisThickness = 2;
         chart.addValueAxis(valueAxis3);*/

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = "入堆矿石";
        graph1.valueField = "rdksl";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = valueAxis1;
        graph1.balloonText = '矿石 [[value]] T';
        graph1.connect = false;
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "smoothedLine";
        graph2.title = "铜金属量";
        graph2.valueField = "cujsl";                   // cu
        graph2.bullet = "square";
        graph2.hideBulletsCount = 30;
        graph2.bulletBorderThickness = 1;
        graph2.valueAxis = valueAxis1;
        graph2.balloonText = 'Cu [[value]]';
        graph2.connect = false;
        chart.addGraph(graph2);

        // third graph
        var graph3 = new AmCharts.AmGraph();
        graph3.type = "smoothedLine";
        graph3.valueField = "fejsl";                   // Fe
        graph3.title = "铁金属量";
        graph3.bullet = "triangleUp";
        graph3.hideBulletsCount = 30;
        graph3.bulletBorderThickness = 1;
        graph3.valueAxis = valueAxis1;
        graph3.balloonText = 'Fe [[value]]';
        graph3.connect = false;
        chart.addGraph(graph3);

        // forth graph
        var graph4 = new AmCharts.AmGraph();
        graph4.type = "smoothedLine";
        graph4.valueField = "cupw";                   // 铜品位
        graph4.title = "铜品位";
        graph4.bullet = "triangleUp";
        graph4.hideBulletsCount = 30;
        graph4.bulletBorderThickness = 1;
        graph4.valueAxis = valueAxis2;
        graph4.balloonText = '铜品位 [[value]]';
        graph4.connect = false;
        chart.addGraph(graph4);

        // fifth graph
        var graph5 = new AmCharts.AmGraph();
        //graph5.type = "smoothedLine";
        graph5.valueField = "fepw";                   // 铁品位
        graph5.title = "铁品位";
        graph5.bullet = "triangleUp";
        graph5.hideBulletsCount = 30;
        graph5.bulletBorderThickness = 1;
        graph5.valueAxis = valueAxis2;
        graph5.balloonText = '铁品位 [[value]]';
        graph5.connect = false;

        chart.addGraph(graph5);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.marginLeft = 110;
        legend.useGraphSettings = true;
        chart.addLegend(legend);

        // WRITE
        chart.write('inputore-'+heap.duichangID);
        chart.invalidateSize();

        // function memory...
        $scope.inputOreHistChart[heap.duichangID] = chart;
    }

    // 引入水 chart
    $scope.inputWaterHistChart = function(heap) {
        if ($scope.inputWaterHistChart[heap.duichangID]) {   // chart already drawed, we'll validateData..
            $scope.inputWaterHistChart[heap.duichangID].dataProvider = $scope.viewModel.orderedInputWaterDataVM;
            $scope.inputWaterHistChart[heap.duichangID].validateData();
            $scope.inputWaterHistChart[heap.duichangID].invalidateSize();
            console.log('----------- validateData for inputWater chart -----------');
            return;
        }
        var chartData = $scope.relatedHeapData.orderedInputWaterData();

        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "./js/amcharts/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "jlrq";

        // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
        //chart.addListener("dataUpdated", zoomChart);

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.minorGridEnabled = true;
        categoryAxis.axisColor = "#DADADA";

        // first value axis (on the left)
        var valueAxis1 = new AmCharts.ValueAxis();
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        valueAxis1.title = "M3,KG"
        chart.addValueAxis(valueAxis1);

        // second value axis (on the right)
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        valueAxis2.title="g/L"
        chart.addValueAxis(valueAxis2);

        // third value axis (on the left, detached)
        /*valueAxis3 = new AmCharts.ValueAxis();
         valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
         valueAxis3.gridAlpha = 0;
         valueAxis3.axisColor = "#B0DE09";
         valueAxis3.axisThickness = 2;
         chart.addValueAxis(valueAxis3);*/

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = "矿坑水总量";
        graph1.valueField = "kkszl";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = valueAxis1;
        graph1.balloonText = '矿坑水 [[value]] m3';
        graph1.connect = false;
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "smoothedLine";
        graph2.title = "矿坑水总含铜量";
        graph2.valueField = "kkszCu";
        graph2.bullet = "square";
        graph2.hideBulletsCount = 30;
        graph2.bulletBorderThickness = 1;
        graph2.valueAxis = valueAxis1;
        graph2.balloonText = '矿坑水含铜 [[value]]';
        graph2.connect = false;
        chart.addGraph(graph2);

        // third graph
        var graph3 = new AmCharts.AmGraph();
        graph3.type = "smoothedLine";
        graph3.valueField = "ejlsjcSl";
        graph3.title = "鹅颈里水量";
        graph3.bullet = "triangleUp";
        graph3.hideBulletsCount = 30;
        graph3.bulletBorderThickness = 1;
        graph3.valueAxis = valueAxis1;
        graph3.balloonText = '鹅颈里水量 [[value]]';
        graph3.connect = false;
        chart.addGraph(graph3);

        // forth graph
        var graph4 = new AmCharts.AmGraph();
        graph4.type = "smoothedLine";
        graph4.valueField = "ejlsjcCu";
        graph4.title = "鹅颈里含铜量";
        graph4.bullet = "triangleUp";
        graph4.hideBulletsCount = 30;
        graph4.bulletBorderThickness = 1;
        graph4.valueAxis = valueAxis1;
        graph4.balloonText = '鹅颈里含铜 [[value]]';
        graph4.connect = false;
        chart.addGraph(graph4);

        // 5th graph
        var graph5 = new AmCharts.AmGraph();
        graph5.type = "smoothedLine";
        graph5.valueField = "ejlsjcCund";
        graph5.title = "鹅颈里铜浓度";
        graph5.bullet = "triangleUp";
        graph5.hideBulletsCount = 30;
        graph5.bulletBorderThickness = 1;
        graph5.valueAxis = valueAxis2;
        graph5.balloonText = '鹅颈里铜浓度 [[value]]';
        graph5.connect = false;

        chart.addGraph(graph5);

        // 6th graph
        var graph6 = new AmCharts.AmGraph();
        graph6.type = "smoothedLine";
        graph6.valueField = "cyyZsl";
        graph6.title = "萃余液总水量";
        graph6.bullet = "triangleUp";
        graph6.hideBulletsCount = 30;
        graph6.bulletBorderThickness = 1;
        graph6.valueAxis = valueAxis1;
        graph6.balloonText = '萃余液水量 [[value]]';
        graph6.connect = false;

        chart.addGraph(graph6);

        // 7th graph
        var graph7 = new AmCharts.AmGraph();
        graph7.type = "smoothedLine";
        graph7.valueField = "cyyCu";
        graph7.title = "萃余液含铜量";
        graph7.bullet = "triangleUp";
        graph7.hideBulletsCount = 30;
        graph7.bulletBorderThickness = 1;
        graph7.valueAxis = valueAxis1;
        graph7.balloonText = '萃余液含铜量 [[value]]';
        graph7.connect = false;

        chart.addGraph(graph7);

        // 8th graph
        var graph8 = new AmCharts.AmGraph();
        graph8.type = "smoothedLine";
        graph8.valueField = "ejlsjcCund";
        graph8.title = "萃余液铜浓度";
        graph8.bullet = "triangleUp";
        graph8.hideBulletsCount = 30;
        graph8.bulletBorderThickness = 1;
        graph8.valueAxis = valueAxis2;
        graph8.balloonText = '萃余液铜浓度 [[value]]';
        graph8.connect = false;

        chart.addGraph(graph8);

        // 9th graph
        var graph9 = new AmCharts.AmGraph();
        graph9.type = "smoothedLine";
        graph9.valueField = "dks3513";
        graph9.title = "3513#水量";
        graph9.bullet = "triangleUp";
        graph9.hideBulletsCount = 30;
        graph9.bulletBorderThickness = 1;
        graph9.valueAxis = valueAxis1;
        graph9.balloonText = '3513#水量 [[value]]';
        graph9.connect = false;

        chart.addGraph(graph9);

        // 10th graph
        var graph10 = new AmCharts.AmGraph();
        graph10.type = "smoothedLine";
        graph10.valueField = "dks3513Cund";
        graph10.title = "铜浓度 3513#";
        graph10.bullet = "triangleUp";
        graph10.hideBulletsCount = 30;
        graph10.bulletBorderThickness = 1;
        graph10.valueAxis = valueAxis2;
        graph10.balloonText = '铜浓度 3513# [[value]]';
        graph10.connect = false;

        chart.addGraph(graph10);
        // 11th graph
        var graph11 = new AmCharts.AmGraph();
        graph11.type = "smoothedLine";
        graph11.valueField = "dks3513Cu";
        graph11.title = "含铜量 3513#";
        graph11.bullet = "triangleUp";
        graph11.hideBulletsCount = 30;
        graph11.bulletBorderThickness = 1;
        graph11.valueAxis = valueAxis1;
        graph11.balloonText = '含铜量 3513# [[value]]';
        graph11.connect = false;

        chart.addGraph(graph11);

        // 12th graph
        var graph12 = new AmCharts.AmGraph();
        graph12.type = "smoothedLine";
        graph12.valueField = "dks3512";
        graph12.title = "3512#水量";
        graph12.bullet = "triangleUp";
        graph12.hideBulletsCount = 30;
        graph12.bulletBorderThickness = 1;
        graph12.valueAxis = valueAxis1;
        graph12.balloonText = '3512#水量 [[value]]';
        graph12.connect = false;

        chart.addGraph(graph12);

        // 13th graph
        var graph13 = new AmCharts.AmGraph();
        graph13.type = "smoothedLine";
        graph13.valueField = "dks3512Cund";
        graph13.title = "铜浓度 3512#";
        graph13.bullet = "triangleUp";
        graph13.hideBulletsCount = 30;
        graph13.bulletBorderThickness = 1;
        graph13.valueAxis = valueAxis2;
        graph13.balloonText = '铜浓度 3512# [[value]]';
        graph13.connect = false;

        chart.addGraph(graph13);
        // 14th graph
        var graph14 = new AmCharts.AmGraph();
        graph14.type = "smoothedLine";
        graph14.valueField = "dks3512Cu";
        graph14.title = "含铜量 3512#";
        graph14.bullet = "triangleUp";
        graph14.hideBulletsCount = 30;
        graph14.bulletBorderThickness = 1;
        graph14.valueAxis = valueAxis1;
        graph14.balloonText = '含铜量 3512# [[value]]';
        graph14.connect = false;

        chart.addGraph(graph14);

        // 15th graph
        var graph15 = new AmCharts.AmGraph();
        graph15.type = "smoothedLine";
        graph15.valueField = "dks3511";
        graph15.title = "3511#水量";
        graph15.bullet = "triangleUp";
        graph15.hideBulletsCount = 30;
        graph15.bulletBorderThickness = 1;
        graph15.valueAxis = valueAxis1;
        graph15.balloonText = '3511#水量 [[value]]';
        graph15.connect = false;

        chart.addGraph(graph15);

        // 16th graph
        var graph16 = new AmCharts.AmGraph();
        graph16.type = "smoothedLine";
        graph16.valueField = "dks3511Cund";
        graph16.title = "铜浓度 3511#";
        graph16.bullet = "triangleUp";
        graph16.hideBulletsCount = 30;
        graph16.bulletBorderThickness = 1;
        graph16.valueAxis = valueAxis2;
        graph16.balloonText = '铜浓度 3511# [[value]]';
        graph16.connect = false;

        chart.addGraph(graph16);
        // 17th graph
        var graph17 = new AmCharts.AmGraph();
        graph17.type = "smoothedLine";
        graph17.valueField = "dks3511Cu";
        graph17.title = "含铜量 3511#";
        graph17.bullet = "triangleUp";
        graph17.hideBulletsCount = 30;
        graph17.bulletBorderThickness = 1;
        graph17.valueAxis = valueAxis1;
        graph17.balloonText = '含铜量 3511# [[value]]';
        graph17.connect = false;

        chart.addGraph(graph17);

        // 18th graph
        var graph18 = new AmCharts.AmGraph();
        graph18.type = "smoothedLine";
        graph18.valueField = "dks3516";
        graph18.title = "3516#水量";
        graph18.bullet = "triangleUp";
        graph18.hideBulletsCount = 30;
        graph18.bulletBorderThickness = 1;
        graph18.valueAxis = valueAxis1;
        graph18.balloonText = '3516#水量 [[value]]';
        graph18.connect = false;

        chart.addGraph(graph18);

        // 19th graph
        var graph19 = new AmCharts.AmGraph();
        graph19.type = "smoothedLine";
        graph19.valueField = "dks3516Cund";
        graph19.title = "铜浓度 3516#";
        graph19.bullet = "triangleUp";
        graph19.hideBulletsCount = 30;
        graph19.bulletBorderThickness = 1;
        graph19.valueAxis = valueAxis2;
        graph19.balloonText = '铜浓度 3516# [[value]]';
        graph19.connect = false;

        chart.addGraph(graph19);
        // 20th graph
        var graph20 = new AmCharts.AmGraph();
        graph20.type = "smoothedLine";
        graph20.valueField = "dks3516Cu";
        graph20.title = "含铜量 3516#";
        graph20.bullet = "triangleUp";
        graph20.hideBulletsCount = 30;
        graph20.bulletBorderThickness = 1;
        graph20.valueAxis = valueAxis1;
        graph20.balloonText = '含铜量 3516# [[value]]';
        graph20.connect = false;

        chart.addGraph(graph20);

        // 21th graph
        var graph21 = new AmCharts.AmGraph();
        graph21.type = "smoothedLine";
        graph21.valueField = "dks3515";
        graph21.title = "3515#水量";
        graph21.bullet = "triangleUp";
        graph21.hideBulletsCount = 30;
        graph21.bulletBorderThickness = 1;
        graph21.valueAxis = valueAxis1;
        graph21.balloonText = '3515#水量 [[value]]';
        graph21.connect = false;

        chart.addGraph(graph21);

        // 22th graph
        var graph22 = new AmCharts.AmGraph();
        graph22.type = "smoothedLine";
        graph22.valueField = "dks3515Cund";
        graph22.title = "铜浓度 3515#";
        graph22.bullet = "triangleUp";
        graph22.hideBulletsCount = 30;
        graph22.bulletBorderThickness = 1;
        graph22.valueAxis = valueAxis2;
        graph22.balloonText = '铜浓度 3515# [[value]]';
        graph22.connect = false;

        chart.addGraph(graph22);
        // 23th graph
        var graph23 = new AmCharts.AmGraph();
        graph23.type = "smoothedLine";
        graph23.valueField = "dks3515Cu";
        graph23.title = "含铜量 3515#";
        graph23.bullet = "triangleUp";
        graph23.hideBulletsCount = 30;
        graph23.bulletBorderThickness = 1;
        graph23.valueAxis = valueAxis1;
        graph23.balloonText = '含铜量 3515# [[value]]';
        graph23.connect = false;

        chart.addGraph(graph23);

        // 24th graph
        var graph24 = new AmCharts.AmGraph();
        graph24.type = "smoothedLine";
        graph24.valueField = "dks3514";
        graph24.title = "3514#水量";
        graph24.bullet = "triangleUp";
        graph24.hideBulletsCount = 30;
        graph24.bulletBorderThickness = 1;
        graph24.valueAxis = valueAxis1;
        graph24.balloonText = '3514#水量 [[value]]';
        graph24.connect = false;

        chart.addGraph(graph24);

        // 25th graph
        var graph25 = new AmCharts.AmGraph();
        graph25.type = "smoothedLine";
        graph25.valueField = "dks3514Cund";
        graph25.title = "铜浓度 3514#";
        graph25.bullet = "triangleUp";
        graph25.hideBulletsCount = 30;
        graph25.bulletBorderThickness = 1;
        graph25.valueAxis = valueAxis2;
        graph25.balloonText = '铜浓度 3514# [[value]]';
        graph25.connect = false;

        chart.addGraph(graph25);
        // 26th graph
        var graph26 = new AmCharts.AmGraph();
        graph26.type = "smoothedLine";
        graph26.valueField = "dks3514Cu";
        graph26.title = "含铜量 3514#";
        graph26.bullet = "triangleUp";
        graph26.hideBulletsCount = 30;
        graph26.bulletBorderThickness = 1;
        graph26.valueAxis = valueAxis1;
        graph26.balloonText = '含铜量 3514# [[value]]';
        graph26.connect = false;

        chart.addGraph(graph26);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.marginLeft = 110;
        legend.useGraphSettings = true;
        chart.addLegend(legend);

        // WRITE
        chart.write('inputWater-'+heap.duichangID);
        chart.invalidateSize();

        // function memory...
        $scope.inputWaterHistChart[heap.duichangID] = chart;
    }

    // 溶液池指标 chart
    $scope.poolParamHistChart = function(heap) {
        if ($scope.poolParamHistChart[heap.duichangID]) {   // chart already drawed, we'll validateData..
            $scope.poolParamHistChart[heap.duichangID].dataProvider = $scope.viewModel.orderedPoolParamDataVM;
            $scope.poolParamHistChart[heap.duichangID].validateData();
            console.log('----------- validateData for pool param chart -----------');
            return;
        }
        var chartData = $scope.relatedHeapData.orderedPoolParamData();

        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "./js/amcharts/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "jlrq";

        // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
        //chart.addListener("dataUpdated", zoomChart);

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.minorGridEnabled = true;
        categoryAxis.axisColor = "#DADADA";

        // first value axis (on the left)
        var valueAxis1 = new AmCharts.ValueAxis();
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        valueAxis1.title = "g/L"
        chart.addValueAxis(valueAxis1);

        // second value axis (on the right)
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        valueAxis2.title="m3,kg"
        chart.addValueAxis(valueAxis2);

        // third value axis (on the left, detached)
        /*valueAxis3 = new AmCharts.ValueAxis();
         valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
         valueAxis3.gridAlpha = 0;
         valueAxis3.axisColor = "#B0DE09";
         valueAxis3.axisThickness = 2;
         chart.addValueAxis(valueAxis3);*/

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = "中间池到中转槽溶液量";
        graph1.valueField = "zj2zzRyQty";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = valueAxis2;
        graph1.balloonText = '中间池到中转槽溶液量 [[value]] M3';
        graph1.connect = false;
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "smoothedLine";
        graph2.title = "中间池CU2+浓度";
        graph2.valueField = "zjCund";                   //
        graph2.bullet = "square";
        graph2.hideBulletsCount = 30;
        graph2.bulletBorderThickness = 1;
        graph2.valueAxis = valueAxis1;
        graph2.balloonText = '中间池CU2+浓度 [[value]]';
        graph2.connect = false;
        chart.addGraph(graph2);

        // third graph
        var graph3 = new AmCharts.AmGraph();
        graph3.type = "smoothedLine";
        graph3.valueField = "zj2zzJsQty";                   //
        graph3.title = "中间池到中转槽金属量";
        graph3.bullet = "triangleUp";
        graph3.hideBulletsCount = 30;
        graph3.bulletBorderThickness = 1;
        graph3.valueAxis = valueAxis2;
        graph3.balloonText = '中间池到中转槽金属量 [[value]] kg';
        graph3.connect = false;
        chart.addGraph(graph3);

        // forth graph
        var graph4 = new AmCharts.AmGraph();
        graph4.type = "smoothedLine";
        graph4.valueField = "py2zzRyQty";                   //
        graph4.title = "贫液池到中转槽溶液量";
        graph4.bullet = "triangleUp";
        graph4.hideBulletsCount = 30;
        graph4.bulletBorderThickness = 1;
        graph4.valueAxis = valueAxis2;
        graph4.balloonText = '贫液池到中转槽溶液量 [[value]] m3';
        graph4.connect = false;
        chart.addGraph(graph4);

        // fifth graph
        var graph5 = new AmCharts.AmGraph();
        graph5.type = "smoothedLine";
        graph5.valueField = "pyCund";                   // Cu2+
        graph5.title = "贫液池CU2+浓度";
        graph5.bullet = "triangleUp";
        graph5.hideBulletsCount = 30;
        graph5.bulletBorderThickness = 1;
        graph5.valueAxis = valueAxis1;
        graph5.balloonText = '贫液池CU2+浓度 [[value]] g/L';
        graph5.connect = false;
        chart.addGraph(graph5);

        // 6th graph
        var graph6 = new AmCharts.AmGraph();
        graph6.type = "smoothedLine";
        graph6.valueField = "py2zzJsQty";                   //
        graph6.title = "贫液池到中转槽金属量";
        graph6.bullet = "triangleUp";
        graph6.hideBulletsCount = 30;
        graph6.bulletBorderThickness = 1;
        graph6.valueAxis = valueAxis2;
        graph6.balloonText = '贫液池到中转槽金属量 [[value]] kg';
        graph6.connect = false;
        chart.addGraph(graph6);

        // 7th graph
        var graph7 = new AmCharts.AmGraph();
        graph7.type = "smoothedLine";
        graph7.valueField = "fy2zzRyQty";                   //
        graph7.title = "富液池到中转槽溶液量";
        graph7.bullet = "triangleUp";
        graph7.hideBulletsCount = 30;
        graph7.bulletBorderThickness = 1;
        graph7.valueAxis = valueAxis2;
        graph7.balloonText = '富液池到中转槽溶液量 [[value]] m3';
        graph7.connect = false;
        chart.addGraph(graph7);

        // 8th graph
        var graph8 = new AmCharts.AmGraph();
        graph8.type = "smoothedLine";
        graph8.valueField = "fyCund";                   //
        graph8.title = "富液池CU2+浓度";
        graph8.bullet = "triangleUp";
        graph8.hideBulletsCount = 30;
        graph8.bulletBorderThickness = 1;
        graph8.valueAxis = valueAxis1;
        graph8.balloonText = '富液池CU2+浓度 [[value]] g/L';
        graph8.connect = false;
        chart.addGraph(graph8);

        // 9th graph
        var graph9 = new AmCharts.AmGraph();
        graph9.type = "smoothedLine";
        graph9.valueField = "fy2zzJsQty";                   //
        graph9.title = "富液池到中转槽金属量";
        graph9.bullet = "triangleUp";
        graph9.hideBulletsCount = 30;
        graph9.bulletBorderThickness = 1;
        graph9.valueAxis = valueAxis2;
        graph9.balloonText = '富液池到中转槽金属量 [[value]] kg';
        graph9.connect = false;
        chart.addGraph(graph9);

        // 10th graph
        var graph10 = new AmCharts.AmGraph();
        graph10.type = "smoothedLine";
        graph10.valueField = "zz2fyRyQty";                   //
        graph10.title = "中转槽到富液池溶液量";
        graph10.bullet = "triangleUp";
        graph10.hideBulletsCount = 30;
        graph10.bulletBorderThickness = 1;
        graph10.valueAxis = valueAxis2;
        graph10.balloonText = '中转槽到富液池溶液量 [[value]] m3';
        graph10.connect = false;
        chart.addGraph(graph10);

        // 11th graph
        var graph11 = new AmCharts.AmGraph();
        graph11.type = "smoothedLine";
        graph11.valueField = "zzCund";                   //
        graph11.title = "中转槽CU2+浓度";
        graph11.bullet = "triangleUp";
        graph11.hideBulletsCount = 30;
        graph11.bulletBorderThickness = 1;
        graph11.valueAxis = valueAxis1;
        graph11.balloonText = '中转槽CU2+浓度 [[value]] g/L';
        graph11.connect = false;
        chart.addGraph(graph11);

        // 12th graph
        var graph12 = new AmCharts.AmGraph();
        graph12.type = "smoothedLine";
        graph12.valueField = "zz2fyJsQty";                   //
        graph12.title = "中转槽到富液池金属量";
        graph12.bullet = "triangleUp";
        graph12.hideBulletsCount = 30;
        graph12.bulletBorderThickness = 1;
        graph12.valueAxis = valueAxis2;
        graph12.balloonText = '中转槽到富液池金属量 [[value]] kg';
        graph12.connect = false;
        chart.addGraph(graph12);

        // 13th graph
        var graph13 = new AmCharts.AmGraph();
        graph13.type = "smoothedLine";
        graph13.valueField = "zz2pyRyQty";                   //
        graph13.title = "中转槽到贫液池溶液量";
        graph13.bullet = "triangleUp";
        graph13.hideBulletsCount = 30;
        graph13.bulletBorderThickness = 1;
        graph13.valueAxis = valueAxis2;
        graph13.balloonText = '中转槽到贫液池溶液量 [[value]] m3';
        graph13.connect = false;
        chart.addGraph(graph13);

        // 14th graph
        var graph14 = new AmCharts.AmGraph();
        graph14.type = "smoothedLine";
        graph14.valueField = "zz2pyJsQty";                   //
        graph14.title = "中转槽到贫液池金属量";
        graph14.bullet = "triangleUp";
        graph14.hideBulletsCount = 30;
        graph14.bulletBorderThickness = 1;
        graph14.valueAxis = valueAxis2;
        graph14.balloonText = '中转槽到贫液池金属量 [[value]] kg';
        graph14.connect = false;
        chart.addGraph(graph14);

        // 15th graph
        var graph15 = new AmCharts.AmGraph();
        graph15.type = "smoothedLine";
        graph15.valueField = "dks388Cund";                   //
        graph15.title = "388硐坑水CU2+浓度";
        graph15.bullet = "triangleUp";
        graph15.hideBulletsCount = 30;
        graph15.bulletBorderThickness = 1;
        graph15.valueAxis = valueAxis1;
        graph15.balloonText = '388硐坑水CU2+浓度 [[value]] g/L';
        graph15.connect = false;
        chart.addGraph(graph15);

        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.marginLeft = 110;
        legend.useGraphSettings = true;
        chart.addLegend(legend);

        // WRITE
        chart.write('pool-'+heap.duichangID);
        chart.invalidateSize();

        // function memory...
        $scope.poolParamHistChart[heap.duichangID] = chart;
    }

    // 浸出指标 chart
    $scope.leachParamHistChart = function(heap) {
        if ($scope.leachParamHistChart[heap]) {   // chart already drawed, we'll validateData..
            $scope.leachParamHistChart[heap].dataProvider = $scope.viewModel.selectedHeapLeachDataVM[heap];
            $scope.leachParamHistChart[heap].validateData();
            console.log('----------- validateData for pool param chart -----------');
            return;
        }
        var chartData = $scope.relatedHeapData.selectedHeapLeachData(heap);

        // SERIAL CHART
        var chart = new AmCharts.AmSerialChart();
        chart.pathToImages = "./js/amcharts/images/";
        chart.dataProvider = chartData;
        chart.categoryField = "jlrq";

        // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
        //chart.addListener("dataUpdated", zoomChart);

        // AXES
        // category
        var categoryAxis = chart.categoryAxis;
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
        categoryAxis.minorGridEnabled = true;
        categoryAxis.axisColor = "#DADADA";

        // first value axis (on the left)
        var valueAxis1 = new AmCharts.ValueAxis();
        valueAxis1.axisColor = "#FF6600";
        valueAxis1.axisThickness = 2;
        valueAxis1.gridAlpha = 0;
        valueAxis1.title = "g/L, mV, PH, mm, %"
        chart.addValueAxis(valueAxis1);

        // second value axis (on the right)
        var valueAxis2 = new AmCharts.ValueAxis();
        valueAxis2.position = "right"; // this line makes the axis to appear on the right
        valueAxis2.axisColor = "#FCD202";
        valueAxis2.gridAlpha = 0;
        valueAxis2.axisThickness = 2;
        valueAxis2.title="m3,kg"
        chart.addValueAxis(valueAxis2);

        // third value axis (on the left, detached)
        /*valueAxis3 = new AmCharts.ValueAxis();
         valueAxis3.offset = 50; // this line makes the axis to appear detached from plot area
         valueAxis3.gridAlpha = 0;
         valueAxis3.axisColor = "#B0DE09";
         valueAxis3.axisThickness = 2;
         chart.addValueAxis(valueAxis3);*/

        // GRAPHS
        // first graph
        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = "降雨扣除蒸发量";
        graph1.valueField = "jykczfl";
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = valueAxis2;
        graph1.balloonText = '降雨扣除蒸发量 [[value]] M3';
        graph1.connect = false;
        chart.addGraph(graph1);

        // second graph
        var graph2 = new AmCharts.AmGraph();
        graph2.type = "smoothedLine";
        graph2.title = "浸出溶液量";
        graph2.valueField = "jcryQty";                   //
        graph2.bullet = "square";
        graph2.hideBulletsCount = 30;
        graph2.bulletBorderThickness = 1;
        graph2.valueAxis = valueAxis2;
        graph2.balloonText = '浸出溶液量 [[value]] m3';
        graph2.connect = false;
        chart.addGraph(graph2);

        // third graph
        var graph3 = new AmCharts.AmGraph();
        graph3.type = "smoothedLine";
        graph3.valueField = "jccund";                   //
        graph3.title = "浸出铜浓度";
        graph3.bullet = "triangleUp";
        graph3.hideBulletsCount = 30;
        graph3.bulletBorderThickness = 1;
        graph3.valueAxis = valueAxis1;
        graph3.balloonText = '浸出铜浓度 [[value]] g/L';
        graph3.connect = false;
        chart.addGraph(graph3);

        // forth graph
        var graph4 = new AmCharts.AmGraph();
        graph4.type = "smoothedLine";
        graph4.valueField = "jccu";                   //
        graph4.title = "浸出铜量";
        graph4.bullet = "triangleUp";
        graph4.hideBulletsCount = 30;
        graph4.bulletBorderThickness = 1;
        graph4.valueAxis = valueAxis2;
        graph4.balloonText = '浸出铜量 [[value]] kg';
        graph4.connect = false;
        chart.addGraph(graph4);

        // fifth graph
        var graph5 = new AmCharts.AmGraph();
        graph5.type = "smoothedLine";
        graph5.valueField = "jcpct";                   //
        graph5.title = "浸出率";
        graph5.bullet = "triangleUp";
        graph5.hideBulletsCount = 30;
        graph5.bulletBorderThickness = 1;
        graph5.valueAxis = valueAxis1;
        graph5.balloonText = '浸出率 [[value]] %';
        graph5.connect = false;
        chart.addGraph(graph5);

        // 6th graph
        var graph6 = new AmCharts.AmGraph();
        graph6.type = "smoothedLine";
        graph6.valueField = "jcfe3nd";                   //
        graph6.title = "浸出3价铁浓度";
        graph6.bullet = "triangleUp";
        graph6.hideBulletsCount = 30;
        graph6.bulletBorderThickness = 1;
        graph6.valueAxis = valueAxis1;
        graph6.balloonText = '浸出3价铁浓度 [[value]] g/L';
        graph6.connect = false;
        chart.addGraph(graph6);

        // 7th graph
        var graph7 = new AmCharts.AmGraph();
        graph7.type = "smoothedLine";
        graph7.valueField = "jcfe2nd";                   //
        graph7.title = "浸出2价铁浓度";
        graph7.bullet = "triangleUp";
        graph7.hideBulletsCount = 30;
        graph7.bulletBorderThickness = 1;
        graph7.valueAxis = valueAxis1;
        graph7.balloonText = '浸出2价铁浓度 [[value]] g/L';
        graph7.connect = false;
        chart.addGraph(graph7);

        // 8th graph
        var graph8 = new AmCharts.AmGraph();
        graph8.type = "smoothedLine";
        graph8.valueField = "jctfend";                   //
        graph8.title = "浸出TFe浓度";
        graph8.bullet = "triangleUp";
        graph8.hideBulletsCount = 30;
        graph8.bulletBorderThickness = 1;
        graph8.valueAxis = valueAxis1;
        graph8.balloonText = '浸出TFe浓度 [[value]] g/L';
        graph8.connect = false;
        chart.addGraph(graph8);

        // 9th graph
        var graph9 = new AmCharts.AmGraph();
        graph9.type = "smoothedLine";
        graph9.valueField = "jcfe";                   //
        graph9.title = "浸出铁量";
        graph9.bullet = "triangleUp";
        graph9.hideBulletsCount = 30;
        graph9.bulletBorderThickness = 1;
        graph9.valueAxis = valueAxis2;
        graph9.balloonText = '浸出铁量 [[value]] kg';
        graph9.connect = false;
        chart.addGraph(graph9);

        // 10th graph
        var graph10 = new AmCharts.AmGraph();
        graph10.type = "smoothedLine";
        graph10.valueField = "jcsld";                   //
        graph10.title = "浸出酸浓度";
        graph10.bullet = "triangleUp";
        graph10.hideBulletsCount = 30;
        graph10.bulletBorderThickness = 1;
        graph10.valueAxis = valueAxis1;
        graph10.balloonText = '浸出酸浓度 [[value]] g/L';
        graph10.connect = false;
        chart.addGraph(graph10);

        // 11th graph
        var graph11 = new AmCharts.AmGraph();
        graph11.type = "smoothedLine";
        graph11.valueField = "jcph";                   //
        graph11.title = "浸出PH";
        graph11.bullet = "triangleUp";
        graph11.hideBulletsCount = 30;
        graph11.bulletBorderThickness = 1;
        graph11.valueAxis = valueAxis1;
        graph11.balloonText = '浸出PH [[value]] ';
        graph11.connect = false;
        chart.addGraph(graph11);

        // 12th graph
        var graph12 = new AmCharts.AmGraph();
        graph12.type = "smoothedLine";
        graph12.valueField = "jceh";                   //
        graph12.title = "浸出电位";
        graph12.bullet = "triangleUp";
        graph12.hideBulletsCount = 30;
        graph12.bulletBorderThickness = 1;
        graph12.valueAxis = valueAxis1;
        graph12.balloonText = '浸出电位 [[value]] mV';
        graph12.connect = false;
        chart.addGraph(graph12);



        // CURSOR
        var chartCursor = new AmCharts.ChartCursor();
        chartCursor.cursorPosition = "mouse";
        chart.addChartCursor(chartCursor);

        // SCROLLBAR
        var chartScrollbar = new AmCharts.ChartScrollbar();
        chart.addChartScrollbar(chartScrollbar);

        // LEGEND
        var legend = new AmCharts.AmLegend();
        legend.marginLeft = 110;
        legend.useGraphSettings = true;
        chart.addLegend(legend);

        // WRITE
        chart.write('leaching-'+heap.duichangID);
        chart.invalidateSize();

        // function memory...
        $scope.leachParamHistChart[heap] = chart;
    }

    // View Model
    // Do it for performance
    $scope.viewModel = {
        selectedHeapLeachDataVM:{},
        orderedPoolParamDataVM:{},
        orderedInputWaterDataVM:{},
        orderedInputOreDataVM:{},
        selectedHeapSprayPenlinyeVM:{},
        selectedHeapSprayDongkengshuiVM:{}
    };

    // current heap
    $scope.heap;

    $scope.$watch('heap',$scope.doCompute);




    var fn = {
        // fn 使用underscore协助计算

        // 浸出指标
        selectedHeapLeachData: function(heap) {
            if (this.selectedHeapLeachData[heap.duichangID]) {
                console.log(' get from selectedHeapLeachData cache.');
                return this.selectedHeapLeachData[heap.duichangID];
            }
            console.log('======= selectedHeapLeachData , heap.duichangID:'+heap.duichangID);
            //console.dir(this.leachingOuts);
            var retArr = _.sortBy(_.where(this.leachingOuts, {
                'duichangID': heap.duichangID
            }), function(element) {  // sort function
                return element.jlrq;
            });
            this.selectedHeapLeachData[heap.duichangID] = retArr;
            return retArr;
        },

        // 溶液池
        orderedPoolParamData: function() {
            if (this.orderedPoolParamData['mem_cache']) {
//                console.log('orderedPoolParamData get from cache.');
                return this.orderedPoolParamData['mem_cache'];
            }

            var rst = _.sortBy(this.poolParam,function(element) {  // sort function
                return element.jlrq;
            });
            this.orderedPoolParamData['mem_cache'] = rst;
            return rst;
        },

        // 引入水
        orderedInputWaterData: function() {
            if (this.orderedInputWaterData['mem_cache']) {
//                console.log('orderedInputWaterData get from cache.');
                return  this.orderedInputWaterData['mem_cache'];
            }
            var rst = _.sortBy(this.inputwater,function(element) { // sort function
                return element.jlrq;
            });
            this.orderedInputWaterData['mem_cache'] = rst;
            return rst;
        },

        // 入堆矿石
        orderedInputOreData: function() {
            if (this.orderedInputOreData['mem_cache']) {
//                console.log('orderedInputOreData get from cache.');
                return this.orderedInputOreData['mem_cache'];
            }
            var rst =  _.sortBy(this.inputore,function(element) {// sort function
                return element.rdrq;
            });
            this.orderedInputOreData['mem_cache'] = rst;
            return rst;
        },

        // 喷淋相关数据
        selectedHeapSprayData: function(heap) { // 指定堆场的数据
            if (!this.sprayParams) {
                console.log('数据还未初始化');
                return [];
            }

            if (this.selectedHeapSprayData[heap.duichangID]) {
                console.log(' selectedHeapSprayData already exist :');
                return  this.selectedHeapSprayData[heap.duichangID];
            }
            else {
                console.log('++++++++++++ selectedHeapSprayData called, do db query ++++++++++++'+heap.duichangID);

                var v = _.sortBy(_.where(this['sprayParams'],{
                    'duichangID' : heap.duichangID
                }),function(element){     // sort function
                    return element.jlrq;
                });

                this.selectedHeapSprayData[heap.duichangID] = v;
//                console.log('selectedHeapSprayData created :'+fn.selectedHeapSprayData[heap.duichangID]);
                return this.selectedHeapSprayData[heap.duichangID];
            }
        },
        selectedHeapSprayPenlinye: function(heap) { // 指定： 堆场  喷淋液
            if (this.selectedHeapSprayPenlinye[heap.duichangID]) {
                return this.selectedHeapSprayPenlinye[heap.duichangID];
            }
            else {
                var v = _.where(this.selectedHeapSprayData(heap),{
                    sprayType: 'PLY'
                });

                this.selectedHeapSprayPenlinye[heap.duichangID] = v;
                return this.selectedHeapSprayPenlinye[heap.duichangID];
            }
        },
        selectedHeapSprayDongkengshui: function(heap) { // 指定： 堆场 硐坑水
            if (this.selectedHeapSprayDongkengshui[heap.duichangID]) {
                return this.selectedHeapSprayDongkengshui[heap.duichangID];
            }
            else {
                var v = _.where(this.selectedHeapSprayData(heap),{
                    sprayType: 'DKS'
                });

                this.selectedHeapSprayDongkengshui[heap.duichangID] = v;
                return this.selectedHeapSprayDongkengshui[heap.duichangID];
            }
        }
        // 喷淋相关数据 End.
    };

    // 切换堆场
    $scope.tabSelect = function(heap) {
        console.log('tabSelect :'+heap.duichangName);
        angular.forEach($rootScope.availHeaps,function(value,key){
            value.active = false;
        });
        heap.active = true;
        $scope.heap = heap;
        //$scope.selectedHeap = heap;
    };

    // 显示1~2月数据
    dashboardSvc.getHeapAboutMonthsData($scope.jlrq)
        .success(function(response){
            $scope.relatedHeapData = response['data'];
            for (key in fn) {
                $scope.relatedHeapData[key] = fn[key];
            }
            $scope.doCompute();
            $scope.validateAllChart();
        })
        .error(function(){
            console.log('  服务器通讯失败!');
        });

    $scope.morePrevData = function() {
        console.log(' set jlrq :');
//        console.dir($scope.jlrq);
        $scope.jlrq = $scope.jlrq = new Date($scope.jlrq.getTime() - 2*30*24*60*60*1000);
        dashboardSvc.getHeapAboutMonthsData($scope.jlrq).success(function(response){
            $scope.relatedHeapData = response['data'];
            for (key in fn) {
                $scope.relatedHeapData[key] = fn[key];
                //clear all function memory
                for (mem in $scope.relatedHeapData[key]) {
                    console.log('clear function '+key+' memory '+mem);
                    $scope.relatedHeapData[key][mem] = undefined;
                }

                // re-draw all related chart.

                $scope.validateAllChart();

            }
            $scope.doCompute();
        })
            .error(function(){
                console.log('  服务器通讯失败!');
            });
    } ;

    $scope.moreNewData =  function() {
        $scope.jlrq = $scope.jlrq.setTime($scope.jlrq.getTime() + 2*30*24*60*60*1000);
        dashboardSvc.getHeapAboutMonthsData($scope.jlrq).success(function(response){
            $scope.relatedHeapData = response['data'];
            for (key in fn) {
                $scope.relatedHeapData[key] = fn[key];
                //clear all function memory
                for (mem in $scope.relatedHeapData[key]) {
                    console.log('clear function '+key+' memory '+mem);
                    $scope.relatedHeapData[key][mem] = undefined;
                }

                // re-draw all related chart.
                $scope.validateAllChart();
            }
            $scope.doCompute();
        })
            .error(function(){
                console.log('  服务器通讯失败!');
            });
    } ;

    // Get All Heap About Data...

    /*$scope.moreData = function() {
        console.log(' do moreData.....');
        if ($scope.moreData.called) {
            console.log('moreData cached.');
            return $scope.relatedHeapData;
        }
        dashboardSvc.getHeapAboutAllData()
            .success(function(response) {
                $scope.relatedHeapData = response['data'];
                for (key in fn) {
                    $scope.relatedHeapData[key] = fn[key];
                    //clear all function memory
                    for (mem in $scope.relatedHeapData[key]) {
                        console.log('clear function '+key+' memory '+mem);
                        $scope.relatedHeapData[key][mem] = undefined;
                    }
                }
                $scope.moreData.called = true;

                // re-draw all related chart.
                $scope.validateAllChart();
            })
            .error(function(){
                $.growl(' 获取堆浸工艺更多数据失败，服务器端通讯异常。');
            });
    };
    $scope.moreData.called = false;*/
    // Accordian Control
    $scope.currAccordian = {};
    $scope.currAccordian.inputOre = false;          // 入堆矿石
    $scope.currAccordian.inputWater = false;        // 引入水
    $scope.currAccordian.spray = true;              // 喷淋液
    $scope.currAccordian.solPool = false;           // 溶液池
    $scope.currAccordian.leaching = false;          // 浸出
}]);

// 生产工艺-环保中和Controller
icdModule.controller('DashNeutroCtrl',['$scope','$state','dashboardSvc','$filter',function($scope, $state, svc, $filter) {
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    $scope.extRelatedData = {};         // 存储萃取电积相关的历史数据
    $scope.timeDimension = {};
    $scope.timeDimension.radioModel = 'Day';

    var fn = {
        showNeutroData: function() {
            var arrs = [];                                          // return array
            if ($scope.timeDimension.radioModel == 'Day') {         // Day Level Data
                angular.forEach(this.neutros,function(value,key){
                    var item = {};
                    item.cllCyyQty = value.cllCyyQty;
                    item.cllFhc2Qty = value.cllFhc2Qty;
                    item.cllSumQty = value.cllSumQty;
                    item.shyjxh = value.shyjxh1 + value.shyjxh2 + value.shyjxh3;
                    item.wpQty = value.wphbylQty + value.wpxyylQty + value.wp3zbsqyQty;
                    item.jlrq = value.jlrq;
                    arrs.push(item);

                });
            }
            else if ($scope.timeDimension.radioModel == 'Month') {

                var groupedData = _.groupBy(this.neutros, function(element){
                    return $filter('date')(element.jlrq, 'yyyy-MM');
                    //return element.jlrq.getFullYear()+'-'+element.jlrq.getMonth();
                });
                angular.forEach(groupedData,function(value,key) {
                    var item = {};
                    item.jlrq = key;
                    item.cllCyyQty = 0;
                    item.cllFhc2Qty = 0;
                    item.cllSumQty = 0;
                    item.shyjxh = 0;
                    item.wpQty = 0;

                    item.cllCyyQty = _.reduce(value,function(memo,e){
                        return memo + e.cllCyyQty;
                    },0);
                    item.cllFhc2Qty = _.reduce(value,function(memo,e){
                        return memo + e.cllFhc2Qty;
                    },0);
                    item.cllSumQty = item.cllCyyQty + item.cllFhc2Qty;
                    item.shyjxh = _.reduce(value,function(memo,e){
                        return memo + e.shyjxh1 + e.shyjxh2 + e.shyjxh3;
                    },0);
                    item.wpQty = _.reduce(value,function(memo,e){
                        return memo + e.wphbylQty + e.wpxyylQty + e.wp3zbsqyQty;
                    },0);

                    arrs.push(item);
                });
            }
            else if ($scope.timeDimension.radioModel == 'Year') {
                var groupedData = _.groupBy(this.neutros, function(element){
                    return $filter('date')(element.jlrq, 'yyyy');
                    //return element.jlrq.getFullYear()+'-'+element.jlrq.getMonth();
                });
                angular.forEach(groupedData,function(value,key) {
                    var item = {};
                    item.jlrq = key;
                    item.cllCyyQty = 0;
                    item.cllFhc2Qty = 0;
                    item.cllSumQty = 0;
                    item.shyjxh = 0;
                    item.wpQty = 0;

                    item.cllCyyQty = _.reduce(value,function(memo,e){
                        return memo + e.cllCyyQty;
                    },0);
                    item.cllFhc2Qty = _.reduce(value,function(memo,e){
                        return memo + e.cllFhc2Qty;
                    },0);
                    item.cllSumQty = item.cllCyyQty + item.cllFhc2Qty;
                    item.shyjxh = _.reduce(value,function(memo,e){
                        return memo + e.shyjxh1 + e.shyjxh2 + e.shyjxh3;
                    },0);
                    item.wpQty = _.reduce(value,function(memo,e){
                        return memo + e.wphbylQty + e.wpxyylQty + e.wp3zbsqyQty;
                    },0);

                    arrs.push(item);
                });
            }
            else {
                console.log('Time Dimension Only Support Day|Month|Year!');
            }
            return _.sortBy(arrs,function(e){
                return e.jlrq;
            });
        }
    };

    $scope.chartTabSelect = function() {
        svc.getNeutroAboutAllData().success(function(response){
            $scope.neutroRelatedData = response['data'] ;
            for (var k in fn) {
                $scope.neutroRelatedData[k] = fn[k];
            }
            $scope.chartDraw();
//            _.each($scope.neutroRelatedData['extract'],function(e) {
//                e.cqyyQty = e.cqyyLL * e.openHours;
//            })
        }).
            error(function(){
                $.growl('获取环保中和相关数据时发生服务器端通讯异常。');
            })
    }

    $scope.chartDraw = function() {
        var data = $scope.neutroRelatedData.showNeutroData();
        var minPeriod = "";
        var dataDateFormat = "YYYY-MM-DD";
        if ($scope.timeDimension.radioModel == 'Day'){
            dataDateFormat = "YYYY-MM-DD";
            minPeriod = 'DD';
        }
        else if($scope.timeDimension.radioModel == 'Month') {
            dataDateFormat = "YYYY-MM";
            minPeriod = 'MM';
        }
        else if ($scope.timeDimension.radioModel == 'Year') {
            dataDateFormat = "YYYY";
            minPeriod = 'YYYY';
        }

        // 萃余液中和量
        easyLineChart(data,{
            items:[
                {
                    unit:'M3',
                    prop:'cllCyyQty',
                    title:'萃余液中和量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'neutro-cyy',
            refresh: true
        });
        // 防洪池2期中和量
        easyLineChart(data,{
            items:[
                {
                    unit:'M3',
                    prop:'cllFhc2Qty',
                    title:'防洪池2期中和量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'neutro-fhc2q',
            refresh: true
        });
        // 中和溶液总量
        easyLineChart(data,{
            items:[
                {
                    unit:'M3',
                    prop:'cllSumQty',
                    title:'中和溶液总量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'neutro-zhzl',
            refresh: true
        });
        // 石灰消耗总量
        easyLineChart(data,{
            items:[
                {
                    unit:'T',
                    prop:'shyjxh',
                    title:'石灰消耗总量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'neutro-shyj',
            refresh: true
        });
        // 外排总量
        easyLineChart(data,{
            items:[
                {
                    unit:'M3',
                    prop:'wpQty',
                    title:'外排总量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'neutro-wp',
            refresh: true
        });
    };
}]);

// 生产工艺-萃取电积Controller
icdModule.controller('DashExtCtrl',['$scope','$state','dashboardSvc','$filter',function($scope, $state, svc, $filter){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }
    // dashboardObj
    $scope.test = function() {
        console.log('----- DashExtCtrl test ----');
//        console.dir($scope.dashboardObj.ext1());
//        console.dir($scope.dashboardObj.ext2());
    }

    $scope.extRelatedData = {};         // 存储萃取电积相关的历史数据
    $scope.timeDimension = {};
    $scope.timeDimension.radioModel = 'Day';

    var fn = {
        computedElectrData: function() {
            if ($scope.timeDimension.radioModel == 'Day') {
                return _.sortBy(this.electrowin,function(e) {
                    return e.jlrq;
                })
            }
            else if ($scope.timeDimension.radioModel == 'Month') {
                var data = _.groupBy(this.electrowin,function(e) {
                    return $filter('date')(e.jlrq,'yyyy-MM');
                });
                var arrs = [];
                angular.forEach(data,function(value,key) {
                    var item = {};
                    item.jlrq = key;            // jlrq
                    item.openHours = _.reduce(value,function(memo,e) {
                        return memo + e.openHours;
                    },0);
                    item.djsjCuQty = _.reduce(value,function(memo,e) {
                        return memo + e.djsjCuQty;
                    },0);
                    item.dlxy = _.reduce(value,function(memo,e) {
                        return memo + e.dlxy;
                    },0);
                    item.djqyQty = _.reduce(value,function(memo,e) {
                        return memo + e.djqyQty;
                    },0);
                    item.djqyCund = _.reduce(value,function(memo,e) {
                        return memo + e.djqyCund;
                    },0);
                    item.djqyCund /= value.length;
                    item.djqyTfend = _.reduce(value,function(memo,e) {
                        return memo + e.djqyTfend;
                    },0);
                    item.djqyTfend /= value.length;
                    item.djqySd = _.reduce(value,function(memo,e){
                        return memo + e.djqySd;
                    },0);
                    item.djqySd /= value.length;
                    item.djhyCund = _.reduce(value,function(memo,e){
                        return memo + e.djhyCund;
                    },0);
                    item.djhyCund /= value.length;
                    item.djhyTfend = _.reduce(value,function(memo,e) {
                        return memo + e.djhyTfend ;
                    },0);
                    item.djhyTfend /= value.length;
                    item.djhySd = _.reduce(value,function(memo,e) {
                        return memo + e.djhySd;
                    });
                    item.djhySd /= value.length;
                    item.djhyWpQty = _.reduce(value,function(memo,e) {
                        return memo + e.djhyWpQty;
                    },0);
                    item.cqdjDHQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqdjDHQty;
                    },0);

                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e) {
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Year') {
                var data = _.groupBy(this.electrowin,function(e) {
                    return $filter('date')(e.jlrq,'yyyy');
                });
                var arrs = [];
                angular.forEach(data,function(value,key) {
                    var item = {};
                    item.jlrq = key;            // jlrq
                    item.openHours = _.reduce(value,function(memo,e) {
                        return memo + e.openHours;
                    },0);
                    item.djsjCuQty = _.reduce(value,function(memo,e) {
                        return memo + e.djsjCuQty;
                    },0);
                    item.dlxy = _.reduce(value,function(memo,e) {
                        return memo + e.dlxy;
                    },0);
                    item.djqyQty = _.reduce(value,function(memo,e) {
                        return memo + e.djqyQty;
                    },0);
                    item.djqyCund = _.reduce(value,function(memo,e) {
                        return memo + e.djqyCund;
                    },0);
                    item.djqyCund /= value.length;
                    item.djqyTfend = _.reduce(value,function(memo,e) {
                        return memo + e.djqyTfend;
                    },0);
                    item.djqyTfend /= value.length;
                    item.djqySd = _.reduce(value,function(memo,e){
                        return memo + e.djqySd;
                    },0);
                    item.djqySd /= value.length;
                    item.djhyCund = _.reduce(value,function(memo,e){
                        return memo + e.djhyCund;
                    },0);
                    item.djhyCund /= value.length;
                    item.djhyTfend = _.reduce(value,function(memo,e) {
                        return memo + e.djhyTfend ;
                    },0);
                    item.djhyTfend /= value.length;
                    item.djhySd = _.reduce(value,function(memo,e) {
                        return memo + e.djhySd;
                    });
                    item.djhySd /= value.length;
                    item.djhyWpQty = _.reduce(value,function(memo,e) {
                        return memo + e.djhyWpQty;
                    },0);
                    item.cqdjDHQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqdjDHQty;
                    },0);

                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e) {
                    return e.jlrq;
                });
            }
            else {
                console.log('时间维度只支持Year,Month,Day.');
            }
        },
        migratedExtData: function() {
            var ext1 = this.ext1Datas();
            var ext2 = this.ext2Datas();
//            console.dir(ext1);
//            console.dir(ext2);

            var arrs = [];
            angular.forEach(ext1,function(value,key) {
                var item = {};
                for (var prop in value) {       // 获取所有一期的数据
                    item[prop] = value[prop];
                }
                var value2 = _.findWhere(ext2,{
                    'jlrq': value.jlrq
                });

                if (value2) {
                    item.openHours2 = value2.openHours;
                    item.totalCql2 = value2.totalCql;
                    item.cqyyQty += value2.cqyyQty;         // 萃取原液量 1期 + 二期
                    item.cqcu += value2.cqcu;               // 萃取传递铜  1+2
                    item.cqyyPh2 = value2.cqyyPh;
                    item.cqyyCund2 = value2.cqyyCund;
                    item.cqyyTfend2 = value2.cqyyTfend;
                    item.cqyySd2 = value2.cqyySd;
                    item.cqyywpFhcQty += value2.cqyywpFhcQty;
                    item.xdywpQty += value2.xdywpQty;
                }
                else {
                    item.openHours2 = 0;
                    item.totalCql2 = 0;
                    item.cqyyQty += 0;         // 萃取原液量 1期 + 二期
                    item.cqcu += 0;               // 萃取传递铜  1+2
                    item.cqyyPh2 = 0;
                    item.cqyyCund2 = 0;
                    item.cqyyTfend2 = 0;
                    item.cqyySd2 = 0;
                    item.cqyywpFhcQty += 0;
                    item.xdywpQty += 0;
                }
                arrs.push(item);
            });
//            console.dir(arrs);
            return arrs;
        },
        ext1Datas : function() {
            if ($scope.timeDimension.radioModel == 'Day') {
                return _.sortBy(_.where(this.extract, {
                    'period': 1
                }),function(e) {
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Month') {
                var e1 = _.groupBy(_.where(this.extract, {
                    'period' : 1
                }),function(element) {          // group by clause
                    return $filter('date')(element.jlrq, 'yyyy-MM');
                });
                var arrs = [];
                angular.forEach(e1,function(value,key) {
                    var item = {};
                    item.jlrq = key;                // jlrq YYYY-MM
                    item.openHours = _.reduce(value,function(memo, e) {     // Sum OpenHours
                        return memo + e.openHours;
                    },0);
                    item.totalCql = _.reduce(value,function(memo,e) {
                        return memo + e.totalCql;
                    },0);
                    item.totalCql /= value.length;                          // Average totalCql
                    item.cqyyQty = _.reduce(value,function(memo,e){         // sum 萃取原液量
                        return memo + e.openHours * e.cqyyLL;
                    },0);
                    item.cqcu = _.reduce(value,function(memo,e){            // sum 萃取传递铜
                        return memo + e.cqcu;
                    },0);
                    item.cqyyPh = _.reduce(value,function(memo,e){
                        return memo + e.cqyyPh;
                    },0);
                    item.cqyyPh /= value.length;
                    item.cqyyCund = _.reduce(value,function(memo,e){
                        return memo + e.cqyyCund;
                    },0);
                    item.cqyyCund /= value.length;
                    item.cqyyTfend = _.reduce(value,function(memo,e){
                        return memo + e.cqyyTfend;
                    },0);
                    item.cqyyTfend /= value.length;
                    item.cqyySd = _.reduce(value,function(memo,e){
                        return memo + e.cqyySd;
                    },0);
                    item.cqyySd /= value.length;
                    item.cqyywpFhcQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqyywpFhcQty;
                    },0);
                    item.xdywpQty = _.reduce(value,function(memo,e){
                        return memo + e.xdywpQty;
                    },0);
                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Year') {
                var e1 = _.groupBy(_.where(this.extract, {
                    'period' : 1
                }),function(element) {          // group by clause
                    return $filter('date')(element.jlrq, 'yyyy');
                });
                var arrs = [];
                angular.forEach(e1,function(value,key) {
                    var item = {};
                    item.jlrq = key;                // jlrq YYYY
                    item.openHours = _.reduce(value,function(memo, e) {     // Sum OpenHours
                        return memo + e.openHours;
                    },0);
                    item.totalCql = _.reduce(value,function(memo,e) {
                        return memo + e.totalCql;
                    },0);
                    item.totalCql /= value.length;                          // Average totalCql
                    item.cqyyQty = _.reduce(value,function(memo,e){         // sum 萃取原液量
                        return memo + e.openHours * e.cqyyLL;
                    },0);
                    item.cqcu = _.reduce(value,function(memo,e){            // sum 萃取传递铜
                        return memo + e.cqcu;
                    },0);
                    item.cqyyPh = _.reduce(value,function(memo,e){
                        return memo + e.cqyyPh;
                    },0);
                    item.cqyyPh /= value.length;
                    item.cqyyCund = _.reduce(value,function(memo,e){
                        return memo + e.cqyyCund;
                    },0);
                    item.cqyyCund /= value.length;
                    item.cqyyTfend = _.reduce(value,function(memo,e){
                        return memo + e.cqyyTfend;
                    },0);
                    item.cqyyTfend /= value.length;
                    item.cqyySd = _.reduce(value,function(memo,e){
                        return memo + e.cqyySd;
                    },0);
                    item.cqyySd /= value.length;
                    item.cqyywpFhcQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqyywpFhcQty;
                    },0);
                    item.xdywpQty = _.reduce(value,function(memo,e){
                        return memo + e.xdywpQty;
                    },0);
                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else {
                console.log('时间维度只支持Year,Month,Day.');
            }

        },
        ext2Datas : function() {
            if ($scope.timeDimension.radioModel == 'Day') {
                return _.sortBy(_.where(this.extract, {
                    'period': 2
                }),function(e) {
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Month') {
                var e1 = _.groupBy(_.where(this.extract, {
                    'period' : 2
                }),function(element) {          // group by clause
                    return $filter('date')(element.jlrq, 'yyyy-MM');
                });
                var arrs = [];
                angular.forEach(e1,function(value,key) {
                    var item = {};
                    item.jlrq = key;                // jlrq YYYY-MM
                    item.openHours = _.reduce(value,function(memo, e) {     // Sum OpenHours
                        return memo + e.openHours;
                    },0);
                    item.totalCql = _.reduce(value,function(memo,e) {
                        return memo + e.totalCql;
                    },0);
                    item.totalCql /= value.length;                          // Average totalCql
                    item.cqyyQty = _.reduce(value,function(memo,e){         // sum 萃取原液量
                        return memo + e.openHours * e.cqyyLL;
                    },0);
                    item.cqcu = _.reduce(value,function(memo,e){            // sum 萃取传递铜
                        return memo + e.cqcu;
                    },0);
                    item.cqyyPh = _.reduce(value,function(memo,e){
                        return memo + e.cqyyPh;
                    },0);
                    item.cqyyPh /= value.length;
                    item.cqyyCund = _.reduce(value,function(memo,e){
                        return memo + e.cqyyCund;
                    },0);
                    item.cqyyCund /= value.length;
                    item.cqyyTfend = _.reduce(value,function(memo,e){
                        return memo + e.cqyyTfend;
                    },0);
                    item.cqyyTfend /= value.length;
                    item.cqyySd = _.reduce(value,function(memo,e){
                        return memo + e.cqyySd;
                    },0);
                    item.cqyySd /= value.length;
                    item.cqyywpFhcQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqyywpFhcQty;
                    },0);
                    item.xdywpQty = _.reduce(value,function(memo,e){
                        return memo + e.xdywpQty;
                    },0);
                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else if ($scope.timeDimension.radioModel == 'Year') {
                var e1 = _.groupBy(_.where(this.extract, {
                    'period' : 2
                }),function(element) {          // group by clause
                    return $filter('date')(element.jlrq, 'yyyy');
                });
                var arrs = [];
                angular.forEach(e1,function(value,key) {
                    var item = {};
                    item.jlrq = key;                // jlrq YYYY
                    item.openHours = _.reduce(value,function(memo, e) {     // Sum OpenHours
                        return memo + e.openHours;
                    },0);
                    item.totalCql = _.reduce(value,function(memo,e) {
                        return memo + e.totalCql;
                    },0);
                    item.totalCql /= value.length;                          // Average totalCql
                    item.cqyyQty = _.reduce(value,function(memo,e){         // sum 萃取原液量
                        return memo + e.openHours * e.cqyyLL;
                    },0);
                    item.cqcu = _.reduce(value,function(memo,e){            // sum 萃取传递铜
                        return memo + e.cqcu;
                    },0);
                    item.cqyyPh = _.reduce(value,function(memo,e){
                        return memo + e.cqyyPh;
                    },0);
                    item.cqyyPh /= value.length;
                    item.cqyyCund = _.reduce(value,function(memo,e){
                        return memo + e.cqyyCund;
                    },0);
                    item.cqyyCund /= value.length;
                    item.cqyyTfend = _.reduce(value,function(memo,e){
                        return memo + e.cqyyTfend;
                    },0);
                    item.cqyyTfend /= value.length;
                    item.cqyySd = _.reduce(value,function(memo,e){
                        return memo + e.cqyySd;
                    },0);
                    item.cqyySd /= value.length;
                    item.cqyywpFhcQty = _.reduce(value,function(memo,e) {
                        return memo + e.cqyywpFhcQty;
                    },0);
                    item.xdywpQty = _.reduce(value,function(memo,e){
                        return memo + e.xdywpQty;
                    },0);
                    arrs.push(item);
                });
                return _.sortBy(arrs,function(e){
                    return e.jlrq;
                });
            }
            else {
                console.log('时间维度只支持Year,Month,Day.');
            }
        },
        electrowinDatas: function() {
            return _.sortBy(this.electrowin,function(e) {
                return e.jlrq;
            })
        }
    };

    $scope.chartTabSelect = function() {
        svc.getEEAboutAllData().success(function(response){
            $scope.extRelatedData = response['data'] ;
            for (var k in fn) {
                $scope.extRelatedData[k] = fn[k];
            }
            _.each($scope.extRelatedData['extract'],function(e) {
                e.cqyyQty = e.cqyyLL * e.openHours;
            })
        }).
            error(function(){
                $.growl('获取萃取电积相关数据时发生服务器端通讯异常。')
            })
    }

    // Draw the chart
    $scope.chartDraw = function() {
        var data = $scope.extRelatedData.migratedExtData();
        var minPeriod = "";
        var dataDateFormat = "YYYY-MM-DD";
        if ($scope.timeDimension.radioModel == 'Day'){
            dataDateFormat = "YYYY-MM-DD";
            minPeriod = 'DD';
        }
        else if($scope.timeDimension.radioModel == 'Month') {
            dataDateFormat = "YYYY-MM";
            minPeriod = 'MM';
        }
        else if ($scope.timeDimension.radioModel == 'Year') {
            dataDateFormat = "YYYY";
            minPeriod = 'YYYY';
        }

        // 开机时间
        easyLineChart(data,{
            items:[
                {
                    unit:'h',
                    prop:'openHours',
                    title:'开机时间1期'
                },
                {
                    unit:'h',
                    prop:'openHours2',
                    title:'开机时间2期'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'eext-openhours',
            refresh: true
        });
        //萃取率
        easyLineChart(data,{
            items: [
                {
                    unit:'%',
                    prop:'totalCql',
                    title:'一期总萃取率'
                },
                {
                    unit:'%',
                    prop:'totalCql2',
                    title:'二期总萃取率'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'eext-totalCql',
            refresh: true
        });
        // 萃取原液量
        easyLineChart(data,{
            items: [
                {
                    unit:'M3',
                    prop:'cqyyQty',
                    title:'萃取原液量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'eext-cqyyQty',
            refresh: true
        });
        // 萃取传递铜量
        easyLineChart(data,{
            items: [
                {
                    unit:'Kg',
                    prop:'cqcu',
                    title:'萃取传递铜量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'eext-cqcu',
            refresh: true
        });
        // 萃取原液性质
        easyLineChart(data,{
            items: [
                {
                    unit:'ph',
                    prop:'cqyyPh2',
                    title:'PH值2期'
                },
                {
                    unit:'ph',
                    prop:'cqyyPh',
                    title:'PH值1期'
                },
                {
                    unit:'g/L',
                    prop:'cqyyCund2',
                    title:'铜离子浓度2期'
                },
                {
                    unit:'g/L',
                    prop:'cqyyCund',
                    title:'铜离子浓度1期'
                },
                {
                    unit:'g/L',
                    prop:'cqyyTfend2',
                    title:'TFe浓度2期'
                },
                {
                    unit:'g/L',
                    prop:'cqyyTfend',
                    title:'TFe浓度1期'
                },
                {
                    unit:'g/L',
                    prop:'cqyySd2',
                    title:'酸度2期'
                },
                {
                    unit:'g/L',
                    prop:'cqyySd',
                    title:'酸度1期'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'eext-cqyy',
            refresh: true
        });

        var data2 = $scope.extRelatedData.computedElectrData();
        // 开机时间
        easyLineChart(data2,{
            items:[
                {
                    unit:'h',
                    prop:'openHours',
                    title:'开机时间'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-open',
            refresh: true
        });
        // 电积实际产铜量
        easyLineChart(data2,{
            items:[
                {
                    unit:'Kg',
                    prop:'djsjCuQty',
                    title:'实际产铜量'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-djsjcu',
            refresh: true
        });
        // 电流效率
        easyLineChart(data2,{
            items:[
                {
                    unit:'%',
                    prop:'dlxy',
                    title:'电流效率'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-dlxl',
            refresh: true
        });
        // 电积前液量
        easyLineChart(data2,{
            items:[
                {
                    unit:'M3',
                    prop:'djqyQty',
                    title:'电积前液'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-djqyQty',
            refresh: true
        });
        // 电积前液后液 Cu，TFe，酸浓度
        easyLineChart(data2,{
            items:[
                {
                    unit:'g/L',
                    prop:'djqyCund',
                    title:'电积前液Cu浓度'
                },
                {
                    unit:'g/L',
                    prop:'djqyTfend',
                    title:'电积前液TFe浓度'
                },
                {
                    unit:'g/L',
                    prop:'djqySd',
                    title:'电积前液酸浓度'
                },
                {
                    unit:'g/L',
                    prop:'djhyCund',
                    title:'电积后液铜浓度'
                },
                {
                    unit:'g/L',
                    prop:'djhyTfend',
                    title:'电积后液TFe浓度'
                },
                {
                    unit:'g/L',
                    prop:'djhySd',
                    title:'电积后液酸浓度'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-djqy',
            refresh: true
        });
        // 电积后液外排量
        easyLineChart(data2,{
            items:[
                {
                    unit:'M3',
                    prop:'djhyWpQty',
                    title:'电积后液外排'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-djhywp',
            refresh: true
        });
        // 萃取电积总电耗
        easyLineChart(data2,{
            items:[
                {
                    unit:'度',
                    prop:'cqdjDHQty',
                    title:'萃取电积总电耗'
                }
            ],
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': minPeriod,
                'dataDateFormat': dataDateFormat
            },
            container: 'elec-cqdjzdh',
            refresh: true
        });

    }
}]);

//生产工艺示意图 Controller
icdModule.controller('DashController',['$scope','$state','dashboardSvc','$modal',function($scope,$state,svc,$modal){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    // Menu Items.
    $scope.menuItems = [
        {
            index: 0,
            title: '生产工艺总流程',
            state: 'process.main',
            default: true,
            disable: false,
            active: false
        },
        {
            index: 1,
            title: '堆浸工艺流程',
            state: 'process.heap',
            default: false,
            disable: true,
            active: false
        },
        {
            index: 2,
            title: '萃取电积工艺流程',
            state: 'process.extextrowin',
            default: false,
            disable: true,
            active: false
        },
        {
            index: 3,
            title: '环保中和工艺流程',
            state: 'process.neutro',
            default: false,
            disable: true,
            active: false
        }
    ];

    //
    $scope.lineChecked = function(menu) {
        return $state.is(menu.state);
    };

    // Click Event Handler, Change the state
    $scope.menuCheck = function(event, menu) {

        angular.forEach($scope.menuItems, function(value,key){
            value.active = false;
        });
        menu.active=true;
        console.log(' ----- state go :'+menu.state);
//        console.dir($scope.menuItems);
        $state.go(menu.state);
    };

    $scope.test = function() {
        $state.go('process.main');

    };

    $scope.heapSegmentClick = function() {
        $state.go('process.heap');
    }

    $scope.extSegmentClick = function() {
        $state.go('process.extextrowin');
    }

    //触发 环保中和 Modal 详细数据
    $scope.neutroDetail = function() {
        var modalInstance = $modal.open({
            templateUrl: 'neutro-detail.html',
            controller: function($scope,$modalInstance, neutroParam) {
                $scope.ok = function () {
                    console.log(' ----- modal exit ------');
                    $modalInstance.close();
                };
                $scope.param = neutroParam;
            },
            resolve: {
                neutroParam: function() {
                    return $scope.dashboardObj.neutrolization;
                }
            }
        });
    };

    //触发 电积详细数据 Modal
    $scope.electrowinDetail = function() {
        var modalInstance = $modal.open({
            templateUrl: 'electrowin-detail.html',
            controller: function($scope,$modalInstance, electrowinParam) {
                $scope.ok = function () {
                    console.log(' ----- modal exit ------');
                    $modalInstance.close();
                };
                $scope.param = electrowinParam;
            },
            resolve: {
                electrowinParam: function() {
                    return $scope.dashboardObj.electrowin;
                }
            }
        });
    };

    // 显示 萃取详细数据 Modal
    $scope.extractDetail = function() {
        var modalInstance = $modal.open({
            templateUrl: 'extract-detail.html',
            controller: extrModalInstanceCtrl,
            resolve: {
                extractParams: function() {
                    return $scope.dashboardObj.extractParams;
                }
            }
        });
    };

    // 显示溶液池详细数据 Modal
    $scope.solPoolDetail = function() {
        //alert('---------- fyc detail -------------');
        var modalInstance = $modal.open({
            templateUrl: 'solPool-detail.html',
            controller: spModalInstanceCtrl,
            resolve: {
                poolParams: function() {
                    return $scope.dashboardObj.poolParam;
                }
            }
        });
    };

    // 显示浸出详细数据 Modal
    $scope.leachoutDetail = function(e) {
        //alert('----- svg click event ------');

        var modalInstance = $modal.open({
            templateUrl : 'leachout-detail.html',
            controller: ldModalInstanceCtrl,
            resolve: {
                leachings : function() {
                    return $scope.dashboardObj.leachingOuts;
                }
            }
        });


    }

    $scope.dashboardObj = {};           // Storage all dashboard about data  (Special day)
    var fn = {
        computedLeachingOutObj : function() {
            var returnObj = {
                sumLiquidQty : 0,       // 浸出液体总量
                avgPH: 0.00,               // ph 平均值
                avgEH: 0.00,               // 电位 平均值
                avgCund: 0.0,               // 铜浓度 平均值
                avgFend: 0.0,               // 铁浓度 平均值
                avgSnd: 0.0,                 // 酸浓度 平均值
                avgJcpct: 0.0,              // 浸出率 平均值
                sumFeQty: 0.0,              // 浸出铁 总量
                sumCuQty: 0.0,               // 浸出铜 总量
                sumRainQty: 0.0             // 降雨量 总量
            };
            if (this.leachingOuts) {
                // 计算总量
                angular.forEach(this.leachingOuts, function(value, key) {
                    returnObj.sumLiquidQty += value.jcryQty;
                    returnObj.sumFeQty += value.jcfe;
                    returnObj.sumCuQty += value.jccu;
                    returnObj.RainQty += value.jykczfl;
                });
                angular.forEach(this.leachingOuts, function(value, key) {
                    var q = value.jcryQty / (returnObj.sumLiquidQty);   // 权重
                    returnObj.avgPH += value.jcph * q;   // ??ph????
                    returnObj.avgEH += value.jceh * q;  // ??eh ??
                    returnObj.avgCund += value.jccund * q;  // ???
                    returnObj.avgFend += value.jctfend * q; // ???
                    returnObj.Snd += value.jcsld * q;       // ???
                    returnObj.avgJcpct += value.jcpct * q;  // ???
                });
            }
            return returnObj;
        }
        ,
        extractObj : function() {        // 总流程上需要显示的萃取数据
            var returnObj = {           // ?????????????mouseover|Click??????
                p1OpenHours : 0.0,
                p2OpenHours : 0.0,
                p1ExtractRatio: 0,
                p2ExtractRatio: 0,
                p1Cu : 0,
                p2Cu : 0
            };
            if (this.extractParams) {
                angular.forEach(this.extractParams, function(value,key) {
                    if (value.period == 1) {    // 1?
                        returnObj.p1OpenHours = value.openHours;
                        returnObj.p1ExtractRatio = value.totalCql;
                        returnObj.p1Cu = value.cqcu;
                    }
                    else {                      // 2?
                        returnObj.p2OpenHours = value.openHours;
                        returnObj.p2ExtractRatio = value.totalCql;
                        returnObj.p2Cu = value.cqcu;
                    }
                });
            }
            return returnObj;
        },
        ext1: function() {              // 萃取一期
            return _.findWhere(this.extractParams, {
                'period': 1
            });
        },
        ext2: function() {              // 萃取二期
            return _.findWhere(this.extractParams, {
                'period' : 2
            });
        }
    };

    $scope.jlrqChange = function(date) {
        svc.getAllDataByDay(date).success(function(response) {
            $scope.dashboardObj = response['data'] || {};
            for (var key in fn) {           // ???????????
                $scope.dashboardObj[key] = fn[key];
            }
//            console.dir($scope.dashboardObj);
        }).error(function() {
            console.log('error !!');
                $.growl('工艺流程数据服务器通讯异常');
            });
    };

}]);

// 历史数据查询 萃取电积
icdModule.controller('HistExtCtrl',['$scope','$state','dashboardSvc',function($scope,$state,svc) {
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    $scope.isCollapsed = true;

    var needShowColumns = function() {
        return _.where(this,{
            show: true
        });
    }
    // 电积数据项
    $scope.electroColumns = [
//        {
//            label:'日期',
//            propName:'jlrq',
//            show:true,
//            unit:'天'
//        },
        {
            label:'开机时间',
            propName:'openHours',
            show:true,
            unit:'h'
        },
        {
            label:'电积前液流量',
            propName:'djqyll',
            show:false,
            unit:'M3/h'
        },
        {
            label:'电积前液量',
            propName:'djqyQty',
            show:false,
            unit:'M3'
        },
        {
            label:'电积前液CU2+浓度',
            propName:'djqyCund',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积前液TFE浓度',
            propName:'djqyTfend',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积前液酸浓度',
            propName:'djqySd',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积后液CU2+浓度',
            propName:'djhyCund',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积后液TFE浓度',
            propName:'djhyTfend',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积后液酸浓度',
            propName:'djhySd',
            show:false,
            unit:'g/L'
        },
        {
            label:'电积液传递铜量',
            propName:'djyCuQty',
            show:true,
            unit:'Kg'
        },
        {
            label:'开动电积槽数',
            propName:'slots',
            show:true,
            unit:'#'
        },
        {
            label:'电流强度',
            propName:'dlqd',
            show:false,
            unit:'A'
        },
        {
            label:'电流密度',
            propName:'dlmd',
            show:false,
            unit:'A/M2'
        },
        {
            label:'电积理论出铜量',
            propName:'djllCuQty',
            show:true,
            unit:'Kg'
        },
        {
            label:'电积实际出铜量',
            propName:'djsjCuQty',
            show:true,
            unit:'Kg'
        },
        {
            label:'电流效率',
            propName:'dlxy',
            show:true,
            unit:'%'
        },
        {
            label:'整流器输出电压',
            propName:'zlqOutput',
            show:false,
            unit:'V'
        },
        {
            label:'电积槽电压',
            propName:'djcDianya',
            show:false,
            unit:'V'
        },
        {
            label:'电积温度',
            propName:'djWendu',
            show:false,
            unit:'℃'
        },
        {
            label:'电积回收率',
            propName:'djhsl',
            show:false,
            unit:'%'
        },
        {
            label:'萃取电积总电耗',
            propName:'cqdjDHQty',
            show:true,
            unit:'度'
        },
        {
            label:'硅整流电耗',
            propName:'gzlDHQty',
            show:false,
            unit:'度'
        },
        {
            label:'电积后液外排量',
            propName:'djhyWpQty',
            show:true,
            unit:'M3'
        },
        {
            label:'电积后液外排金属量',
            propName:'djhyWpJsQty',
            show:false,
            unit:'M3'
        }
    ];

    $scope.electroColumns.needShowColumns = needShowColumns;

    // 萃取数据项
    $scope.extColumns = [
//        {
//            label: '日期',
//            propName: 'jlrq',
//            show: true,
//            unit:'天'
//        },
        {
            label: '工艺期',
            propName: 'period',
            show: true,
            unit:'#'
        },
        {
            label: '开机时间',
            propName: 'openHours',
            show: true,
            unit:'h'
        },
        {
            label: '有机相流量',
            propName: 'yjxll',
            show: false,
            unit:'M3/h'
        },
        {
            label: '再生有机相CU2+浓度',
            propName: 'zsyjxCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '负载有机相CU2+浓度',
            propName: 'fzyjxCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '有机相传递铜量',
            propName: 'yjxcdCu',
            show: false,
            unit:'Kg'
        },
        {
            label: '再生有机相含铜量',
            propName: 'zsyjxCu',
            show: false,
            unit:'g/L'
        },
        {
            label: '负载有机相含铜量',
            propName: 'fzyjxCu',
            show: false,
            unit:'g/L'
        },
        {
            label: '萃取一级B|D有机相回流',
            propName: 'cq1bdYjxHl',
            show: false,
            unit:'M3/h'
        },
        {
            label: '萃取相比',
            propName: 'false',
            show: false,
            unit:'%'
        },
        {
            label: '萃取原液流量',
            propName: 'cqyyLL',
            show: true,
            unit:'M3/h'
        },
        {
            label: '萃取A|C原液量',
            propName: 'cqacYyl',
            show: false,
            unit:'M3'
        },
        {
            label: '萃取B|D原液量',
            propName: 'cqbdYyl',
            show: false,
            unit:'M3'
        },
        {
            label: '萃取原液含铜量',
            propName: 'cqyyCu',
            show: true,
            unit:'Kg'
        },
        {
            label: '萃取原液CU2+浓度',
            propName: 'cqyyCund',
            show: true,
            unit:'g/L'
        },
        {
            label: '萃取原液TFE浓度',
            propName: 'cqyyTfend',
            show: true,
            unit:'g/L'
        },
        {
            label: '萃取原液PH值',
            propName: 'cqyyPh',
            show: true,
            unit:'ph'
        },
        {
            label: '萃取原液酸度',
            propName: 'cqyySd',
            show: true,
            unit:'g/L'
        },
        {
            label: '萃取原液蚀度',
            propName: 'cqyyZd',
            show: false,
            unit:'NTU'
        },
        {
            label: '萃取一级B|D余液CU2+浓度',
            propName: 'cq1bdYYCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '萃取二级A|C余液CU2+浓度',
            propName: 'cq2acYYCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '萃取一级A|C水相回流',
            propName: 'cq1acSxhl',
            show: false,
            unit:'M3/h'
        },
        {
            label: '萃取二级A|C有机相回流',
            propName: 'cq2acYjxhl',
            show: false,
            unit:'M3/h'
        },
        {
            label: '萃余液池CU2+浓度',
            propName: 'cyyc2Cund',
            show: false
        },
        {
            label: '萃取余液TFE浓度',
            propName: 'cqyy2Tfend',
            show: false,
            unit:'g/L'
        },
        {
            label: '萃取余液PH值',
            propName: 'cqyy2Ph',
            show: false,
            unit:'ph'
        },
        {
            label: '萃取余液酸度',
            propName: 'cqyy2Sd',
            show: false,
            unit:'g/L'
        },
        {
            label: '萃取A|C萃取率',
            propName: 'cqacCql',
            show: false,
            unit:'%'
        },
        {
            label: '萃取B|D萃取率',
            propName: 'cqbdCql',
            show: false,
            unit:'%'
        },
        {
            label: '总萃取率',
            propName: 'totalCql',
            show: true,
            unit:'%'
        },
        {
            label: '萃取传递铜量',
            propName: 'cqcu',
            show: true,
            unit:'Kg'
        },
        {
            label: '萃取传递铁量',
            propName: 'cqfe',
            show: false,
            unit:'Kg'
        },
        {
            label: '反萃液流量',
            propName: 'fcyLL',
            show: false,
            unit:'M3/h'
        },
        {
            label: '反萃液量',
            propName: 'fcyl',
            show: false,
            unit:'M3'
        },
        {
            label: '反萃液CU2+浓度',
            propName: 'fcyCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '反萃液TFE浓度',
            propName: 'fcyTfend',
            show: false,
            unit:'g/L'
        },
        {
            label: '反萃液酸浓度',
            propName: 'fcySd',
            show: false,
            unit:'g/L'
        },
        {
            label: '反萃水相回流量',
            propName: 'fcsxHll',
            show: false,
            unit:'M3/h'
        },
        {
            label: '反萃相比',
            propName: 'fcxb',
            show: false,
            unit:'%'
        },
        {
            label: '反萃后液铜浓度',
            propName: 'fchyCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '反萃后液铁浓度',
            propName: 'fchyTfend',
            show: false,
            unit:'g/L'
        },
        {
            label: '反萃后液酸度',
            propName: 'fchySd',
            show: false,
            unit:'g/L'
        },
        {
            label: '一次反萃率',
            propName: 'ycfcRate',
            show: false,
            unit:'%'
        },
        {
            label: '反萃液传递铜',
            propName: 'fcycdCu',
            show: false,
            unit:'Kg'
        },
        {
            label: '反萃液传递铁',
            propName: 'fcycdFe',
            show: false,
            unit:'Kg'
        },
        {
            label: '反萃供液传递铜',
            propName: 'fcgycdCu',
            show: false,
            unit:'Kg'
        },
        {
            label: '反萃后液传递铜',
            propName: 'fchycdCu',
            show: false,
            unit:'Kg'
        },
        {
            label: '洗涤液流量',
            propName: 'xdyll',
            show: false,
            unit: 'M3/h'
        },
        {
            label: '洗涤液量',
            propName: 'xdyQty',
            show: false,
            unit:'M3'
        },
        {
            label: '洗涤液铜浓度',
            propName: 'xdyCund',
            show: false,
            unit:'g/L'
        },
        {
            label: '洗涤液铁浓度',
            propName: 'xdyTfend',
            show: false,
            unit:'g/L'
        },
        {
            label: '洗涤液PH',
            propName: 'xdyPh',
            show: false,
            unit:'ph'
        },
        {
            label: '洗涤液酸度',
            propName: 'xdySd',
            show: false,
            unit:'g/L'
        },
        {
            label: '一级 A|C 萃取池三相量',
            propName: 'yjacCqc3xl',
            show: false,
            unit:'mm'
        },
        {
            label: '二级 A|C 萃取池三相量',
            propName: 'ejacCqc3xl',
            show: false,
            unit:'mm'
        },
        {
            label: '一级 B|D 萃取池三相量',
            propName: 'yjbdCqc3xl',
            show: false,
            unit:'mm'
        },
        {
            label: '萃取反萃池三相量',
            propName: 'cqFcc3xl',
            show: false,
            unit:'mm'
        },
        {
            label: '萃取余液外排量 防洪池',
            propName: 'cqyywpFhcQty',
            show: true,
            unit:'M3'
        },
        {
            label: '萃取余液金属量 防洪池',
            propName: 'cqyywpFhcJsQty',
            show: false,
            unit:'M3'
        },
        {
            label: '萃余液槽萃余液 外排 环保水量',
            propName: 'cyyc1wpWaterQty',
            show: false,
            unit:'M3'
        },
        {
            label: '萃余液槽萃余液 外排 金属量',
            propName: 'cyyc1wpJsQty',
            show: false,
            unit:'Kg'
        },
        {
            label: '洗涤液 外排量',
            propName: 'xdywpQty',
            show: true,
            unit:'M3'
        },
        {
            label: '洗涤液 外排铜金属量',
            propName: 'xdywpJsQty',
            show: false,
            unit:'Kg'
        }
    ];
    $scope.extColumns.needShowColumns = needShowColumns;

    // 获取数据
    $scope.data = {};
    svc.getEEAboutAllData().success(function(response){
        $scope.data = response['data'];

    }).error(function(){
            $.growl('萃取电积数据获取失败，服务器端通讯异常.');
        });

    $scope.drawChartExt = function(period) {
//        console.log('------- period:'+period);
        var chartDef = {
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'
            }
        };

        chartDef.container = 'hist-extract-chart';
        chartDef.refresh = true;
        chartDef.items = [];
        angular.forEach($scope.extColumns.needShowColumns(),function(value,key) {
            var item = {};
            item.unit = value['unit'];
            item.prop = value['propName'];
            item.title = value['label'];
            chartDef.items.push(item);
        });


        easyLineChart(_.sortBy(_.where($scope.data.extract,{'period':period}),function(e) {return e.jlrq;}),chartDef);
    };

    $scope.drawChartElectro = function() {
        var chartDef = {
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'
            }
        };

        chartDef.container = 'hist-electro-chart';
        chartDef.refresh = true;
        chartDef.items = [];
        angular.forEach($scope.electroColumns.needShowColumns(),function(value,key) {
            var item = {};
            item.unit = value['unit'];
            item.prop = value['propName'];
            item.title = value['label'];
            chartDef.items.push(item);
        });

        easyLineChart(_.sortBy($scope.data.electrowin,function(e) {return e.jlrq;}),chartDef);
    }
}]);

// 历史数据查询 环保中和
icdModule.controller('HistNeutroCtrl',['$scope','$state','dashboardSvc',function($scope,$state,svc){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }
    $scope.isCollapsed = true;

    var needShowColumns = function() {
        return _.where(this,{
            show: true
        });
    }
    // 电积数据项
    $scope.neutroColumns = [
//        {
//            label:'日期',
//            propName:'jlrq',
//            show:true,
//            unit:'天'
//        },
        {
            label:'降雨量',
            propName:'rainQty',
            show:false,
            unit:'M3'
        },
        {
            label:'去铁去酸水量',
            propName:'qtqsWaterQty',
            show:false,
            unit:'M3'
        },
        {
            label:'处理量萃余液',
            propName:'cllCyyQty',
            show:true,
            unit:'M3'
        },
        {
            label:'处理量防洪池二期',
            propName:'cllFhc2Qty',
            show:true,
            unit:'M3'
        },
        {
            label:'处理量总量',
            propName:'cllSumQty',
            show:false,
            unit:'M3'
        },
        {
            label:'处理水质PH',
            propName:'clszPh',
            show:false,
            unit:'ph'
        },
        {
            label:'处理水质CU2+',
            propName:'clszCund',
            show:false,
            unit:'g/L'
        },
        {
            label:'处理水质TFE',
            propName:'clszTfend',
            show:false,
            unit:'g/L'
        },
        {
            label:'处理水质H2SO4',
            propName:'clszSd',
            show:false,
            unit:'g/L'
        },
        {
            label:'处理损失金属总量铜',
            propName:'clLostCu',
            show:false,
            unit:'T'
        },
        {
            label:'处理损失金属总量铁',
            propName:'clLostFe',
            show:false,
            unit:'T'
        },
        {
            label:'处理损失金属总量硫酸',
            propName:'clLostH2so4',
            show:false,
            unit:'T'
        },
        {
            label:'处理时间一系列',
            propName:'clsj1',
            show:false,
            unit:'h'
        },
        {
            label:'处理时间二系列',
            propName:'clsj2',
            show:false,
            unit:'h'
        },
        {
            label:'处理时间三系列',
            propName:'clsj3',
            show:false,
            unit:'h'
        },
        {
            label:'石灰药剂消耗一系列',
            propName:'shyjxh1',
            show:true,
            unit:'T'
        },
        {
            label:'石灰药剂消耗二系列',
            propName:'shyjxh2',
            show:true,
            unit:'T'
        },
        {
            label:'石灰药剂消耗三系列',
            propName:'shyjxh3',
            show:true,
            unit:'T'
        },
        {
            label:'石灰药剂消耗实际单耗',
            propName:'shyjSjdh',
            show:false,
            unit:'Kg/M3'
        },
        {
            label:'外排量环保溢流',
            propName:'wphbylQty',
            show:true,
            unit:'M3'
        },
        {
            label:'外排量选冶溢流',
            propName:'wpxyylQty',
            show:true,
            unit:'M3'
        },
        {
            label:'外排量3#子坝上清液',
            propName:'wp3zbsqyQty',
            show:true,
            unit:'M3'
        },
        {
            label:'压滤机压滤板数',
            propName:'yljYlbs',
            show:false,
            unit:'#'
        },
        {
            label:'压滤机压榨量',
            propName:'yljYzls',
            show:false,
            unit:'M3'
        },
        {
            label:'3#子坝液位夜班',
            propName:'yewei3Yb',
            show:false,
            unit:'M'
        },
        {
            label:'3#子坝液位早班',
            propName:'yewei3Zb',
            show:false,
            unit:'M'
        },
        {
            label:'3#子坝液位中班',
            propName:'yewei3Mb',
            show:false,
            unit:'M'
        }
    ];
    $scope.neutroColumns.needShowColumns = needShowColumns;

    // 获取数据
    $scope.data = {};
    svc.getNeutroAboutAllData().success(function(response){
        $scope.data = response['data'];
    }).error(function(){
            $.growl('萃取中和数据获取失败，服务器端通讯异常.');
        });

    $scope.drawChart = function() {

        var chartDef = {
            category: {
                prop: 'jlrq',
                parseDates: true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'
            }
        };

        chartDef.container = 'hist-neutro-chart';
        chartDef.refresh = true;
        chartDef.items = [];
        angular.forEach($scope.neutroColumns.needShowColumns(),function(value,key) {
            var item = {};
            item.unit = value['unit'];
            item.prop = value['propName'];
            item.title = value['label'];
            chartDef.items.push(item);
        });


        easyLineChart(_.sortBy($scope.data.neutros,function(e) {return e.jlrq;}),chartDef);
    };

}]);

//历史数据查询 Controller
icdModule.controller('HistoryController',['$scope','$state','dashboardSvc','$modal',function($scope,$state,svc,$modal){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    // Menu Items.
    $scope.menuItems = [

        {
            index: 1,
            title: '堆浸工艺数据查询',
            state: 'history.heap',
            default: false,
            disable: true,
            active: false
        },
        {
            index: 2,
            title: '萃取电积工艺数据',
            state: 'history.extextrowin',
            default: false,
            disable: true,
            active: false
        },
        {
            index: 3,
            title: '环保中和工艺数据',
            state: 'history.neutro',
            default: false,
            disable: true,
            active: false
        }
    ];

    //
    $scope.lineChecked = function(menu) {
        return $state.is(menu.state);
    };

    // Click Event Handler, Change the state
    $scope.menuCheck = function(event, menu) {

        angular.forEach($scope.menuItems, function(value,key){
            value.active = false;
        });
        menu.active=true;
//        console.log(' ----- state go :'+menu.state);
//        console.dir($scope.menuItems);
        $state.go(menu.state);
    };

}]);

// 物料平衡计算 Controller
icdModule.controller('BalanceCtrl',['$scope','$state','$modal','dashboardSvc','$filter',function($scope,$state,$modal,dashboardSvc,$filter) {
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }
    $scope.timeDimension = {};
    $scope.timeDimension.radioModel = 'Day';

    // amcharts 绘图

    /*
     chartDef = {
     items: [{
     'unit': '单位',
     'prop': '属性名称',
     'title': '标题'
     }...],
     category: {
     'prop': '用于x轴的属性',
     'parseDates': true|false,
     'minPeriod': DD|MM|YYYY,
     'dataDateFormat','YYYY-MM-DD'
     },
     container: 'div id',
     refresh: true|false         // refresh chart?
     }
     */
    $scope.chartDraw = function() {
        console.log('------ chartDraw --------');
        //console.dir($scope.balanceObj.showData());
        easyLineChart($scope.balanceObj.showData(),{
            items: [{
                'unit':'kg',
                'prop':'djsjCuQty',
                'title':'阴极铜产量'
            }],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-djsjCuQty',
            refresh: true
        });
        easyLineChart($scope.adjustArray($scope.balanceObj.showData()),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'cuNetLeachingQty-A1',
                    'title' : 'A1 Cu 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'cuNetLeachingQty-A2',
                    'title' : 'A2 Cu 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'cuNetLeachingQty-A3',
                    'title' : 'A3 Cu 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'cuNetLeachingQty-SUM',
                    'title' : '总量 Cu 净浸出量'
                },
                {
                    'unit':'%',
                    'prop' :'cuNetLeachingRate-A1',
                    'title' : 'A1 Cu 净浸出率'
                },
                {
                    'unit':'%',
                    'prop' :'cuNetLeachingRate-A2',
                    'title' : 'A2 Cu 净浸出率'
                },
                {
                    'unit':'%',
                    'prop' :'cuNetLeachingRate-A3',
                    'title' : 'A3 Cu 净浸出率'
                },
                {
                    'unit':'%',
                    'prop' :'cuNetLeachingRate-SUM',
                    'title' : '总 Cu 净浸出率'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-cuLeaching',
            refresh: true
        });
        easyLineChart($scope.adjustArray($scope.balanceObj.showData()),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'liquidInputCu-A1',
                    'title' : 'A1 Cu 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputCu-A2',
                    'title' : 'A2 Cu 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputCu-A3',
                    'title' : 'A3 Cu 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputCu-SUM',
                    'title' : '总 Cu 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidOutputCu',
                    'title' : ' Cu 系统溶液出量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-cuLiquid',
            refresh: true
        });
        easyLineChart($scope.adjustArray($scope.balanceObj.showData()),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'feNetLeachingQty-A1',
                    'title' : 'A1 Fe 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'feNetLeachingQty-A2',
                    'title' : 'A2 Fe 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'feNetLeachingQty-A3',
                    'title' : 'A3 Fe 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'feNetLeachingQty-SUM',
                    'title' : '总量 Fe 净浸出量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-feLeaching',
            refresh: true
        });
        easyLineChart($scope.adjustArray($scope.balanceObj.showData()),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'liquidInputFe-A1',
                    'title' : 'A1 Fe 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputFe-A2',
                    'title' : 'A2 Fe 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputFe-A3',
                    'title' : 'A3 Fe 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidInputFe-SUM',
                    'title' : '总 Fe 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidOutputFe',
                    'title' : ' Fe 系统溶液出量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-feLiquid',
            refresh: true
        });
        easyLineChart($scope.adjustArray($scope.balanceObj.showData()),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'suanNetLeachingQty-A1',
                    'title' : 'A1 酸 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'suanNetLeachingQty-A2',
                    'title' : 'A2 酸 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'suanNetLeachingQty-A3',
                    'title' : 'A3 酸 净浸出量'
                },
                {
                    'unit':'kg',
                    'prop' :'suanNetLeachingQty-SUM',
                    'title' : '总量 酸 净浸出量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-suanLeaching',
            refresh: true
        });

        easyLineChart($scope.balanceObj.showData(),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'liquidInputSuan',
                    'title' : '酸 系统溶液进量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidOutputSuan',
                    'title' : '酸 系统溶液出量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-suanLiquid',
            refresh: true
        });

        easyLineChart($scope.balanceObj.showData(),{
            items:[
                {
                    'unit':'kg',
                    'prop' :'liquidInputSuan',
                    'title' : '进水量'
                },
                {
                    'unit':'kg',
                    'prop' :'liquidOutputSuan',
                    'title' : '出水量'
                }
            ],
            category: {
                'prop': 'jlrq',
                'parseDates': true,
                'minPeriod': 'DD',
                'dataDateFormat': 'YYYY-MM-DD'

            },
            container: 'balance-water',
            refresh: true
        });
    };

    var fn = {

    };

    $scope.adjustArray = function(arr) {
        angular.forEach(arr,function(value,key){
            // 数组中的每个元素
            for (var k in value) {
                // 元素对象的每个属性
                for (var subkey in value[k]) {
                    value[k+'-'+subkey] = value[k][subkey];
                }
            }
        });
//        console.dir(arr);
        return arr;
    }

    $scope.balanceObj = {
        needShowHeap: {     // 需要显示的堆场
            'A1':5,
            'A2':6,
            'A3':7
        },
        showData: function(timeDimension) {
            if (!timeDimension) {
                timeDimension = $scope.timeDimension.radioModel;
            }
            if ($scope.balanceObj.showData[timeDimension]) {
                console.log(' 物料平衡数据获取,cached.');
                return $scope.balanceObj.showData[timeDimension];
            }
            // Function Memory Cache

            var arrs = [];
            var self = this;

            if (timeDimension == 'Day') {
                if (!$scope.balanceResult || $scope.balanceResult.length == 0) {
                    return [];
                }
                //console.dir($scope.balanceResult);
                return _.sortBy($scope.balanceResult,function(e){
                    return e.jlrq;
                });
                /*console.log(' showData, Day:');
                console.dir(self.eeAboutData.electrowin);
                //电积实际出铜量
                angular.forEach(self.eeAboutData.electrowin,function(value,key){

                    var item = {
                        djsjCuQty: 0,                                                           // 电积实际出铜量
                        cuNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                       // Cu 净浸出量
                        cuNetLeachingRate: {'A1':0,'A2':0,'A3':0,'SUM':0},                      // Cu 浸出率
                        liquidInputCu: {'A1':0,'A2':0,'A3':0,'SUM':0},                          // 系统溶液Cu进量
                        liquidOutputCu: 0,                                                      // 系统溶液Cu出量
                        feNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                        // Fe 净浸出量
                        liquidInputFe: {'A1':0,'A2':0,'A3':0,'SUM':0},                           // 系统溶液Fe进量
                        liquidOutputFe: 0,                                                      // 系统溶液Fe出量
                        suanNetLeachingQty:{'A1':0,'A2':0,'A3':0,'SUM':0},                       // 酸净浸出量
                        liquidInputSuan:0,                                                      // 系统溶液酸进量，设计电积数据，不分A1，A2，A3
                        liquidOutputSuan:0,                                                     // 系统溶液酸出量
                        inputWater:0,                              // 进水
                        outputWater:0,                              // 出水
                        sprayQty:{'A1':0,'A2':0,'A3':0,'SUM':0}
                    };


                    item.djsjCuQty = value.djsjCuQty;
                    item.jlrq = value.jlrq;
                    console.log('jlrq:'+value.jlrq+'\t cu:'+value.djsjCuQty);
                    arrs.push(item);
                });

                angular.forEach(arrs,function(value,key){
                    // 当天的浸出数据
                    console.log('\t\t !!!! 浸出数据:');
                    console.dir(self);
                    console.dir(self.heapAboutData);
                    var leachingArr = _.where(self.heapAboutData.leachingOuts, {
                        'jlrq': value.jlrq
                    });

                    // 当天喷淋数据 PLY + DKS
                    var sprayArr = _.where(self.heapAboutData.sprayParams, {
                        'jlrq': value.jlrq
                    })
                    // 分别对A1，A2，A3计算物料浸出量
                    angular.forEach(['A1','A2','A3'],function(val) {
                        var heapid = self.needShowHeap[val];
                        var leachingItem = _.findWhere(leachingArr,{
                            'duichangID' : heapid
                        });
                        if (!leachingItem) {        // 处理数据不完整情况
                            leachingItem = {
                                jcryQty:0,
                                jccund:0,
                                jctfend:0,
                                jcsld:0,
                                jykczfl:0
                            };
                        }
                        var sprayItem = {
                            sprayQty:0,
                            cuQty:0,
                            feQty:0,
                            suanQty:0,
                            dksSprayQty:0,
                            dksCuQty:0,
                            dksFeQty:0,
                            dksSuanQty:0
                        };
                        angular.forEach(_.where(sprayArr,{'duichangID':heapid}),function(v,k){
                            sprayItem.sprayQty += v.sprayQty;
                            sprayItem.cuQty += v.sprayQty * v.cu2nd;
                            sprayItem.feQty += v.sprayQty * v.tfend;
                            sprayItem.suanQty += v.sprayQty * v.sld;
                            if (v.sprayType == 'DKS') {
                                sprayItem.dksSprayQty += v.sprayQty;
                                sprayItem.dksCuQty += v.sprayQty * v.cu2nd;
                                sprayItem.dksFeQty += v.sprayQty * v.tfend;
                                sprayItem.dksSuanQty += v.sprayQty * v.sld;
                            }
                        });
                        value.cuNetLeachingQty[heapid] = leachingItem.jcryQty * leachingItem.jccund - sprayItem.cuQty; // Cu净浸出量
                        value.cuNetLeachingRate[heapid] = value.cuNetLeachingQty[heapid]/sprayItem.sprayQty;            // Cu浸出效率
                        value.feNetLeachingQty[heapid] = leachingItem.jcryQty * leachingItem.jctfend - sprayItem.feQty; // Fe净浸出量
                        value.suanNetLeachingQty[heapid] = leachingItem.jcryQty * leachingItem.jcsld - sprayItem.suanQty; // 酸净浸出量
                        value.liquidInputCu[heapid] = sprayItem.dksCuQty + value.cuNetLeachingQty[heapid];          // 系统溶液Cu进量
                        value.liquidInputFe[heapid] = sprayItem.dksFeQty + value.feNetLeachingQty[heapid];          // 系统溶液Fe进量
                        value.liquidInputSuan[heapid] = sprayItem.dksSuanQty +value.suanNetLeachingQty[heapid] + value.djsjCuQty * 1.54;     // 系统溶液酸进量
                        value.sprayQty[heapid] = sprayItem.sprayQty;

                        // 进水 临时值： 降雨扣除蒸发量
                        value.inputWater += leachingItem.jykczfl;
                    });
                    // SUM 计算
                    value.sprayQty['SUM'] = _.reduce(value.sprayQty,function(memo,e){
                        return memo + e;
                    },0);
                    value.cuNetLeachingQty['SUM'] = _.reduce(value.cuNetLeachingQty,function(memo,e){
                        return memo + e
                    },0);
                    value.cuNetLeachingRate['SUM'] = value.cuNetLeachingQty['SUM'] / value.sprayQty['SUM'];
                    value.feNetLeachingQty['SUM'] = _.reduce(value.feNetLeachingQty,function(memo,e){
                        return memo + e
                    },0);
                    value.suanNetLeachingQty['SUM'] = _.reduce(value.suanNetLeachingQty,function(memo,e){
                        return memo + e
                    },0);
                    value.liquidInputCu['SUM'] = _.reduce(value.liquidInputCu,function(memo,e){
                        return memo + e
                    },0);
                    value.liquidInputFe['SUM'] = _.reduce(value.liquidInputFe,function(memo,e){
                        return memo + e
                    },0);
                    value.liquidInputSuan['SUM'] = _.reduce(value.liquidInputSuan,function(memo,e){
                        return memo + e
                    },0);

                    // 萃取数据
                    var extractItem = {
                        cqyywpFhcJsQty:0,       // 萃余液外排金属量 防洪池
                        xdywpJsQty:0           // 洗涤液外排金属量
                    };
                    var extractArr = _.where(self.eeAboutData.extract,{'jlrq':value.jlrq});
                    angular.forEach(extractArr,function(val,key){
                        extractItem.cqyywpFhcJsQty += val.cqyywpFhcJsQty;
                        extractItem.xdywpJsQty += val.xdywpJsQty;
                    });

                    // 电积数据
                    var electrowinItem = _.findWhere(self.eeAboutData.electrowin,{'jlrq':value.jlrq});
                    if (!electrowinItem) {      // 处理数据不完整情况
                        electrowinItem = {
                            djhyWpJsQty:0
                        };
                    }

                    // 环保中和数据
                    var neutroItem = _.findWhere(self.neutroAboutData.neutros,{'jlrq':value.jlrq});
                    if (!neutroItem) {          // 处理数据不完整情况
                        neutroItem = {
                            clLostCu:0,
                            clLostFe:0,
                            clLostH2so4:0,
                            wphbylQty:0,
                            wpxyylQty:0,
                            wp3zbsqyQty:0
                        };
                    }

                    value.liquidOutputCu = value.djsjCuQty + extractItem.cqyywpFhcJsQty + extractItem.xdywpJsQty + neutroItem.clLostCu + electrowinItem.djhyWpJsQty;
                    value.liquidOutputFe = neutroItem.clLostFe;
                    value.liquidOutputSuan = neutroItem.clLostH2so4;
                    value.outputWater = neutroItem.wphbylQty + neutroItem.wpxyylQty + neutroItem.wp3zbsqyQty;

                    // 引入水数据
                    var inputWaterItem = _.findWhere(self.heapAboutData.inputwater,{'jlrq':value.jlrq});
                    if (!inputWaterItem) {      // 处理数据不完整情况
                        inputWaterItem = {
                            kkszl:0
                        };
                    }
                    // 矿坑水引入量 + 降雨扣除蒸发量
                    value.inputWater += inputWaterItem.kkszl ;
                });
                arrs = _.sortBy(arrs,function(se) {
                    return se.jlrq;
                });
                _.each(arrs,function(element,key){
                    element.jlrq = $filter('date')(element.jlrq,'yyyy-MM-dd');
                });*/
            }
            else if (timeDimension == 'Month') {
                // 按天计算的结果
                var dayArr = $scope.balanceObj.showData('Day');
                // Aggregate
                _.each(_.groupBy(dayArr,function(e1){
                    return $filter('date')(e1.jlrq, 'yyyy-MM');
                }),function(v,k) {
                    var item = {
                        djsjCuQty: 0,                                                           // 电积实际出铜量
                        cuNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                       // Cu 净浸出量
                        cuNetLeachingRate: {'A1':0,'A2':0,'A3':0,'SUM':0},                      // Cu 浸出率
                        liquidInputCu: {'A1':0,'A2':0,'A3':0,'SUM':0},                          // 系统溶液Cu进量
                        liquidOutputCu: 0,                                                      // 系统溶液Cu出量
                        feNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                        // Fe 净浸出量
                        liquidInputFe: {'A1':0,'A2':0,'A3':0,'SUM':0},                           // 系统溶液Fe进量
                        liquidOutputFe: 0,                                                      // 系统溶液Fe出量
                        suanNetLeachingQty:{'A1':0,'A2':0,'A3':0,'SUM':0},                       // 酸净浸出量
                        liquidInputSuan:0,                                                      // 系统溶液酸进量，设计电积数据，不分A1，A2，A3
                        liquidOutputSuan:0,                                                     // 系统溶液酸出量
                        inputWater:0,                              // 进水
                        outputWater:0,                              // 出水
                        sprayQty:{'A1':0,'A2':0,'A3':0,'SUM':0}
                    };
                    item.jlrq = k;
                    _.each(v, function(v2,k2){
                        item.djsjCuQty += v2.djsjCuQty;
                        item.cuNetLeachingQty['A1'] += v2.cuNetLeachingQty['A1'];
                        item.cuNetLeachingQty['A2'] += v2.cuNetLeachingQty['A2'];
                        item.cuNetLeachingQty['A3'] += v2.cuNetLeachingQty['A3'];
                        item.cuNetLeachingQty['SUM'] += v2.cuNetLeachingQty['SUM'];

                        item.liquidInputCu['A1'] += v2.liquidInputCu['A1'];
                        item.liquidInputCu['A2'] += v2.liquidInputCu['A2'];
                        item.liquidInputCu['A3'] += v2.liquidInputCu['A3'];
                        item.liquidInputCu['SUM'] += v2.liquidInputCu['SUM'];

                        item.liquidOutputCu += v2.liquidOutputCu;

                        item.feNetLeachingQty['A1'] += v2.feNetLeachingQty['A1'];
                        item.feNetLeachingQty['A2'] += v2.feNetLeachingQty['A2'];
                        item.feNetLeachingQty['A3'] += v2.feNetLeachingQty['A3'];
                        item.feNetLeachingQty['SUM'] += v2.feNetLeachingQty['SUM'];

                        item.liquidInputFe['A1'] += v2.liquidInputFe['A1'];
                        item.liquidInputFe['A2'] += v2.liquidInputFe['A2'];
                        item.liquidInputFe['A3'] += v2.liquidInputFe['A3'];
                        item.liquidInputFe['SUM'] += v2.liquidInputFe['SUM'];

                        item.liquidOutputFe += v2.liquidOutputFe;

                        item.suanNetLeachingQty['A1'] += v2.suanNetLeachingQty['A1'];
                        item.suanNetLeachingQty['A2'] += v2.suanNetLeachingQty['A2'];
                        item.suanNetLeachingQty['A3'] += v2.suanNetLeachingQty['A3'];
                        item.suanNetLeachingQty['SUM'] += v2.suanNetLeachingQty['SUM'];

                        item.liquidInputSuan += v2.liquidInputSuan;
                        item.liquidOutputSuan += v2.liquidOutputSuan;
                        item.inputWater += v2.inputWater;
                        item.outputWater += v2.outputWater;

                        item.sprayQty['A1'] += v2.sprayQty['A1'];
                        item.sprayQty['A2'] += v2.sprayQty['A2'];
                        item.sprayQty['A3'] += v2.sprayQty['A3'];
                        item.sprayQty['SUM'] += v2.sprayQty['SUM'];



                    });
                    item.cuNetLeachingRate['A1'] += item.cuNetLeachingQty['A1'] / item.sprayQty['A1'];
                    item.cuNetLeachingRate['A2'] += item.cuNetLeachingQty['A2'] / item.sprayQty['A2'];
                    item.cuNetLeachingRate['A3'] += item.cuNetLeachingQty['A3'] / item.sprayQty['A3'];
                    item.cuNetLeachingRate['SUM'] += item.cuNetLeachingQty['SUM'] / item.sprayQty['SUM'];
                    arrs.push(item);

                });
                arrs = _.sortBy(arrs,function(se) {
                    return se.jlrq;
                });
            }
            else if (timeDimension == 'Year') {
                // 按天计算的结果
                var dayArr = $scope.balanceObj.showData('Day');
                // Aggregate
                _.each(_.groupBy(dayArr,function(e1){
                    return $filter('date')(e1.jlrq, 'yyyy');
                }),function(v,k) {
                    var item = {
                        djsjCuQty: 0,                                                           // 电积实际出铜量
                        cuNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                       // Cu 净浸出量
                        cuNetLeachingRate: {'A1':0,'A2':0,'A3':0,'SUM':0},                      // Cu 浸出率
                        liquidInputCu: {'A1':0,'A2':0,'A3':0,'SUM':0},                          // 系统溶液Cu进量
                        liquidOutputCu: 0,                                                      // 系统溶液Cu出量
                        feNetLeachingQty: {'A1':0,'A2':0,'A3':0,'SUM':0},                        // Fe 净浸出量
                        liquidInputFe: {'A1':0,'A2':0,'A3':0,'SUM':0},                           // 系统溶液Fe进量
                        liquidOutputFe: 0,                                                      // 系统溶液Fe出量
                        suanNetLeachingQty:{'A1':0,'A2':0,'A3':0,'SUM':0},                       // 酸净浸出量
                        liquidInputSuan:0,                                                      // 系统溶液酸进量，设计电积数据，不分A1，A2，A3
                        liquidOutputSuan:0,                                                     // 系统溶液酸出量
                        inputWater:0,                              // 进水
                        outputWater:0,                              // 出水
                        sprayQty:{'A1':0,'A2':0,'A3':0,'SUM':0}
                    };
                    item.jlrq = k;
                    _.each(v, function(v2,k2){
                        item.djsjCuQty += v2.djsjCuQty;
                        item.cuNetLeachingQty['A1'] += v2.cuNetLeachingQty['A1'];
                        item.cuNetLeachingQty['A2'] += v2.cuNetLeachingQty['A2'];
                        item.cuNetLeachingQty['A3'] += v2.cuNetLeachingQty['A3'];
                        item.cuNetLeachingQty['SUM'] += v2.cuNetLeachingQty['SUM'];

                        item.liquidInputCu['A1'] += v2.liquidInputCu['A1'];
                        item.liquidInputCu['A2'] += v2.liquidInputCu['A2'];
                        item.liquidInputCu['A3'] += v2.liquidInputCu['A3'];
                        item.liquidInputCu['SUM'] += v2.liquidInputCu['SUM'];

                        item.liquidOutputCu += v2.liquidOutputCu;

                        item.feNetLeachingQty['A1'] += v2.feNetLeachingQty['A1'];
                        item.feNetLeachingQty['A2'] += v2.feNetLeachingQty['A2'];
                        item.feNetLeachingQty['A3'] += v2.feNetLeachingQty['A3'];
                        item.feNetLeachingQty['SUM'] += v2.feNetLeachingQty['SUM'];

                        item.liquidInputFe['A1'] += v2.liquidInputFe['A1'];
                        item.liquidInputFe['A2'] += v2.liquidInputFe['A2'];
                        item.liquidInputFe['A3'] += v2.liquidInputFe['A3'];
                        item.liquidInputFe['SUM'] += v2.liquidInputFe['SUM'];

                        item.liquidOutputFe += v2.liquidOutputFe;

                        item.suanNetLeachingQty['A1'] += v2.suanNetLeachingQty['A1'];
                        item.suanNetLeachingQty['A2'] += v2.suanNetLeachingQty['A2'];
                        item.suanNetLeachingQty['A3'] += v2.suanNetLeachingQty['A3'];
                        item.suanNetLeachingQty['SUM'] += v2.suanNetLeachingQty['SUM'];

                        item.liquidInputSuan += v2.liquidInputSuan;
                        item.liquidOutputSuan += v2.liquidOutputSuan;
                        item.inputWater += v2.inputWater;
                        item.outputWater += v2.outputWater;

                        item.sprayQty['A1'] += v2.sprayQty['A1'];
                        item.sprayQty['A2'] += v2.sprayQty['A2'];
                        item.sprayQty['A3'] += v2.sprayQty['A3'];
                        item.sprayQty['SUM'] += v2.sprayQty['SUM'];



                    });
                    item.cuNetLeachingRate['A1'] += item.cuNetLeachingQty['A1'] / item.sprayQty['A1'];
                    item.cuNetLeachingRate['A2'] += item.cuNetLeachingQty['A2'] / item.sprayQty['A2'];
                    item.cuNetLeachingRate['A3'] += item.cuNetLeachingQty['A3'] / item.sprayQty['A3'];
                    item.cuNetLeachingRate['SUM'] += item.cuNetLeachingQty['SUM'] / item.sprayQty['SUM'];
                    arrs.push(item);

                });
                arrs = _.sortBy(arrs,function(se) {
                    return se.jlrq;
                });
            }
            else {
                $.growl('Time Dimension Only Support Day,Month,Year');
            }
            $scope.balanceObj.showData[timeDimension] = arrs; // save cache
            console.log('arrs size:'+arrs.length);
            //console.dir(arrs);
            return arrs;
        }
        ,
        // Data
        heapAboutData : {
            inputore: [],
            inputwater: [],
            poolParam:[],
            sprayParams:[],
            leachingOuts:[]
        },
        eeAboutData : {
            extract:[],
            electrowin:[]
        },
        neutroAboutData : {
            neutros:[]
        }
    };

    $scope.balanceResult = [];

    $scope.queryData = function() {

        console.log('======================= queryData =====================\n\n\n');
        dashboardSvc.getBalanceData().success(function(response){
            $scope.balanceResult = response['data'];
            $scope.chartDraw();
        }).error(function(){
                $.growl(' 物料平衡计算失败，服务器通讯异常.');
            })
        // 查询数据库
//        dashboardSvc.getHeapAboutAllData().success(function(response) {
//            $scope.balanceObj['heapAboutData'] = response['data'];
//
//            dashboardSvc.getEEAboutAllData().success(function(response) {
//                $scope.balanceObj['eeAboutData'] = response['data'];
//
//                dashboardSvc.getNeutroAboutAllData().success(function(response) {
//                    $scope.balanceObj['neutroAboutData'] = response['data'];
//
//                    for (var k in $scope.balanceObj.showData) {
//                        console.log('clear cache :'+k);
//                        $scope.balanceObj.showData[k] = undefined;
//                    }
//                    console.log('======================== queryData End ================ ');
//                }).error(function() {
//                        $.growl(' 查询环保中和数据失败，服务器端通讯异常.');
//                    });
//            }).error(function() {
//                    $.growl(' 查询萃取、电积数据失败，服务器端通讯异常.');
//                });
//
//
//
//        }).error(function(){
//                $.growl(' 查询堆浸数据失败，服务器端通讯异常.');
//            });






    };

}]);

// 报表 Controller
icdModule.controller('ReportCtrl',['$scope','$state','$modal','dashboardSvc','$filter',function($scope,$state,$modal,dashboardSvc,$filter){
    // 检查登陆状态
    if (! $scope.headShowSwitch.login) {
        $.growl('请先登陆系统。');
        $state.go('home');
        return;
    }

    $scope.inputOreParam = function() {
        $scope.reportObj.inputOreParam();
    }

    $scope.reportObjVM = {
        extParamVM:{
            '1':{},
            '2':{}
        },
        inputOreParamVM: {

        }   ,
        inputWaterParamVM: {},
        theHeapParamVM: {},
        electrowinParamVM:{},
        neutroParamVM:{}

    };

    $scope.reportObj = {
        // heapAboutData,eeAboutData,neutroAboutData
        extParam: function(period,rq) {
            if (this.extParam[period+'-'+$scope.reportObj.jlrqTime]) {
//                console.log('---- result get from cache -----');
                return this.extParam[period+'-'+$scope.reportObj.jlrqTime];
            }
            var retObj = {
                cqyyCund:{'d':0,'m':0,'y':0},
                cqyyTfend:{'d':0,'m':0,'y':0},
                cqyyPh: {'d':0,'m':0,'y':0},
                cqyySd: {'d':0,'m':0,'y':0},
                cqyyLL: {'d':0,'m':0,'y':0},
                cqyyQty: {'d':0,'m':0,'y':0},            // 萃取原液量  Computed
                cqyyCu: {'d':0,'m':0,'y':0},
                cqcu: {'d':0,'m':0,'y':0},               // 萃取原液传递铜量
                totalCql: {'d':0,'m':0,'y':0},
                cyyc2Cund: {'d':0,'m':0,'y':0},          // 萃余液铜浓度
                cqyy2Tfend: {'d':0,'m':0,'y':0},
                cqyy2Ph: {'d':0,'m':0,'y':0},
                cqyy2Sd: {'d':0,'m':0,'y':0},
                cyyc1wpWaterQty: {'d':0,'m':0,'y':0},    // 萃余液槽 外排堆浸水量
                cyyc1wpJsQty: {'d':0,'m':0,'y':0},
                yjxll: {'d':0,'m':0,'y':0},              // 有机相流量
                yjxl: {'d':0,'m':0,'y':0},               // 有机相量       Computed
                zsyjxCund: {'d':0,'m':0,'y':0},          // 再生有机相 铜浓度
                fzyjxCund: {'d':0,'m':0,'y':0},          // 负载有机相 铜浓度
                yjxcdCu: {'d':0,'m':0,'y':0},            // 有机相 传递铜
                ycfcRate: {'d':0,'m':0,'y':0},           // 反萃率
                fcyLL: {'d':0,'m':0,'y':0},              // 反萃液流量
                fcyl: {'d':0,'m':0,'y':0},               // 反萃液量
                fcyCund: {'d':0,'m':0,'y':0},            // 反萃供液铜浓度
                fchyCund: {'d':0,'m':0,'y':0},           // 反萃后液铜浓度
                fcycdCu: {'d':0,'m':0,'y':0},            // 反萃液传递 铜
                xdywpQty: {'d':0,'m':0,'y':0},           // 洗涤液外排量
                xdywpJsQty: {'d':0,'m':0,'y':0},         // 洗涤液外排金属量
                openHours: {'d':0,'m':0,'y':0}           // 开机时间

            };

            for (var key in retObj) {
                if (key == 'cqyyQty') {
                    continue;
                }

                retObj[key]['d'] = _.reduce(this['currDayExt'+period](),function(memo,e){
                    //console.log('\t\t value:'+e[key]) ;
                    return memo + e[key];
                },0);
                retObj[key]['m'] = _.reduce(this['currMonthExt'+period](),function(memo,e){
                    return memo + e[key];
                },0);
                retObj[key]['y'] = _.reduce(this['currYearExt'+period](),function(memo,e){
                    return memo + e[key];
                },0);
            }
            // 不能直接获取，需要计算才能获得的属性
            retObj['cqyyQty']['d'] = _.reduce(this['currDayExt'+period](),function(memo,e){
                return memo + e.openHours * e.cqyyLL;
            },0);
            retObj['cqyyQty']['m'] = _.reduce(this['currMonthExt'+period](),function(memo,e){
                return memo + e.openHours * e.cqyyLL;
            },0);
            retObj['cqyyQty']['y'] = _.reduce(this['currYearExt'+period](),function(memo,e){
                return memo + e.openHours * e.cqyyLL;
            },0);
            retObj['yjxl']['d'] = _.reduce(this['currDayExt'+period](),function(memo,e){
                return memo + e.openHours * e.yjxll;
            },0);
            retObj['yjxl']['m'] = _.reduce(this['currMonthExt'+period](),function(memo,e){
                return memo + e.openHours * e.yjxll;
            },0);
            retObj['yjxl']['y'] = _.reduce(this['currYearExt'+period](),function(memo,e){
                return memo + e.openHours * e.yjxll;
            },0);
            // 不能聚合计算的属性
            var cannotAggregateProps = ['cqyyCund','cqyyTfend','cqyyPh','cqyySd','cqyyLL','totalCql','cyyc2Cund','cqyy2Tfend',
                'cqyy2Ph','cqyy2Sd','yjxll','zsyjxCund','fzyjxCund','ycfcRate','fcyLL','fcyCund','fchyCund'];
            angular.forEach(cannotAggregateProps,function(value,key){
                retObj[value]['m'] = 0;
                retObj[value]['y'] = 0;
            }) ;

            this.extParam[period+'|'+$scope.reportObj.jlrqTime] = retObj;

            return retObj;
        },
        neutroParam: function() {
            if (this.neutroParam[$scope.reportObj.jlrqTime]) {
//                console.log(' neutroParam() get from cache...');
                return this.neutroParam[$scope.reportObj.jlrqTime];
            }
            var retObj = {
                cllCyyQty: {'d':0,'m':0,'y':0},                                  // 萃余液处理量
                cllFhc2Qty: {'d':0,'m':0,'y':0},                                 // 页面为回抽液处理量，实际显示防洪池2期处理量
                shyjSjdh: {'d':0,'m':0,'y':0}                                   // 石灰药剂实际单耗
//                ,
//                shyjKucun: {'d':0,'m':0,'y':0}                                   // 石灰药剂库存
            };
            for (var key in retObj) {
                retObj[key].d = _.reduce($scope.reportObj.currDayNeutro(),function(memo,e) {
                    return memo + e[key];
                },0);
                retObj[key].m = _.reduce($scope.reportObj.currMonthNeutro(),function(memo,e) {
                    return memo + e[key];
                },0);
                retObj[key].y = _.reduce($scope.reportObj.currYearNeutro(),function(memo,e) {
                    return memo + e[key];
                },0);
            }
            this.neutroParam[$scope.reportObj.jlrqTime] = retObj;
            return retObj;
        },
        electrowinParam: function() {
            if (this.electrowinParam[$scope.reportObj.jlrqTime]) {
                console.log(' electrowinParam() get from cache....');
                return this.electrowinParam[$scope.reportObj.jlrqTime];
            }
            var retObj = {
                djqyCund:{'d':0,'m':0,'y':0},                    // 电积前液Cu浓度
                djhyCund:{'d':0,'m':0,'y':0},                    // 电积后液Cu浓度
                djqyTfend:{'d':0,'m':0,'y':0},                   // 电积前液TFe浓度
                djyCuQty:{'d':0,'m':0,'y':0},                    // 电积液传递铜量
                dlqd: {'d':0,'m':0,'y':0},                       // 电流强度
                slots: {'d':0,'m':0,'y':0},                      // 电积槽#
                djsjCuQty: {'d':0,'m':0,'y':0},                  // 实际产铜量
                dlmd: {'d':0,'m':0,'y':0},                       // 电流密度
                djcDianya: {'d':0,'m':0,'y':0},                  // 电积槽电压
                djWendu: {'d':0,'m':0,'y':0}                     // 电积液温度
            };
            for (var key in retObj) {                            // 每日的参数
                retObj[key].d = _.reduce($scope.reportObj.currDayElectrowin(),function(memo,e){
                    return memo + e[key];
                },0);
            }
            // 汇总计算月度、年度数据
            angular.forEach(['djyCuQty','djsjCuQty'],function(value,key){
                retObj[value].m = _.reduce($scope.reportObj.currMonthElectrowin(),function(memo,e){
                    return memo + e[value];
                },0);
                retObj[value].y = _.reduce($scope.reportObj.currYearElectrowin(),function(memo,e){
                    return memo + e[value];
                },0);
            })
            this.electrowinParam[$scope.reportObj.jlrqTime] = retObj;
            return retObj;
        },
        inputWaterParam: function() {
            if (this.inputWaterParam[$scope.reportObj.jlrqTime]) {
//                console.log(' inputWaterParam get from cache...');
                return this.inputWaterParam[$scope.reportObj.jlrqTime];
            }
            var retObj = {
                kkszl: {'d':0,'m':0,'y':0},
                kkszCu: {'d':0,'m':0,'y':0},
                ejlsjcSl: {'d':0,'m':0,'y':0},
                ejlsjcCu: {'d':0,'m':0,'y':0},
                cyyZsl: {'d':0,'m':0,'y':0},
                cyyCu: {'d':0,'m':0,'y':0}
            };
            retObj.kkszl['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.kkszl;
            },0);

            retObj.kkszl['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.kkszl;
            },0);
            retObj.kkszl['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.kkszl;
            },0);

            retObj.kkszCu['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.kkszCu;
            },0);
            retObj.kkszCu['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.kkszCu;
            },0);
            retObj.kkszCu['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.kkszCu;
            },0);

            retObj.ejlsjcSl['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.ejlsjcSl;
            },0);
            retObj.ejlsjcSl['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.ejlsjcSl;
            },0);
            retObj.ejlsjcSl['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.ejlsjcSl;
            },0);

            retObj.ejlsjcCu['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.ejlsjcCu;
            },0);
            retObj.ejlsjcCu['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.ejlsjcCu;
            },0);
            retObj.ejlsjcCu['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.ejlsjcCu;
            },0);

            retObj.cyyZsl['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.cyyZsl;
            },0);
            retObj.cyyZsl['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.cyyZsl;
            },0);
            retObj.cyyZsl['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.cyyZsl;
            },0);

            retObj.cyyCu['d'] = _.reduce(this.currDayInputWater(),function(memo,e){
                return memo + e.cyyCu;
            },0);
            retObj.cyyCu['m'] = _.reduce(this.currMonthInputWater(),function(memo,e){
                return memo + e.cyyCu;
            },0);
            retObj.cyyCu['y'] = _.reduce(this.currYearInputWater(),function(memo,e){
                return memo + e.cyyCu;
            },0);

            this.inputWaterParam[$scope.reportObj.jlrqTime] = retObj;
            return retObj;
        },
        inputOreParam: function() {
            if (this.inputOreParam[$scope.reportObj.jlrqTime]) {
//                console.log(' inputOreParam() get from cache ...');
                return this.inputOreParam[$scope.reportObj.jlrqTime];
            }
            var retObj = {
                rdksl: {'d':0,'m':0,'y':0},
                rdksCupw: {'d':0,'m':0,'y':0},
                rdksCu: {'d':0,'m':0,'y':0}
            };
//            console.dir(this.currMonthInputOre());
            retObj.rdksl['d'] = _.reduce(this.currDayInputOre(),function(memo,e){
                return memo + e.rdksl;
            },0);
            retObj.rdksl['m'] = _.reduce(this.currMonthInputOre(),function(memo,e){
                return memo + e.rdksl;
            },0);
            retObj.rdksl['y'] = _.reduce(this.currYearInputOre(),function(memo,e){
                return memo + e.rdksl;
            },0);
            retObj.rdksCupw['d'] = _.reduce(this.currDayInputOre(),function(memo,e){
                return memo + e.cupw;
            },0);
            retObj.rdksCupw['m'] = _.reduce(this.currMonthInputOre(),function(memo,e){
                return memo + e.cupw * e.rdksl/retObj.rdksl['m'];
            },0);
            retObj.rdksCupw['y'] = _.reduce(this.currYearInputOre(),function(memo,e){
                return memo + e.cupw * e.rdksl/retObj.rdksl['y'];
            },0);
            retObj.rdksCu['d'] = _.reduce(this.currDayInputOre(),function(memo,e){
                return memo + e.cujsl;
            },0);
            retObj.rdksCu['m'] = _.reduce(this.currMonthInputOre(),function(memo,e){
                return memo + e.cujsl;
            },0);
            retObj.rdksCu['y'] = _.reduce(this.currYearInputOre(),function(memo,e){
                return memo + e.cujsl;
            },0);

            this.inputOreParam[$scope.reportObj.jlrqTime] = retObj;
            return retObj;
        },
        needShowHeap: {     // 需要显示的堆场
            'A1':5,
            'A2':6,
            'A3':7
        },
        jlrq: new Date,
        jlrqTime: 0,
        theHeapParam: function(hname) {   // A1,A2,A3
            if (this.theHeapParam[$scope.reportObj.jlrqTime+'-'+hname]) {
//                console.log(' the HeapParam() get from cache ');
                return this.theHeapParam[$scope.reportObj.jlrqTime+'-'+hname];
            }
            var retObj = {
                sprayQty: {d:0,m:0,y:0},
                sprayCuQty: {d:0,m:0,y:0},
                sprayFeQty: {d:0,m:0,y:0},
                spraySuanQty: {d:0,m:0,y:0},
                leachingQty: {d:0,m:0,y:0},
                leachingCund: {d:0,m:0,y:0},
                leachingCuQty: {d:0,m:0,y:0},
                leachingFeQty: {d:0,m:0,y:0},
                leachingSuanQty: {d:0,m:0,y:0},
                cuNetLeachingQty: {d:0,m:0,y:0},
                feNetLeachingQty: {d:0,m:0,y:0},
                suanNetLeachingQty: {d:0,m:0,y:0}
            };

            var heapid = this.needShowHeap[hname];      // 5,6,7
            if (! heapid) {
                return retObj;
            }
            retObj.sprayQty['d'] = _.reduce(_.where(this.currDaySpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sprayQty;
            },0);
            retObj.sprayCuQty['d'] = _.reduce(_.where(this.currDaySpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.cuQty;
            },0);
            retObj.sprayFeQty['d'] = _.reduce(_.where(this.currDaySpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.feQty;
            },0);
            retObj.spraySuanQty['d'] = _.reduce(_.where(this.currDaySpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sld / 1000;
            },0);
            retObj.sprayQty['m'] = _.reduce(_.where(this.currMonthSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sprayQty;
            },0);
            retObj.sprayCuQty['m'] = _.reduce(_.where(this.currMonthSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.cuQty;
            },0);
            retObj.sprayFeQty['m'] = _.reduce(_.where(this.currMonthSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.feQty;
            },0);
            retObj.spraySuanQty['m'] = _.reduce(_.where(this.currMonthSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sld / 1000;
            },0);
            retObj.sprayQty['y'] = _.reduce(_.where(this.currYearSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sprayQty;
            },0);
            retObj.sprayCuQty['y'] = _.reduce(_.where(this.currYearSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.cuQty;
            },0);
            retObj.sprayFeQty['y'] = _.reduce(_.where(this.currMonthSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.feQty;
            },0);
            retObj.spraySuanQty['y'] = _.reduce(_.where(this.currYearSpray(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.sld / 1000;
            },0);

            retObj.leachingQty['d'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcryQty;
            },0);
            retObj.leachingCund['d'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jccund;
            },0);
            retObj.leachingCuQty['d'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jccu;
            },0);
            retObj.leachingFeQty['d'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcfe;
            },0);
            retObj.leachingSuanQty['d'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcsld * e.jcryQty / 1000;
            },0);
            retObj.leachingQty['m'] = _.reduce(_.where(this.currMonthLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcryQty;
            },0);
//            retObj.leachingCund['m'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
//                return memo + e.jccund;
//            },0);
            retObj.leachingCuQty['m'] = _.reduce(_.where(this.currMonthLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jccu;
            },0);
            retObj.leachingFeQty['m'] = _.reduce(_.where(this.currMonthLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcfe;
            },0);
            retObj.leachingSuanQty['m'] = _.reduce(_.where(this.currMonthLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcsld * e.jcryQty / 1000;
            },0);
            retObj.leachingQty['y'] = _.reduce(_.where(this.currYearLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcryQty;
            },0);
//            retObj.leachingCund['m'] = _.reduce(_.where(this.currDayLeaching(),{'duichangID': heapid}),function(memo,e) {
//                return memo + e.jccund;
//            },0);
            retObj.leachingCuQty['y'] = _.reduce(_.where(this.currYearLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jccu;
            },0);
            retObj.leachingFeQty['y'] = _.reduce(_.where(this.currYearLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcfe;
            },0);
            retObj.leachingSuanQty['y'] = _.reduce(_.where(this.currYearLeaching(),{'duichangID': heapid}),function(memo,e) {
                return memo + e.jcsld * e.jcryQty / 1000;
            },0);

            retObj.cuNetLeachingQty['d'] = retObj.leachingCuQty['d'] - retObj.sprayCuQty['d'];
            retObj.cuNetLeachingQty['m'] = retObj.leachingCuQty['m'] - retObj.sprayCuQty['m'];
            retObj.cuNetLeachingQty['y'] = retObj.leachingCuQty['y'] - retObj.sprayCuQty['y'];
            retObj.feNetLeachingQty['d'] = retObj.leachingFeQty['d'] - retObj.sprayFeQty['d'];
            retObj.feNetLeachingQty['m'] = retObj.leachingFeQty['m'] - retObj.sprayFeQty['m'];
            retObj.feNetLeachingQty['y'] = retObj.leachingFeQty['y'] - retObj.sprayFeQty['y'];
            retObj.suanNetLeachingQty['d'] = retObj.leachingSuanQty['d'] - retObj.spraySuanQty['d'];
            retObj.suanNetLeachingQty['m'] = retObj.leachingSuanQty['m'] - retObj.spraySuanQty['m'];
            retObj.suanNetLeachingQty['y'] = retObj.leachingSuanQty['y'] - retObj.spraySuanQty['y'];

            this.theHeapParam[$scope.reportObj.jlrqTime+'-'+hname] = retObj;


            return retObj;
        },
        currDayInputOre : function() {          // 本日入堆矿石数据
            if (this.currDayInputOre[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayInputOre get from cache.');
                return this.currDayInputOre[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.heapAboutData.inputore, {
                'rdrq' : $scope.reportObj.jlrq
            });
            this.currDayInputOre[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthInputOre: function() {         // 本月入堆矿石数据
            if (this.currMonthInputOre[$scope.reportObj.jlrqTime]) {
                return this.currMonthInputOre[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var t = _.find(_.groupBy(this.heapAboutData.inputore, function(element) {
                return $filter('date')(element.rdrq, 'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq, 'yyyy-MM') == key;
            });

            this.currMonthInputOre[$scope.reportObj.jlrqTime] = t;
            return t;



        },
        currYearInputOre: function() {          // 本年入堆矿石数据
            if (this.currYearInputOre[$scope.reportObj.jlrqTime]) {
                return  this.currYearInputOre[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.inputore, function(e) {
                return $filter('date')(e.rdrq, 'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq, 'yyyy') == key;
            });
            this.currYearInputOre[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currDayInputWater: function() {         // 本日引入水
            if (this.currDayInputWater[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayInputWater get from cache...');
                return this.currDayInputWater[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.heapAboutData.inputwater, {
                'jlrq' : $scope.reportObj.jlrq
            });
            this.currDayInputWater[$scope.reportObj.jlrqTime] = arr;

            return arr;
        },
        currMonthInputWater: function() {       // 本月引入水
            if (this.currMonthInputWater[$scope.reportObj.jlrqTime]) {
                return this.currMonthInputWater[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.inputwater,function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthInputWater[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currYearInputWater: function() {        // 本年引入水
            if (this.currYearInputWater[$scope.reportObj.jlrqTime]) {
                return this.currYearInputWater[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.inputwater,function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearInputWater[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currDaySpray: function() {              // 本日喷淋液 []
            if (this.currDaySpray[$scope.reportObj.jlrqTime]) {
//                console.log(' currDaySpray get from cache. ');
                return this.currDaySpray[$scope.reportObj.jlrqTime];

            }
            var arr =  _.where(this.heapAboutData.sprayParams, {
                'jlrq' : $scope.reportObj.jlrq
            });
            this.currDaySpray[$scope.reportObj.jlrqTime] = arr;
            return  arr;
        },
        currMonthSpray: function() {              // 本月喷淋液 []
            if (this.currMonthSpray[$scope.reportObj.jlrqTime]) {
                return this.currMonthSpray[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.sprayParams,function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthSpray[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currYearSpray: function() {              // 本年喷淋液 []
            if (this.currYearSpray[$scope.reportObj.jlrqTime]) {
                return this.currYearSpray[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.sprayParams,function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearSpray[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currDayLeaching: function() {           // 本日浸出
            if (this.currDayLeaching[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayLeaching get from cache.');
                return this.currDayLeaching[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.heapAboutData.leachingOuts, {
                'jlrq' : $scope.reportObj.jlrq
            });
            this.currDayLeaching[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthLeaching: function() {           // 本月浸出
            if (this.currMonthLeaching[$scope.reportObj.jlrqTime]) {
                return this.currMonthLeaching[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.leachingOuts,function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthLeaching[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currYearLeaching: function() {           // 本年浸出
            if (this.currYearLeaching[$scope.reportObj.jlrqTime]) {
                return this.currYearLeaching[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.heapAboutData.leachingOuts,function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearLeaching[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currDayExt1: function() {               // 本日萃取一期
            if (this.currDayExt1[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayExt1 get from cache.');
                return this.currDayExt1[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.eeAboutData.extract, {
                'jlrq' : $scope.reportObj.jlrq,
                'period' : 1
            });
            this.currDayExt1[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthExt1: function() {               // 本月萃取一期
            if (this.currMonthExt1[$scope.reportObj.jlrqTime]) {
                return this.currMonthExt1[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(_.where(this.eeAboutData.extract, {
                'period' : 1
            }),function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthExt1[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currYearExt1: function() {               // 本年萃取一期
            if (this.currYearExt1[$scope.reportObj.jlrqTime]) {
                return this.currYearExt1[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arrs = _.find(_.groupBy(_.where(this.eeAboutData.extract, {
                'period' : 1
            }),function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearExt1[$scope.reportObj.jlrqTime] = arrs;
            return arrs;

        },
        currDayExt2: function() {               // 本日萃取二期
            if (this.currDayExt2[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayExt2 get from cache.');
                return this.currDayExt2[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.eeAboutData.extract, {
                'jlrq' : $scope.reportObj.jlrq,
                'period' : 2
            });
            this.currDayExt2[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthExt2: function() {               // 本月萃取二期
            if (this.currMonthExt2[$scope.reportObj.jlrqTime]) {
                return this.currMonthExt2[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(_.where(this.eeAboutData.extract, {
                'period' : 2
            }),function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthExt2[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currYearExt2: function() {               // 本年萃取二期
            if (this.currYearExt2[$scope.reportObj.jlrqTime]) {
                return this.currYearExt2[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(_.where(this.eeAboutData.extract, {
                'period' : 2
            }),function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearExt2[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currDayElectrowin: function() {         // 本日电积
            if (this.currDayElectrowin[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayElectrowin get from cache.');
                return this.currDayElectrowin[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.eeAboutData.electrowin, {
                'jlrq': $scope.reportObj.jlrq
            });
            this.currDayElectrowin[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthElectrowin: function() {         // 本月电积
            if (this.currMonthElectrowin[$scope.reportObj.jlrqTime]) {
                return this.currMonthElectrowin[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.eeAboutData.electrowin,function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthElectrowin[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currYearElectrowin: function() {         // 本年电积
            if (this.currYearElectrowin[$scope.reportObj.jlrqTime]) {
                return this.currYearElectrowin[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.eeAboutData.electrowin,function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearElectrowin[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currDayNeutro: function() {             // 本日环保中和
            if (this.currDayNeutro[$scope.reportObj.jlrqTime]) {
//                console.log(' currDayNeutro get from cache.');
                return this.currDayNeutro[$scope.reportObj.jlrqTime];
            }
            var arr = _.where(this.neutroAboutData.neutros, {
                'jlrq':$scope.reportObj.jlrq
            });
            this.currDayNeutro[$scope.reportObj.jlrqTime] = arr;
            return arr;
        },
        currMonthNeutro: function() {             // 本月环保中和
            if (this.currMonthNeutro[$scope.reportObj.jlrqTime]) {
                return this.currMonthNeutro[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.neutroAboutData.neutros,function(e) {
                return $filter('date')(e.jlrq,'yyyy-MM');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy-MM') == key;
            });
            this.currMonthNeutro[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },
        currYearNeutro: function() {             // 本年环保中和
            if (this.currYearNeutro[$scope.reportObj.jlrqTime]) {
                return this.currYearNeutro[$scope.reportObj.jlrqTime];
            }
            var jlrq = $scope.reportObj.jlrq;
            var arr = _.find(_.groupBy(this.neutroAboutData.neutros,function(e) {
                return $filter('date')(e.jlrq,'yyyy');
            }),function(value,key) {
                return $filter('date')(jlrq,'yyyy') == key;
            });
            this.currYearNeutro[$scope.reportObj.jlrqTime] = arr;
            return arr;

        },


        // Data
        heapAboutData : [],
        eeAboutData : [],
        neutroAboutData : []
    };

    // 查询数据库
    $scope.queryData = function() {
        dashboardSvc.getRptHeapData().success(function(response) {
            $scope.reportObj['heapAboutData'] = response['data'];
        }).error(function(){
                $.growl(' 查询堆浸数据失败，服务器端通讯异常.');
            });

        dashboardSvc.getRptEEData().success(function(response) {
            $scope.reportObj['eeAboutData'] = response['data'];
            for (var k in $scope.reportObj.extParam) {
                $scope.reportObj.extParam[k] = undefined;
            }

        }).error(function() {
                $.growl(' 查询萃取、电积数据失败，服务器端通讯异常.');
            });

        dashboardSvc.getNeutroAboutAllData().success(function(response) {
            $scope.reportObj['neutroAboutData'] = response['data'];
        }).error(function() {
                $.growl(' 查询环保中和数据失败，服务器端通讯异常.');
            });
    };


    // 直接调用查询数据函数
    $scope.queryData();
    $scope.$watch('reportObj.jlrq',function(newValue,oldValue,scope) {
        console.log('--------- in $watch function --------');
        if (scope.reportObj.heapAboutData) {
            console.log('------- 数据已装载，开始计算 ---------');
            scope.reportObj.jlrqTime = newValue.getTime();
            scope.reportObjVM.inputOreParamVM = scope.reportObj.inputOreParam();
            scope.reportObjVM.inputWaterParamVM = scope.reportObj.inputWaterParam();
            scope.reportObjVM.extParamVM['1'][newValue] = scope.reportObj.extParam(1,newValue);
            scope.reportObjVM.extParamVM['2'][newValue] = scope.reportObj.extParam(2,newValue);
            scope.reportObjVM.theHeapParamVM['A1'] = scope.reportObj.theHeapParam('A1');
            scope.reportObjVM.theHeapParamVM['A2'] = scope.reportObj.theHeapParam('A2');
            scope.reportObjVM.theHeapParamVM['A3'] = scope.reportObj.theHeapParam('A3');
            scope.reportObjVM.electrowinParamVM = scope.reportObj.electrowinParam();
            scope.reportObjVM.neutroParamVM = scope.reportObj.neutroParam();
        }
        else {
            console.log(' 数据还未准备好 ');
            console.dir(scope.reportObj.heapAboutData);
            $.growl('正在从服务器端下载数据，请重试...');
        }
    });

    $scope.selectRptDate = function() {

        var modalInstance = $modal.open({
            templateUrl: 'rpt-setdate.html',
            controller: function($scope,$modalInstance) {
                //$scope.selectDate = new Date();
                $scope.ok = function (d) {


                    $scope.selectDate = new Date(Date.parse(d));
                    $modalInstance.close($scope.selectDate);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

            }
        });

        modalInstance.result.then(function(selectDate) {
//            console.log('modal then input jlrq:'+selectDate);
            $scope.reportObj.jlrq = selectDate;
            $scope.reportObj.jlrqTime = selectDate.getTime();
//            console.log('modal then jlrq:' + $scope.reportObj.jlrq);

        }), function() {
            console.log(' 选择日期操作取消. ');
            $scope.reportObj.jlrq = new Date;
        };

    };







}]);

// Head 区域 控制器
function HeadController($scope,$rootScope,userUtil,$q,$state) {
    // 设置Menu 的active状态
    $scope.menuClick = function($event) {

        $($event.target).parent().addClass('active').siblings().removeClass('active');
    }

    // 登陆按钮
    $scope.loginAction = function () {


        console.log(' in login action:');
//        console.dir($rootScope.userInfo);

        userUtil.login($rootScope.userInfo).success(function (user) {
//            console.log(' After login    ...');
//            console.dir(user);
            $rootScope.userInfo = user['data'];
            if ($rootScope.userInfo && $rootScope.userInfo.id && $rootScope.userInfo.id > 0) {
                $rootScope.headShowSwitch.login = true;

               /*

                if ($rootScope.userInfo.isAdmin == '1') {
                    $state.go('edit');
                }
                else {
                    $state.go('process');
                }
                */
            }
            else
            {
                $rootScope.userInfo = {};
            }
        })
        .
        error(function () {
            console.log(' ---------- login failed -----------');
        });


        $scope.$broadcast('testevent');
    }

    // 登出按钮
    $scope.logoutAction = function() {
        $rootScope.userInfo = {};
        $rootScope.headShowSwitch.login = false;
        $state.go('home');
    }

    $scope.$on('testevent',function(event){
//        console.log('event testevent received in HeadController.');
        //console.dir(event);                                                                         s
        //event.stopPropagation();
    });


}

icdModule.controller('ToolsController',['$scope','$state',function($scope, $state){
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }
     $scope.toolsList = [
         {
             'title' : '比对HIS中编码数据',
             'active': false,
             'target': 'autoCompareManual'
         }   ,
         {
             'title' : 'ICD自动编码提示',
             'active': false,
             'target': 'autoCode'
         }
     ];

    $scope.toolSelect = function(tool) {

        $state.go('tools.'+tool.target);
    }
}]) ;

icdModule.controller('ToolAutoCodeCtrl',['$scope','miscUtil','icdService',function($scope,miscUtil,icdService) {

    $scope.diagName = "";
    $scope.autoCodePaths = [];
    $scope.doautocode = function() {
        if ($scope.diagName && "" != $scope.diagName) {
            icdService.autoCode($scope.diagName).success(function(data) {
//            console.dir(data);

                $scope.autoCodePaths = data['data'];
                _.each($scope.autoCodePaths, function(path){
                    for (var idx=path.nodes-1 ; idx>=0; idx--) {
                        if (path.nodeList[idx-1]) {
                            path.nodeList[idx-1]['children'] = path.nodeList[idx-1]['children'] || [];
                            path.nodeList[idx-1]['children'].push(path.nodeList[idx]);
                            path.nodeList.pop();
                        }

                    }
                });
//            console.dir($scope.autoCodePaths);
            }).error(function() {
                    $.growl('自动为诊断进行ICD-10编码失败。');
                })   ;
        }

    }   ;
}]);

icdModule.controller('ToolAutoCompareCtrl',['$scope','miscUtil','icdService',function($scope, miscUtil,icdService) {
    $scope.queryHisInput = {};
    $scope.diagItemsFromHis = [];
    $scope.autoCodePaths = [];
    $scope.queryHis = function() {
        miscUtil.getHisDiagItems($scope.queryHisInput).success(function(data){
            console.dir(data);
            $scope.diagItemsFromHis = data['data'];
        })
        .error(function(){
                $.growl('查询His数据库失败。');
            });
    };



    $scope.selectDiagIndex = 0;

    $scope.selectDiagItem = function(item,index) {
        $scope.selectDiagIndex = index;
//        console.dir(item);
        item.active = true;
        icdService.autoCode(item.diagName).success(function(data) {
            console.dir(data);

            $scope.autoCodePaths = data['data'];
            _.each($scope.autoCodePaths, function(path){
                for (var idx=path.nodes-1 ; idx>=0; idx--) {
                    if (path.nodeList[idx-1]) {
                        path.nodeList[idx-1]['children'] = path.nodeList[idx-1]['children'] || [];
                        path.nodeList[idx-1]['children'].push(path.nodeList[idx]);
                        path.nodeList.pop();
                    }

                }
            });
//            console.dir($scope.autoCodePaths);
        }).error(function() {
                $.growl('自动为诊断进行ICD-10编码失败。');
            })   ;
    }
}]);
icdModule.controller('DiseaseicdController',['$scope','$state','$modal','disUtil',function($scope,$state,$modal,disUtil){
    $scope.queryDiseaseOne = {};
    if (! $scope.headShowSwitch.login) {
        $.growl('请先正确登陆系统，再进行操作。');
        $state.go('home');
        return;
    }
    $scope.diseaseicdList = [
         {
             'title' : '疾病编码索引(卷3)',
             'active': false,
             'target': 'diseaseThree'
         }   ,
         {
             'title' : '疾病编码核对(卷1)',
             'active': false,
             'target': 'diseaseOne'
         } 
    ];
    $scope.diseaseicdSelect = function(diseaseicd) {

        $state.go('diseaseicd.'+diseaseicd.target);
    };
    $scope.icdCodeUrl = function(inputCode){
        $scope.queryDiseaseOne.inputCode = inputCode;
        $state.go('diseaseicd.diseaseOne');
    };
   /* $scope.diseaseicdEditSelect = function(url){
        $state.go(url);
    };*/
     //包括||不包括||另编码  编辑
    $scope.editCludeClick = function(cludeDisRelation){
        var modalInstance = $modal.open({
            templateUrl: 'diseaseOne_noIncludeEdit.html',
            controller: function($scope,$modalInstance,currentDiseaseRelation){
                $scope.ok=function(){
                    $modalInstance.close();
                };
                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
                $scope.currentDiseaseRelation=currentDiseaseRelation;
                //包括||不包括 编辑--》保存
                $scope.save = function(icdDiseaseRelation){
                    disUtil.editDiseaseRelation(icdDiseaseRelation).success(function(data){
                        //alert(data['data'].codeNameCh);
                        $modalInstance.close();
                    });
                };
            },
            resolve: {
                currentDiseaseRelation: function() {
                    return  cludeDisRelation;
                }
            } 
        });
        
    };
    //next
    $scope.editNextClick = function(dis){
        var modalInstance = $modal.open({
            templateUrl: 'diseaseOne_nextEdit.html',
            controller: function($scope,$modalInstance,nextDisease){
                $scope.ok=function(){
                    $modalInstance.close();
                };
                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
                $scope.nextDisease=nextDisease;
                //next 编辑--》保存
                $scope.save = function(icdDisease){
                    var child_save =   icdDisease.children;
                    var  parent_save = icdDisease.parentDisease;
                    icdDisease.children= null;
                    icdDisease.parentDisease=null;
                    disUtil.editDiseaseOne(icdDisease).success(function(data){
                        //alert(data['data'].codeNameCh);
                        icdDisease.children = child_save;
                        icdDisease.parentDisease=parent_save;
                        $modalInstance.close();
                    });
                };
            },
            resolve: {
                nextDisease: function() {
                    return  dis;
                }
            } 
        });
    };
       //icdDisease eidt
    $scope.editClick = function(dis){
        var modalInstance = $modal.open({
            templateUrl: 'diseaseOne_edit.html',
            controller: function($scope,$modalInstance,currentDisease){
                $scope.ok=function(){
                    $modalInstance.close();
                };
                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
                $scope.currentDisease=currentDisease;
                //进入编辑--》保存
                $scope.editDiseaseOne = function(icdDisease){
                    var refRelations = icdDisease.refRelations;
                    var child_save =   icdDisease.children;
                    var  parent_save = icdDisease.parentDisease;
                    icdDisease.children= null;
                    icdDisease.parentDisease=null;
                    icdDisease.refRelations = null;
                    disUtil.editDiseaseOne(icdDisease).success(function(data){
                        //alert(data['data'].codeNameCh);
                        icdDisease.children = child_save;
                        icdDisease.parentDisease=parent_save;
                        icdDisease.refRelations = refRelations;
                        $modalInstance.close();
                    });
                };
            },
            resolve: {
                currentDisease: function() {
                    return  dis;
                }
            }
        });
       
        /*modalInstance.result.then(function(duichang){
            console.log('modal ok:'+duichang);
//            console.dir(duichang);
            // 添加堆场
            HeapSvc.addHeap(duichang).success(function(response) {
                console.log('正常:');
//               
                $scope.managedTargets.push(duichang);
            }).error(function(){
                    console.log('操作异常');
                });
        }, function(){
            console.log(' modal cancel.');
        });*/
    };
    //进入编辑--卷三
    $scope.editThreeClick = function(dis){
        var modalInstance = $modal.open({
            templateUrl: 'diseaseThree_edit.html',
            controller: function($scope,$modalInstance,currentDisease){
                $scope.ok=function(){
                    $modalInstance.close();
                };
                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
                $scope.currentDisease=currentDisease;
                //next 编辑--》保存
                $scope.save = function(icdDiseaseIndex){
                    var child_save =   icdDiseaseIndex.children;
                    var  parent_save = icdDiseaseIndex.parentDiseaseIndex;
                    icdDiseaseIndex.children= null;
                    icdDiseaseIndex.parentDiseaseIndex=null;
                    disUtil.editDiseaseThree(icdDiseaseIndex).success(function(data){
                        //alert(data['data'].codeNameCh);
                        icdDiseaseIndex.children = child_save;
                        icdDiseaseIndex.parentDiseaseIndex=parent_save;
                        $modalInstance.close();
                    });
                };
            },
            resolve: {
                currentDisease: function() {
                    return  dis;
                }
            } 
        });
    };
    //卷三-编辑别名
    $scope.editThreeAliasClick = function(dis){
        var modalInstance = $modal.open({
            templateUrl: 'diseaseThree_alias_edit.html',
            controller: function($scope,$modalInstance,currentDiseaseIndex){
                $scope.ok=function(){
                    $modalInstance.close();
                };
                $scope.cancel = function(){
                    $modalInstance.dismiss('cancel');
                };
               // $scope.currentDiseaseIndex=currentDiseaseIndex;
                disUtil.findAliases(currentDiseaseIndex.id).success(function(data){
                    $scope.currentDiseaseIndex = data['data'];
                });
                //next 编辑--》保存
                $scope.save = function(icdDiseaseIndex){
                  
                };
            },
            resolve: {
                currentDiseaseIndex: function() {
                    return  dis;
                }
            } 
        });
    };
     
}]);
icdModule.controller('DiseaseicdThreeCtrl',['$scope','disUtil','icdService' ,function($scope,disUtil,icdService){
    $scope.queryDiseaseThree = {};
    $scope.autoCodePaths={};
    $scope.queryDisease = function(queryDiseaseThree){
        $scope.autoCodePaths ={};
        disUtil.search0Dis(queryDiseaseThree.level0).success(function(data){
                $scope.autoCodePaths = data['data'];
        });
    };
    $scope.setLevel = function(nodeVal){
       
      if(nodeVal.depth ==1){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.length);
          $scope.queryDiseaseThree.level2="";
          $scope.queryDiseaseThree.level3="";
          $scope.queryDiseaseThree.level4="";
          $scope.queryDiseaseThree.level5="";
          $scope.queryDiseaseThree.level6="";
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').hide();
          $('#level4Div').hide();
          $('#level5Div').hide();
          $('#level6Div').hide();
      }else if(nodeVal.depth==2){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.indexOf('--'));
          $scope.queryDiseaseThree.level2=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('--')+2,nodeVal.pathStr.length);
          $scope.queryDiseaseThree.level3="";
          $scope.queryDiseaseThree.level4="";
          $scope.queryDiseaseThree.level5="";
          $scope.queryDiseaseThree.level6="";
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').show();
          $('#level4Div').hide();
          $('#level5Div').hide();
          $('#level6Div').hide();
      }else if(nodeVal.depth==3){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.indexOf('--'));
          $scope.queryDiseaseThree.level2=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('--')+2,nodeVal.pathStr.indexOf('---'));
          $scope.queryDiseaseThree.level3=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('---')+3,nodeVal.pathStr.length);
          $scope.queryDiseaseThree.level4="";
          $scope.queryDiseaseThree.level5="";
          $scope.queryDiseaseThree.level6="";
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').show();
          $('#level4Div').show();
          $('#level5Div').hide();
          $('#level6Div').hide();
      }else if(nodeVal.depth==4){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.indexOf('--'));
          $scope.queryDiseaseThree.level2=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('--')+2,nodeVal.pathStr.indexOf('---'));
          $scope.queryDiseaseThree.level3=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('---')+3,nodeVal.pathStr.indexOf('----'));
          $scope.queryDiseaseThree.level4=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('----')+4,nodeVal.pathStr.length);
          $scope.queryDiseaseThree.level5="";
          $scope.queryDiseaseThree.level6="";
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').show();
          $('#level4Div').show();
          $('#level5Div').show();
          $('#level6Div').hide();
      }else if(nodeVal.depth==5){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.indexOf('--'));
          $scope.queryDiseaseThree.level2=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('--')+2,nodeVal.pathStr.indexOf('---'));
          $scope.queryDiseaseThree.level3=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('---')+3,nodeVal.pathStr.indexOf('----'));
          $scope.queryDiseaseThree.level4=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('----')+4,nodeVal.pathStr.indexOf('-----'));
          $scope.queryDiseaseThree.level5=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-----')+5,nodeVal.pathStr.length);
          $scope.queryDiseaseThree.level6="";
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').show();
          $('#level4Div').show();
          $('#level5Div').show();
          $('#level6Div').show();
      }else if(nodeVal.depth==6){
          $scope.queryDiseaseThree.level1=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-')+1,nodeVal.pathStr.indexOf('--'));
          $scope.queryDiseaseThree.level2=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('--')+2,nodeVal.pathStr.indexOf('---'));
          $scope.queryDiseaseThree.level3=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('---')+3,nodeVal.pathStr.indexOf('----'));
          $scope.queryDiseaseThree.level4=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('----')+4,nodeVal.pathStr.indexOf('-----'));
          $scope.queryDiseaseThree.level5=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('-----')+5,nodeVal.pathStr.indexOf('------'));
          $scope.queryDiseaseThree.level6=nodeVal.pathStr.substring(nodeVal.pathStr.indexOf('------')+6,nodeVal.pathStr.length);
          $('#level1Div').show();
          $('#level2Div').show();
          $('#level3Div').show();
          $('#level4Div').show();
          $('#level5Div').show();
          $('#level6Div').show();
      }
    };
    
}]);
icdModule.controller('DiseaseicdOneCtrl',['$scope','disUtil','$modal','icdService' ,function($scope,disUtil,$modal,icdService){
    if($scope.queryDiseaseOne.inputCode!=""&&$scope.queryDiseaseOne.inputCode!=null){
        
        disUtil.searchDis($scope.queryDiseaseOne.inputCode).success(function(data){
            $scope.queryDiseaseOne.icdDisease = data['data'];
            $scope.queryDiseaseOne.icdDisease.next=[];
             for(var i=0;i<$scope.queryDiseaseOne.icdDisease.children.length;i++){
                 
                 var d = $scope.queryDiseaseOne.icdDisease.children[i];
                 if(d.icdCode==''||d.icdCode==null){
                        $scope.queryDiseaseOne.icdDisease.next.push(d);
                        for(var j=0;j<d.children.length;j++){
                            $scope.queryDiseaseOne.icdDisease.next.push(d.children[j]);
                        }
                 }
             }
        });
    }
    //本页ICDuRL
    $scope.searchDise = function(inputCode){
        $scope.queryDiseaseOne.inputCode = inputCode;
        disUtil.searchDis(inputCode).success(function(data){
            $scope.queryDiseaseOne.icdDisease = data['data'];
            $scope.queryDiseaseOne.icdDisease.next=[];
             for(var i=0;i<$scope.queryDiseaseOne.icdDisease.children.length;i++){
                 
                 var d = $scope.queryDiseaseOne.icdDisease.children[i];
                 if(d.icdCode==''||d.icdCode==null){
                        $scope.queryDiseaseOne.icdDisease.next.push(d);
                        for(var j=0;j<d.children.length;j++){
                            $scope.queryDiseaseOne.icdDisease.next.push(d.children[j]);
                        }
                 }
             }
        });
    };
   
}]);
 