<template>
  <q-card
    v-for="(data,key) in this.appliesList" :key="key"
    class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              style="object-fit:cover;"
              :src="data.applyDetail.profileImage"
              v-if="data.applyDetail.profileImage">
            <q-btn v-else icon="person" color="dark" round></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>@{{data.userDetail.email}}</q-item-label>
          <q-item-label caption>
            {{data.userDetail.name ?? ''}}, {{ data.userDetail.surName ?? '' }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.applyDetail.description ?? 'No Description' }}
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-4 q-pa-sm" horizontal>
          <q-btn icon="info" flat color="green-4" class="col" v-on:click="goSelectedApply(data)"></q-btn>
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
      appliesList:[]
    }
  },
  methods:{
    updateStatusWhenClicked(data){
      const id = data.applyDetail._id
      axios.put(
        `${this.store.baseUrl}/fileconverter/${id}/updateStatus`
      )
        .then(
          res => {
            console.log(res)
            const result = this.store.allAppliesList.find(
              object => object._id === data._id
            )
            if(result){
              Object.assign(result,res.data.findapply)
            }
          }
        )
        .catch(
          err => {
            console.log(err)
          }
        )
    },
    goSelectedApply(data){
      console.log('adminPanelApplies',data)
      this.updateStatusWhenClicked(data)
      const id = data.applyDetail._id
      this.store.adminPanelSelectedApply = data
      this.store.adminPanelApplyDetailActive =! this.store.adminPanelApplyDetailActive
    },
    getAppliesFunction(){
      this.store.getAllApplies()
    }
  },
  created(){
    this.getAppliesFunction()
  },
  watch:{
    'store.allAppliesList':{
      handler(newVal,oldVal){
        if(newVal){
          this.appliesList = newVal
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
