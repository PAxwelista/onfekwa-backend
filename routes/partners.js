var express = require('express');
var router = express.Router();

const Partner = require("../models/partners")

// Récupère tous les partenaires
router.get("/" , (req,res)=>{
    Partner.find().then(data=>{
        res.json({result : true , partners : data})
    })
    
})

// Récupère les partenaires filté par type d'evenement 
    //(utile pour filter dans tous les evenements)
router.get("/filter/:filterType" , (req, res) => {
    const filterType = req.params.filterType;

    Partner.find({filterTypes: filterType})
    .then(data => {
        res.json({ result: true, partners: data})
    });
});

//Récupère tous les filterType de tous les partenaires
    //(En supprimant les doublons)
router.get("/filterTypes", (req, res) => {

    Partner.find({}, "filterTypes")
    .then(data => {
        console.log("data", data)

        const allFilterTypes = data.flatMap(partner => partner.filterTypes);
        const finalFilterTypes = [...new Set(allFilterTypes)];

        res.json({result: true, filterTypes: finalFilterTypes});
    });
});


module.exports = router;
