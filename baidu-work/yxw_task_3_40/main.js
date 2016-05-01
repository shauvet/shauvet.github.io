/**
 * Created by yang8 on 2016/5/1.
 */
;(function($, window, document, undefined){
    //定义Mycalender构造函数
    var MyCalender = function(ele, opt){
        this.$element = ele;
        this.defaults = {
            'show': true

        };
        this.options = $.extend({}, this.defaults, opt);
    };
//定义Mycalender的方法
    MyCalender.prototype = {
        createCalender: function(){

        }
    };
//在插件中实用MyCalender对象
    $.fn.myPlugin = function(options){
        //创建MyCalender实体
        var calender = new MyCalender(this, options);
        //调用其方法
        return calender.createCalender();
    }
})(jQuery, window, document);
