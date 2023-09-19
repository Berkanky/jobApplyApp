<template>
  <q-dialog
    v-model="this.store.dateDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
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
      <q-separator size="1px" color="grey-7"></q-separator>
      <q-card-section horizontal>
        <q-date
          dark
          class="col"
          v-model="this.dateData.date" mask="YYYY-MM-DD" color="dark" />
        <q-time
          dark
          class="col"
          v-model="this.dateData.dateHour" mask="HH:mm" color="dark" />
      </q-card-section>
      <transition-group appear enter-active-class="animated fadeInUp slower" leave-active-class="animated fadeOutUp slower">
        <q-card-section class="q-mt-xs" v-if="this.checkDateData()">
          <div>
            <q-icon name="info"></q-icon>
            {{ this.returnMessage() }}
          </div>
        </q-card-section>
      </transition-group>
      <transition-group appear enter-active-class="animated fadeInUp slower" leave-active-class="animated fadeOutUp slower">
        <q-card-section v-if="this.checkDateData()" horizontal class="q-mt-xs q-pa-sm">
          <q-btn

            icon="clear_all" color="red-4" flat no-caps label="Clear" class="col" v-on:click="clearAll"></q-btn>
          <q-btn
            v-on:click="confirmMeeting"
            icon="edit" color="green-4" flat no-caps label="Confirm" class="col"></q-btn>
        </q-card-section>
      </transition-group>
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
      dateData:{}
    }
  },
  methods:{
    goBack(){
      this.store.dateDialogActive =! this.store.dateDialogActive
    },
    confirmMeeting(){
      const allBody = {}
      Object.assign(allBody,{
        applyDetail:this.store.adminPanelSelectedApply.applyDetail,
        userDetail:this.store.adminPanelSelectedApply.userDetail,
        dateData:this.dateData,
      })
      console.log(allBody)
      ///:selectedUserId/:selectedApplyId/sendNotify
      const selectedUserId = allBody.userDetail._id
      const applyDetail = allBody.applyDetail._id
      console.log(selectedUserId,applyDetail)
      axios.put(`${this.store.baseUrl}/fileconverter/${selectedUserId}/${applyDetail}/sendNotify`, allBody)
        .then(res => {
          console.log(res)

          console.log(this.store.allAppliesList)
          this.store.allAppliesList = this.store.allAppliesList.filter(
            object => object.applyDetail.applicationId !== this.store.adminPanelSelectedApply.applyDetail.applicationId
          )

        })
        .catch(err => {
          console.log(err)
        })

    },
    returnMessage(){
      const check = ['date','dateHour'].every((key) => key in this.dateData)
      if(check){
        const message = `In ${this.dateData.date} - ${this.dateData.dateHour} Meeting Will Be Created.`
        return message
      }
    },
    clearAll(){
      this.dateData = {}
    },
    checkDateData(){
      const check = ['date', 'dateHour'].every((key) => key in this.dateData);
      return check
    }
  },
  created(){

  },
  watch:{
    dateData:{
      handler(newVal,oldVal){
        if(newVal){
          const check = ['date', 'dateHour'].every((key) => key in newVal);
          if(check){
            console.log(newVal)
          }
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
