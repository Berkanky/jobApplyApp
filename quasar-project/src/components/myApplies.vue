<template>
    <q-card
      style="border-radius:15px;"
      v-for="(data,key) in this.appliesListLocal" :key="key"
      class="q-pa-md q-mt-xs" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <q-btn icon="info" color="grey-8" round flat></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ data.jobPosition ?? 'No Info About Job Position' }}
          </q-item-label>
          <q-item-label caption>
            {{ data.applicationDate ?? ''}}
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="this.checkRejectedOrNot(data)" class="text-red-4 text-weight-bold">
          <div>
            <q-icon name="info"></q-icon>
            Rejected
          </div>
        </q-item-section>
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.description ?? 'No Info About MySelf' }}
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-4 q-pa-xs" horizontal>
          <q-btn
            class="col"
            icon="edit" color="grey-7"
            v-on:click="editApply(data)"
          ></q-btn>
          <q-btn
            icon="delete_forever"
            color="red-4" class="col" v-on:click="deleteJobApplication(data)">
            <q-tooltip>Delete Applie</q-tooltip>
          </q-btn>
          <q-btn
            v-on:Click="goSelectedApply(data)"
            icon="login" color="grey-6" class=" col">
            <q-tooltip>
              Check Details
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
</template>

<script>
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
export default {
  props:['appliesList'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      appliesListLocal:[]
    }
  },
  methods:{
    checkRejectedOrNot(data){
      const check = 'declinedStatus' in data
      if(check === true){
        if(data.declinedStatus === true){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    },
    editApply(data){
      const id  = data.applicationId
      this.$router.push(
        {
          path:`/updateApply/${id}`,
          params:{id:id}
        }
      )
    },
    goSelectedApply(data){
      const id = data._id
      this.$router.push(
        {
          path:`/applyDetail/${id}`,
          params:
            {
              id:id
            }
        }
      )
    },
    deleteJobApplication(data){
      const id = this.store.firebaseInfoUser.uid
      const dataId = data._id
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/${dataId}/removeSelected`)
        .then(res => {
          console.log(res)
          this.store.myAllAppliesList = this.store.myAllAppliesList.filter(
            object => object._id !== res.data.findapply._id
          )
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created(){

  },
  watch:{
    'store.myAllAppliesList':{
      handler(newVal,oldVal){
        if(newVal){
          const checkLength = newVal.length > 0 ? true : false
          if(checkLength){
            this.appliesListLocal = newVal
            console.log('appliesList',this.appliesListLocal)
          }else{
            this.appliesListLocal = []
          }
        }
      },
      immediate:true,
      deep:true
    },
    'store.firebaseInfoUser':{
      handler(newValue,oldValue){
        const check = newValue.hasOwnProperty('uid')
        if(check){
          if(newValue.uid !== '' && newValue.uid !== null){
            const firebaseId = newValue.uid
            console.log('firebaseId',firebaseId)
            this.store.getMyAppliesFunction(firebaseId)
          }
        }
      },
      immediate:true,
      deep:true
    }
  }
}
</script>

<style>

</style>
