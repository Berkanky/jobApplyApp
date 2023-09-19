import { defineStore } from 'pinia';
import axios from 'axios';
export const useCounterStore = defineStore('counter', {
  state: () => ({
    myAppliesPageNumber:0,

    baseUrl:'http://localhost:3000',
    myAccFromDb:{},
    loginDialogActive:false,
    mobileActive:false,
    window:{},
    firebaseInfoUser:{},
    loginDialogCheckEmailActive:false,
    openCageApiKey:'a7ac3cc8ba514f0287f82a6a306eabc8',
    //myaplies
    myAllAppliesList:[],
    selectedApplyDetail:{},
    checkAdminDialogActive:false,
    checkingForAdminResult:{},
    allUsersList:[],
    allAppliesList:[],


    //adminPanel ApplyDetail
    adminPanelApplyDetailActive:false,
    adminPanelSelectedApply:{},
    dateDialogActive:false,

    //update ddate
    updateDateDialogActive:false,
    //MyDeclineds
    myDeclinedsList:[]
  }),
  getters: {
  },
  actions: {
    getMyDeclinedsAppliesList(id){
      axios.get(`${this.baseUrl}/fileconverter/${id}/getMyDeclinedApplies`)
        .then(res=>{
          console.log(res)
          this.myDeclinedsList = res.data.declinedAppliesList
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllApplies(){
      axios.put(`${this.baseUrl}/fileconverter/getAppliesDetails`)
        .then(res =>{
          console.log(res)
          this.allAppliesList = res.data.updatedAllApplications
        })
        .catch(err => {
          console.log(err)
        })
    },
    getAllUsersList(id){
      axios.get(`${this.baseUrl}/fileconverter/${id}/getAllUsers`)
        .then(res => {
          console.log(res)
          this.allUsersList = res.data.allUsersList
        })
        .catch(err => {
          console.log(err)
        })
    },
    getSelectedApplyDetail(jobApplyId){
      axios.get(`${this.baseUrl}/fileconverter/${jobApplyId}/getDetail`)
        .then(res => {
          console.log(res)
          this.selectedApplyDetail = res.data.findedapply
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyAppliesFunction(firebaseId){
      axios.get(`${this.baseUrl}/fileconverter/${firebaseId}/getMyApplies`)
        .then(res => {
          console.log(res)
          this.myAllAppliesList = res.data.myapplies
        })
        .catch(err => {
          console.log(err)
        })
    },
    sendMyCvFunction(allBody){
      axios.put(`${this.baseUrl}/fileconverter/sendMyCv`, allBody)
        .then(res => {
          console.log(res)
        })
        .catch(err =>{
          console.log(err)
        })
    },
    updateAccDataWhenGoogleLogin(firebaseId){
      const allBody = {
        googleData:this.firebaseInfoUser
      }
      axios.put(`${this.baseUrl}/fileconverter/${firebaseId}/login`, allBody)
        .then(res =>{
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getMyAcc(firebaseId){
      axios.get(`${this.baseUrl}/fileconverter/${firebaseId}/getMyAcc`)
        .then(res => {
          console.log(res)
          this.myAccFromDb = res.data.myacc
          console.log('myAccFromDb',this.myAccFromDb)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
});
