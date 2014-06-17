/**
 * Created with JetBrains WebStorm.
 * User: changzhenghe
 * Date: 11/3/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */
// 定义各种所需服务 angular service

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
var easyLineChart = function(dataProvider,chartDef) {
//    console.log('easyLineChart, container:'+chartDef.container);
//    if (easyLineChart[chartDef.container] && chartDef.refresh) {        // refresh
//        console.log('----- easyLineChart Refresh -----');
//        console.dir(easyLineChart[chartDef.container]);
//        easyLineChart[chartDef.container].dataProvider = dataProvider;
//        easyLineChart[chartDef.container].validateData();
//        easyLineChart[chartDef.container].invalidateSize();
//        return;
//    }

    var chartData = dataProvider;

    // SERIAL CHART
    var chart = new AmCharts.AmSerialChart();
    chart.pathToImages = "./js/amcharts/images/";
    chart.dataProvider = chartData;
    chart.categoryField = chartDef.category['prop'];

    // listen for "dataUpdated" event (fired when chart is inited) and call zoomChart method when it happens
    //chart.addListener("dataUpdated", zoomChart);

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    if (chartDef.category.parseDates) {
        categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    }
    if (chartDef.category.minPeriod) {
        categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    }

    categoryAxis.minorGridEnabled = true;
    categoryAxis.axisColor = "#DADADA";

    // 最多4各Y轴
    var valueAxisDef = {
        nd : {
            position: 'right',
            items : ['g/L','ph','mm','NTU']
        },
        qty: {
            position:'left',
            items: ['M3','Kg','A','V']
        },
        qtyph: {
            position:'left',
            items: ['M3/h','A/M2']
        },
        hour: {
            position: 'right',
            items: ['h','%','#','℃']
        }
    };

    var axisPosition = {
        'left': [],
        'right':[]
    };


    // 设置valueAxis
//    var tUnits = _.countBy(chartDef.items,function(item){
//        return item.unit;
//    });

    // ValueAxis
    var vaxises = {};
    var i = 0;
    angular.forEach(chartDef.items,function(value,key){
        var unit = value.unit;
        var unitDef = {
            position:'left',
            items:[]
        };

        // 查找本数据项应对应的y轴坐标定义
        angular.forEach(valueAxisDef,function(v,k){
            if (_.contains(v.items,unit)) {
                unitDef = v;
            }
        })

        // 坐标定义已经存在
        if (_.contains(axisPosition[unitDef.position],unitDef)) {
            angular.forEach(vaxises,function(v,k){
                //console.log('stored title:'+)
                if (v.title == unitDef.items.join()) {
                    vaxises[value.unit] = v;
//                    console.log('key :'+value.unit);
//                    console.dir(v);
                }

            });
        }
        else {
            var valueAxis = new AmCharts.ValueAxis();
            valueAxis.position = unitDef.position; //
            valueAxis.axisColor = "#FCD202";
            valueAxis.gridAlpha = 0;
            valueAxis.axisThickness = 2;
            valueAxis.title=unitDef.items.join();
            valueAxis.axisTitleOffset = 5;
            axisPosition[unitDef.position].push(unitDef);
            valueAxis.offset = (axisPosition[unitDef.position].length - 1) * 50;
            vaxises[value.unit] = valueAxis;
//            console.log(value.unit+'    add valueaxis :'+valueAxis.title+'\t position:'+valueAxis.position+'\t offset:'+valueAxis.offset);
            chart.addValueAxis(valueAxis);
        }


        i += 1;
    });
//    console.dir(axisPosition);

    angular.forEach(chartDef.items,function(value,key){
        // GRAPHS

        var graph1 = new AmCharts.AmGraph();
        graph1.type = "smoothedLine";
        graph1.title = value.title;
        graph1.valueField = value.prop;
        graph1.bullet = "round";
        graph1.hideBulletsCount = 30;
        graph1.bulletBorderThickness = 1;
        graph1.valueAxis = vaxises[value.unit];
        graph1.balloonText = value.title+' [[value]] '+value.unit;
        graph1.connect = false;
        chart.addGraph(graph1);
    });



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


//    console.log('---  easyLineChart write & invalidateSize ----');
    // WRITE
    chart.write(chartDef.container);
    chart.invalidateSize();

    return chart;
};

