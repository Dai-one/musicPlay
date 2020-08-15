axios.defaults.baseURL = "https://apimusic.linweiqin.com"
function fetch(url,data,fn){
  axios.get(url,{
    params:data
  }).then(res=>{
        fn(res.data)
      }).catch(err=>{
        console.log(err)
      })
}