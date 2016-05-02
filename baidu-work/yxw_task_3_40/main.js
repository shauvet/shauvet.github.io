/**
 * Created by yang8 on 2016/5/1.
 */
;(function($, window, document, undefined){
    //定义Mycalender构造函数
    var MyCalender = function(wrapper){
        this.wrapper = wrapper;
        this.date = new Date();
        this.mainEle = null;


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
            var title = $('<span></span>')
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
            
        }
    };

})(jQuery, window, document);