var svc = angular.module('icd-service',[]);

var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

var dateFormat = "yyyy-MM-dd";

// 将输入Object中所有 符合 ISO8601 格式的字符串， 转换、设置为Date
function convertDateStringsToDates(input) {
    // Ignore things that aren't objects.
    if (typeof input !== "object") return input;

    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        var value = input[key];
        var match;
        // Check for string properties which look like dates.
        if (typeof value === "string" && (match = value.match(regexIso8601))) {
            var milliseconds = Date.parse(match[0])
            if (!isNaN(milliseconds)) {
                //console.log(' --- Before convert to Date:'+input[key]);
                input[key] = new Date(milliseconds);
                //console.log(' --- After convert to Date:'+input[key]);
            }
        } else if (typeof value === "object") {
            // Recurse into object
            convertDateStringsToDates(value);
        }
    }
}

// 将输入Object中所有 Date 类型的属性， 转换成 yyyy-MM-dd 格式字符串
function convertDateToString(input,custFormat)
{
//    try {
//        input = $.parseJSON(input);
//    }
//    catch(e) {
//        console.log("$$$$$$$$$$$$$$$$$$$ Request Data Cannot Parse to JSON $$$$$$$$$$$$$$$$$$$$$$$$$");
//        return input;
//    }

    //console.log("=================== convertDateToString ================");
    if (typeof input !== "object") {
        try {
            input = $.parseJSON(input);
        }
        catch(e) {
            return input;
        }

    }
    console.log('------------ convertDateToString -----------------');
    for (var key in input) {
        if (!input.hasOwnProperty(key)) continue;

        //console.log('---------------- check key:'+key);
        var value = input[key];
        if (value instanceof Date) {
            //console.log(' --- Before convert to String :'+input[key]);
            input[key] = angular.$filter('date')(value,dateFormat);
            //console.log(' --- After convert to String :'+input[key]);
        }
        else if (typeof value === "object" ) {
            convertDateToString(value);
        }
    }
//    input = input.toString();
    console.log("@@@@@@@@@@@@@@@@@ AFTER CONVERTDATETOSTRING @@@@@@@@@@@@@@@"+input);
}


// 处理用户相关操作， 登陆、添加、删除、修改...
//svc.factory('userUtil',['$resource', function($resoure){
//    return $resoure('/gpe/webapi/user/:userid/', {userid: '@userid'},
//        {login: {method: 'POST', params: {login: true}, isArray: false},
//            'get':    {method:'GET'},
//            'save':   {method:'POST'},
//            'query':  {method:'GET', isArray:false},
//            'remove': {method:'DELETE'},
//            'delete': {method:'DELETE'}
//        }
//    );
//}]);

// Dashboard
svc.factory('dashboardSvc',['$http','$filter',function($http,$filter) {
    var baseUrl = 'webapi/dashboard';
    return {
        // 根据日期，获取所有数据
        getAllDataByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/main/' + rqstr);
        },
        getHeapAboutAllData: function() {  // 堆浸工段的所有数据
            return $http.get(baseUrl + '/getHeapAboutAllData/');
        },
        getHeapAboutMonthsData: function(rq) {               // 堆浸工段1~2个月的数据
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getHeapAboutMonthsData/' + rqstr);
        },
        getEEAboutAllData: function() {     // 萃取、电积工段的所有数据
            return $http.get(baseUrl + '/getEEAboutAllData/');
        },
        getNeutroAboutAllData: function() {     // 环保、中和工段的所有数据
            return $http.get(baseUrl + '/getNeutroAboutAllData/');
        },
        getBalanceData: function() {    // 物料平衡计算
            return $http.get(baseUrl + '/getBalanceData/');
        },
        getRptHeapData: function() {    // 报表 堆浸工艺数据
            return $http.get(baseUrl + '/getRptHeapData/');

        } ,
        getRptEEData: function() {      // 报表 萃取电积工艺
            return $http.get(baseUrl + '/getRptEEData/');
        },
        getDashHeapAboutData: function() {
            return $http.get(baseUrl + '/getDashHeapAboutData/');
        }
    };
}]);

