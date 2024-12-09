const mongoose=require('mongoose');
const URI=process.env.URI || `mongodb://127.0.0.1:27017/databaseuser`;
mongoose.connect(URI);
const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    imgname:String,
    data:Buffer,
    problems:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'problem'
        }
    ]
});
module.exports =mongoose.model('user',userSchema);