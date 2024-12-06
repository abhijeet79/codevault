const express=require('express');
const app=express();
const path=require('path');
const userModel=require('./models/user');
const problemModel=require('./models/problem');
const bcrypt=require(`bcrypt`);
const jwt=require('jsonwebtoken');
const { CLIENT_RENEG_WINDOW } = require('tls');
const cookieParser=require('cookie-parser');


app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));
app.set("view engine","ejs")
app.get("/",function(req,res){
    res.render('index')
})



app.get("/sign-in",function(req,res){
    res.render('index')
})



app.get("/login",function(req,res){
    res.render('login')
})



app.get("/profile",isloggedin,async (req,res)=>{
    let user= await userModel.findOne({email:req.data.email}).populate('problems');
    res.render('profile',{user});
})



app.post("/loggin",async (req,res)=>{
    const {email,password}=req.body;
    const user =await userModel.findOne({email});
    console.log(user);
    if(!user) return res.redirect("/login");
    bcrypt.compare(password,user.password,(err,result)=>{
        if(result){
            const token =jwt.sign({email},"secret-key");
            res.cookie("token",token);
            res.redirect("/profile");
        }else{
            res.redirect("/login");
        }
    })
})



app.post("/create",isloggedin,async (req,res)=>{
    const {link,problem,solution}=req.body;
    let user=await userModel.findOne({email:req.data.email});
    if(link==="" || problem==="" || solution==="") return res.redirect("/profile");
    let prob=await problemModel.create({
        link,
        problem,
        solution,
        user:user._id
    });
    user.problems.push(prob._id);
    await user.save();
    res.redirect('/profile');
})


function isloggedin(req,res,next){
    if(req.cookies.token==="")  return res.redirect("login");
    else{
        let data=jwt.verify(req.cookies.token,"secret-key");
        req.data=data;
        console.log(data.email);
    }
    next();
}

app.post("/submit",async (req,res)=>{
   let {name,email,password}=req.body;
   let user=await userModel({email});
   if(email==="" || name==="" || password==="") return res.redirect("/");

   bcrypt.genSalt(10,(err,salt)=>{
         bcrypt.hash(password,salt,async (err,hash)=>{
            let user=await userModel.create({
                name,
                email,
                password:hash
            });
            const token =jwt.sign({email},"secret-key");
            res.cookie("token",token);
            res.render('profile',{user});
         })
   })

});


app.get("/logout",(req,res)=>{
    res.cookie("token","");
    res.redirect("/");
})


app.listen(3000,function(){
    console.log("its running");
})