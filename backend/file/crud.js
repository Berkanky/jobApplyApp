const express = require('express');
const app = express.Router();




const convertfile = (selectedFile) => {
}


app.put('/converFile',async (req,res) => {
    try{
        const selectedFile = req.body.selectedFile
        res.status(200).json({selectedFile})
    }catch(err){
        res.status(500).json({message:'Internal Server Err'})
    }
})




module.exports = app