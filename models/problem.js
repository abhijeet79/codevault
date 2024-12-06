const mongoose=require('mongoose');

const problemSchema=mongoose.Schema({
    link:String,
    problem:String,
    solution:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
    // date:{
    //    type:Date,
    //    default:Date.now
    //}
});
module.exports =mongoose.model('problem',problemSchema);