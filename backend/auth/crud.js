const express = require('express');
const app = express.Router();
const User = require('./schema')
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const MyNotifies = require('../notify/schema')

const sendEmailFunction = (allBody) => {

    const newBody = {}
    const currentDate = new Date().toLocaleString()
    const randomId = uuidv4()
    const textVal = 'Please Copy UID and Enter in Client -> '
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yusufbk92@gmail.com',
          pass: 'nyfiapkrazpbbgto'
        }
      });
      var mailOptions = {
        from: 'yusufbk92@gmail.com',
        to: allBody.email,
        subject: 'Signup Vertification Code',
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
        vertificationId:randomId,
        textVal:textVal,
        toEmail: allBody.email,
        currentDate:currentDate
    })
    return newBody
}

app.put('/vertificationCode',async(req,res) => {
    try{
        const allBody = req.body
        const newBody = sendEmailFunction(allBody)
        res.status(200).json({newBody})
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.put('/:firebaseId/login',async(req,res) => {
    const {firebaseId} = req.params
    try{
        const googleData = req.body.googleData
        const newLoginData = {
            email:googleData.email,
            fireBaseId:googleData.uid,
            googleImage:googleData.photoURL ?? '',
            lastLoginDate:new Date().toLocaleString(),
            loginType:'google',// silebilirsin
            active:true,
            uniqueId:uuidv4()
        }
        const myacc = await User.findOne({fireBaseId : firebaseId})
        if(!myacc){
            const newacc = new User(newLoginData)
            await newacc.save()
        } 
        else{
            myacc.active = false
            myacc.lastLoginDate = new Date().toLocaleString()
            await myacc.save()
        } 
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})


app.get('/:firebaseId/getMyAcc',async(req,res) => {
    const {firebaseId} = req.params
    const allBody = {
        firebaseId
    }
    try{
        const myacc = await User.findOne({fireBaseId : firebaseId})
        if(myacc){
            res.status(200).json({myacc})
        }else{
            res.status(200).json({message:'Not Found'})
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})



app.get('/:firebaseId/getAllUsers',async(req,res) => {
    const {firebaseId} = req.params
    try{
        let allUsersList = await User.find()
        if(allUsersList.length > 0 ){
            allUsersList = allUsersList.filter(
                object => String(object.fireBaseId) !== String(firebaseId)
            )
            res.status(200).json({allUsersList})
        }else{
            res.status(200).json({message:'No User List',allUsersList:[]})
        }
    }catch(err){
        res.status(500).json({messge:'Internal Server Error'})
    }
})


app.put('/:selectedUserId/updateAdminPermission',async(req,res) => {
    const {selectedUserId} = req.params
    try{
        let allUsersList = await User.find()
        if(allUsersList.length > 0 ){
            const finduser = allUsersList.find(
                object => String(object._id) === String(selectedUserId)
            )
            if(finduser){
               const check = 'adminStatus' in finduser;
               // const check = finduser.hasOwnProperty('adminStatus')
                if(check === true){
                    finduser.adminStatus =! finduser.adminStatus
                }else if(check === false){
                    Object.assign(finduser,{
                        adminStatus:true
                    })
                }   
                await finduser.save()
                res.status(200).json({finduser})
            }
        }
    }catch(err){
        res.status(500).json({message:'Internal Server Error'})
    }
})





module.exports = app