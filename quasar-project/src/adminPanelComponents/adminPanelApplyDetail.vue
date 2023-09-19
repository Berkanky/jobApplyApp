<template>
  <q-dialog
    v-model="this.store.adminPanelApplyDetailActive"
    persistent
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    :position="this.store.mobileActive ? 'center' : 'top'"
  >
    <q-card
      class="bg-dark text-white"
      :style="{
        'width':this.store.mobileActive ? '100%'  : '500px'
      }"
    >
      <q-card-section class="row">
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
        <q-space></q-space>
        <q-btn icon="more_vert" flat color="white">
          <q-menu>
            <q-list class="bg-dark">
              <q-item
                v-for="(data,key) in this.checkStatusConfirmedApply()" :key="key"
                clickable v-close-popup @click="selectOption(data)">
                <q-item-section avatar>
                  <q-btn :icon="data.icon" :color="data.color" flat />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-white">{{data.label}}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="info" color="white" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-card-section>
      <q-separator size="1px" color="grey-5"></q-separator>
      <q-card-section class="text-center">
        <q-avatar size="150px">
          <img
            style="object-fit:Cover;"
            :src="this.applyDetail.profileImage" alt="" v-if="this.applyDetail.profileImage">
          <q-btn v-else icon="person" color="white" round size="lg" flat></q-btn>
        </q-avatar>
      </q-card-section>
      <q-card-section>
        <div class="">
          <q-input
            dark
            class="q-mt-md"
            readonly
            v-model="this.userDetail.email"
            label="E-Mail"
            >
              <template v-slot:prepend>
                <q-icon name="email"></q-icon>
              </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.name"
              :label="this.applyDetail.name ? 'Name' : 'No Name'"
              >
                <template v-slot:prepend>
                  <q-icon name="person"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.lastName"
              :label="this.applyDetail.lastName ? 'Family Name' : 'No Family Name'"
              >
                <template v-slot:prepend>
                  <q-icon name="person"></q-icon>
                </template>
            </q-input>
            <q-card-section horizontal>
              <q-input
                dark
                class="col q-ml-md q-mt-md"
                readonly
                label="DC"
                v-model="this.applyDetail.dialCode"
                >
                <template v-slot:prepend>
                    <q-icon name="phone"></q-icon>
                  </template>
              </q-input>
              <q-input
                dark
                class="q-mt-md col-9"
                readonly
                v-model="this.applyDetail.phoneNumber"
                :label="this.applyDetail.phoneNumber ? 'PhoneNumber' : 'No PhoneNumber'"
                >
              </q-input>
            </q-card-section>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.lastName"
              :label="this.applyDetail.lastName ? 'Family Name' : 'No Family Name'"
              >
                <template v-slot:prepend>
                  <q-icon name="person"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.country"
              :label="this.applyDetail.country ? 'Country' : 'No Country'"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.city"
              :label="this.applyDetail.city ? 'City' : 'No City'"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.address"
              :label="this.applyDetail.address ? 'Address' : 'No Address'"
              >
                <template v-slot:prepend>
                  <q-icon name="location_on"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.jobPosition"
              :label="this.applyDetail.jobPosition ? 'Job Position' : 'No Job Position'"
              >
                <template v-slot:prepend>
                  <q-icon name="work"></q-icon>
                </template>
            </q-input>
            <q-input
              type="textarea"
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.description"
              :label="this.applyDetail.description ? 'Description' : 'No Description'"
              >
                <template v-slot:prepend>
                  <q-icon name="info"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.salary"
              :label="this.applyDetail.salary ? 'Salary Expending' : 'No Salary Info'"
              >
                <template v-slot:prepend>
                  <q-icon name="work"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.applicationDate"
              :label="this.applyDetail.applicationDate ? 'Application Date' : 'No Application Date'"
              >
                <template v-slot:prepend>
                  <q-icon name="event"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.birthday"
              :label="this.applyDetail.birthday ? 'Birthday Date' : 'No Birthday Date'"
              >
                <template v-slot:prepend>
                  <q-icon name="event"></q-icon>
                </template>
            </q-input>
            <q-input
              dark
              class="q-mt-md"
              readonly
              v-model="this.applyDetail.age"
              :label="this.applyDetail.age ? 'Age' : 'No Age Info'"
              >
                <template v-slot:prepend>
                  <q-icon name="event"></q-icon>
                </template>
            </q-input>
        </div>
      </q-card-section>
    </q-card>
    <dateDialog v-if="this.store.dateDialogActive"/>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import dateDialog from './dateDialog.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    dateDialog
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      applyDetail:{},
      userDetail:{},
      options:[
        {id:1,label:'Confirm For HR',icon:'info',color:'green-4'},
        {id:2,label:'Declined Apply',icon:'remove',color:'red-4'}
      ]
    }
  },
  methods:{
    checkStatusConfirmedApply(){
      let options = []
      const confirmOption = {id:1,label:'Confirm For HR',icon:'info',color:'green-4'}
      const declineOption = {id:2,label:'Declined Apply',icon:'remove',color:'red-4'}
      console.log('options',this.options)
      const applyCheck = Object.keys(this.applyDetail).length
      if(applyCheck > 0){
        const check = ['confirmedStatus','declinedStatus'].every((key) => key in this.applyDetail)
        if(check){
          const confirmVal = this.applyDetail.confirmedStatus === true ? true : false
          const declinedVal = this.applyDetail.declinedStatus === true ? true : false
          if(!confirmVal){
            options.push(confirmOption)
          }
          if(!declinedVal){
            options.push(declineOption)
          }
          console.log('options',this.options)
          return options
        }
      }
    },
    declineApply(){
      const selectedData = {applyDetail:this.applyDetail,userDetail:this.userDetail}
      const allBody = {
        selectedData
      }
      const adminId = this.store.myAccFromDb._id
      const id = selectedData.applyDetail.applierId
      const applyId = selectedData.applyDetail.applicationId
      console.log(adminId,id,applyId)
      axios.put(`${this.store.baseUrl}/fileconverter/${adminId}/${id}/${applyId}/declineApply`, allBody)
        .then(res  => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    selectOption(data){
      //console.log(data)
      if(data.id === 1){
        this.store.dateDialogActive =! this.store.dateDialogActive
      }else if(data.id === 2){
        //decline apply
        this.declineApply()
      }
    },
    goBack(){
      this.store.adminPanelSelectedApply = {}
      this.store.adminPanelApplyDetailActive =! this.store.adminPanelApplyDetailActive
    },
  },
  created(){

  },
  watch:{
    'store.adminPanelSelectedApply':{
      handler(newVal,oldVal){
        if(newVal){
          const check = ['applyDetail','userDetail'].every((key) => key in this.store.adminPanelSelectedApply)
          if(check){
            console.log('adminPanelSelectedApply',this.store.adminPanelSelectedApply)
            this.applyDetail = newVal.applyDetail
            this.userDetail = newVal.userDetail
          }
        }
      },
      immediate:true,deep:true
    }
  },

}
</script>

<style>
</style>
