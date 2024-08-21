const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please, Provide Title for Post"],
    },
    category: {
      type: String,
      enum: [
        "Agriculture",
        "Business",
        "Education",
        "Entertainment",
        "Art",
        "Un-categorized",
        "Investment",
        "Weather"
      ],
      message: "Value is not Supported",
    },
    description: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },
    thumbnail: {
      type: String,
      required: true

    },
  },
  { timestamps: true }
);


module.exports=mongoose.model('Post', postSchema)