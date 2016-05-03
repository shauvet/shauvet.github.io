/**
 * Created by yang8 on 2016/5/1.
 */
;(function($, window, document, undefined){
    //定义Mycalender构造函数
    var MyCalender = function(wrapper){
        this.wrapper = wrapper;
        this.date = new Date();
        this.mainEle = null;
        this.selectedEle = null;

        this.init();
    };

//定义Mycalender的方法
    MyCalender.prototype = {
        weekday: ['一', '二', '三', '四', '五', '六', '日'],
        init: function(){
            this.mainEle = $('<div></div>')
                .css('width', '400px')
                .css('height', '400px')
                .css('border', '2px solid #999')
                .css('font-family', 'microsoft yahei')
                .appendTo(this.wrapper);

            this.render();
        },
        render: function(){
            var titleWrapper = $('<div></div>')
                .css('text-align', 'center')
                .css('line-height', '1.5em')
                .appendTo(this.mainEle);
            var title = $('<span class="j-title"></span>')
                .appendTo(titleWrapper);
            var previous = $('<strong></strong>')
                .html('<')
                .css('float', 'left')
                .css('cursor', 'pointer')
                .appendTo(titleWrapper)
                .click(function(){});
            var next = $('<strong></strong>')
                .html('>')
                .css('float', 'right')
                .css('cursor', 'pointer')
                .appendTo(titleWrapper)
                .click(function(){});

            var table = $('<table></table>')
                .appendTo(this.wrapper);
            var thead = $('<thead></thead>');
            for(var i=0; i<this.weekday.length; i++){
                var th = $('<th>').html(this.weekday[i]).appendTo(thead);
            }
            thead.appendTo(table);

            var tbody = $('<tbody></tbody>');
            for(var j=0; j<42; j++){
                var td = $('<td>').css('cursor', 'pointer').appendTo(tbody);
            }
            tbody.appendTo(table);

            this.renderByDate(this.date);

            var self = this;
            this.mainEle.click(function(e){
                if (e.target.nodeName === 'TD') {
                    var tds = $('td'),
                        oIndex = tds.index($(e.target)),
                        selectIndex = tds.index(self.selectedEle);
                    var dat = new Date(self.date);
                    dat.setDate(dat.getDate() + oIndex - selectIndex);
                    self.selectDate(dat);
                }
            })
        },
        preMonth: function(){
            var dateTemp = new Date(this.date);
            dateTemp.setMonth(dateTemp.getMonth() + 1);
            this.selectDate(dateTemp);
        },
        nextMonth: function(){
            var dateTemp = new Date(this.date);
            dateTemp.setMonth(dateTemp.getMonth() - 1);
            this.selectDate(dateTemp);
        },
        selectDate: function(date){
            this.selectedEle.css('background-color','').css('color','');
            if (date.getMonth() === this.date.getMonth()) {
                var tds = $('td'),
                    oIndex = tds.index(this.selectedEle);
                var temp = tds.get(oIndex + date.getData() - this.date.getDate());
                this.selectedEle = $(temp).css('background-color', '#f33').css('color', '#fff');
            } else {
                this.renderByDate(date);
            }

            this.date = date;
        },
        renderByDate: function (date) {
            $('.j-title').html(date.getFullYear() + '年' + (date.getMonth() + 1) + '月');
            var dat = new Date();
            dat.setDate(dat.getDate() - date.getDate() + 1);
            dat.setDate(dat.getDate() - dat.getDay());

            var tds = $('td');
            for (var i=0; i<42; i++) {
                var ele = $(tds.get(i+7)).html(dat.getDate());
            }

            if (dat.getMonth() !== date.getMonth()) {
                ele.css('color', '#ccc');
            } else {
                if (dat.getDay() === 0 || dat.getDay() === 6) {
                    ele.css('color', '#f33');
                }
            }

            if (dat.getTime() === date.getTime()) {
                ele.css('background-color', '#f33').css('color','#fff')
                this.selectedEle = ele;
            }

            dat.setDate(dat.getDate() + 1);
        }
    };

    var calender = new MyCalender($('.wrapper'));
})(jQuery, window, document);
