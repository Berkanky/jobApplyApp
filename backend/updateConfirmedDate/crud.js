const express = require('express');
const app = express.Router();
const User = require('../auth/schema')
const CvModel = require('../application/schema')
const MyNotifies = require('../notify/schema')


app.put('/:currentUserId/:selectedApplyId/updateDate',async(req,res) => {
    const {currentUserId, selectedApplyId} = req.params
    try{
        const selectedApplyDetail = req.body.selectedApplyDetail
        const newDateData = req.body.newDateData
        const resBody = {}

        Object.assign(resBody,{
            currentUserId,selectedApplyId,selectedApplyDetail
        })

        const findusernotify = await MyNotifies.findOne({userId : selectedApplyDetail.applyDetail.applierId})
        if(findusernotify){
            const findapply = findusernotify.appliesNotifies.find(
                object => String(object.applicationId) === String(selectedApplyDetail.applyDetail.applicationId)
            )
            if(findapply){
                const check = 'meetingDetail' in findapply
                if(check === true){
                    Object.assign(findapply,{
                        meetingDetail:newDateData
                    })
                }

                findusernotify.markModified('appliesNotifies')
                await findusernotify.save()
                Object.assign(resBody,{
                    findusernotify,findapply,newDateData
                })
            }
        }

        const update = {
            updatedDate:new Date().toLocaleString(),
        }
        const filter = {applicationId : selectedApplyDetail.applyDetail.applicationId}

        const findandupdate = await CvModel.findOneAndUpdate(filter,update)

        Object.assign(resBody,{
            findandupdate
        })

        res.status(200).json({resBody})
    }catch(err){
        res.status(500).json({messagge:'Internal Server err'})
    }
})


module.exports = app