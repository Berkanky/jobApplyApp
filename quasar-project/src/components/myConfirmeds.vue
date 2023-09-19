<template>
    <q-card
      v-for="(data,key) in this.myMeetingsList" :key="key"
      class="q-mt-sm" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              style="object-fit:Cover;"
              v-if="this.checkImage(data)"
              :src="data.applyDetail.userDetail.userImage ?? data.applyDetail.userDetail.googleImage">
            <q-btn
              round color="grey-8"
              icon="event" v-if="!this.checkImage(data)"></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ data.applyDetail.jobPosition ?? 'No Position Detail' }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="event"></q-icon>
            {{ data.applyDetail.applicationDate ?? 'No Application Date Info' }}
          </q-item-label>
        </q-item-section>
        <q-space></q-space>
        <q-item-section class="text-right">
          <q-btn
            v-on:Click="deleteMeeting(data)"
            icon="restart_alt" flat color="red-4"
          ></q-btn>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.applyDetail.description ?? '' }}
        </q-card-section>
      </q-card-section>
      <q-separator size="1px"></q-separator>
      <q-card-section horizontal
        v-if="this.checkEachDate(data)"
        >
        <q-date readonly dark v-model="data.meetingDetail.date" mask="YYYY-MM-DD" color="blue-4"  class="col"/>
        <q-time readonly dark v-model="data.meetingDetail.dateHour" mask="HH:mm" color="blue-4" class="col"/>
      </q-card-section>
    </q-card>
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
      myMeetingsList:[],
      dateData:{}
    }
  },
  methods:{
    deleteMeetingFunction(data){
      //:currentUserId/:selectedApplyId/removeMeeting

      const url = this.store.baseUrl
      const id = this.store.myAccFromDb._id
      const applyId = data.applyDetail.applicationId

      axios.put(`${url}/fileconverter/${id}/${applyId}/removeMeeting`)
        .then(res => {
          console.log(res)
          this.myMeetingsList = this.myMeetingsList.filter(
            object => object.applyDetail.applicationId !== data.applyDetail.applicationId
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteMeeting(data){
      this.$q.dialog({
        dark:true,
        title:'Warning',
        message:'Are You Sure For Remove Meeting ?',
        cancel:true
      }).onOk(() => {
        console.log(data)
        this.deleteMeetingFunction(data)
      }).onCancel(() => {
        //
      })
    },
    checkEachDate(data){
      const check = 'meetingDetail' in data
      if(check){
        return true
      }else{
        return false
      }
    },
    checkDescription(data){
      const check = 'applyDetail' in data
      if(check){
        const secCheck = 'description' in data.applyDetail
        if(secCheck){
          const thirdCheck = data.applyDetail.description !== '' && data.applyDetail.description !== null ? true : false
          if(thirdCheck === true){
            return true
          }else{
            return false
          }
        }else{
          return false
        }
      }else{
        return false
      }
    },
    checkImage(data){
      const check = data.applyDetail.hasOwnProperty('userDetail')
      if(check){
        const imageCheck = data.applyDetail.userDetail.userImage || data.applyDetail.userDetail.googleImage ? true : false
        if(imageCheck === true){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    getConfirmeds(id){
      ///:currentUserId/getMyConfirmeds
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/getMyConfirmeds`)
        .then(res =>{
          console.log(res)
          this.myMeetingsList = res.data.myConfirmedApplies
        })
        .catch(err =>{
          console.log(err)
        })
    },
    getMyConfirmedApplies(){
      this.$watch('store.myAccFromDb',(newVal) => {
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check){
            const id = newVal._id
            this.getConfirmeds(id)
          }
        }
      },{
        immediate:true, deep:true
      })
    },
  },
  created(){
    this.getMyConfirmedApplies()
  },
  watch:{

  }
}
</script>

<style>

</style>
