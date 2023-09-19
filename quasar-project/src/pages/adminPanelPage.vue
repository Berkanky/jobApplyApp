<template>
  <q-page>

    <div
      style="margin:0 auto;"
      :style="
        {
          'width':this.store.mobileActive ? '100%' : '950px'
        }
      "
      class="">
        <q-card>
          <q-card-section>
            <q-btn
              v-on:click="this.leftBarActive =! this.leftBarActive"
              no-caps
              :label="this.leftBarActive ? 'Hide Options' : 'Show Options'"
              :icon="this.leftBarActive ? 'arrow_left' : 'arrow_right'" flat color="dark"
            ></q-btn>
          </q-card-section>
          <q-separator size="2px"></q-separator>
          <q-card-section horizontal>
            <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutLeft slower">
              <q-card-section class="col-3" v-if="this.leftBarActive">
                <q-list
                  padding>
                  <q-item
                    v-on:Click="selectOption(data)"
                    :class="this.checkSelectedOption(data)"
                    v-for="(data,key) in this.options" :key="key"
                    clickable v-ripple>
                    <q-item-section avatar>
                      <q-icon :name="data.icon" />
                    </q-item-section>
                    <q-item-section>
                      {{data.label}}
                    </q-item-section>
                  </q-item>
              </q-list>
            </q-card-section>
            </transition-group>
            <q-card-section class="col">
              <adminPanelUsersListVue
                :allUsers="this.allUsers"
                v-if="this.selectedOption.id === 1"/>
              <adminPanelAppliesList
                v-if="this.selectedOption.id === 2"
              />
              <adminPanelConfirmeds v-if="this.selectedOption.id === 3"/>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <adminPanelApplyDetail
        v-if="this.store.adminPanelSelectedApply"/>
  </q-page>
</template>

<script>
import adminPanelConfirmeds from 'src/adminPanelComponents/adminPanelConfirmeds.vue';
import adminPanelApplyDetail from 'src/adminPanelComponents/adminPanelApplyDetail.vue';
import adminPanelAppliesList from 'src/adminPanelComponents/adminPanelAppliesList.vue';
import axios from 'axios'
import { useCounterStore } from 'src/stores/store';
import adminPanelUsersListVue from 'src/adminPanelComponents/adminPanelUsersList.vue';
export default {
  components:{
    adminPanelUsersListVue,
    adminPanelAppliesList,
    adminPanelApplyDetail,
    adminPanelConfirmeds
  },
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      leftBarActive:true,
      currentRouterDetails:{},
      options:[
        {id:1,label:'Users',icon:'group'},
        {id:2,label:'Applies',icon:'filter_list'},
        {id:3,label:'Confirmeds',icon:'groups'}
      ],
      selectedOption:{
        id:1,label:'Users',icon:'group'
      },
      allUsers:[]
    }
  },
  methods:{
    getAllUsersFunction(){
      this.$watch('store.firebaseInfoUser',(newVal,oldVal) => {
        if(newVal){
          const check = newVal.hasOwnProperty('uid')
          if(check){
            const id = newVal.uid
            this.store.getAllUsersList(id)
          }
        }
      })
    },
    selectOption(data){
      this.selectedOption = data
    },
    checkSelectedOption(data){
      const check = this.selectedOption.hasOwnProperty('id')
      if(check){
        if(this.selectedOption.id === data.id){
          return 'bg-grey-8 text-white'
        }else{
          return ''
        }
      }else{
        return ''
      }
    }
  },
  created(){
    this.getAllUsersFunction()
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const checkMyAcc = vm.store.myAccFromDb.hasOwnProperty('adminStatus')
      if(checkMyAcc){
        const secCheck = vm.store.myAccFromDb.adminStatus === true ? true : false
        if(!secCheck){
/*           vm.$router.replace(
            {
              path:`/`,
            }
          ) */
        }
      }
    })
  },
  watch:{
    'store.allUsersList':{
      handler(newVal,oldVal){
        if(newVal){
          this.allUsers = newVal
          console.log('allUsers',this.allUsers)
        }
      },
      immediate:true,deep:true
    },
    $route:{
      handler(to,from){
        console.log(to)
        const check = to.hasOwnProperty('params')
        if(check){
          this.currentRouterDetails = to
          console.log('currentRouterDetails',this.currentRouterDetails)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
