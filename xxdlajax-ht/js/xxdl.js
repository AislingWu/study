var cRequestSign = "/reqxml";

//获取url并提取相关参数
function getUrlParameter(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var arr = window.location.search.substr(1).match(reg);

    if (arr) {
        return arr[2];
    } else return null;
}

//通用ajax请求出错处理
function ajaxError(XMLHttpRequest, textStatus, errorThrown) {
    var message = "";
    switch (textStatus) {
        case 'timeout':
            message = "请求超时.";
            alert(message);
            break;
        case 'parsererror':
            message = "数据格式出错.";
            alert(message);
            break;
        default:
        return false;
    }
    return false;
}

//通用ajax请求
function getData(requestUrl, requestData, cfunc){ //回调函数 cfunc

    $.ajax({
        type: "POST",
        url: requestUrl,
        data: requestData,
        contentType: "application/x-www-form-urlencoded;", //避免乱码
        success: function(data){
            if(data.ERRORNO < 0 && !(data.ERRORMESSAGE == null|| data.ERRORMESSAGE == '')){
                var action = data.ACTION;
                if( action=='41138'||action=='41140'||action=='41116' ){
                    $(".refresh").html(data.ERRORMESSAGE).setmiddle().fadeOut(900,function(){
                        $(this).hide();
                    });
                }else{
                    alert(data.ERRORMESSAGE);
                }
                if($(".refresh").length>0){
                    $(".refresh").fadeOut(300).hide();
                }
                return false;
            }else{ cfunc(data);};
        },
        error: ajaxError
    });
}

//获取窗口高度
function getWinHeight(){
    var height;
    //Standards browsers mozilla, netscape, opera and IE7
    if (typeof window.innerHeight != 'undefined'){ height = window.innerHeight; }
    // IE6
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientHeight != 'undefined' && document.documentElement.clientHeight != 0){
        height = document.documentElement.clientHeight;
    }
    // Older IE
    else { height = document.getElementsByTagName('body')[0].clientHeight;}
    return height;
}

//调用手机功能
function onJsOverrideUrlLoading(str){
   var app = navigator.appVersion;
   app = app.toLocaleLowerCase();

   if(app.indexOf("windows")>0)
   {
       window.external.notify(str);
   }
   else if(app.indexOf("iphone")>0)
   {
       window.location=str;
   }
   else if(app.indexOf("android")>0)
   {
     window.location=str;
   }
}

function loadEssay(reqUrl){

    var url = cRequestSign + reqUrl;
    getData(url, "", function(data){
        if(data.GRID0){
            var essayDate = data.GRID0[0].split(" ")[0];  //文章日期
            var essayTitle = data.GRID0[0].split(" ")[1];  //文章标题
            var essaySource = data.GRID0[1];  //文章来源
            var html = "";
            var date = essayDate.substr(1, 4) + '-' + essayDate.substr(5, 2) + '-' + essayDate.substr(7, 2);

            $.each(data.GRID0, function(index, item){
                if(index == 0){
                    html += '<h2>' + essayTitle + '</h2>';
                }
                else if(index == 1){
                    html += '<h3>' + date + " " + essaySource + '</h3>';
                }
                else {

                    if(/^\s{2,}/.test(item)){
                        html += '<p>' + item + '</p>';
                    } else html += item;
                }
            });

            $("#essaywrap").append(html);
        }else{
            $("#essaywrap").append('<div style="margin:15px 10px;">该信息暂无详情</div>');
        }
    });
}
