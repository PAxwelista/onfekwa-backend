var express = require('express');
var router = express.Router();

const Partner = require("../models/partners")

// Récupère tous les partenaires
router.get("/" , (req,res)=>{
    Partner.find().then(data=>{
        res.json({result : true , partners : data})
    })
    
})

module.exports = router;
