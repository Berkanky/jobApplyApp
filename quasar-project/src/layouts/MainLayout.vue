<template>
  <q-layout view="lHh Lpr lff">

    <q-header elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Apply Form
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn icon="logout" flat color="white" v-on:click="logoutButton"></q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer
      class="bg-grey-2"
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
          <q-list
            padding>
            <q-item
              :class="this.checkCurrentRouter(data)"
              v-on:Click="selectOption(data)"
              v-for="(data,key) in this.options" :key="key"
              clickable v-ripple>
              <q-item-section avatar>
                <q-icon :name="data.icon" />
              </q-item-section>
              <q-item-section>
                {{data.label}}
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img :src="this.store.firebaseInfoUser.photoURL" v-if="this.store.firebaseInfoUser.photoURL">
              <q-btn icon="person" color="grey-8" round v-else></q-btn>
            </q-avatar>
            <div class="text-weight-bold">{{this.store.firebaseInfoUser.displayName ?? this.store.firebaseInfoUser.email}}</div>
            <div>@{{ this.store.firebaseInfoUser.email ?? '' }}</div>
          </div>
        </q-img>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-grey-9 text-white">
      <q-toolbar>
        <q-toolbar-title>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <checkAdminStatus v-if="this.store.checkAdminDialogActive"/>
  </q-layout>
</template>

<script>
import axios from 'axios'
import checkAdminStatus from "src/components/checkAdminStatus.vue";
import { getAuth, signOut } from "firebase/auth";
import { ref } from 'vue'
import { useCounterStore } from 'src/stores/store'
export default {
  components:{
    checkAdminStatus
  },
  setup () {
    const store = useCounterStore()
    const leftDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      store,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  },
  data:function(){
    return{
      options:[
        {id:1,label:'My Applies',icon:'filter_list',name:`myApplies`},
        {id:2,label:'HomePage',icon:'home',name:'home'},
        {id:4,label:'Admin Panel',icon:'admin_panel_settings',name:'adminPanel'}
      ]
    }
  },
  methods:{
    checkForApplyDetailRouter(){
      const newOption = {
        id:3,label:'Back',icon:'keyboard_backspace'
      }

      const currentRouter = this.$route.name
      const check = this.options.some(
        object => object.id === newOption.id
      )
      if(!check && currentRouter === 'applyDetail' || currentRouter === 'updateApply'){
       const newList = [newOption,...this.options]
       this.options = newList
      }else if(currentRouter !== 'applyDetail'){
        this.options = this.options.filter(
          object => object.id !== newOption.id
        )
      }
    },
    checkCurrentRouter(data){
      const currentRouter = this.$route.name
      if(currentRouter === data.name){
        return 'bg-grey-8 text-white'
      }else{
        return ''
      }
    },
    selectOption(data){
      console.log(data)
      if(data.id === 1){
        const id = this.store.firebaseInfoUser.uid
        this.$router.push(
          {
            path:`/myApplies/${id}`,
            params:
              {
                id:id
              }
          }
        )
      }else if(data.id === 2){
        this.$router.push(
          {
            path:'/'
          }
        )
      }else if(data.id === 3){
        this.$router.go(-1)
        this.options = this.options.filter(
          object => Number(object.id) !== 3
        )
      }else if(data.id === 4){
        this.checkForAdminStatus()
        const check = this.store.checkingForAdminResult.hasOwnProperty('active')
        if(check){
          this.store.checkAdminDialogActive =! this.store.checkAdminDialogActive
        }
      }
    },
    checkForAdminStatus(){
      const id = this.store.firebaseInfoUser.uid
      console.log(id)
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/checkForAdmin`)
        .then(res => {
          console.log(res)
          Object.assign(this.store.checkingForAdminResult,{
            message:res.data.message,
            active:res.data.active
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    logoutButton(){
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        this.store.firebaseInfoUser = {}
        this.store.myAccFromDb = {}
        this.store.loginDialogActive = true
        const check = this.$route.name === 'home' ? true : false
        if(!check){
          this.$router.push({path:'/'})
        }

      }).catch((error) => {
        // An error happened.
      });
    }
  },
  created(){
  },
  watch:{
    $route:{
      handler(to,from){
        console.log('mainlayoutto',to)
        const check = to.hasOwnProperty('params')
        if(check){
          this.checkForApplyDetailRouter()
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>
<style>
::-webkit-scrollbar {
  display: none;
}
</style>
