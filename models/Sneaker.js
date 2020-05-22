const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sneakerSchema = new Schema({
    name: String,  
    ref: String,  
    size: Number,  
    description: String,  
    price: Number,  
    category: String,  
    id_tags: Number
})

const sneakerModel = mongoose.model("Sneaker", sneakerSchema);
module.exports = sneakerModel;