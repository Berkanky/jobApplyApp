const express = require('express');
const app = express.Router();
const CvModel = require('./schema')
const { v4: uuidv4 } = require('uuid');
const getCurrentDate = require('../dateJs')
const User = require('../auth/schema')
/* app.put('/sendMyCv',async(req,res) => {
    try{
        const newData = req.body.myCv
        Object.assign(newData,{
            applicationId:uuidv4(),
            applicationDate:getCurrentDate(),
        })
        const checkForAddedCvFile = newData.hasOwnProperty('selectedCv')
        if(checkForAddedCvFile){
            Object.assign(newData.selectedCv,{
                fileId:uuidv4(),
                date:getCurrentDate()
            })
        }

        const checkFirst = await CvModel.findOne({email : newData.email})
        if(!checkFirst){
            const newCvModel = new CvModel(newData)
            await newCvModel.save()
            res.status(200).json({newCvModel})
        }else{
            Object.assign(checkFirst,newData,{
                _id:checkFirst._id,
                applicationId:checkFirst.applicationId,
                applierFirebaseId:checkFirst.applierFirebaseId ?? '',
                applierId:checkFirst.applierId ?? ''
            })
            await checkFirst.save()
            res.status(200).json({checkFirst})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
}) */


app.put('/sendMyCv',async(req,res) => {
    try{
        const newData = req.body.myCv
        Object.assign(newData,{
            applicationId:uuidv4(),
            applicationDate:getCurrentDate(),
            status:1
        })
        const checkForAddedCvFile = newData.hasOwnProperty('selectedCv')
        if(checkForAddedCvFile){
            Object.assign(newData.selectedCv,{
                fileId:uuidv4(),
                date:getCurrentDate()
            })
        }
        const newCvModel = new CvModel(newData)
        await newCvModel.save()
        res.status(200).json({newData})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


app.get('/:firebaseId/getMyApplies',async(req,res) => {
    const {firebaseId} = req.params
    try{
/*           let myapplies = allApplies.filter(
                object => String(object.applierFirebaseId) === String(firebaseId)
            ) */
        let allApplies = await CvModel.find()
        if(allApplies.length > 0 ){
            let myapplies = allApplies.filter(
                object => {
                    const checkFireBaseId = String(object.applierFirebaseId) === String(firebaseId)
                    const checkConfirmed = object.confirmedStatus !== true
                    return checkFireBaseId && checkConfirmed
                }
            )
            res.status(200).json({
                myapplies
            })
        }else{
            res.status(200).json({message:'No Any Applies'})
        }
    }catch(err){
        res.status(500).json({message:'Intenral Server Error'})
    }
})


app.put('/:firebaseId/:jobApplyId/removeSelected',async(req,res) => {
    const {firebaseId, jobApplyId} = req.params
    try{
        const findapply =  await CvModel.findOneAndRemove(
            {_id : jobApplyId}
        )
        res.status(200).json({findapply})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})

app.get('/:jobApplyId/getDetail',async(req,res) => {
    const {jobApplyId} = req.params
    try{
        const findedapply = await CvModel.findOne({_id : jobApplyId})
        if(findedapply){
            res.status(200).json({findedapply})
        }
    }catch(err){    
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:firebaseId/checkForAdmin',async(req,res) => {
    const {firebaseId} = req.params
    try{

        const mainAdminDetail = {
            email:'yusufbk92@gmail.com'
        }
        const findme = await User.findOne({fireBaseId : firebaseId})
        if(findme){
            const checkForAdmin = String(findme.email) === String(mainAdminDetail.email) || findme.adminStatus === true ? true : false
            if(checkForAdmin){
                res.status(200).json({active:true,message:'Please wait, ...'})
            }else{
                res.status(200).json({active:false,message:'You Dont Have Any Perrmission!'})
            }
        }else{
            res.status(200).json({message:'User Not Found'})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})

module.exports = app