// 堆浸、萃取、电积、环保中和
svc.factory('HeapLeachingProc',['$http','$filter',function($http,$filter){
    var baseUrl = 'webapi/hlpProc';
    return {

        // 根据日期，获取入堆矿石数据
        getInputOreByDay: function(rq) {
//            console.dir(" input rdrq:"+rq);
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl+'/getInputOreByDay/'+rqstr);
        },
        getInputWaterByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl+'/getInputWaterByDay/'+rqstr);
        },
        saveInputOre: function(hio) {
            if (hio.pkid && hio.pkid != null) {

                return $http.post(baseUrl+'/inputOre/'+hio.pkid,hio);
            }
            else {
                return $http.post(baseUrl+'/inputOre/',hio);
            }
        },
        saveInputWater:function(data) {
            if (data.pkid && data.pkid != null) {

                return $http.post(baseUrl+'/inputWater/'+data.pkid,data);
            }
            else {
                return $http.post(baseUrl+'/inputWater/',data);
            }
        },
        getSprayParamsByDay:function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getSprayParamsByDay/'+rqstr);
        },
        saveSprayParam: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/sprayParam/'+data.pid,data);
            }
            else {
                return $http.post(baseUrl + '/sprayParam/',data);
            }
        },
        getLeachingParamsByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getLeachingParamsByDay/'+rqstr);
        },
        saveLeachingParam: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/leachingParam/'+data.pid, data);
            }
            else {
                return $http.post(baseUrl + '/leachingParam/', data);
            }
        },
        getExtracParam1ByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getExtractParam1ByDay/'+rqstr);
        },
        getExtracParam2ByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getExtractParam2ByDay/'+rqstr);
        },
        getElectrowDataByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getElectroDataByDay/'+rqstr);
        },
        saveExtracParam: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/extracParam/'+data.pid, data);
            }
            else {
                return $http.post(baseUrl + '/extracParam/', data);
            }
        },
        saveElectroParam: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/electroParam/'+data.pid, data);
            }
            else {
                return $http.post(baseUrl + '/electroParam/', data);
            }
        },
        getNeutroDataByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getNeutroDataByDay/'+rqstr);
        },
        saveNeutroParam: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/neutroParam/'+data.pid, data);
            }
            else {
                return $http.post(baseUrl + '/neutroParam/', data);
            }
        },
        getSolPoolParamByDay: function(rq) {
            var rqstr = $filter('date')(rq,dateFormat);
            return $http.get(baseUrl + '/getSolPoolParamByDay/'+rqstr);
        }
        ,
        saveSolPoolParams: function(data) {
            if (data.pid && data.pid != null) {
                return $http.post(baseUrl + '/solPoolParam/'+data.pid, data);
            }
            else {
                return $http.post(baseUrl + '/solPoolParam/', data);
            }
        }
    };
}]);

/*
因为 $resource 自动去除 URL 末尾的 / 符号，导致与Jersey 后台RESTFul 服务不兼容
改用 $http 实现

 */
svc.factory('userUtil',['$http',function($http){
    var baseUrl = '/webAppICD/api/comm';
    return {
        /*get: function(userid) {
            return $http.get(baseUrl+'id/'+userid+'/');
        },
        save: function(user) {
            var url = user.userid ? baseUrl +'save/' + user.userid +'/' : baseUrl + 'save/';
            return $http.post(url, user);
        },
        query: function() {
            return $http.get(baseUrl+'listAll/');
        },   */
        login: function(user) {
            var url = baseUrl + '/login';
            return $http.get(url, {params: user});
        }
        /*,
        delete: function(user) {
            return $http.delete(baseUrl+'delete/'+user.userid);
        }           */
    };
}]);

/*
杂七杂八的工具
 */
