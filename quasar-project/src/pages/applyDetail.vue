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
          <q-card-section horizontal>
            <q-card-section
              style="border-right:0.1px solid rgb(206, 204, 204)"
              class="col-4">
              <q-stepper
                flat
                v-model="step"
                vertical
                color="primary"
                animated
              >
                <q-step
                  :name="1"
                  title="
                    Application Sended."
                  icon="info"
                  color="green-4"
                  :done="this.step > 1"
                >
                  Application Maded
                </q-step>

                <q-step
                  :name="2"
                  title="Application Viewed"
                  caption="Optional"
                  icon="info"
                  :done="step > 2"
                >
                  <div>
                    Application viewed.
                  </div>
                  <div class="text-weight-bold text-grey-6">
                    <q-icon name="event" color="grey-5"></q-icon>
                    {{ this.selectedApply.firstViewedDate ?? '' }}
                  </div>
                  <q-stepper-navigation>
                  </q-stepper-navigation>
                </q-step>

                <q-step
                  :name="3"
                  title="Application Status"
                  icon="assignment"
                  :done="step > 3"
                >
                  This step won't show up because it is disabled.
                </q-step>
              </q-stepper>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
  </q-page>
</template>

<script>
import {useCounterStore} from '../stores/store'
export default {
  setup(){
    const store = useCounterStore()
    return{
      store
    }
  },
  data:function(){
    return{
      currentRouterDetails:{},
      selectedApply:{},
      step:null
    }
  },
  methods:{

  },
  created(){

  },
  watch:{
    'store.selectedApplyDetail':{
      handler(newVal,oldVal){
        if(newVal){
          const check = newVal.hasOwnProperty('_id')
          if(check){
            this.selectedApply = newVal
            const check = this.selectedApply.hasOwnProperty('status')
            if(check){
              this.step = this.selectedApply.status
              console.log('step',this.step)
            }
            console.log('selectedApply',this.selectedApply)
          }
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
          const jobApplyId = to.params.id
          this.store.getSelectedApplyDetail(jobApplyId)
        }
      },
      immediate:true,deep:true
    }
  }
}
</script>

<style>

</style>
