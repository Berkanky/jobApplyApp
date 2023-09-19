const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const CvModel = require('../application/schema');
const MyNotifies = require('../notify/schema');


app.put('/getAppliesDetails',async(req,res) => {
    try{

        let updatedAllApplications = []

        let allUsersList= await User.find()
        let allApplications = await CvModel.find()

        if(allUsersList.length > 0 && allApplications.length > 0){
            allApplications.forEach(element => {
                const findUser = allUsersList.find(
                    object => String(object._id) === String(element.applierId)
                )
                if(findUser){
                    const newObject = {}
                    Object.assign(newObject,{
                        userDetail:findUser,
                        applyDetail:element
                    })
                    updatedAllApplications.push(newObject)
                }
            });


            updatedAllApplications.forEach(element => {
                const check = 'confirmedStatus' in element.applyDetail
                if(check){
                    if(element.applyDetail.confirmedStatus === true){
                        updatedAllApplications = updatedAllApplications.filter(
                            object => String(object.applyDetail.applicationId) !== String(element.applyDetail.applicationId)
                        )
                    }
                }
            });

            res.status(200).json({updatedAllApplications})
        }

    }catch(err){
        res.status(500).json({message:'Internal SErver ERror'})
    }
})

app.put('/:jobApplyId/updateStatus',async(req,res) => {
    const {jobApplyId} = req.params
    try{
        const findapply = await CvModel.findOne({_id : jobApplyId})
        if(findapply){
            const check = 'status' in findapply
            if(check){
                const secCheck = Number(findapply.status) === 1 ? true : false
                if(secCheck === true){
                    const checkForViewedDate = 'firstViewedDate' in findapply
                    if(checkForViewedDate){
                        findapply.firstViewedDate = new Date().toLocaleString()
                    }else{
                        Object.assign(findapply,{
                            firstViewedDate:new Date().toLocaleString()
                        })
                    }
                    findapply.status = findapply.status + 1
                    await findapply.save()
                    res.status(200).json({findapply})
                }else{
                    res.status(200).json({message:'Already Seen'})
                }
            }else if(check === false){
                Object.assign(findapply,{
                    status:2,
                })
                const firstViewedDateCheck = 'firstViewedDate' in findapply
                if(firstViewedDateCheck){
                    findapply.firstViewedDate = new Date().toLocaleString()
                }else{
                    Object.assign(findapply,{
                        firstViewedDate: new Date().toLocaleString()
                    })
                }
                findapply.status = findapply.status + 1
                await findapply.save()
                res.status(200).json({findapply})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:jobApplyId/confirmApply',async(req,res) => {
    const {jobApplyId} = req.params
    try{
        const findapply = await CvModel.findOne(
            {_id : jobApplyId}
        )
        if(findapply){
            
        }

    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})




app.get('/:currentUserId/:selectedApplyId/getSelectedApplyDetail',async(req,res) => {
    const {currentUserId, selectedApplyId} = req.params
    try{
        const findapply = await CvModel.findOne({applicationId : selectedApplyId})
        if(findapply){
            res.status(200).json({findapply})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server  error'})
    }
})



app.put('/:currentUserId/:selectedApplyId/updateApply',async(req,res) => {
    const {currentUserId, selectedApplyId} = req.params
    try{
        const newApplyData = req.body.newApplyData
        Object.assign(newApplyData,{
            updatedDate:new Date().toLocaleString()
        })
        const findapply = await CvModel.findOne({applicationId : selectedApplyId})
        if(findapply){
            Object.assign(findapply,newApplyData)
            const check = 'confirmedStatus' in findapply
            if(check === true){
                const newVal = findapply.confirmedStatus === true ? false : false
                findapply.confirmedStatus = newVal
            }
        
            const firstViewedDateCheck = 'firstViewedDate' in findapply
            if(firstViewedDateCheck){
                findapply.firstViewedDate = ''
            }

            const checkStatus = 'status' in findapply
            if(checkStatus){
                const newStatusVal = Number(findapply.status) === 3 ? 1 : 1
                findapply.status = newStatusVal 
            }

            await findapply.save()

            const findusernotifies = await MyNotifies.findOne({userId : findapply.applierId})
            if(findusernotifies){
                const checkAppliesNotifies = findusernotifies.appliesNotifies.some(
                    object => String(object.applicationId) === String(findapply.applicationId)
                )
                if(checkAppliesNotifies){
                    findusernotifies.appliesNotifies = findusernotifies.appliesNotifies.filter(
                        object => String(object.applicationId) !== String(findapply.applicationId)
                    )
    
                    findusernotifies.markModified('appliesNotifies')
                    await findusernotifies.save()
                }
            }

            res.status(200).json({findapply,findusernotifies})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.put('/:currentUserId/:selectedApplyId/removeMeeting',async(req,res) => {
    
    const {currentUserId, selectedApplyId} = req.params
    try{
        const currentDate = new Date().toLocaleString()

        const findapply = await CvModel.findOne({applicationId : selectedApplyId})
        if(findapply){
            const check = 'updatedDate' in findapply
            if(check === true){
                findapply.updatedDate = currentDate
            }else{
                Object.assign(findapply,{
                    updatedDate:currentDate
                })
            }

            Object.assign(findapply,{
                confirmedStatus:false,
                declinedStatus:false,
                status:2,
            })

            await findapply.save()


            const mynotifies = await MyNotifies.findOneAndUpdate(
                {userId : currentUserId},
                {$pull : {appliesNotifies : {applicationId : selectedApplyId}}}
            )

            res.status(200).json({findapply,mynotifies})
        }

    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



module.exports = app