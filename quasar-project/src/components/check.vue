<template>
  <q-dialog
    v-model="this.store.loginDialogCheckEmailActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
  >
    <q-card
      class="bg-grey-9 text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '400px'
      }">
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-separator size="1px" color="grey-7"></q-separator>
      <q-card-section>
        <q-input
          v-model="this.vertificationData.vertificationId"
          type="text" dark
          color="grey-8" label="Enter Vertification Code" label-color="white">
          <template v-slot:prepend>
            <q-btn
              v-on:Click="sendAgain"
              icon="fa-sharp fa-solid fa-rotate-left fa-spin fa-spin-reverse" flat color="white"></q-btn>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="row">
        <q-btn icon="clear_all" flat color="red-4" class="col-6" v-on:click="clearAll"></q-btn>
        <q-btn icon="send" flat color="green-4" class="col-6" v-on:click="signUp"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  props:['vertificationResData'],
  setup(){
    const store  = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      vertificationData:{},
      vertificationResDataLocal:{},
      sendAgainActive:false
    }
  },
  methods:{
    succesfullNotify(){
      this.$q.notify({
        type:'positive',
        message:'Succesfull.',
        icon:'send',
        position:'right'
      })
    },
    nonCorrectNotify(){
      this.$q.notify({
        type:'negative',
        message:'Try Again !',
        icon:'warning',
        position:'right'
      })
    },
    signUpFunction(){
      const auth = getAuth();
      const email = this.vertificationResDataLocal.loginData.email
      const password = this.vertificationResDataLocal.loginData.password
      console.log(email,password)
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          this.store.firebaseInfoUser = user
          this.store.loginDialogActive =! this.store.loginDialogActive
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
    signUp(){
      console.log(this.vertificationResDataLocal)
      const check = this.vertificationData.hasOwnProperty('vertificationId')
      if(check){
        const secondCheck = this.vertificationData.vertificationId === this.vertificationResDataLocal.vertificationId ? true : false
        if(secondCheck){
          console.log('correct')
          this.signUpFunction()
          this.succesfullNotify()
        }else{
          console.log('false')
          this.vertificationData = {}
          this.nonCorrectNotify()
        }
      }

    },
    clearAll(){
      this.store.loginDialogCheckEmailActive =! this.store.loginDialogCheckEmailActive
    },
    sendAgain(){
      this.sendAgainActive = true
      this.$emit('sendAgainActive',this.sendAgainActive)
      setTimeout(() => {
        this.sendAgainActive = false
      },1000)
    },
    goBack(){
      this.store.loginDialogCheckEmailActive =! this.store.loginDialogCheckEmailActive
    }
  },
  created(){

  },
  watch:{
    vertificationResData:{
      handler(newValue,oldValue){
        const check = newValue.hasOwnProperty('toEmail')
        if(check){
          this.vertificationResDataLocal = newValue
          console.log('vertificationResDataLocal',this.vertificationResDataLocal)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
