<style scoped>
  .formDiv{
    margin:0 auto;
  }
</style>

<template>
  <q-page class="bg-dark myEntirePage">
    <div
      class="formDiv"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
      }"
      >
      <q-card class="bg-grey-3">
        <q-card-section class="row">
          <div class="text-h6">
            <q-icon name="work" color="grey-7"></q-icon>
            Job Application Form
          </div>
          <q-space></q-space>
          <q-btn
            v-on:Click="this.getCurrentLocationLatLng()"
            icon="fa-solid fa-light fa-location-dot fa-bounce" flat color="grey-8"></q-btn>
        </q-card-section>
        <q-separator size="1px"></q-separator>
        <q-card-section class="text-center">
          <q-avatar size="100px">
            <img style="object-fit:cover;" :src="this.formData.profileImage" alt="" v-if="this.formData.profileImage">
            <q-btn icon="person" size="30px" v-else color="grey-8" round></q-btn>
          </q-avatar>
          <q-file
            v-model="this.selectedProfileImage"
            label="Pick one file"
            filled
            @update:model-value="selectProfileImageFunction"
            style=""
          >
            <template v-slot:append v-if="this.selectedProfileImage">
              <q-btn icon="remove" flat color="red-4" v-on:click="clearProfileImage"></q-btn>
            </template>
            <template v-slot:prepend>
              <q-icon name="collections_bookmark"></q-icon>
            </template>
          </q-file>
        </q-card-section>
        <q-card-section class="">
          <q-input
            type="text"
            class="col-12"
            label="Enter Your Name"
            v-model="this.formData.name"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.name" v-on:click="delete this.formData.name"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.name">
              <q-btn icon="check" flat color="green-4"></q-btn>
            </template>
          </q-input>
          <q-input
            type="text"
            class="col-12 q-mt-md"
            label="Enter Your Family Name"
            v-model="this.formData.lastName"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.lastName" v-on:click="delete this.formData.lastName"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.lastName">
              <q-btn icon="check" flat color="green-4"></q-btn>
            </template>
          </q-input>
          <q-input
            type="email"
            class="col-12 q-mt-md"
            label="Enter Your E-mail"
            v-model="this.formData.email"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="mail"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.email" v-on:click="delete this.formData.email"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.email">
              <q-btn icon="check" flat color="green-4"></q-btn>
            </template>
          </q-input>
          <div class="row  q-mt-md">
            <q-select
              color="dark"
              label="+"
              v-model="this.formData.dialCode"
              class="col"
              use-input
              @update:model-value="selectDialCode"
              @filter="filterDialCode"
              :options="this.onlyDialCodes">
              <template v-slot:prepend>
                <q-icon name="phone"></q-icon>
              </template>
            </q-select>
            <q-input
              mask="(###) ### ####"
              fill-mask="#"
              type="tel"
              class="col-8"
              label="Enter Your PhoneNumber"
              v-model="this.formData.phoneNumber"
              color="dark"
            >
              <template v-slot:append>
                <q-btn icon="remove" flat color="red-4" v-if="this.formData.phoneNumber" v-on:click="clearTelVal"></q-btn>
              </template>
              <template v-slot:after v-if="this.formData.phoneNumber">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
            </q-input>
          </div>
          <q-select
            use-input
            @filter="filterCountry"
            color="dark"
            v-model="this.formData.country"
            label="Select Country " class="col-12 q-mt-md"
            :options="this.onlyCountries"
          >
            <template v-slot:prepend>
              <q-icon name="flag"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" color="red-4" flat v-on:click="clearCountryVal" v-if="this.formData.country"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.country">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-select>
          <q-input
            type="text"
            class="col-12 q-mt-md "
            label="Enter Your City"
            v-model="this.formData.city"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="location_on"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.city" v-on:click="delete this.formData.city"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.city">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
          <q-input
            type="text"
            class="col-12 q-mt-md "
            label="Enter Your Full Addres"
            v-model="this.formData.address"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="location_city"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.address" v-on:click="delete this.formData.address"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.address">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
          <q-input
            type="text"
            class="col-12 q-mt-md "
            label="Enter Your Prefer Job Position"
            v-model="this.formData.jobPosition"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="work"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.jobPosition" v-on:click="delete this.formData.jobPosition"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.jobPosition">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
          <q-input
            type="textarea"
            filled
            class="col-12 q-mt-md "
            label="Additional Info"
            v-model="this.formData.description"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="info"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.description" v-on:click="delete this.formData.description"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.description">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
          <q-file
            class="q-mt-md"
            color="grey-3" outlined label-color="dark" v-model="this.selectedCv" label="Add CV" @update:model-value="selectCvFunction">
            <template v-slot:append>
              <q-btn icon="attachment" color="grey-8" class="" rounded/>
            </template>
            <template v-slot:prepend>
              <q-btn icon="delete_forever" color="red-4" v-on:click="this.selectedCv = '';this.selectedDetailedCv = {}" v-if="this.selectedCv"></q-btn>
            </template>
            <template v-slot:after v-if="this.selectedCv">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-file>
          <q-input
            color="dark"
            label="Enter Your Birthday"
            v-model="this.formData.birthday" mask="date" :rules="['date']" class="q-mt-md">
            <template v-slot:prepend>
              <q-icon name="celebration"></q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" >
                  <q-date v-model="this.formData.birthday" class="bg-dark text-white" today-btn color="dark">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="white" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            type="number"
            class="col-12 q-mt-md "
            label="Enter Your Age"
            v-model="this.formData.age"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="person"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.age" v-on:click="delete this.formData.age"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.age">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
          <q-input
            type="number"
            class="col-12 q-mt-md "
            label="Enter Your Expected Salary"
            v-model="this.formData.salary"
            color="dark"
          >
            <template v-slot:prepend>
              <q-icon name="work"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn icon="remove" flat color="red-4" v-if="this.formData.salary" v-on:click="delete this.formData.salary"></q-btn>
            </template>
            <template v-slot:after v-if="this.formData.salary">
                <q-btn icon="check" flat color="green-4"></q-btn>
              </template>
          </q-input>
        </q-card-section>
        <q-card-section horizontal>
          <q-btn
            :disable="this.checkFormData() ? false : true"
            icon="clear_all" class="col-6" color="red-4" v-on:click="clearAll" glossy></q-btn>
          <q-btn
            glossy
            :disable="this.checkFormData() ? false : true"
            icon="send" class="col-6" color="green-4" v-on:click="sendMyCvToDb"
          ></q-btn>
        </q-card-section>
      </q-card>
    </div>
    <login v-if="this.store.loginDialogActive"/>
  </q-page>
