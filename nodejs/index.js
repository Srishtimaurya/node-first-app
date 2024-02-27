// console.log("hellooo");
// console.log("subscribeee");
// console.log(200/2);
// import fs from "fs";


// const home =fs.readFile("./index.html",()=>{
//     console.log("file read");
// })
// // const http=require("http");  this and its below line is exactly same
// import http from "http";

// // const gfname=require("./features");

// import gfname from "./features.js"
// // export {gf2,gf3} from "./features.js"     we will not write gfname as it is export by default
// console.log(gfname);  


// // if i want to export as one object from feature
// import * as combined from "./features.js"
// console.log(combined);

// // importing function from features
// import {generatelove} from "./features.js"
// console.log(generatelove());
// const server=http.createServer((req,res)=>{

// if(req.url==="/about"){
//     res.end(`<h1>love is ${generatelove()} </h1>`);
// }

// if(req.url==="/"){
//     res.end("<h1>home page </h1>");
// }
// else if(req.url==="/contact"){
//     res.end("<h1>contact page </h1>");
// }
// else{
//     res.end("<h1>page not found </h1>");
// }
// })

// server.listen(5000,()=>{
//     console.log("server is working");
// })




// from here we will se how express works

import express, { json } from "express";
import path from "path";
import mongoose from "mongoose"; 
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
const app=express();
app.use(cookieParser());
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbname:"backend",
}).then(()=>console.log("database connected successfully")).catch((e)=>console.log(e));

// for adding data to mongodb  we have to make schema(it is basically structure how we are adding data in mongodb)
// and in mongodb data is sgtored in json format

const userschema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});

// now we will collection of mongodb

const messge=mongoose.model("user",userschema);




// now we are accesing static file which is in public folder
// and as express.static is middleware so for tha we have to use syntax app.use()
// static folder like photos videos
app.use(express.static(path.join(path.resolve(),"public")));
// now here we are using middleware for accesing data of form
app.use(express.urlencoded({extended:true}));


// setting up view engine
app.set("view engine","ejs");

 //if request is "/".like above we were writing this in if function..here we write directly
// app.get("/",(req,res)=>{
//     //res.send("<h1>hii</h1>");
//     //res.sendStatus(400);  // it will decode 400 means it shows not found 

//     // res.json({
//     //     success:true,
//     //     products:[],
//     // });


//    // res.status(400).send("merii marzi");  // if we want to set for 400 that is bad request
// //const pathlocation=path.resolve();// these both line is for to know the path of directory......
// //console.log(path.join(path.resolve(),"features"));


// // now we want to send content of html backend on server to present
// //res.render("index",{name:"srishtii"});  // render we bsaically use for dynamic data like here we passes name yaha 
// // hum index.ejs file ki baat kr rhe...

// // now i want to read my static file which is index.html in public file

// //res.sendFile("indexx.html");
// })
// ;


const isauthenticated=async (req,res,next)=>{
    const {token}=req.cookies;
    if(token){
        const decoded=jwt.verify(token,"anyrandom");
        //console.log(decoded);
 // we are storing id of user in user model
        req.user=await messge.findById(decoded._id);


      next();
    }
    else{
     res.redirect("/login");
    }
}


// mtlb h slash pr jaane se pahla funtction hmesha isauthenticated activate hoga,fir dusra wla hoga jo bgal me h 
app.get("/",isauthenticated,(req,res)=>{
// now cookies aur authentication dekhenge
// console.log(req.cookies);
// we will stroe cookie token
// agr isauthenticated me token exist hua to ye logout render hoga wrna login wla hoga else part of isauthenticated

//console.log(req.user);
res.render("logout",{name:req.user.name});
})
;


app.get("/login",(req,res)=>{

    res.render("login");
});

//const userss=[];
app.get("/register",(req,res)=>{
    // now cookies aur authentication dekhenge
    // console.log(req.cookies);
    // we will stroe cookie token
    // agr isauthenticated me token exist hua to ye logout render hoga wrna login wla hoga else part of isauthenticated
    
    
    res.render("register");
    });



    
    app.post("/login", async (req, res) => {
        const { email, password } = req.body;
        let user= await messge.findOne({ email });
    
        // console.log(user.password);
        // console.log(password);
        if (!user) {
            return res.redirect("/register");
        }
    
    const ismatch = await bcrypt.compare(password,user.password);
    // here bcrypt converting my password which i just entered into hashed one so tha i can
    // match with database password which is already stored in hashes format
        // Compare passwords
        if (!ismatch){
            return res.render("login", { email, message: "incorrect password" });
         }
    
        const token = jwt.sign({ _id: user._id }, "anyrandom");
        res.cookie("token", token, {
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 1000)
        });
    
        res.redirect("/");
    });
     
   
import bcrypt from 'bcrypt';  // this is use for hashing the entered paasword so that no one
// can see in  stored database
app.post("/register",async (req,res)=>{
    
    const {name,email,password}=req.body;
let user=await messge.findOne({email});  // if user does not exist in database then he should register first
    
if(user){
    return res.redirect("/login");
    //return res.send("register");
}

const hashedpassword=await bcrypt.hash(password,10);

     user=await messge.create({
        name,
        email,
        password:hashedpassword,
    });

    // here in place of directly giving user id we store into another place
    const token=jwt.sign({ _id: user._id},"anyrandom");
res.cookie("token",token,{

    httpOnly:true,expires:new Date(Date.now()+60*1000)
});
//userss.push({name:req.body.name,email:req.body.email});
res.redirect("/");
});




app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
    
        httpOnly:true,expires:new Date(Date.now())
    });
    res.redirect("/");
    });
// we will create array to store name and email

// app.get("/success",(req,res)=>{
//     res.render("success");
// })


// for mongodb

app.get("/add",(req,res)=>{
    messge.create({name:"abhisha",email:"abhisha@gmail.com"}).then(()=>{
        res.send("nice");
    });
       
})
    

// ye understanding ke liye h...same function is copied below to add data in mongo
// app.post("/contact", (req, res) => {
//     console.log(req.body);
//     console.log(req.body.name);
//     console.log(req.body.email);
//     users.push({name:req.body.name,email:req.body.email});
//     res.send("Data received successfully!");
    
//     // or 
//     // res.redirect("/success");  ye success wle route pr redirect krega jo ki app.get me /success h
// });

// app.post("/contact", async (req, res) => {
//     // async await ka mtlb h ki messgae me data add hine ke baad inche wla message send hoga response me
    
//     // const {name,email}=req.body;
//     // await messge.create({name,email});
   
   
//     // or

//     await messge.create({name:req.body.name,email:req.body.email});
   
//     res.send("Data received successfully!");
    
    
// });




// get ka mtlb hai ki agr us route pr jayenge to hme users wali array milegi
app.get("/users",(req,res)=>{  
    res.json({
        userss,
    });
})




app.listen(5000,()=>{
    console.log("server is working");
});