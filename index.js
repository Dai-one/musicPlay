Vue.component("music-con", {
  template: `
  <div class="app-con">
  <!-- 头部开始 -->
  <div class="app-head">
    <div class="app-logo">
      乌比莫斯音乐盒
    </div>
    <div class="app-search">
      <input type="text" id="search" v-model="val" @keyup.enter="search">
      <span class="search-img"></span>
    </div>
  </div>
  <!-- 头部结束 -->
  <!-- nav开始 -->
  <div class="app-nav">
    <div class="music-list">
      <div class="music-item" v-for="(item,index) in musicArr" :key="item.id" @click="handerClick(index)">
        <div class="item-play"></div>
        <div class="music-name"  v-text="item.name"></div>
        <div class="music-mv" v-show="true?item.mvid != 0:item.id.mvid=0" @click.stop="mvPlay(index)"></div>
      </div>
    </div>
    <div class="palyer-img">
      <img src="./imgs/player_bar.png" alt="" class="
      music-tentacle" :class="{playing: isbol}">
      <img :src="[pic]" alt="" class="music-card">
      <img src="./imgs/disc.png" alt="" class="compact-disc" :class="{autoPlay :isbol}">
    </div>
    <div class="message-box">
      <div class="message-tit">
        热门留言
      </div>
      <div class="message-list">
        <div class="item-box" v-for="item in msgArr">
          <div class="head-portrait">
            <img :src="[item.user.avatarUrl]" alt="">
          </div>
          <div class="message-con">
            <div class="title" v-text="item.user.nickname"></div>
            <div class="content" v-text="item.content"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- nav结束 -->
  <!-- 底部开始 -->
  <div class="app-footer">
    <audio controls="controls" autoplay="autoplay" loop="loop" :src="urlStr" @play="pausePlay(true)" @pause="pausePlay(false)">
      <source type="audio/mpeg">
    </audio>
    <div class="play-scheduler"></div>
  </div>
  <!-- 底部结束 -->
</div>
  `,
  data: function () {
    return {
      musicArr: [], //请求到的音乐
      msgArr: [], // 请求到的评论
      mvArr: [], //请求到的mv
      urlStr: '', //请求到的音乐路径
      imgArr: [], //请求到的音乐图片
      musicId: [], //所有音乐的ids
      pic: '' ,//音乐图片
      isbol:false, //是否旋转与播放
      val:'',
    }
  },
  //挂载完成，初始化
  mounted: function () {
    //获取音乐
    fetch("/search", {
      keywords: '热门'
    }, (res) => {
      this.musicArr = res.result.songs
    })
    //默认获取第一首音乐url
    fetch("/song/url", {
      id: 423228325
    }, (res) => {
      this.urlStr = res.data[0].url
    })
    //获取第一首歌的详情
    fetch("/song/detail", {
      ids: 423228325
    }, (res) => {
      this.pic = res.songs[0].al.picUrl
    })
    //默认获取第一首歌的热评
    fetch("/comment/hot", {
      type: 0,
      id: 423228325
    }, (res) => {
      this.msgArr = res.hotComments
    })
  },
  methods:{
    //点击切换歌
    handerClick(index){
      //切换图片
      fetch("/song/url",{id:this.musicArr[index].id},(res)=>{
        this.urlStr = res.data[0].url
      })
      //切换歌曲图片
      fetch("/song/detail",{
        ids:this.musicArr[index].id
      },(res)=>{
        this.pic = res.songs[0].al.picUrl
      })
      //切换留言列表
      fetch("/comment/hot",{
        type: 0,
        id: this.musicArr[index].id
      },(res)=>{
        this.msgArr.length = 0
        this.msgArr = res.hotComments
      })
    },
    //播放mv
    mvPlay(index){
      fetch("/mv/url",{
        id:this.musicArr[index].mvid
      },(res)=>{
        window.open(res.data.url)
      })
    },
    //判断是否播放
    pausePlay(bol){
      if(bol){
        this.isbol = true
        console.log('正在播放')
      }else{
        this.isbol = false
        console.log('暂停')
      }
    },
    //搜索
    search(){
      if(this.val!=''){
        fetch("/search", {
          keywords: this.val
        }, (res) => {
          this.musicArr = res.result.songs
          this.val = ''
        })

      }else{
        alert('输入的不能为空')
      }
    }
  }
})


const vm = new Vue({
  el: "#app",
})