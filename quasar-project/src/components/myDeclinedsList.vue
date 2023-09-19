<template>
    <q-card
      style="border-radius:15px;"
      v-for="(data,key) in this.store.myDeclinedsList" :key="key"
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
      </q-item>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.description ?? 'No Info About MySelf' }}
        </q-card-section>
        <q-separator vertical />
        <q-card-section class="col-4 q-pa-xs" horizontal>
          <q-btn icon="delete_forever" color="red-4" class="col">
            <q-tooltip>Delete Applie</q-tooltip>
          </q-btn>
          <q-btn
            v-on:Click="reSendApply(data)"
            icon="restart_alt" color="green-4" class=" col">
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
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{

    }
  },
  methods:{
    reSendApply(data){
      console.log(data)
      const allBody = {
        selectedApply:data
      }
      const id = this.store.myAccFromDb._id
      const selectedApplyId = data.applicationId
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/${selectedApplyId}/reSendApply`, allBody)
        .then(res =>{
          console.log(res)
          this.store.myDeclinedsList = this.store.myDeclinedsList.filter(
            object => object.applicationId !== data.applicationId
          )
          this.$emit('newApplication',res.data.newApplication)
        })
        .catch(err =>{
          console.log(err)
        })
    },
    getMyDeclinedApplies(){
      this.$watch('store.myAccFromDb',(newVal) => {
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check){
            const id = newVal._id
            console.log(id)
            this.store.getMyDeclinedsAppliesList(id)
          }
        }
      },{
        immediate:true, deep:true
      })
    }
  },
  created(){
    this.getMyDeclinedApplies()
  },
  watch:{
  }
}
</script>

<style>

</style>