svc.factory('miscUtil',['$http',function($http){
        var baseUrl = '/webAppICD/api/comm';
        return {
            getHisDiagItems: function(obj) {
                var url = baseUrl + '/getDiagFromHis';
                return $http.get(url, {params: obj});
            }
        }
}]);
//疾病编码索引查询 && 疾病编码核对查询
svc.factory('disUtil',['$http',function($http){
    var baseUrl ='/webAppICD/api';
    return {
        search0Dis:function(name){
            var url = baseUrl+'/diseaseThree/search0Dis';
            return $http.get(url,{params:{'name':name,'type':"vol3"}});
        },
        searchDis:function(inputCode){
            var url = baseUrl+'/diseaseOne/searchDis';
            return $http.get(url,{params:{'inputCode':inputCode}});
        },
        editDiseaseOne:function(icdDisease){
            var url = baseUrl+'/diseaseOne/edit';
            return $http.post(url,icdDisease);
        }
    };
}]);
/*
根据诊断，进行自动编码
 */
svc.factory('icdService',['$http',function($http){
        var baseUrl = '/webAppICD/api/icd';
        return {
            autoCode : function(diagName) {
                var url = baseUrl + '/autocode';
                return $http.get(url, {params: {'diagName': diagName}});
            }
        }
}])

/*
常用链接相关的服务
 */
svc.factory('linkSvc',['$http',function($http){
    var baseUrl = 'webapi/favLinks/';
    return {
        getAllLinks: function() {
            return $http.get(baseUrl + 'getAllLinks/');
        },
        addLink: function(link) {
            return $http.post(baseUrl + 'addLink/', link);
        },
        removeLink: function(pid) {
            return $http.get(baseUrl + 'removeLink/'+pid);
        },
        updateLink: function(link) {
            return $http.post(baseUrl + 'updateLink/',link);
        }
    }
}]);

/*
堆场相关操作服务 HeapSvc
 */
svc.factory('HeapSvc',['$http',function($http){
    var baseUrl = 'webapi/heap/';
    return {
       get: function(heapid) {
           return $http.get(baseUrl+heapid+'/');
       },
       query: function() {
           return $http.get(baseUrl + 'availHeaps');
       },
       queryLayers: function(heapid) {
            return $http.get(baseUrl + heapid+'/layer');
       },
       querySubHeaps: function(heapid) {
           return $http.get(baseUrl + heapid + '/subheaps');
       },
       availLayers: function() {
           return $http.get(baseUrl + 'availLays');
       },
       addHeap: function(heap) {
           return $http.post(baseUrl + 'addHeap' , heap
           );
       },
       allLayers: function() {
           return $http.get(baseUrl + 'allLayers');
       },
       allHeaps: function() {
           return $http.get(baseUrl + 'allHeaps');
       }

    };
}]);

svc.filter('yesOrNo', function(){
    var showYesOrNo = function(input) {
        if (input == 1 || input == 'y' || input == 'Y') {
            console.log(' show ok...');
            return "<span class='glyphicon glyphicon-ok-sign'></span>";
        }
        else {
            console.log('show error...');
            return "<span class='glyphicon glyphicon-remove-circle'></span>";
        }
    };
    return showYesOrNo;
});

svc.filter('sprayTypeFilter',function(){
    var func = function(input) {
        if (input === 'PLY') {
            return '喷淋液';
        }
        else if (input === 'DKS') {
            return '硐坑水';
        }
        else {
            return '错误的喷淋类型';
        }
    };
    return func;
});



svc.factory('errorHttpInterceptor',function($q, $rootScope){
    return function(promise) {
        return promise.then(function(response){
//                console.log('In HttpInterceptor, response status:'+response.status);
                //console.dir(response);
//                console.log('---------- HttpInterceptor, Next will emit event.....');

                if (response && response.data && response.data.retCode != null) {
                    if (response.data.retCode === 0) {
//                        console.log(' json operation success.' + response.data.retCode);
                        $rootScope.$emit('JSONNOTIFYEVENT',response.data.retCode,response.data.retInfo);
                    }
                    else {
//                        console.log(' json operation Error.' + response.data.retCode);
                        $rootScope.$emit('JSONNOTIFYEVENT',response.data.retCode,response.data.retInfo);

//                        return promise.resolve(response);
                    }
                }

                return response;
            },
            function(response) {
                if (response.status === 401) {
                    $rootScope.$emit('event:loginRequired');
                }
                else {
                    $rootScope.$emit('NOTIFYEVENT','服务器不能正确处理请求，Sorry！Code: '+response.status);
                }
                console.log('--------------------- error ----------------');
                return $q.reject(response);
            }
        )
    }
});

