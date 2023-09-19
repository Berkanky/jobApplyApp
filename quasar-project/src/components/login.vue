<template>
  <q-dialog
    v-model="this.store.loginDialogActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
  >
    <q-card
      class="bg-grey-9 text-white"
      :style="{
        'width':this.store.mobileActive ? '100%' : '400px',
        'border-radius':this.store.mobileActive ? '0px' : '7px'
      }"
    >
      <q-card-section class=" row">
<!--         <q-btn icon="keyboard_backspace" flat color="" v-on:click="closeDialog"></q-btn>
 -->        <q-space></q-space>
        <q-btn
          flat
          v-on:Click="this.signupActive =! this.signupActive"
          :icon="this.signupActive ? 'login' : 'person_add'"
        >
          <q-tooltip>
            {{ this.signupActive ? 'SİgnUp' : 'Login' }}
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-separator size="1px" color="grey-8"></q-separator>
      <q-card-section class="">
       <q-input
        required
        label="E-mail"
        type="email"
        color="white"
        dark
        v-model="this.loginData.email"
       >
        <template v-slot:prepend>
          <q-icon name="person"></q-icon>
        </template>
        <template v-slot:append>
          <q-btn icon="remove" flat color="red-4" v-if="this.loginData.email" v-on:click="this.clearEmail()"></q-btn>
        </template>
       </q-input>
        <q-input
          required
          class="q-mt-md"
          color="white"
          dark
          label="Password"
          v-model="this.loginData.password"  :type="isPwd ? 'password' : 'text'"
          >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
            <q-btn icon="remove" color="red-4" v-if="this.loginData.password" flat v-on:click="this.clearPassword()"></q-btn>
          </template>
          <template v-slot:prepend>
            <q-icon name="lock"></q-icon>
          </template>
        </q-input>
        <div class="text-right text-overline text-weight-bold text-grey-6">
          Forgot Password <q-btn icon="question_mark" flat color="white" size="xs" v-on:click="forgotPasswordFunction"></q-btn>
        </div>
      </q-card-section>
      <transition appear enter-active-class="animated fadeInUp slower" leave-active-class="animated fadeOutDown slower">
        <q-card-section class="">
          <q-btn
            :disable="this.secondCheck() ? false : true"
            v-on:click="loginButtonFunction"
            v-if="!this.signupActive"
            icon-right="login" label="Login"
            no-caps color="grey-2" text-color="dark"
            class="full-width" push>
              <q-tooltip>SignIn Button</q-tooltip>
            </q-btn>
            <q-btn
            :disable="this.secondCheck() ? false : true"
            v-if="this.signupActive"
            icon-right="person_add" label="SignUp"
            no-caps color="grey-2" text-color="dark"
            class="full-width" push v-on:click="signUpButton">
            <q-tooltip>SignUp Button</q-tooltip>
          </q-btn>
        </q-card-section>
      </transition>
      <q-separator size="1px" color="grey-8"></q-separator>
      <q-card-section class="row">
        <q-btn
          v-on:click="loginWithGoogle"
          flat text-color="red-4"
          icon="fa-brands fa-google fa-spin" class="col" >
            <q-tooltip>Google</q-tooltip>
          </q-btn>
          <span class="col-1"></span>
          <q-btn
          v-on:click="loginWithAnonAcc"
          flat text-color="white"
          icon="fa-sharp fa-regular fa-user fa-spin fa-spin-reverse" class="col" >
          <q-tooltip>Anonymous</q-tooltip>
          </q-btn>
      </q-card-section>
      <q-separator size="1px" color="grey-8"></q-separator>
      <q-card-section class="text-subtitle2 text-grey-6 text-weight-bold">
        <q-icon name="info"></q-icon>
        For Better Experience, Please Login the System.
      </q-card-section>
    </q-card>
    <check
      @sendAgainActive="getsendAgainActive"
      :vertificationResData="this.vertificationResData"
      v-if="this.store.loginDialogCheckEmailActive"/>
  </q-dialog>
</template>

<script>
import check from "./check.vue";
import {
  signInAnonymously,
  sendPasswordResetEmail,
  updatePassword,
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword } from "firebase/auth";
import { useCounterStore } from 'src/stores/store';
import axios from 'axios'
export default {
  components:{
    check
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      loginData:{},
      isPwd:false,
      signupActive:false,
      vertificationResData:{}
    }
  },
  methods:{
    loginWithAnonAcc(){
      const auth = getAuth();
      signInAnonymously(auth)
        .then(() => {
          // Signed in..
          this.store.loginDialogActive =! this.store.loginDialogActive
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    },
    forgotPasswordFunction(){
      const check = this.loginData.hasOwnProperty('email')
      if(check){
        const secCheck = this.loginData.email !== '' && this.loginData.email !== null ? true : false
        if(secCheck){
          const auth = getAuth();
          const email = this.loginData.email
          sendPasswordResetEmail(auth, email)
            .then(() => {
              this.$q.notify({
                type:'positive',
                message:'Password Reset Email Sended.',
                position:'right',
                icon:'send'
              })
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
          });
        }else{
          //
        }
      }else{
        //
      }
    },
    clearPassword(){
      this.loginData.password = ''
      delete this.loginData.password
    },
    clearEmail(){
      this.loginData.email = ''
      delete this.loginData.email
    },
    secondCheck(){
      const lengthObj = Object.keys(this.loginData).length
      const lengthValObj = Object.values(this.loginData).length

      const check = lengthObj === 2&& lengthValObj === 2 ? true : false
      return check

    },
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
    loginButtonFunction(){
      const email = this.loginData.email
      const password = this.loginData.password
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          this.store.firebaseInfoUser = user
          this.store.loginDialogActive =! this.store.loginDialogActive
          this.succesfullNotify()
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          this.loginData = {}
          this.nonCorrectNotify()
        });
    },
    getsendAgainActive(data){
      if(data){
        console.log(data)
        this.signUpButton()
      }
    },
    signUpButton(){
      const allBody = {
        email:this.loginData.email,
        password:this.loginData.password
      }
      axios.put(`${this.store.baseUrl}/fileconverter//vertificationCode`, allBody)
        .then(res => {
          console.log(res)
          this.vertificationResData = res.data.newBody
          Object.assign(this.vertificationResData,{
            loginData:this.loginData
          })
          this.store.loginDialogCheckEmailActive = true
        })
        .catch(err => {
          console.log(err)
        })
    },
    loginWithGoogle(){
      const provider = new GoogleAuthProvider()
      const auth = getAuth();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          this.store.firebaseInfoUser = user
          console.log('firebaseInfoUser',this.store.firebaseInfoUser)
          this.store.loginDialogActive = false
        }).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    },
    checkLoginData(){
      for (const key in this.loginData) {
        for (const key in this.loginData) {
          if (this.loginData[key] !== '' && this.loginData[key] !== null) {
            return true;
          }
        }
        return false;
      }
    },
    closeDialog(){
      this.store.loginDialogActive =! this.store.loginDialogActive
    }
  }
}
</script>

<style>

</style>
