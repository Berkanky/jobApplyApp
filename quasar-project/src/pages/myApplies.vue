<template>
  <q-page class="bg-grey-1">
    <div
      style="margin:0 auto;"
      :style="{
        'width':this.store.mobileActive ? '100%' : '900px'
      }"
      class="">
      <q-card
        class="bg-grey-2"
      >
        <q-card-section>
          <q-item clickable v-ripple v-on:Click="hideLeftBar">
              <q-item-section avatar>
                <q-icon :name="this.leftBarActive ? 'arrow_left' : 'arrow_right'"></q-icon>
              </q-item-section>
              <q-item-section>
                {{ this.leftBarActive ? 'Hide' : 'Show' }}
              </q-item-section>
            </q-item>
        </q-card-section>
        <q-separator size="2px"></q-separator>
        <q-card-section horizontal>
          <transition-group appear enter-active-class="animated fadeInLeft slower" leave-active-class="animated fadeOutRight slower">
            <q-card-section
              style="border-right: 0.1px solid rgb(179, 177, 177);"
              class="col-3" v-if="this.leftBarActive">
            <q-list
              padding>
              <q-item
                :class="this.checkSelectedOption(data)"
                v-on:Click="selectOption(data)"
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
            <q-scroll-area
              :style="{
                'height':(this.$q.screen.height/1.5) + 'px'
              }"
            >
            <myApplies
              v-if="this.selectedOption.id === 1"/>
            <myDeclinedsList
              @newApplication="getnewApplication"
              v-if="this.selectedOption.id === 2"/>
            <myConfirmeds
              v-if="this.selectedOption.id === 4"
            />
          </q-scroll-area>
          </q-card-section>
        </q-card-section>
  <!--       <q-card-section class="text-right">
          <q-btn
            icon="arrow_left"
            color="grey" round
            v-on:click="this.store.myAppliesPageNumber = this.store.myAppliesPageNumber - 1"
            v-if="this.store.myAppliesPageNumber > 0"></q-btn>
          <q-btn icon="arrow_right" color="dark" round v-on:click="this.store.myAppliesPageNumber = this.store.myAppliesPageNumber + 1"></q-btn>
        </q-card-section> -->
      </q-card>
    </div>
  </q-page>
</template>

<script>
import myConfirmeds from 'src/components/myConfirmeds.vue';
import myDeclinedsList from 'src/components/myDeclinedsList.vue';
import myApplies from 'src/components/myApplies.vue';
import { useCounterStore } from 'src/stores/store';
export default {
  components:{
    myApplies,
    myDeclinedsList,
    myConfirmeds
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
      options:[
        {id:1,label:'Applies',icon:'filter_list'},
        {id:2,label:'Declineds',icon:'clear_all'},
        {id:3,label:'Pendings',icon:'hourglass_top'},
        {id:4,label:'Meetings',icon:'group'}
      ],
      selectedOption:{
        id:1,label:'Applies',icon:'filter_list'
      },
      appliesList:[]
    }
  },
  methods:{
    getnewApplication(data){
      if(data){
        this.appliesList.push(data)
      }
    },
    hideLeftBar(){
      this.leftBarActive =! this.leftBarActive
    },
    checkSelectedOption(data){
      const check = this.selectedOption.hasOwnProperty('id')
      if(check){
        if(data.id === this.selectedOption.id){
          return 'bg-grey-8 text-white'
        }else{
          return ''
        }
      }else{
        return ''
      }
    },
    selectOption(data){
      this.selectedOption = data
    }
  },
  watch:{
  }
}
</script>

<style>

</style>
