<template>
      <q-card
        v-for="(data,key) in this.confirmedsList" :key="key"
        class="q-mt-xs" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              style="object-fit:cover;"
              v-if="this.checkForImage(data)"
              :src="data.appliedUserDetail.googleImage ?? data.appliedUserDetail.userImage"
            >
            <q-btn icon="groups" color="grey-8" v-else round></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ data.applyDetail.jobPosition ?? 'No Info Position' }}
          </q-item-label>
          <q-item-label caption>
            <q-icon name="event"></q-icon>
            {{ data.applyDetail.applicationDate ?? 'No Info About Application' }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.applyDetail.description ?? 'No Description' }}
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-4 q-pa-xs" horizontal>
          <q-btn
            icon="delete_forever" color="red-4" class="col"
            v-on:click="cancelApplication(data)"></q-btn>
          <q-btn
            icon="edit" color="green-4" class="col"
            v-on:click="updateDateApply(data)"
          ></q-btn>
        </q-card-section>
      </q-card-section>
      <q-card-section horizontal
        v-if="this.checkEachDate(data)"
        >
        <q-date readonly dark v-model="data.meetingDetail.date" mask="YYYY-MM-DD" color="blue-4"  class="col"/>
        <q-time readonly dark v-model="data.meetingDetail.dateHour" mask="HH:mm" color="blue-4" class="col"/>
      </q-card-section>
      <updateDate
        :selectedApplyForUpdateDate="this.selectedApplyForUpdateDate"
        v-if="this.store.updateDateDialogActive"
      />
    </q-card>
</template>

<script>
import updateDate from 'src/components/updateDate.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    updateDate,
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      confirmedsList:[],
      selectedApplyForUpdateDate:{}
    }
  },
  methods:{
    updateDateApply(data){
      console.log(data)
      this.selectedApplyForUpdateDate = data
      this.store.updateDateDialogActive =! this.store.updateDateDialogActive
    },
    checkEachDate(data){
      const check = 'meetingDetail' in data
      if(check){
        return true
      }else{
        return false
      }
    },
    cancelApplication(data){
      const allBody = {
        applyDetail:data.applyDetail
      }
      const id = this.store.myAccFromDb._id
      const url = this.store.baseUrl
      ///:currentAdminId/removeConfirmedApplication
      //selectedapplyusernotifies findapply
      axios.put(`${url}/fileconverter/${id}/removeConfirmedApplication`, allBody)
        .then(res =>{
          console.log(res)
          this.confirmedsList = this.confirmedsList.filter(
            object => object.applyDetail.applicationId !== res.data.resBody.findapply.applicationId
          )
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkForImage(data){
      const check = 'appliedUserDetail' in data
      if(check){
        const check = data.appliedUserDetail.googleImage || data.appliedUserDetail.userImage ? true : false
        return check
      }else{
        return check
      }
    },
    getAllConfirmeds(id){
      axios.get(`${this.store.baseUrl}/fileconverter/${id}/getAllConfirmeds`)
        .then(res => {
          console.log(res)
          this.confirmedsList = res.data.confirmedsList
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkId(){
      this.$watch('store.myAccFromDb',(newVal) => {
        if(newVal){
          const check = '_id' in newVal
          if(check){
            const id = newVal._id
            this.getAllConfirmeds(id)
          }
        }
      },{
        immediate:true,deep:true
      })
    }
  },
  created(){
    this.checkId()
  },
  watch:{

  }
}
</script>

<style>

</style>
