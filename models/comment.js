const {Schema,model}=require("mongoose");

const commentSchema=new Schema({
    comment:{
        type:String,
        require:true,
    },
    blogId:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:'blog',
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required: true, // Ensure createdBy is required
    },


},
{timestamps:true});

const Comment=model('comment',commentSchema);
module.exports=Comment;