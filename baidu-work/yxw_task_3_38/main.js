/**
 * Created by yang8 on 2016/4/24.
 */
var sortTable = (function(){
    var tableWrapper = document.querySelector('.wrapper');
    var newTable = document.createElement('table');
    var newThead = document.createElement('thead');
    var newTbody = document.createElement('tbody');

    var title = ['姓名','语文','数学','英语','总分'];
    var data = {
        '小明':['80','90','70','240'],
        '小红':['90','60','90','240'],
        '小亮':['60','100','70','230']
};
    var strHead = '<tr>',
        strBody = '',
        i,j;
    for(i=0; i<title.length; i++){
        strHead += '<th>' + title[i] + '</th>';
    }
    for(key in data){
        strBody += '<tr><td>' + key + '</td>';
        for(j=0; j<data[key].length; j++){
            strBody += '<td>' + data[key][j] + '</td>';
        }
    }
    strHead += '</tr>';
    strBody += '</tr>';
    newThead.innerHTML = strHead;
    newTbody.innerHTML = strBody;
    newTable.appendChild(newThead);
    newTable.appendChild(newTbody);
    tableWrapper.appendChild(newTable);


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
            var strHead = '<tr>',
                strBody = '',
                i,j;
            for(i=0; i<this.thead.length; i++){
                strHead += '<th>' + this.thead[i] + '</th>';
            }
            for(key in this.data){
                strBody += '<tr><td>' + key + '</td>';
                for(j=0; j<this.data[key].length; j++){
                    strBody += '<td>' + this.data[key][j] + '</td>';
                }
            }
            strHead += '</tr>';
            strBody += '</tr>';

            this.tableEle += strHead;
            this.tableEle += strBody;

            this.addSortEle();
        },
        addSortEle: function(){

        }
    }
})();