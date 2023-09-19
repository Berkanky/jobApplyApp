<template>
  <div class="allApp">
    <transition-group apper enter-active-class="animated fadeIn slower" leave-active-class="animated fadeOut slower">
      <router-view />
    </transition-group>
  </div>
</template>

<script>
import {auth} from './firebase/index.js'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { defineComponent } from 'vue'
import axios from 'axios'
import { useCounterStore} from './stores/store';
export default defineComponent({
  name: 'App',
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    sendWelcomeMessage(id){
      const check = '_id' in this.store.myAccFromDb
      if(check){
        const allBody = {
          id:id
        }
        console.log('sendWelcomeMessage',id)
        axios.put(`${this.store.baseUrl}/fileconverter/${id}/sendWelcomeMessage`, allBody)
          .then(res => {
            console.log('sendWelcomeMessage',res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    welcomeMessage(){
      this.$q.notify({
        color:"blue-4",
        classes:'glossy',
        avatar:this.store.firebaseInfoUser.photoURL ?? '',
        position:'top',
        message:`${this.store.firebaseInfoUser.email ?? ''} Welcome .`
      })
    },
    handleResize() {
      this.store.window.width = window.innerWidth;
      this.store.window.height = window.innerHeight;
      //console.log('window',this.window)
    },
    checkCurrentUserStatus(){
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/auth.user
          const uid = user.uid;
          // ...
          this.store.firebaseInfoUser = user
          console.log('firebaseInfoUser',this.store.firebaseInfoUser)
          const firebaseId = user.uid
          if(!user.isAnonymous && firebaseId){
            const checkFireBaseData = 'uid' in this.store.firebaseInfoUser
            if(checkFireBaseData === true){
              console.log('aloburda',firebaseId)
              this.store.updateAccDataWhenGoogleLogin(firebaseId)
            }
          }else if(user.isAnonymous){
            console.log('anon active')
            this.$q.dialog({
              title: 'Alert',
              dark:true,
              persistent:true,
              maximized:this.store.mobileActive ? true : false,
              fullHeight:this.store.mobileActive ? true : false,
              message: `#${user.uid ?? ''} Welcome, Anonymous Login Active !`,
              position:this.store.mobileActive ? 'center' : 'top'
            }).onOk(() => {
              // console.log('OK')
            }).onCancel(() => {
              // console.log('Cancel')
            }).onDismiss(() => {
              // console.log('I am triggered on both OK and Cancel')
            })
          }
        } else{
                    // User is signed out
          // ...
          console.log('please login')
          this.store.loginDialogActive = true
        }
      });
    },
  },
  created(){
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.$watch('store.myAccFromDb',(newVal) => {
      if(newVal){
        const check = '_id' in newVal
        if(check === true){
          console.log('_id',newVal._id)
          const id = newVal._id
          this.sendWelcomeMessage(id)
        }
      }
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch:{
    'store.myAccFromDb':{
      handler(newValue,oldValue){
        if(newValue){
          const check = newValue.hasOwnProperty('_id')
          if(check){
            const id = newValue._id
            //console.log('this.$router',this.$router)
          }else{
            console.log('none')
          }
        }else{
          console.log('none')
        }
      },
      immediate:true,
      deep:true
    },
    $route:{
      handler(to,from){
        console.log(to,from)
        const path  = to.fullPath
        if(from.path === '/login'){
          this.welcomeMessage()

          this.$watch('store.myAccFromDb',(newVal) => {
            const check = newVal.hasOwnProperty('_id')
            if(check){
              const id = newVal._id
              console.log('newVal',newVal)
              this.store.welcomeMessageWhenLogin(id)
            }
          })

        }
        if(this.$route.path !== '/login'){
          this.checkCurrentUserStatus()
        }
      }
    },
    'store.window':{
      handler(newValue,oldValue){
        if(newValue.width<580){
          this.store.newHeight = 300
          this.store.mobileActive = true
          console.log('newHeight',this.store.newHeight)
          console.log('avatar',this.store.mobileActive)
        }else{
          this.store.newHeight = ''
          this.store.mobileActive = false
          console.log('avatar',this.store.mobileActive)
          console.log('newHeight',this.store.newHeight)
        }
      },
      immediate:true,
      deep:true
    },
    'store.firebaseInfoUser':{
      handler(newValue,oldValue){
        const check = newValue.hasOwnProperty('uid')
        if(check){
          if(newValue.uid !== '' && newValue.uid  !== null){
            const firebaseId = newValue.uid
            console.log('firebaseId',firebaseId)
            this.store.getMyAcc(firebaseId)
           // this.store.getMyAppliesFunction(firebaseId)
          }
        }
      },
      immediate:true,
      deep:true
    }
  },
})
</script>

<style>
  .appStyle{
    font-family: 'Montserrat', sans-serif;
  }
</style>
