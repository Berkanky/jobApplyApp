<template>
  <q-dialog
    v-model="this.store.checkAdminDialogActive"
    :full-height="this.store.mobileActive ? true  : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
    :position="this.store.mobileActive ? 'center' : 'left'"
  >
  <q-card
    class="bg-dark text-white"
    :style="{
      'width':this.store.mobileActive ? '100%' : '500px'
    }"
  >
    <q-card-section>
      <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section class="text-center text-subtitle2">
      <q-btn
        icon="info" flat
        :color="this.colorForResult() === true ? 'green-4' : 'red-4'"></q-btn>
      {{ this.getMessage() }}
      <q-btn
        flat
        icon="fa-solid fa-regular fa-arrow-rotate-left fa-spin fa-spin-reverse"
        :color="this.colorForResult() === true ? 'green-4' : 'red-4'"
        ></q-btn>
    </q-card-section>
  </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      formData:{},
      isPwd:false,
      numVal:3
    }
  },
  methods:{
    actionToPushAdminPanel(){
      const check = this.store.checkingForAdminResult.hasOwnProperty('active')
        if(check){
          console.log('active',this.store.checkingForAdminResult)
          const check = this.store.checkingForAdminResult.active === true ? true : false
          if(check === true){
            console.log('store.checkingForAdminResult',this.store.checkingForAdminResult)
            const id = this.store.firebaseInfoUser.uid
            setTimeout(() => {
              this.$router.push(
                {
                  path:`/adminPanel/${id}`,
                  params:{
                    id:id
                  }
                }
              )
              this.store.checkAdminDialogActive =! this.store.checkAdminDialogActive
            },3000)
          }else{
            setTimeout(() => {
              this.$router.push({path:'/'})
              this.store.checkAdminDialogActive =! this.store.checkAdminDialogActive
            },3000)
          }
        }
    },
    colorForResult(){
      const check = this.store.checkingForAdminResult.hasOwnProperty('active')
      if(check){
        const secCheck = this.store.checkingForAdminResult.active
        return secCheck
      }
    },
    getMessage(){
      const check = this.store.checkingForAdminResult.hasOwnProperty('message')
      if(check){
        const message = `${this.store.checkingForAdminResult.message}`
        return message
      }else{
        return 'No Info'
      }
    },
    checkForAdminStatus(){
      const id = this.store.firebaseInfoUser.uid
      console.log(id)
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/checkForAdmin`)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    goBack(){
      this.store.checkAdminDialogActive =! this.store.checkAdminDialogActive
    },
    getCurrentData(){
      const check = this.formData.hasOwnProperty('email')
      if(!check){
        Object.assign(this.formData,{
          email:this.store.firebaseInfoUser.email
        })
      }else{
        this.formData.email = this.store.firebaseInfoUser.email
      }
    }

  },
  mounted(){

  },
  created(){
    this.getCurrentData()
    this.actionToPushAdminPanel()
  },
  watch:{
    'store.checkingForAdminResult':{
      handler(newVal,oldVal){
        if(newVal){

        }
      }
    }
  }
}
</script>

<style>

</style>