</template>

<script>
import dialCodes from '../dialCodes/jsonFile.json'
import login from 'src/components/login.vue';
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    login
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      testData:{},
      fileData:{},
      selectedFile:{},
      formData:{},
      allDialCodes:dialCodes,
      onlyCountries:[],
      onlyDialCodes:[],
      selectedCv:'',
      selectedDetailedCv:{},
      selectedProfileImage:'',
      selectedProfileImageDetail:{}
    }
  },
  mounted(){
  },
  methods:{
    clearProfileImage(){
      this.selectedProfileImage = ''
      this.selectedProfileImageDetail = {}
      delete this.formData.profileImage
    },
    selectProfileImageFunction(val){
      if(val){
        const newObject = {
          _key: val._key ?? '',
          lastModified: val.lastModified ?? '',
          lastModifiedDate: val.lastModifiedDate ?? '',
          name: val.name ?? '',
          size: val.size ?? '',
          type: val.type ?? '',
          webKitRelativePath: val.webKitRelativePath ?? '',
        };
        const reader = new FileReader();
        reader.onloadend = () => {
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
              Object.assign(newObject,{
                url : reader.result
              })

              Object.assign(this.selectedProfileImageDetail,newObject)

              console.log('selectedProfileImageDetail',this.selectedProfileImageDetail)
        };
        reader.readAsDataURL(val);
      }
    },
    filterDialCode(val,update){
      update(() => {
        if(val){
          const filterResult = this.onlyDialCodes.filter(
            object => (object.toLowerCase()).includes(val.toLowerCase())
          )

          this.onlyDialCodes = filterResult

        }else{
          let onlyDialCodes = []
          this.allDialCodes.forEach(element => {
            onlyDialCodes.push(element.dial_code)
          });
          this.onlyDialCodes = onlyDialCodes
          }
      })
    },
    notifyAfterSendedCv(){
      this.$q.notify({
        type:'positive',
        icon:'send',
        message:'CV Sended.',
        position:'bottom'
      })
    },
    sendMyCvToDb(){
      console.log(this.formData)

      Object.assign(this.formData,{
        applierFirebaseId:this.store.firebaseInfoUser.uid ?? '',
        applierId:this.store.myAccFromDb._id ?? ''
      })

      const allBody = {
        myCv:this.formData
      }
      this.store.sendMyCvFunction(allBody)
      this.notifyAfterSendedCv()
    },
    checkFormData(){
      const obj = this.formData
      for (const key in obj) {
        if (obj[key] !== '' && obj[key] !== null) {
          return true;
        }
      }
      return false;
    },
    clearAll(){
      this.formData = {}
      this.selectedCv = ''
      this.selectedDetailedCv = {}
    },
    async getCurrentLocationDetails(allBody){
      const res = await fetch(`
        https://api.opencagedata.com/geocode/v1/json?q=${allBody.lat}+${allBody.lng}&key=${this.store.openCageApiKey}`
      )
      const resData = await res.json()
      console.log(resData.results)
      this.formData.address = resData.results[0].formatted
      this.formData.country = resData.results[0].components.country
      this.formData.city = resData.results[0].components.province
    },
    getCurrentLocationLatLng(){
      const navigator = window.navigator;
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const allBody = {
          lat:latitude,
          lng:longitude
        }
        console.log(allBody)
        this.getCurrentLocationDetails(allBody)
      });
    },
    askForAutomaticLocation(){
      this.$q.dialog({
        title: 'Location',
        message: 'Would You Like To Get Current Location Details Automatically ?',
        cancel: true,
        maximized:this.store.mobileActive ? true : false,
        fullHeight:this.store.mobileActive ? true : false,
        persistent: true
      }).onOk(() => {
        // console.log('>>>> OK')
        this.getCurrentLocationLatLng()
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    selectCvFunction(val){
      if(val){
        const newObject = {
          _key: val._key ?? '',
          lastModified: val.lastModified ?? '',
          lastModifiedDate: val.lastModifiedDate ?? '',
          name: val.name ?? '',
          size: val.size ?? '',
          type: val.type ?? '',
          webKitRelativePath: val.webKitRelativePath ?? '',
        };
        const reader = new FileReader();
        reader.onloadend = () => {
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
              Object.assign(newObject,{
                url : reader.result
              })

              Object.assign(this.selectedDetailedCv,newObject)

              console.log('selectedDetailedCv',this.selectedDetailedCv)
        };
        reader.readAsDataURL(val);
      }
    },
    clearCountryVal(){
      delete this.formData.country
      let onlyCountries = []
        this.allDialCodes.forEach(element => {
          onlyCountries.push(element.name)
        });
      this.onlyCountries = onlyCountries
    },
    filterCountry(val, update){
      update(() => {
        let firstList = this.onlyCountries
        if(val){
          const inputVal = val.toLowerCase()
          this.onlyCountries = this.onlyCountries.filter(
            object => (object.toLowerCase()).includes(inputVal.toLowerCase())
          )
        }else{

        }
      })
    },
    getOnlyCountries(){
      const lengthCheck = this.allDialCodes.length ? true : false
      if(lengthCheck){
        let onlyCountries = []
        this.allDialCodes.forEach(element => {
          onlyCountries.push(element.name)
        });
        return onlyCountries
      }else{
        return []
      }
    },
    clearTelVal(){
      delete this.formData.phoneNumber
      delete this.formData.dialCode
    },
    selectDialCode(val){
      if(val){
        this.formData.dialCode = val
        console.log(this.formData)
      }
    },
    editallDialCodes(){
      const lengthCheck = this.allDialCodes.length ? true : false
      if(lengthCheck){
        let onlyDialCodes = []
        this.allDialCodes.forEach(element => {
          onlyDialCodes.push(element.dial_code)
        });
        return onlyDialCodes
      }else{
        return []
      }
    },
    sendFile(){
      const allBody = {
        selectedFile:this.selectedFile
      }
      axios.put(`${this.store.baseUrl}/fileconverter/converFile`, allBody)
        .then(res =>{
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectFileFunction(val){
      const newObject = {
          _key: val._key ?? '',
          lastModified: val.lastModified ?? '',
          lastModifiedDate: val.lastModifiedDate ?? '',
          name: val.name ?? '',
          size: val.size ?? '',
          type: val.type ?? '',
          webKitRelativePath: val.webKitRelativePath ?? '',
        };
        const reader = new FileReader();
        reader.onloadend = () => {
            // Logs data:<type>;base64,wL2dvYWwgbW9yZ...
              Object.assign(newObject,{
                url:reader.result
              })
              console.log(newObject)
              this.selectedFile = newObject
        };
        reader.readAsDataURL(val);
    },
    sendData(){
      console.log(this.testData)
      const allBody = {
        testData:this.testData
      }
      axios.post(`${this.store.baseUrl}/fileconverter/sendTest`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkStoreMyAccFromDb(){
      this.$watch('store.myAccFromDb',(newVal) => {
        const check = newVal.hasOwnProperty('_id')
        if(check){
          this.store.loginDialogActive = false
        }else{
          this.store.loginDialogActive = true
        }
        console.log('loginDialogActive',this.store.loginDialogActive)
      })
    }
  },
  beforeRouteEnter(to,from,next){
    next(vm =>{
      console.log('tofasdfasf',to)
      //vm.checkStoreMyAccFromDb()
    })
  },
  created(){
  //  this.askForAutomaticLocation()
  console.log(this.$route)
  },
  watch:{
    selectedProfileImageDetail:{
      handler(newVal,oldVal){
        if(newVal){
          const check = newVal.hasOwnProperty('url')
          if(check){
            Object.assign(this.formData,{
              profileImage:newVal.url ?? ''
            })
            console.log(this.formData,newVal)
          }
        }
      },
      immediate:true,deep:true
    },
    selectedDetailedCv:{
      handler(newVal,oldVal){
        if(newVal){
          const check = newVal.hasOwnProperty('type')
          if(check){
            Object.assign(this.formData,{
              selectedCv:this.selectedDetailedCv
            })
          }
        }
      },
      immediate:true,deep:true
    },
    'store.firebaseInfoUser':{
      handler(newVal,oldVal){
        if(newVal){
          const check = newVal.hasOwnProperty('uid')
          if(check){
            this.formData.email = newVal.email ?? ''
          }
        }
      },
      immediate:true,deep:true
    },
    allDialCodes:{
      handler(newVal,oldVal){
        if(newVal){
          const checkLength = newVal.length ? true  : false
          if(checkLength){
            this.onlyCountries = this.getOnlyCountries()
            this.onlyDialCodes = this.editallDialCodes()
          }
        }
      },
      immediate:true,deep:true
    },
    'store.myAccFromDb':{
      handler(newValue,oldValue){
        if(newValue){
          const check = newValue.hasOwnProperty('_id')
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>


