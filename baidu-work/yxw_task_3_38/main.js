/**
 * Created by yang8 on 2016/4/24.
 */
var sortTable = (function(){

    function addEvent(ele,type,func){
        if(ele.addEventListener){
            ele.addEventListener(type,func,false);
        }else if(ele.attachEvent){
            ele.attachEvent(type,func);
        }else{
            ele['on' + type] = func;
        }
    }

    var SortTable = function (tableEle, courses, data, funcSort){
        this.tableEle = tableEle;
        this.courses = courses;
        this.data = data;
        this.funcSort = funcSort;
        this.curOrder = null;

        this.init();
    };

    SortTable.prototype = {
        init: function(){
            this.curOrder = [];
            for (var key in this.data){
                this.curOrder.push(key);
            }

            this.render();
        },
        render: function(){
            this.tableEle.innerHTML = '';
            var strHead = '<thead><tr>',
                strBody = '',
                i, j, k;
            for (i=0; i<this.courses.length; i++){
                strHead += '<th>' + courses[i] + '</th>';
            }
            for (j=0; j<this.curOrder.length; j++){
                var name = this.curOrder[j];
                strBody += '<tr><td>' + name + '</td>';
                for (k=0; k<this.data[name].length; k++){
                    strBody += '<td>' + this.data[name][k] + '</td>';
                }
            }
            strHead += '</thead></tr>';
            strBody += '</tr>';
            this.tableEle.innerHTML += strHead;
            this.tableEle.innerHTML += strBody;

            this.addSortEle();
        },
        addSortEle: function(){
            var self = this;
            function addArrow(index){
                var wrapper = document.createElement('span');
                wrapper.style.cssText = 'display:inline-block;';
                var arrowUp = document.createElement('i');
                arrowUp.style.cssText = 'display: inline-block;width: 0;height: 0;border-style: solid;border-width: 0 7.5px 13.0px 7.5px;border-color: transparent transparent #007bff transparent;';
                var arrowDown = document.createElement('i');
                arrowDown.style.cssText = 'display: inline-block;width: 0;height: 0;border-style: solid;border-width: 13.0px 7.5px 0 7.5px;border-color: #007bff transparent transparent transparent;';
                wrapper.appendChild(arrowUp);
                wrapper.appendChild(arrowDown);

                var th = self.tableEle.children[0].children[0].children[index];
                th.appendChild(wrapper);

                var func = self.funcSort(self.courses[index]);

                addEvent(arrowUp, 'click', function(e){
                    self.curOrder.sort(function(a, b){
                        return -func(self.data[a][index-1], self.data[b][index-1]);
                    });

                    self.render();
                });
                addEvent(arrowDown, 'click', function(e){
                    self.curOrder.sort(function(a, b){
                        return func(self.data[a][index-1], self.data[b][index-1]);
                    });

                    self.render();
                });

                return wrapper;
            };
            for(var i=0; i<self.courses.length; i++){
                var name = self.courses[i];
                var func = self.funcSort(name);

                if(func){
                    var ele = addArrow(i);
                }
            }
        }
    };

    var courses = ['姓名','语文','数学','英语','总分'];
    var data = {
        '小明':['80','90','70','240'],
        '小红':['90','60','90','240'],
        '小亮':['60','100','70','230']
    };

    var funcSort = function(name){
        if(name == courses[0]){
            return;
        }
        return function(a, b){
            return b-a;
        }
    };

    var table = document.querySelector('.table');
    console.log(table);
    var newTable = new SortTable(table, courses, data, funcSort);
})();