svc.factory('spinnerShowInterceptor',function($q,$window) {
    return function (promise) {
        return promise.then(function (response) {
            // do something on success
            // todo hide the spinner
            //alert('stop spinner');
            $('#mydiv').hide();
            return response;

        }, function (response) {
            // do something on error
            // todo hide the spinner
            //alert('stop spinner');
            $('#mydiv').hide();
            return $q.reject(response);
        });
    };
});

// 对 $http 的配置、设置
svc.config(function($httpProvider) {
    $httpProvider.responseInterceptors.push('errorHttpInterceptor');
    $httpProvider.responseInterceptors.push('spinnerShowInterceptor');

    var spinnerFunction = function (data, headersGetter) {
        // todo start the spinner here
        //alert('start spinner');
        $('#mydiv').show();
        return data;
    };


    // 转换Response 中 String 为 Date
    $httpProvider.defaults.transformResponse.push(function(responseData){
        convertDateStringsToDates(responseData);
        return responseData;
    });

    $httpProvider.defaults.transformRequest.push(spinnerFunction);

    $httpProvider.defaults.transformRequest.push(function(requestData){

       //2014-06-17 cjl
       //  convertDateToString(requestData);
        return requestData;
    });


});




svc.factory('wsocket',['$rootScope', function($rootScope){
    console.log(typeof WebSocket);
    if (typeof WebSocket !== "function" && typeof MozWebSocket === "function") {
        WebSocket = MozWebSocket;
    }
//    console.dir(WebSocket);
    if (typeof WebSocket === "function" || typeof WebSocket === 'object')   {
        return {
            connect: function (url) {
                return new WebSocket(url);
            }
        };
    }
    else {  // WebSocket not supported.
        console.log(' WebSocket not Supported.');
    }
}]);

/*
文件上传
 */
svc.directive('fileupload',function() {
    return {
        restrict: 'A',
        scope: {
            done: '&',
            progress: '&'
        },
        link: function(scope,element,attrs) {
            var optionsObj = {
                dataType: 'json'
            };
            if (scope.done) {
                optionsObj.done = function() {
                    scope.$apply(function(){
                        scope.done({e: e,data: data});
                    })
                };
            }
            if (scope.progress) {
                optionsObj.progress = function() {
                    scope.$apply(function() {
                        scope.progress({e:e, data:data});
                    })
                }
            }

            element.fileupload(optionsObj);
        }
    };
});


/*
    检查二次输入password是否一致

 */
svc.directive('passwdCheck', function() {
    console.log('=============== directive passwdCheck Defined. ==============');
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {

            console.log('============ directive pwCheck ============='+attrs.passwdCheck);
            var firstPassword = '#' + attrs.passwdCheck;
            elem.add(firstPassword).on('keyup', function () {
                scope.$apply(function () {
                    console.log(elem.val() === $(firstPassword).val());
                    ctrl.$setValidity('pwmatch', elem.val() === $(firstPassword).val());
                });
            });
        }
    } ;
});

// 检查输入值是否重复
svc.directive('ngUnique', ['$http', function (async) {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
            elem.on('blur', function (evt) {
                scope.$apply(function () {
                    var val = elem.val();
                    var req = { "value":val, "checkType":attrs.ngUnique }

                    var ajaxConfiguration = { method: 'POST', url: 'checkValueUnique', data: req };
                    async(ajaxConfiguration)
                        .success(function(data, status, headers, config) {
                            ctrl.$setValidity('unique', data.status);
                        });
                });
            });
        }
    }
}
]);

// ng-blur
svc.directive('ngBlur', function() {
    return function( scope, elem, attrs ) {
        elem.bind('blur', function() {
            scope.$apply(attrs.ngBlur);
        });
    };
});

svc.directive('ngReallyClick', [function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                var message = attrs.ngReallyMessage;
                if (message && confirm(message)) {
                    scope.$apply(attrs.ngReallyClick);
                }
            });
        }
    }
}]);

