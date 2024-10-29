const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    email : String,
    phoneNumber : String,
});

const coordinateSchema = mongoose.Schema({
    lat : Number,
    long : Number,
});

const addressSchema = mongoose.Schema({
    adress : String,
    zipCode : Number,
    city : String,
    coordinate : coordinateSchema,
});

const hoursOpeningSchema = mongoose.Schema({
    openTime: Date,
    closingTime: Date
});

const openingInfoSchema = mongoose.Schema({
    monday : [hoursOpeningSchema],
    tuesday : [hoursOpeningSchema],
    wednesday : [hoursOpeningSchema],
    thursday : [hoursOpeningSchema],
    friday : [hoursOpeningSchema],
    saturday : [hoursOpeningSchema],
    sunday : [hoursOpeningSchema],
});

const partersSchema = mongoose.Schema({
    name : String,
    category : String,
    description : String,
    averagePrice:Number,
    averageNote : Number,
    filterTypes : [String],
    urlsPhotos : [String],
    infosAdds : [String],
    contact : contactSchema,
    adress : addressSchema,
    openingInfos : openingInfoSchema,

});

const Partner = mongoose.model("partners",partersSchema);

module.exports = Partner;