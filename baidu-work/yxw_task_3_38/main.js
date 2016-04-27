/**
 * Created by yang8 on 2016/4/24.
 */
var sortTable = (function(){

    var title = ['姓名','语文','数学','英语','总分'];
    var data = {
        '小明':['80','90','70','240'],
        '小红':['90','60','90','240'],
        '小亮':['60','100','70','230']
};

    function addEvent(ele,type,func){
        if(ele.addEventListener){
            ele.addEventListener(type,func,false);
        }else if(ele.attachEvent){
            ele.attachEvent(type,func);
        }else{
            ele['on' + type] = func;
        }
    }

    function SortTable(tableEle, thead, data, funcSort){
        this.tableEle = tableEle;
        this.thead = thead;
        this.data = data;
        this.funcSort = funcSort;
        this.curOrder = null;
        this.init();
    }

    SortTable.prototype = {
        init: function(){
            this.curOrder = [];
            for (var key in this.data){
                this.curOrder.push(key);
            }
            this.render();
        },
        render: function(){
            var strBody = '',
                i;
            for(key in this.data){
                strBody += '<tr><td>' + key + '</td>';
                for(i=0; i<this.data[key].length; i++){
                    strBody += '<td>' + this.data[key][i] + '</td>';
                }
            }
            strBody += '</tr>';
            this.tableEle += strBody;
            this.addSortEle();
        },
        addSortEle: function(){
            var self = this;
            var addArrow = function(index){
                var wrapper = document.createElement('span');
                var arrowUp = document.createElement('i');
                arrowUp.style.cssText = 'display: inline-block;width: 0;height: 0;border-style: solid;border-width: 0 7.5px 13.0px 7.5px;border-color: transparent transparent #007bff transparent;';
                var arrowDown = document.createElement('i');
                arrowDown.style.cssText = 'display: inline-block;width: 0;height: 0;border-style: solid;border-width: 13.0px 7.5px 0 7.5px;border-color: #007bff transparent transparent transparent;';
                wrapper.appendChild(arrowUp);
                wrapper.appendChild(arrowDown);

                var th = self.tableEle.children[0].children[0].children[index];
                var func = self.funcSort(self.thead[index]);

                addEvent(arrowUp, 'click', function(){
                    self.curOrder.sort(function(a, b){
                        return -func(self.data[a][index-1], self.data[b][index-1]);
                    });
                    self.render();
                });
                addEvent(arrowDown, 'click', function(){
                    self.curOrder.sort(function(a, b){
                        return func(self.data[a][index-1], self.data[b][index-1]);
                    });
                    self.render();
                });

                return wrapper;
            };
            for(var i=0; i<self.thead.length; i++){
                var head = self.thead[i];
                var func = self.funcSort(head);

                if(func){
                    var ele = addArrow(i);
                }
            }
        }
    };

    var funcSort = function(name){
        if(name == title[0]){
            return;
        }
        return function(a, b){
            return b-a;
        }
    };

    var tableWrapper = document.querySelector('.wrapper');
    var newTable = new SortTable(tableWrapper, data, title, funcSort);
})();