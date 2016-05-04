/**
* Created by yang8 on 2016/5/4.
*/
//定义Mycalender构造函数
var MyCalender = function(wrapper){
    this.wrapper = wrapper;
    this.date = new Date();
    this.selectedEle = null;
    this.callback = null;

    this.init();
};

//定义Mycalender的方法
MyCalender.prototype = {
    weekday: ['日', '一', '二', '三', '四', '五', '六' ],
    init: function(){
//        this.mainEle = $('<div></div>')
//            .css('width', '360px')
//            .css('height', '400px')
//            .css('border', '2px solid #999')
//            .css('font-family', 'microsoft yahei')
//            .appendTo(this.wrapper);
        var wrapperDiv = $('<div></div>')
            .css('position', 'relative')
            .appendTo(this.wrapper);
        var input = $('<input>')
            .css('width', '220px')
            .css('height', '40px')
            .css('text-align', 'center')
            .css('readonly', 'true')
            .appendTo(wrapperDiv);
        var wrapperCal = $('<div></div>')
            .css('position', 'absolute')
            .css('top', '50px')
            .css('width', '360px')
            .css('height', '400px')
            .css('border', '2px solid #ccc')
            .css('font-family', 'microsoft yahei')
            .hide().appendTo(wrapperDiv);

        var self = this;
        var titleWrapper = $('<div></div>')
            .css('text-align', 'center')
            .css('line-height', '1.5em')
            .appendTo(wrapperCal);
        var title = $('<span class="j-title"></span>')
            .appendTo(titleWrapper);
        var previous = $('<strong></strong>')
            .html('<')
            .css('float', 'left')
            .css('cursor', 'pointer')
            .appendTo(titleWrapper)
            .click(function(){
                self.preMonth();
            });
        var next = $('<strong></strong>')
            .html('>')
            .css('float', 'right')
            .css('cursor', 'pointer')
            .appendTo(titleWrapper)
            .click(function(){
                self.nextMonth();
            });

//            var table = $('<table></table>')
//                .appendTo(wrapperCal);
//            var thead = $('<thead></thead>');
//            for(var i=0; i<this.weekday.length; i++){
//                var th = $('<th>').html(this.weekday[i]).appendTo(thead);
//            }
//            thead.appendTo(table);
//
//            var tbody = $('<tbody></tbody>');
//            for(var j=0; j<42; j++){
//                var td = $('<td>').css('cursor', 'pointer').appendTo(tbody);
//            }
//            tbody.appendTo(table);
        function createEle() {
            var ele = $('<i></i>')
                .css('display', 'inline-block')
                .css('text-align', 'center')
                .css('width', '50px')
                .css('height', '50px')
                .css('line-height', '50px')
            return ele;
        }

        for (var i=0; i<7; i++){
            var ele = createEle().html(this.weekday[i]).appendTo(wrapperCal);
            if (i === 0 || i === 6){
                ele.css('color', '#f33');
            }
        }
        for (var j=0; j<42; j++) {
            var element = createEle().css('cursor', 'pointer').appendTo(wrapperCal);
        }

        this.renderByDate(this.date);

        wrapperCal.click(function(e){
            if (wrapperCal.is(':hidden')) {
                return;
            }
            if (e.target.nodeName === 'I') {
                var tds = $('I'),
                    oIndex = tds.index($(e.target)),
                    selectIndex = tds.index(self.selectedEle);
                var dat = new Date(self.date);
                dat.setDate(dat.getDate() + oIndex - selectIndex);
                self.selectDate(dat);

                input.val(self.getSelectedDate());
                wrapperCal.hide();
                self.callback();
            }
        });

        input.click(function(){
            wrapperCal.toggle();
        });
//            this.render();
    },
    render: function(){

    },
    getSelectedDate: function() {
        var y = this.date.getFullYear(),
            m = this.date.getMonth() + 1,
            d = this.date.getDate();
        return y + '年' + (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日';
    },
    select: function(fn){
        this.callback = fn;
        return this;
    },
    preMonth: function(){
        var dateTemp = new Date(this.date);
        dateTemp.setMonth(dateTemp.getMonth() - 1);
        this.selectDate(dateTemp);
    },
    nextMonth: function(){
        var dateTemp = new Date(this.date);
        dateTemp.setMonth(dateTemp.getMonth() + 1);
        this.selectDate(dateTemp);
    },
    selectDate: function(date){
        this.selectedEle.css('background-color','').css('color','');
        if (date.getMonth() === this.date.getMonth()) {
            var tds = $('i'),
                oIndex = tds.index(this.selectedEle);
            var temp = tds.get(oIndex + date.getDate() - this.date.getDate());
            this.selectedEle = $(temp).css('background-color', '#f33').css('color', '#fff');
        } else {
            this.renderByDate(date);
        }

        this.date = date;
    },
    renderByDate: function (date) {
        $('.j-title').html(date.getFullYear() + '年' + (date.getMonth() + 1) + '月');

        var dat = new Date(date);
        dat.setDate(dat.getDate() - date.getDate() + 1);
        dat.setDate(dat.getDate() - dat.getDay());

        var tds = $('i');
        for (var i=0; i<42; i++) {
            var ele = $(tds.get(i+7)).html(dat.getDate());

            if (dat.getMonth() !== date.getMonth()) {
                ele.css('color', '#ccc');
            } else {
                if (dat.getDay() === 0 || dat.getDay() === 6) {
                    ele.css('color', '#f33');
                } else {
                    ele.css('color', '');
                }
            }

            if (dat.getTime() === date.getTime()) {
                ele.css('background-color', '#f33').css('color','#fff');
                this.selectedEle = ele;
            }

            dat.setDate(dat.getDate() + 1);
        }
    }
};

var calender = new MyCalender($('.wrapper')).select(function(){
    alert('您选择了' + this.getSelectedDate());
});