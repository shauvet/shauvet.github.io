/**
 * Created by yang8 on 2016/4/24.
 */
var sortTable = (function(){
    var tableWrapper = document.querySelector('.wrapper');
    var newTable = document.createElement('table');
    var newThead = document.createElement('thead');
    var newTbody = document.createElement('tbody');
    var newTfoot = document.createElement('tfoot');

    var data = {
        '姓名':['小明','小红','小亮'],
        '语文':['80','90','60'],
        '数学':['90','60','100'],
        '英语':['70','90','70'],
        '总分':['240','240','230']
    };
    var course,
        strHead = '<tr>',
        strBody = '<tr>',
        i;
    for(course in data){
        strHead += '<th>' + course + '</th>';

    }
    strHead += '</tr>';
    strBody += '</tr>';
    newThead.innerHTML = strHead;
    newTbody.innerHTML = strBody;
    newTable.appendChild(newThead);
    newTable.appendChild(newTbody);
    tableWrapper.appendChild(newTable);
})();