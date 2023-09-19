<template>
  <q-card
    v-for="(data,key) in this.allUsersList" :key="key"
    class="my-card" flat bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img
              style="object-fit:cover;"
              :src="data.userImage ?? data.googleImage" v-if="data.userImage || data.googleImage">
            <q-btn icon="person" color="dark" round></q-btn>
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{data.email ?? ''}}</q-item-label>
          <q-item-label caption>
            <q-btn icon="fiber_manual_record" :color="data.active === true ? 'green-4' :'red-4'" flat>
              <q-tooltip>{{data.active === true ? 'Active' : 'InActive'}}</q-tooltip>
            </q-btn>
          </q-item-label>
          <q-item-label caption>
            <q-icon name="event"></q-icon>
            {{ data.createdDate ?? '' }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-separator />

      <q-card-section horizontal>
        <q-card-section class="col">
          {{ data.userDescription ?? 'No Description' }}
        </q-card-section>

        <q-separator vertical />

        <q-card-section class="col-4">
          <q-btn
            v-on:click="updateAdminStatus(data)"
            icon="admin_panel_settings" flat :color="this.checkForAdminStatus(data) ? 'green-4' : 'red-4'">
            <q-tooltip>
              {{ this.checkForAdminStatus(data) ?  'Remove Admin Permission' : 'Give Admin Permission' }}
            </q-tooltip>
          </q-btn>
        </q-card-section>
      </q-card-section>
    </q-card>
</template>

<script>
import axios from 'axios'
import {useCounterStore} from '../stores/store'
export default {
  props:['allUsers'],
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      allUsersList:[]
    }
  },
  methods:{
    updateAdminStatus(data){
      const id  = data._id
      axios.put(`${this.store.baseUrl}/fileconverter/${id}/updateAdminPermission`)
        .then(res => {
          console.log(res)
          const updateuser = this.store.allUsersList.find(
            object => object._id === data._id
          )
          if(updateuser){
            Object.assign(updateuser,res.data.finduser)
          }
          const check = updateuser.hasOwnProperty('adminStatus')
          if(check){
            console.log('burda aq')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    checkForAdminStatus(data){
      const check = data.hasOwnProperty('adminStatus')
      if(check){
        const secCheck = data.adminStatus === true ? true : false
        if(secCheck){
          return true
        }else{
          return false
        }
      }else{
        return false
      }
    }
  },
  watch:{
    allUsers:{
      handler(newVal,oldVal){
        if(newVal){
          this.allUsersList = newVal
          console.log('allUsersList',this.allUsersList)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
