const express = require('express');
const app = express.Router();
const MyNotifies = require('./schema')
const CvModel = require('../application/schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const User = require('../auth/schema')


const sendEmailFunction = (sendBody) => {
    const newBody = {}
    const currentDate = new Date().toLocaleString()
    const randomId = uuidv4()
    const textVal = 'Your Appliaction Confirmed '
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yusufbk92@gmail.com',
          pass: 'nyfiapkrazpbbgto'
        }
      });
      var mailOptions = {
        from: 'yusufbk92@gmail.com',
        to: sendBody.userDetail.email,
        subject: `#${sendBody.applyDetail._id} Application Form`,
        html: `
            <div style="display: flex;justify-content: space-between;">
                <div>${textVal}</div>
                <a style="font-weight:bold;text-decoration:none;margin-left:5%;">${randomId}</a>
            </div>
            <div>${currentDate}</div>
        `
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

    Object.assign(newBody,{
        textVal:textVal,
        toEmail: sendBody.email,
        currentDate:currentDate
    })
}


/*           mynotifies.welcomeMessage.push(newData)
            await mynotifies.markModified('welcomeMessage')
            await mynotifies.save() */


app.put('/:currentUserId/sendWelcomeMessage',async(req,res) => {
    const {currentUserId} = req.params
    try{
        const newData = {message:'Welcome',currentDate:new Date().toLocaleString()}
        const allBody = req.body
        const mynotifies = await MyNotifies.findOne({userId :currentUserId })
        if(mynotifies){
            const check = mynotifies.welcomeMessage.length > 0 ? true : false
            if(check === true){
                Object.assign(mynotifies.welcomeMessage[0],newData)
            }else{
                mynotifies.welcomeMessage[0] = newData
            }
            mynotifies.markModified('welcomeMessage')
            await mynotifies.save()
            res.status(200).json({mynotifies})
        }else{
            const setNewUser = await MyNotifies.findOneAndUpdate(
                {userId : currentUserId},
                {$push : {welcomeMessage : newData}},
                {new:true,upsert:true}
            )
            res.status(200).json({setNewUser})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server  Error'})
    }
})



const updateApplyDetails = (sendBody) => {
    const findapply = sendBody.allAppliesList.find(
        object => String(object._id) === String(sendBody.selectedApplyId)
    )
    if(findapply){
        const check = 'status' in findapply
        if(check){
            const secCheck = Number(findapply.status) < 3 ? true : false
            if(secCheck === true){
                findapply.status = findapply.status + 1
            }
        }else{
            Object.assign(findapply,{
                status:3
            })
        }


        const checkForConfirmedStatus = 'confirmedStatus' in findapply
        if(checkForConfirmedStatus){
            findapply.confirmedStatus = true
        }else{
            Object.assign(findapply,{
                confirmedStatus:true
            })
        }


        const checkForDeclinedStatus = 'declinedStatus' in findapply
        if(checkForDeclinedStatus){
            const newVal = findapply.declinedStatus === true ? false : false
            findapply.declinedStatus = newVal
        }else{
            Object.assign(findapply,{
                declinedStatus:false
            })
        }



        return findapply
    }
}

app.put('/:selectedUserId/:selectedApplyId/sendNotify',async(req,res) => {
    const {selectedUserId, selectedApplyId} = req.params
    try{
        let allAppliesList = await CvModel.find()

        if(allAppliesList.length > 0){
            const sendBody = {selectedUserId,selectedApplyId,allAppliesList}

            const allBody = req.body
    
            const newData = allBody.applyDetail
    
            Object.assign(newData,{
                currentDate:new Date().toLocaleString()
            })
            
            const sendingData = {
                applicationId:newData.applicationId,
                applyDetail:newData,
                meetingDetail:allBody.dateData
            }

            const finduser = await MyNotifies.findOne({userId : selectedUserId})
            if(!finduser){
                const finduser = await MyNotifies.findOneAndUpdate(
                    {userId : selectedUserId},
                    {$push : {appliesNotifies: sendingData}},
                    {new:true,upsert:true}
                )
                res.status(200).json({finduser})
            }else{
                const result = finduser.appliesNotifies.find(
                    object => String(object.applicationId) === String(sendingData.applicationId)
                )
                if(!result){
                    finduser.appliesNotifies.push(sendingData)
                }else{
                    Object.assign(result,sendingData)
                }
                
                //finduser.appliesNotifies.push(newData)
                finduser.markModified('appliesNotifies')
                const findapply = updateApplyDetails(sendBody)
                await findapply.save()
                await finduser.save()

                Object.assign(sendBody,{
                    userDetail:allBody.userDetail,
                    applyDetail:allBody.applyDetail
                })
                sendEmailFunction(sendBody)
                res.status(200).json({finduser, findapply})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.put('/:adminId/:selectedUserId/:selectedApplyId/declineApply',async(req,res) => {
    const {adminId, selectedUserId, selectedApplyId} = req.params
    try{

        const reqBody = {}

        const allBody = {adminId, selectedUserId, selectedApplyId}
        const selectedData = req.body.selectedData

        const declinedDetail = {
            currentDate:new Date().toLocaleString(),
            message:'Declined',
            declinedDetailId:''
        }
        Object.assign(selectedData,{
            declinedDetail:declinedDetail,
            applicationId:selectedData.applyDetail.applicationId,
            currentDate:new Date().toLocaleString()
        })

        const filter = {applicationId:selectedData.applyDetail.applicationId}
        const update = {declinedStatus : true, confirmedStatus : false}

        const findapply = await CvModel.findOneAndUpdate(filter,update)

        const findusernotifies = await MyNotifies.findOne({userId : selectedData.applyDetail.applierId})
        if(findusernotifies){
            const check = findusernotifies.appliesNotifies.some(
                object => String(object.applicationId) === String(selectedData.applyDetail.applicationId)
            )
            if(check){
                findusernotifies.appliesNotifies = findusernotifies.appliesNotifies.filter(
                    object => String(object.applicationId) !== String(selectedData.applyDetail.applicationId)
                )
                findusernotifies.markModified('appliesNotifies')
                await findusernotifies.save()
                Object.assign(reqBody,{
                    findapply,findusernotifies
                })
            }
        }
        res.status(200).json({reqBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:currentUserId/getMyDeclinedApplies',async(req,res) => {
    const {currentUserId} = req.params
    try{
        const mynotifies = await MyNotifies.findOne({userId : currentUserId})
        if(mynotifies){
            let declinedAppliesList = []
            mynotifies.myDeclineds.forEach(element => {
                const newObject = element.applyDetail
                const check = 'currentDate' in element
                if(check){
                    Object.assign(newObject,{
                        declinedDate:element.currentDate
                    })   
                }
                declinedAppliesList.push(newObject)
            });
            res.status(200).json({declinedAppliesList,mynotifies})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



//resend Apply

app.put('/:currentUserId/:selectedApplicationId/reSendApply',async(req,res) => {
    const {currentUserId, selectedApplicationId} = req.params
    try{
        const selectedApply = req.body.selectedApply


        delete selectedApply._id
        delete selectedApply.firstViewedDate

        Object.assign(selectedApply,{
            applicationId:uuidv4(),
            confirmedStatus:false,
            declinedStatus:null,
            status:1,
            applicationDate:new Date().toLocaleString()
        })

        const newApplication = new CvModel(selectedApply)
        await newApplication.save()


        const myNotifies = await MyNotifies.findOne({userId : currentUserId})
        if(myNotifies){
            myNotifies.myDeclineds = myNotifies.myDeclineds.filter(
                object => String(object.applicationId) !== String(selectedApplicationId)
            )
            myNotifies.markModified('myDeclineds')
            await myNotifies.save()
        }
        res.status(200).json({newApplication, myNotifies})

    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



app.put('/:currentUserId/getMyConfirmeds',async(req,res) => {
    const {currentUserId} = req.params
    try{
        let allCvs = await CvModel.find()
        let allUsersList = await User.find()
        if(allUsersList.length > 0 && allCvs.length > 0){
            
            const mynotifies =  await MyNotifies.findOne({userId : currentUserId})
            if(mynotifies){
                let myConfirmedApplies = []

                mynotifies.appliesNotifies.forEach(element => {
                    const newData = {}


                    const findLatestApply = allCvs.find(
                        object => String(object.applicationId) === String(element.applyDetail.applicationId)
                    )

                    const newApplyDetail = findLatestApply

                    const finduserDetail = allUsersList.find(
                        object => String(object._id) === String(element.applyDetail.applierId)
                    )
                    if(finduserDetail){
                        Object.assign(newApplyDetail,{
                            userDetail:finduserDetail
                        })
                    }

                    Object.assign(newData,{
                        applyDetail:newApplyDetail,
                        meetingDetail:element.meetingDetail
                    })
                    myConfirmedApplies.push(newData)

                });

                res.status(200).json({myConfirmedApplies})

            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})


const getAllConfirmedsMeetingDetails = (allBody) => {
    let newList = []
    allBody.confirmedsList.forEach((element) => {
        const findusernotifies = allBody.allMyNotifies.find(object => String(object.userId) === String(element.applyDetail.applierId))
        if(findusernotifies){
            const findapply = findusernotifies.appliesNotifies.find(
                object => String(object.applicationId) === String(element.applyDetail.applicationId)
            )
            if(findapply){
                const check = 'meetingDetail' in findapply
                if(check === true){
                    Object.assign(element,{
                        meetingDetail:findapply.meetingDetail
                    })

                    newList.push(element)

                }
            }
        }
    });
    return newList
}

app.get('/:currentAdminId/getAllConfirmeds',async(req,res) => {
    const {currentAdminId} = req.params
    try{
        let allUsersList = await User.find()
        let allAppliesList = await CvModel.find()
        let allMyNotifies = await MyNotifies.find()
 

        if(allAppliesList.length > 0 && allUsersList.length > 0 && allMyNotifies.length > 0){
            const allBody = {
                allUsersList,allAppliesList,allMyNotifies
            }

            let confirmedsList = []
            allAppliesList.forEach((element) => {
                const newObject = {}
                const check = 'confirmedStatus' in element
                if(check === true){
                    if(element.confirmedStatus === true){
                        const result = allUsersList.find(
                            object => String(object._id) === String(element.applierId)
                        )
                        if(result){
                            Object.assign(newObject,{
                                appliedUserDetail:result,
                                applyDetail:element
                            })
                            confirmedsList.push(newObject)
                        }
                    }
                }
            });
            Object.assign(allBody,{
                confirmedsList
            })
            confirmedsList = getAllConfirmedsMeetingDetails(allBody)
            res.status(200).json({confirmedsList,allUsersList})

        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:currentAdminId/removeConfirmedApplication',async(req,res) => {
    const {currentAdminId} = req.params
    try{
        const allBody = req.body
        const resBody = {}
        const findapply = await  CvModel.findOne({applicationId : allBody.applyDetail.applicationId})
        if(findapply){
            const check = 'confirmedStatus' in findapply
            if(check === true){
                findapply.confirmedStatus = false
            }else{
                Object.assign(findapply,{
                    confirmedStatus:false
                })
            }

            Object.assign(findapply,{
                declinedStatus:false,
                updatedDate:new Date().toLocaleString(),
                status:2
            })

            Object.assign(resBody,{
                findapply:findapply
            })

            await findapply.save()
            
            const selectedapplyusernotifies = await MyNotifies.findOne({userId : allBody.applyDetail.applierId})
            if(selectedapplyusernotifies){
                const findapply = selectedapplyusernotifies.appliesNotifies.find(
                    object => String(object.applicationId) === String(allBody.applyDetail.applicationId)
                )
                if(findapply){
                    selectedapplyusernotifies.appliesNotifies = selectedapplyusernotifies.appliesNotifies.filter(
                        object => String(object.applicationId) !== String(allBody.applyDetail.applicationId)
                    )
                    selectedapplyusernotifies.markModified('appliesNotifies')
                    await selectedapplyusernotifies.save()
                
                    Object.assign(resBody,{
                        selectedapplyusernotifies:selectedapplyusernotifies
                    })
                }
            }
            
            res.status(200).json({resBody})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})



module.exports = app