// angular amcharts Gauge Directive
svc.directive('dashGauge', function factory() {
    var directiveDefinitionObject = {
        restrict: "A",
        replace:    true,
        require:    '?ngModel',
        template:   '<div class="container"><div id="test" class="amGauge" style="width:200px; height:200px;"></div></div>',

        compile
            :
            function compile(tElement, tAttrs, transclude) {

                return function (scope, element, attrs,ngModel) {
                    if (!scope.amchartsReady) {
                        console.log('amcharts intialized failed....');
                        element.children(".amGauge").append('图表组件初始化失败，无法正常显示！');
                        return;
                    }



                    // AmChart Gauge...
                    var chart;
                    var arrow;
                    var axis;
                    var arrow2;

                    chart = new AmCharts.AmAngularGauge();

                    chart.addTitle('cpu 使用率');
                    chart.startDuration = 0;
//                chart.backgroundColor = "#CCCCCC";
                    //            chart.backgroundAlpha = 1;

                    chart.faceColor = "#CCCCCC";
                    chart.faceAlpha = 1;

                    axis = new AmCharts.GaugeAxis();
                    axis.startValue = 0;
                    axis.axisThickness = 1;
                    axis.endValue = 100;

                    // Color bands
                    var band1 = new AmCharts.GaugeBand();
                    band1.startValue = 0;
                    band1.endValue = 75;
                    band1.color = "#00CC00";

                    var band2 = new AmCharts.GaugeBand();
                    band2.startValue = 75;
                    band2.endValue = 90;
                    band2.color = "#ffac29";

                    var band3 = new AmCharts.GaugeBand();
                    band3.startValue = 90;
                    band3.endValue = 100;
                    band3.color = "#ea3838";
                    band3.innerRadius = "95%";

                    axis.bands = [band1, band2, band3];

                    // bottom text
                    axis.bottomTextYOffset = -20;
                    axis.setBottomText("0 %");
                    chart.addAxis(axis);

                    // gauge arrow
                    arrow = new AmCharts.GaugeArrow();
                    chart.addArrow(arrow);

                    arrow2 = new AmCharts.GaugeArrow();
                    chart.addArrow(arrow2);

                    console.log('-------- amchart will write now --------');
//                    console.dir(element.children()[0]);

                    //chart.write(element.children()[0]);
                    chart.write(element.children('.amGauge')[0]);

                    var updateView = function(val) {
                        console.log(' us_cpu :'+val['us_cpu'] + "\t  sys_cpu:"+val['sy_cpu']);
                        arrow.setValue(val['us_cpu']);
                        arrow2.setValue(val['sy_cpu']) ;
                        axis.setBottomText(''+(100 - val.id_cpu) + " %");
                    }


                    ngModel.$render = function() {
                        console.log(' ngModel.$viewVaue :'+ngModel.$viewValue);
//                        console.dir(ngModel.$viewValue);
                        if (ngModel.$viewValue['id_cpu']) {
                            updateView(ngModel.$viewValue);
                        }
                    }

                    updateView({us_cpu:10,sy_cpu:15,id_cpu:75});

                }
            }
    };
    return directiveDefinitionObject;
})


    svc.directive('jqdatepicker',function($filter){
        return {
            restrict: 'A',
            require: '?ngModel',
            priority: 1,                        // WORKROUND For Angular 1.2 Bug
            scope: {
                select: '&'
            },
            link: function(scope,element,attrs,ngModel) {
                if (!ngModel) return;

                var optionObj = {};

                optionObj.dateFormat = 'yy-mm-dd';
                var updateModel = function(dateText) {
                    scope.$apply(function(){
                        ngModel.$setViewValue(dateText);
                    });
                };

                optionObj.onSelect = function(dateText, picker) {
                    updateModel(dateText);
                    if (scope.select) {
                        scope.$apply(function() {
                            scope.select({date: dateText});
                        });
                    }
                };

                ngModel.$render = function() {
                    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@ jqdatepicker $render :"+$filter('date')(ngModel.$viewValue,dateFormat));
                    element.datepicker('setDate', $filter('date')(ngModel.$viewValue,dateFormat));
                };

                element.datepicker(optionObj);
            }
        };
    })  ;
