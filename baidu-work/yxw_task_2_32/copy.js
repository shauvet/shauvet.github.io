//定义ShowTag构造器
function ShowTag(inputObj,wrapper){
    this.arr = [];
    this.wrapper = wrapper;
    this.inputObj = inputObj;
}

//ShowTag构造器方法
ShowTag.prototype = {
    //去重
    trim: function(){
        var i= 0, j=0;
        for(; i<this.arr.length; i++){ //判断重复，如果元素重复就去掉该元素
            for(j=i+1; j<this.arr.length; j++){
                if(this.arr[i] === this.arr[j]){
                    this.arr.splice(j, 1);
                    j--;
                }
            }
        }
        while(this.arr.length > this.length){
            this.arr.shift();
        }
        this.show();
        return this;
    },
    //显示标签
    show: function(){
        var text = '';
        for(var i=0; i<this.arr.length; i++){
            text += '<div data-num="' + i + '"><span>点击删除</span>' + this.arr[i] + '</div>';
        }
        this.wrapper.innerHTML = text;
        return this;
    },
    //将输入的值添加到数组
    add: function(){

    }
};