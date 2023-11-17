<template>
  <div id="app">
    <!-- 双向绑定文本框,注意为单项动态绑定，不能用v-model，会破坏用mutation改变state的规则 -->
    <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputChange"/>
    <a-button type="primary" @click = "addItemToList">添加事项</a-button>
<!-- 把list渲染到界面上 -->
    <a-list bordered :dataSource="infolist" class="dt_list">
      <a-list-item slot="renderItem" slot-scope="item">
        <!-- 复选框 -->
        <!-- 只要状态发生变化，就会自动触发change函数 -->
        <!-- 这里因为要传两个参数，组件库规定所以用箭头函数 -->
        <a-checkbox :checked="item.done" @change="(e) => {cbStatusChanged(e,item.id)}">{{ item.info }}</a-checkbox>
        <!-- 删除链接 -->
        <a slot="actions" @click="removeItemById(item.id)">删除</a>
      </a-list-item>

      <!-- footer区域 -->
      <div class="footer" slot="footer">
        <span>{{ unDoneLength }} 条剩余</span>
        <a-button-group>
          <!-- 重点三元运算符，viewKey是否等于all，等于高亮，不等于就不亮 -->
          <a-button :type="viewKey === 'all' ? 'primary' :'default'" @click="changeList('all')">全部</a-button>
          <a-button :type="viewKey === 'undone' ? 'primary' :'default'"  @click="changeList('undone')">未完成</a-button>
          <a-button :type="viewKey === 'done' ? 'primary' :'default'"  @click="changeList('done')">已完成</a-button>
        </a-button-group>
        <a @click= "clean">清除已完成</a>
      </div>
    </a-list>
  </div>
</template>
<script>
//引入mapState,同mapState一样映射Getters到计算属性
import {  mapState,mapGetters } from "vuex"
export default {
  name: "app",
  data() {
    return {}
  },
  //创建时调用action函数
  created(){
    this.$store.dispatch("getList")
  },
  computed:{
    //将store里的list映射过来
    ...mapState(['list','inputValue','viewKey']),
    ...mapGetters(['unDoneLength','infolist'])
  },
  methods:{
    //监听文本框内容变化
    handleInputChange(e){
      console.log(e.target.value)
      //通过methods里面的事件监听函数拿到文本框最新的数据
      //对应setInputValue(state,val)
      this.$store.commit('setInputValue',e.target.value)
    },
    //向列表中新增item项
    addItemToList(){
      if(this.inputValue.trim().length <= 0){
        //如果要添加的数据去掉空格后长度小于等于0，即添加了空值，提示不为空
        return this.$message.warning('文本框内容不能为空！')
      }
    //不为空就想办法提交mutation的某个函数修改state里面的list数组
    this.$store.commit('addItem')
    },
    //删除列表项需要对应的id
    removeItemById(id){
      console.log(id)
      //模仿增加提交对应的mutation中函数
      this.$store.commit('removeItem',id)
    },
    //事件e全称是$event，不传参数的花可以不写，不用箭头函数并且要传参的话，必须写全
    //监听复选框选中状态变化的事件
    cbStatusChanged(e,id){
      // //通过e.target.checked可以接收到最新选中状态
      // console.log(e.target.checked)
      // //获取了状态但不知道具体是哪个
      // console.log(id)
      // //根据获取的这俩参数写mutation方法
      const param = {
        id: id,
        status: e.target.checked
      }
      this.$store.commit('changeStatus',param)
    },
    //清楚已完成的任务
    clean(){
      this.$store.commit('cleanDone')
    },
    //修改页面上展示的列表数据
    changeList(key){
    //通过修改key值来切换
      console.log('key')
      this.$store.commit('changeViewKey',key)
    }
  }
};
</script>
<style scoped>
#app {
  padding: 10px;
}
.my_ipt {
  width: 500px;
  margin-right: 10px;
}
.dt_list {
  width: 500px;
  margin-top: 10px;
}
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
