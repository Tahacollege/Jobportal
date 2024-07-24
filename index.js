const express=require('express')
const path=require('path')
const app=express()
//vibha tiwari
const DbConnection=require('./db')
const bodyparser=require('body-parser')
const multer=require('multer')
var userskills=["Artificial Intelligence","Cloud Computing","Networking","Technical Support","Linux","C/C++","Java","Python","App Development","Full Stack Web Development","Front End","Back End","Quality Assurance","User Experience","Machine Learning","Database Administration","Data Analysis","Data Visualization","Data Science","Big Data","Information Security","Risk Analysis","Cybersecurity Analytics","Penetration Testing","Project management","Business skills","Automation"]
const fs=require('fs')  
var phstorage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./public/userprofile')
    },
    filename:function (req,file,cb){
        return cb(null,`${req.session.username}.png`)
    }
})
var jobstorage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./public/images')
    },
    filename:function (req,file,cb){
        return cb(null,file.originalname)
    }
})
var storage=multer.diskStorage({
    destination:function(req,file,cb){
        return cb(null,'./public/uploads/')
    },
    filename:function (req,file,cb){
        return cb(null,`${req.session.email}.pdf`)
    }
})

const upload=multer({storage})
const phupload=multer({storage:phstorage})
const jobupload=multer({storage:jobstorage})
const { ObjectId } = require('mongodb');
var userprofile=false
var employer=false
app.set('view engine', 'ejs')
app.use('/public',express.static('public'));
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
const cors=require('cors');
const corsConfig={
    origin:"*",
    credential:true,
    methods:["GET", "POST", "PUT", "DELETE"],
};
app.options("", cors(corsConfig));
app.use(cors(corsConfig));
const cookieParser=require("cookie-parser");
var session=require('express-session');
const MemoryStore = require('memorystore')(session);

app.use(cookieParser())
app.use(session({
    cookie: { maxAge: 86400000 },
    saveUninitialized:false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    resave: false,
    secret: 'keyboard cat'
}))

