/**
* Created by yang8 on 2016/5/4.
*/
//定义Mycalender构造函数
var MyCalender = function(wrapper, period, min, max){
    this.wrapper = wrapper;
    this.period = period;
    this.min = min || 0;
    this.max = max || 0;
    this.date = new Date();
    this.selectedEle = null;
    this.wrapperDiv = null;
    this.callback = null;

    this.selectedDates = [];

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
        this.wrapperDiv = $('<div></div>')
            .css('position', 'relative')
            .appendTo(this.wrapper);
        var input = $('<input>')
            .css('width', '220px')
            .css('height', '40px')
            .css('text-align', 'center')
            .css('readonly', 'true')
            .appendTo(this.wrapperDiv);
        var wrapperCal = $('<div></div>')
            .css('position', 'absolute')
            .css('z-index', '99')
            .css('top', '50px')
            .css('width', '360px')
            .css('height', '480px')
            .css('border', '2px solid #ccc')
            .css('font-family', 'microsoft yahei')
            .hide().appendTo(this.wrapperDiv);

        var self = this;
        var titleWrapper = $('<div></div>')
            .css('height', '40px')
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
                .css('line-height', '50px');
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

        var confirm = $('<input type="button" value="确定">')
            .css('float', 'left')
            .css('width', '120px')
            .css('height', '36px')
            .css('margin', '5px 24px')
            .css('background-color', '#f33')
            .css('outline', 'none')
            .css('border', 'none')
            .css('color', '#fff')
            .appendTo(wrapperCal)
            .click(function(){
                input.val(self.getSelectedDate());
                wrapperCal.hide();
                self.callback();
            });
        var cancel = $('<input type="button" value="取消">')
            .css('float', 'right')
            .css('width', '120px')
            .css('height', '36px')
            .css('margin', '5px 24px')
            .css('background-color', '#f33')
            .css('outline', 'none')
            .css('border', 'none')
            .css('color', '#fff')
            .appendTo(wrapperCal)
            .click(function(){
                wrapperCal.hide();
            });

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

                if (self.period) {
                    if (self.selectedDates.length < 1) {
                        self.selectedDates.push(dat);
                    } else {
                        var preDate = self.selectedDates[self.selectedDates.length - 1];
                        var dayNum = Math.abs(dat - preDate) / 1000 / 60 / 60 / 24;
                        if (dayNum < self.min || dayNum > self.max) {
                            alert('时间跨度不在范围内');
                        } else {
                            self.selectedDates.push(dat);
                        }
                    }

                    if (self.selectedDates.length > 2) {
                        self.selectedDates.shift();
                    }
                } else {
                    self.selectedDates[0] = dat;
                }

                self.selectDate(dat);
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
        function getString(date) {
            var y = date.getFullYear(),
                m = date.getMonth() + 1,
                d = date.getDate();
            return y + '年' + (m < 10 ? '0' + m : m) + '月' + (d < 10 ? '0' + d : d) + '日';
        }

        if (this.multi) {
            if (this.selectedDates.length === 2) {
                var dat1 = this.selectedDates[0],
                    dat2 = this.selectedDates[1];
                if (dat1 > dat2) {
                    return getString(dat2) + '-' + getString(dat1);
                } else {
                    return getString(dat1) + '-' + getString(dat2);
                }
            } else {
                alert('请选择时间');
                return;
            }
        } else {
            return getString(this.date);
        }
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
    selectDate: function(date) {
        this.renderByDate(date);

        this.date = date;
    },
    renderByDate: function(date) {
        this.wrapperDiv.find('.j-title').html(date.getFullYear() + '年' + (date.getMonth() + 1) + '月');

        // 找到第一个日期
        var dat = new Date(date);
        dat.setDate(dat.getDate() - date.getDate() + 1);
        dat.setDate(dat.getDate() - dat.getDay());

        var tds = this.wrapperDiv.find('i');
        for (var i = 0; i < 42; i++) {
            // 获取显示日子的jq对象
            var ele = $(tds.get(i + 7)).html(dat.getDate());

            if (date.getTime() === dat.getTime()) {
                this.selectedEle = ele;
            }

            // 被选中的日期背景变红
            if ((this.selectedDates[0] && dat.getTime() === this.selectedDates[0].getTime()) ||
                (this.selectedDates[1] && dat.getTime() === this.selectedDates[1].getTime())) {
                ele.css('background-color', '#f33').css('color', '#fff');
            } else {
                if ((this.selectedDates.length === 2 && this.selectedDates[0] > dat && this.selectedDates[1] < dat) ||
                    (this.selectedDates.length === 2 && this.selectedDates[1] > dat && this.selectedDates[0] < dat)) {
                    ele.css('background-color', '#666')
                } else {
                    ele.css('background-color', '').css('color', '');
                }
                // 不是同月的色彩变淡
                if (dat.getMonth() !== date.getMonth()) {
                    ele.css('color', '#ccc');
                } else {
                    // 周六日字变红
                    if (dat.getDay() === 0 || dat.getDay() === 6) {
                        ele.css('color', '#f33');
                    } else {
                        ele.css('color', '');
                    }
                }
            }

            dat.setDate(dat.getDate() + 1);
        }
    }
};

var calender1 = new MyCalender($('.wrapper')).select(function(){
    alert('您选择了' + this.getSelectedDate());
});

$(document.body).append($('<p>上面是一个选择时间跨度的,最短3天最长100天</p>').css('margin-bottom', '50px'));

var calender2 = new MyCalender($('.wrapper')).select(function() {
    alert('您选择了' + this.getSelectedDate());
});

$(document.body).append($('<p>上面是一个选择一天的</p>'));