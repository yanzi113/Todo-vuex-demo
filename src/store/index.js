import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表
    list:[],
    //文本框的内容
    inputValue:'aaa',
    //下一个id
    nextId:5,
    viewKey:'all'
  },
  mutations: {
    //把获取到的list赋值到state中的list去
    initList(state,list){
      state.list = list
    },
    //为store中的inputValue赋值，赋的为外界传入的val
    setInputValue(state, val){
      state.inputValue = val
    },
    addItem(state){
      //构造出要添加的对象数据,对应json里的模式
      const obj ={
        //正常情况下，id是后台数据库自动生成的，
        //没有id需要自己模拟
        id : state.nextId,
        info: state.inputValue.trim(),
        done: false
      }
      //接下来写一个把它加到数组里的函数
      //数组的push方法添加。。。这里又忘了
      state.list.push(obj)
      state.nextId++
      //将已经输入好的事项清空，方便下一次添加
      state.inputValue = ''
    },
    removeItem(state,id){
      //根据id找对应索引值，如果索引值不为-1则删除元素
      const i = state.list.findIndex(x => x.id === id)
      if(i !== -1){
        state.list.splice(i,1)
      }
    },
    changeStatus(state,param){
      //1.查找索引
      //2.根据索引找到对象
      const i = state.list.findIndex(x => x.id === param.id)
      if(i !== -1){
        //找到了
        state.list[i].done = param.status;
      }
    },
    cleanDone(state){
      state.list = state.list.filter(x => x.done === false)
    },
    changeViewKey(state,key){
      state.viewKey = key
    }
  },
  //在action里面定义一个通过get请求获取list里面的数据的函数，但需要在App.vue中调用
  //通过观察id
  actions: {
    getList(context){
      axios.get('/list.json').then(({data}) =>{
        // console.log(data)
        context.commit('initList',data)
      })
    }
  },
  getters:{
    //未完成的任务条数
    unDoneLength: state => {
      return state.list.filter(x => x.done === false).length;
    },
    infolist(state){
      if(state.viewKey === 'all'){
        return state.list
      }
      if (state.viewKey === 'undone') {
        return state.list.filter(x =>x.done === false)
      }
      if (state.viewKey === 'done') {
        return state.list.filter(x =>x.done === true)
      }
    }
  }
})