app.get('/',async(req,resp)=>{
    let result=await DbConnection
        let collection=result.collection('jobs')
        let jobdata=await collection.find({}).toArray()
        let fulldata=await collection.find({}).limit(10).toArray()
        var p1=1
        var p2=2
        var p3=3
        var p4=4
        var p5=10
    if(req.session.username){
        var uname=req.session.username
        var log=undefined
    resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    else{
    var uname="First Time"
    var log=undefined
    resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
})


app.post('/signup',async(req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('users')
    let username=req.body.username
    var p1=1
    var p2=2
    var p3=3
    var p4=9
    var p5=10
    let email=req.body.email
    let password=req.body.password
    let mobilenumber=req.body.number
    
    let likdinid=req.body.likdinid
    let type=req.body.type
    let data=await collection.findOne({'email':email})
    let collection2=result.collection('jobs')
    
    let collection3=result.collection('applied')
        let jobdata=await collection2.find({}).toArray()
        let fulldata=await collection2.find({}).limit(10).toArray()
    if(data ){
        var uname="email already exists Or Company is not Registered by You"
        var log=undefined
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    else{
        if(type=='employer'){
            let companyname=req.body.companyname
            let checkcomapany=await collection2.findOne({'companyname':companyname})
            if(checkcomapany.employer!=email){
                var uname="email already exists Or Company is not Registered by You"
                var log=undefined
                resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
            }
            let userdata=await collection.insertOne({
                'username':username,
                'email':email,
                'password':password,
                'mobilenumber':mobilenumber,
                'type':type,
                'company_name':companyname,
                'likdinid':likdinid
            })
            employer=true
        }
        else{
            let userdata=await collection.insertOne({
                'username':username,
                'email':email,
                'password':password,
                'mobilenumber':mobilenumber,
                'type':type,
                'likdinid':likdinid,
                'skills':[
                    'Quality Assurance'
                ]
            })
        }
    
    req.session.username=username
    req.session.email=email
    var uname=req.session.username
    req.session.companyname=req.body.companyname
    if(fs.existsSync(`./public/userprofile/${req.session.username}.png`)){
        userprofile=true
    }
    else{
        userprofile=false
    }
}
var log=undefined
if(employer){
    let cdata=await collection2.findOne({'companyname':companyname})
    let adata=await collection3.find({'company_name':data.company_name}).toArray()
        resp.render(`employerIndex`,{uname,log,cdata,userprofile,adata})
    resp.render(`employerIndex`,{uname,log,cdata,userprofile,adata})
}
else{
resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
}
})
app.post('/login',async (req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('users')
    let collection2=result.collection('jobs')
    let collection3=result.collection('applied')
    let email=req.body.email
    let password=req.body.password
    let type=req.body.type
    let companyname=false
    var p1=1
    var p2=2
    var p3=3
    var p4=9
    var p5=10
    let data=await collection.findOne({'email':email, 'password':password})
        let jobdata=await collection2.find({}).toArray()
        let fulldata=await collection2.find({}).limit(10).toArray()
    if(type=='employer'){
        companyname=req.body.companyname
        let checkcomapany=await collection2.findOne({'companyname':companyname})
        if(checkcomapany.employer!=email){
            var uname="email already exists Or Company is not Registered by You"
            let log=undefined
            resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
        }
    }
    
    if(data){
        req.session.username=data.username
        if(fs.existsSync(`./public/userprofile/${req.session.username}.png`)){
            userprofile=true
        }
        else{
            userprofile=false
        }
        req.session.email=data.email
    var uname=req.session.username
    var log=undefined
    }
    else{
        var uname=undefined
        var log=undefined
    }
     data=await collection.findOne({'email':email, 'password':password})
    if(data.type=='employer'){
        let cdata=await collection2.findOne({'companyname':companyname})
        let adata=await collection3.find({'company_name':companyname}).toArray()
        employer=true
        req.session.companyname=req.body.companyname
        console.log(`login emial:- ${req.session.email}`)
    console.log(`login comapny:- ${req.session.companyname}`)
        resp.render(`employerIndex`,{uname,log,cdata,userprofile,adata})
    }
    else{
    resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
})
app.post('/pagination',async(req,resp)=>{
    var value=req.body.value
    var intdata=parseInt(value)
    var result=await DbConnection
    var collection2=result.collection('jobs')
    let jobdata=await collection2.find({}).toArray()
    let fulldata=[]
    if(req.session.username){
        var uname=req.session.username
        var log=undefined
    }
    else{
    var uname="First Time"
    var log=undefined
    }
    if(intdata==1){
        var p1=1
        var p2=2
        var p3=3
        var p4=4
        var p5=10
        for(let i=0;i<=9;i++){
            fulldata[i]=jobdata[i]
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==2){
        var p1=1
        var p2=3
        var p3=4
        var p4=5
        var p5=10
        for(let i=9;i<=19;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=9;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==3){
        var p1=1
        var p2=2
        var p3=4
        var p4=5
        var p5=10
        for(let i=19;i<=29;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=19;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==4){
        var p1=1
        var p2=2
        var p3=3
        var p4=5
        var p5=10
        for(let i=29;i<=39;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=29;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==5){
        var p1=1
        var p2=2
        var p3=3
        var p4=6
        var p5=10
        for(let i=39;i<=49;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=39;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==6){
        var p1=1
        var p2=2
        var p3=3
        var p4=7
        var p5=10
        for(let i=49;i<=59;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=49;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==7){
        var p1=1
        var p2=2
        var p3=3
        var p4=8
        var p5=10
        for(let i=59;i<=69;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=59;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==8){
        var p1=1
        var p2=2
        var p3=3
        var p4=9
        var p5=10
        for(let i=69;i<=79;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=69;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==9){
        var p1=1
        var p2=2
        var p3=3
        var p4=8
        var p5=10
        for(let i=79;i<=89;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=79;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==10){
        var p1=1
        var p2=2
        var p3=3
        var p4=9
        var p5=11
        for(let i=89;i<=99;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=89;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
    if(intdata==11){
        var p1=1
        var p2=2
        var p3=3
        var p4=9
        var p5=10
        for(let i=99;i<=109;i++){
            fulldata[i]=jobdata[i]
        }
        for(let i=0;i<=99;i++){
            fulldata.shift()
        }
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
    }
})
app.get('/dropdown',async(req,resp)=>{
    var value=req.query.val
   var jtype=req.query.type 
   var p1=1
   var p2=2
   var p3=3
   var p4=9
   var p5=10
var result=await DbConnection
var collection2=result.collection('jobs')
let jobdata=await collection2.find({}).toArray()
if(jtype=='companyname'){
var fulldata=await collection2.find({'companyname':value}).toArray()
}
else if(jtype=='Type'){
    var fulldata=await collection2.find({'Type':value}).toArray()
    }
    else if(jtype=='Location'){
        var fulldata=await collection2.find({'Location':value}).toArray()
        }
   if(req.session.username){
       var uname=req.session.username
       var log=undefined
   }
   else{
   var uname="First Time"
   var log=undefined
   }
   resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
})

app.get('/details',async(req,resp)=>{
    let val=req.query.val
    let result=await DbConnection
    let collection2=result.collection('users')
    let collection=result.collection('jobs')
    let collection3=result.collection('applied')
    let data=await collection.findOne({'_id':new ObjectId(val)})
    let already_applied=false
    let applied=await collection3.findOne({'company_id':val,'useremail':req.session.email})
    if(applied){
        already_applied=true
    }
    var udata=undefined
    if(req.session.username){
        var uname=req.session.username
        var email=req.session.email
        var udata=await collection2.findOne({'email':email})
        var log=undefined
    }
    else{
    var uname=undefined
    var log=undefined
    var udata=undefined
    }
    if(employer){
        resp.render('employer_company_details',{data,udata})
    }
    else{
        resp.render('details',{uname,data,udata,already_applied,userprofile})
    }
    
})
app.get('/apply',async(req,resp)=>{
    let id=req.query.val
    let result=await DbConnection
    let collection=result.collection('jobs')
    let already_applied=false
    let collection2=result.collection('users')
    let data=await collection.findOne({'_id':new ObjectId(id)})
        var p1=1
        var p2=2
        var p3=3
        var p4=4
        var p5=10
    if(req.session.username){
        var uname=req.session.username
        var log=undefined
        var email=req.session.email
        var udata=await collection2.findOne({'email':email})
        
    }
    else{
    var uname=undefined
    var log=undefined
    var udata=undefined
    }
    resp.render('details',{uname,data,udata,already_applied,userprofile})
})
app.post('/jobapply',upload.single('resume'),async(req,resp)=>{
    let c_id=req.body.c_id
    let email=req.session.email
    let number=req.body.number
    let resume=req.body.resume
    let likdinid=req.body.likdinid
    let cover_letter=req.body.cover_letter
    let result=await DbConnection
    let collection=result.collection('jobs')
    let cdata=await collection.findOne({'_id':new ObjectId(c_id)})
    let cname=cdata.companyname
    let clink=cdata.Link
    let ctype=cdata.Type
    let collection2=result.collection('users')
    let collection3=result.collection('applied')
    let data=await collection2.findOne({'email':email})
    var job_applied=true
    var apply_data=await collection3.insertOne({
        'company_id':c_id,
        'company_name':cname,
        'company_link':clink,
        'company_type':ctype,
        'useremail':email,
        'cover_letter':cover_letter,
        'likdinid':likdinid
    })
    let companydata=await collection3.find({'useremail':email}).toArray()
    console.log(req.file)
    resp.render('userportal',{data,companydata,job_applied,userskills,userprofile})
    

})

app.get('/userportal',async(req,resp)=>{
    var email=req.session.email
    console.log(req.session.email)
    let result=await DbConnection
    let collection=result.collection('users')
    let collection2=result.collection('applied')
    let collection3=result.collection('jobs')
    let data=await collection.findOne({'email':email})
    var job_applied=false
    let companydata=await collection2.find({'useremail':email}).toArray()
    resp.render('userportal',{data,companydata,job_applied,userskills,userprofile})
})
app.get('/updateskills',async(req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('users')
    let skills=req.query.skills
    let collection2=result.collection('applied')
    let companydata=await collection2.find({'useremail':req.session.email}).toArray()
    var job_applied=false
    let addskills=await collection.updateOne({'email':req.session.email},{$set:{
        "skills":skills
    }})
    let data=await collection.findOne({'email':req.session.email})
    resp.render('userportal',{data,companydata,job_applied,userskills,userprofile})
})
app.post('/updateprofile',phupload.single('photo'),async(req,resp)=>{
    let result=await DbConnection
    console.log(req.file)
    var job_applied=false
    userprofile=true
    let collection2=result.collection('applied')
    let collection=result.collection('users')
    let companydata=await collection2.find({'useremail':req.session.email}).toArray()
    let data=await collection.findOne({'email':req.session.email})
    resp.render('userportal',{data,companydata,job_applied,userskills,userprofile})
})
app.get('/search',async(req,resp)=>{
    let result=await DbConnection
    let collection=result.collection('jobs')
    var search_query=req.query.search
    let jobdata=await collection.find({}).toArray()
    var resu=await collection.find({"companyname":{$regex:".*"+search_query+".*",$options:'i'}}).toArray()
    if(req.session.username){
        var uname=req.session.username
    }
    else{
        var uname=undefined
    }
    if(resu){
        resp.render('search_result',{resu,uname,jobdata,userprofile})
    }
    else {
        resp.send("No Result found")
    }
})

app.post('/aboutupdate',async(req,resp)=>{
    let result=await DbConnection
var c_id=req.body.c_id
let collection=result.collection('jobs')
let collection2=result.collection('users')
if(req.body.about){
    let updatedata=await collection.updateOne({'_id':new ObjectId(c_id)},{$set:{
        "about":req.body.about
    }})
}
else if(req.body.resp){
    let updatedata=await collection.updateOne({'_id':new ObjectId(c_id)},{$set:{
        "Responsibilities":req.body.resp
    }})
}
else if(req.body.qual){
    let updatedata=await collection.updateOne({'_id':new ObjectId(c_id)},{$set:{
        "Qualifications":req.body.qual
    }})
}
var email=req.session.email
var udata=await collection2.findOne({'email':email})
let data=await collection.findOne({'_id':new ObjectId(c_id)})
resp.render('employer_company_details',{data,udata})

})

app.get('/employerportal',async(req,resp)=>{
    let result =await DbConnection
    let collection=result.collection('users')
    let collection2=result.collection('jobs')
    let data=await collection.findOne({'email':req.session.email})
    let comp=req.session.companyname
    console.log(`portal emial:- ${req.session.email}`)
    console.log(`portal comapny:- ${req.session.companyname}`)
    let cdata=await collection2.findOne({'companyname':comp})
    resp.render('employerportal',{data,cdata,comp})
})

app.post('/newjob',jobupload.single('comapnyphoto'),async(req,resp)=>{
    let result=await DbConnection
    let collection2=result.collection('jobs')
    let collection3=result.collection('applied')
    let companyname=req.body.companyname
    let type=req.body.type
    let Joblocation=req.body.Joblocation
    let uname=req.session.username
    let resp2=req.body.resp
    let qual=req.body.qual
    let about=req.body.about
    let linkdinid=req.body.linkdinid
    let data=await collection2.insertOne({
        'companyname':companyname,
        'Type':type,
        'Location':Joblocation,
        'Responsibilities':resp2,
        'Qualifications':qual,
        'about':about,
        'Link':linkdinid,
        'employer':req.session.email
    })
    var log=undefined
    let cdata=await collection2.findOne({'companyname':companyname})
    let adata=await collection3.find({'company_name':data.company_name}).toArray()
    resp.render(`employerIndex`,{uname,log,cdata,userprofile,adata})
})
app.get('/logout',async(req,resp)=>{
    req.session.username=undefined
    const uname=req.session.username
    employer=false
    var log="Loged Out Successfully"
    let result=await DbConnection
    let collection2=result.collection('jobs')
        let jobdata=await collection2.find({}).toArray()
        let fulldata=await collection2.find({}).limit(10).toArray()
        var p1=1
        var p2=2
        var p3=3
        var p4=9
        var p5=10
        resp.render(`index`,{uname,log,jobdata,fulldata,p1,p2,p3,p4,p5,userprofile})
})
app.listen(4000)