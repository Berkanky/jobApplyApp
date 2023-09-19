<template>
  <q-dialog
    v-model="this.store.updateDateDialogActive"
    :full-height="this.store.mobileActive ? true : false"
    :maximized="this.store.mobileActive ? true : false"
    persistent
  >
    <q-card
      class="bg-dark text-white"
      style="margin:0 auto;"
      :style="{
        'max-width':this.store.mobileActive ? '100%' : '700px',
        'width':this.store.mobileActive ? '100%' : '700px'
      }"
    >
      <q-card-section>
        <q-btn icon="keyboard_backspace" flat color="white" v-on:click="goBack"></q-btn>
      </q-card-section>
      <q-separator size="1.5px" color="grey-7"></q-separator>
      <q-card-section horizontal>
        <q-date
          dark
          class="col"
          v-model="this.newDateData.date" mask="YYYY-MM-DD" color="dark" />
        <q-time
          dark
          class="col"
          v-model="this.newDateData.dateHour" mask="HH:mm" color="dark" />
      </q-card-section>
      <q-separator size="1.5px" color="grey-7"></q-separator>
      <q-card-section horizontal v-if="this.checkNewDateData()" class="q-pa-sm">
        <q-btn icon="clear_all" flat color="red-4" v-on:click="clearAll" class="col"></q-btn>
        <q-btn icon="edit" flat color="green-4" v-on:click="updateDate" class="col"></q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script>
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  props:['selectedApplyForUpdateDate'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      selectedApplyDetail:{},
      newDateData:{}
    }
  },
  methods:{
    updateDate(){
      console.log(this.selectedApplyDetail)
      const allBody = {
        selectedApplyDetail:this.selectedApplyDetail,
        newDateData:this.newDateData
      }

      const id = this.store.myAccFromDb._id
      const applyId = this.selectedApplyDetail.applyDetail.applicationId
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/${applyId}/updateDate`, allBody)
        .then(res => {
          console.log(res)
          this.$q.notify({
            type:'positive',
            position:'bottom',
            message:'Updated Succesfully.',
            icon:'info'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    clearAll(){
      this.newDateData = {}
    },
    goBack(){
      this.store.updateDateDialogActive =! this.store.updateDateDialogActive
    },
    checkNewDateData(){
      const check = ['date','dateHour'].every((key) => key in this.newDateData)
      return check
    }
  },
  created(){

  },
  watch:{
    newDateData:{
      handler(newVal,oldVal){
        if(newVal){
          const check = ['date','dateHour'].every((key) => key in this.newDateData)
          if(check){
            console.log('newDateData',this.newDateData)
          }
        }
      },
      immediate:true, deep:true
    },
    selectedApplyForUpdateDate:{
      handler(newVal,oldVal){
        if(newVal){
          this.selectedApplyDetail = newVal
          const check = 'meetingDetail' in newVal
          if(check === true){
            this.newDateData = newVal.meetingDetail
          }
          console.log('selectedApplyDetail',this.selectedApplyDetail)
        }
      },
      immediate:true, deep:true
    }
  }
}
</script>

<style>

</style>
