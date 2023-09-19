<style>
  .formDiv{
    margin:0 auto;
  }
</style>

<template>
  <q-page>
    <div
      class="formDiv q-pa-xs"
      :style="{
        'width':this.store.mobileActive ? '100%' : '600px',
      }"
      >
      <q-card class="bg-grey-3">
        <q-card-section class="row">
          <div class="text-h6">
            <q-icon name="work" color="grey-7"></q-icon>
            Update Page
          </div>
          <q-space></q-space>
          <q-btn
            v-on:Click="this.getCurrentLocationLatLng()"
            icon="fa-solid fa-light fa-location-dot fa-bounce" flat color="grey-8"></q-btn>
        </q-card-section>
        <q-separator size="1px"></q-separator>
        <q-card-section
          v-if="'updatedDate' in this.formData"
          class="text-overline text-weight-bold text-grey-6">
          <q-icon name="info"></q-icon>
          {{ this.messageForLastUpdateDate() }}
        </q-card-section>
        <q-card-section class="text-center">
          <q-avatar size="100px">
            <img style="object-fit:cover;" :src="this.formData.profileImage" alt="" v-if="this.checkImage()">
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
          <q-btn icon="edit" color="green-5" class="col" v-on:click="updateApply"></q-btn>
        </q-card-section>
      </q-card>
    </div>

  </q-page>
</template>

<script>
import dialCodes from '../dialCodes/jsonFile.json'
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
      onlyDialCodes:[],
      allDialCodes:dialCodes,
      formData:{},
      routeDetails:{},
      selectedCv:'',
      selectedProfileImage:'',
      selectedProfileImageDetail:{},
      selectedDetailedCv:{},
      onlyCountries:[]
    }
  },
  methods:{
    selectDialCode(val){
      if(val){
        this.formData.dialCode = val
        console.log(this.formData)
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
          this.onlyCountries = this.getOnlyCountries()
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
    messageForLastUpdateDate(){
      const check = 'updatedDate' in this.formData
      if(check === true){
        const message = `Last Updated Date ${this.formData.updatedDate}`
        return message
      }else{
        return  ''
      }
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
    updateFunction(){
      ///:currentUserId/:selectedApplyId/updateApply
      const url = this.store.baseUrl
      const id = this.store.myAccFromDb._id
      const selectedApplyId = this.$route.params.id

      const allBody = {
        newApplyData:this.formData
      }

      axios.put(`${url}/fileconverter/${id}/${selectedApplyId}/updateApply`,allBody)
        .then(res => {
          console.log(res)
          this.$q.notify({
            type:'positive',
            icon:'info',
            position:'bottom',
            message:'Updated Successfully.'
          })
          this.$router.go(-1)
        })
        .catch(err => {
          console.log(err)
        })
    },
    updateApply(){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:`#${this.routeDetails.params.id} Update For Sure ?`,
        cancel:true,
      }).onOk(() => {
        this.updateFunction()
      }).onCancel(() => {
        //
      })

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
    checkImage(){
      const check = this.formData.profileImage ? true : false
      return check
    },
    catchMyId(){
      const myData = {}
      this.$watch('store.myAccFromDb',(newVal) => {
        if(newVal){
          const check = '_id' in newVal
          if(check === true){
            console.log('store.myacc',newVal)
            Object.assign(myData,{
              myId:newVal._id
            })
          }
        }
      })
      const check = 'params' in this.routeDetails
        if(check === true){
          Object.assign(myData,{
            selectedApplyId:this.routeDetails.params.id
          })
          console.log('myData',myData)
        }
     this.getSelectedApplyDetails(myData)
    },
    getSelectedApplyDetails(myData){
      console.log('getSelectedApplyDetails',myData)
      ///:currentUserId/:selectedApplyId/getSelectedApplyDetail
      const url = this.store.baseUrl
      axios.get(`${url}/fileconverter/${myData.myId}/${myData.selectedApplyId}/getSelectedApplyDetail`)
        .then(res => {
          console.log('getSelectedApplyDetail',res)
          this.formData = res.data.findapply

        })
        .catch(err => {
          console.log(err)
        })
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
  },
  created(){

  },
  watch:{
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
    selectedDetailedCv:{
      handler(newVal,oldVal){
        if(newVal){
          const check = newVal.hasOwnProperty('url')
          if(check === true){
            const secCheck = 'selectedCv' in this.formData
            if(secCheck === true){
              this.formData.selectedCv = newVal
            }else{
              Object.assign(this.formData,{
                selectedCv:newVal
              })
            }
          }
        }
      },
      immediate:true,
      deep:true
    },
    selectedProfileImageDetail:{
      handler(newVal,oldVal){
        if(newVal){
          const check = 'url' in newVal
          if(check === true){
            this.formData.profileImage = newVal.url
          }
        }
      },
      immediate:true, deep:true
    },
    $route:{
      handler(to,from){
        console.log(to,from)
        this.routeDetails = to
        this.catchMyId()
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
