const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
var fs = require("fs");
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
const {check,validationResult}  = require('express-validator/check');
var sanitize = require('mongo-sanitize');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
  app.use(cors());
 // app.use(validationResult());
  app.use('/', express.static('.'));

  //const myValidationResult = validationResult.withDefaults({
  //  formatter: (error) => {
   //   return {
      //  myLocation: error.location,
     // };
    //}
 // });

fs.readFile("Lab3-timetable-data.json",'utf8', function(err,data){
    if (err)
    {
        res.status(500).send({"statusMessage" : "Error"});
    }
    else
    {

    var json = JSON.parse(data);

MongoClient.connect(url, function(err, db) {
    if (err)
    {
        res.status(500).send({"statusMessage" : "Error"});
    }
    else
    {
    
    //console.log("Success");
    var dbo=db.db("mydb");
    var collection = dbo.collection("timetable_data")
    dbo.collection("timetable_data", {strict:true},function(err, collect){
    if(err)
    {    
    dbo.collection("timetable_data").insertMany(json, function(err, records) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
            console.log("Success");
        }
        //console.log("Record added as"+records[0]._catalog_nbr);
    });
}
}); 
    } 
});
    }
});
app.get('/api/subject', function(req,res){
    MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
       // console.log("Success");
       else
       {
        var dbo=db.db("mydb");
        var collection = dbo.collection("timetable_data");
        const query= {'course_info': { $elemMatch:{'enrl_stat':"Not full"} }};
        const options = {projection: { _id: 0, subject: 1, className: 1 },};
        collection.find(query, options).toArray(function(err,data)
        {
            if (err)
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
           // console.log(data);
           else
           {
            res.status(200).send(data);
           }
        });
    }
    });
});

app.get('/api/course_code/:subject', function(req,res){
    const subject = sanitize(req.params.subject);

    MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
        //console.log("Success");
        var dbo=db.db("mydb");
        var collection = dbo.collection("timetable_data");
        const query= {"subject":subject};
        const options = {projection: { _id: 0, catalog_nbr: 1 },};
        collection.find(query, options).toArray(function(err,data)
        {
            if (err) 
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            else 
            {
                if(data.length==0)
                {
                    //console.log(data.length);
                    res.status(500).send({"statusMessage":"User does not exist"});
                }
                else
                {
                    //console.log(data);
                    res.status(200).send(data);
                }
            }
            
        });
    }
    });
});
app.get('/api/timetable/:subject',function(req,res){
    const subject = sanitize(req.params.subject);
    MongoClient.connect(url, function(err, db) {
        if (err) 
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
        //console.log("Success");
        var dbo=db.db("mydb");
        var collection = dbo.collection("timetable_data");
        const query= {"subject":subject};
        var options = {projection: { _id: 0},};
        collection.find(query,options).toArray(function(err,data)
        {
            if (err) 
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            else 
            {
                if(data == null)
                {
                    //console.log(data.length);
                    res.status(500).send({"statusMessage":"User does not exist"});
                }
                else
                {
                   // console.log(data);
                    res.status(200).send(data);
                }
            }
            
        });
    }

    });
})

app.get('/api/timetable/:subject/:course',function(req,res){

    const subject = sanitize(req.params.subject);
    const course = sanitize(req.params.course);
    MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
       // console.log("Success");
        var dbo=db.db("mydb");
        var collection = dbo.collection("timetable_data");
        const query= {"subject":subject,"catalog_nbr":course};
        var options = {projection: { _id: 0},};
        collection.find(query,options).toArray(function(err,data)
        {
            if (err) 
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            else 
            {
                if(data.length==0)
                {
                    console.log(data.length);
                   // res.status(500).send({"statusMessage":"Subject/Course does not exist"});
                   res.status(500).send(data);
                }
                else
                {
                    console.log(data);
                    res.status(200).send(data);
                }
            }
            
        });
    }

    });
})

app.get('/api/timetable/:subject/:catalognbr/:component?', function(req,res){
        const subject = sanitize(req.params.subject);
        const course_code = sanitize(req.params.catalognbr);
        const component = sanitize(req.params.component);
        MongoClient.connect(url, function(err, db) {
            if (err)
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            else
            {
           // console.log("Success");
            var dbo=db.db("mydb");
            var collection = dbo.collection("timetable_data");
            //console.log(component);
            if(component)
            {
            var query= {"subject":subject,"catalog_nbr":course_code,'course_info': { $elemMatch:{'ssr_component':component} }};
            }
            else
            {
                var query= {"subject":subject,"catalog_nbr":course_code};
            }
            const options = {projection: { _id: 0},};
            collection.find(query, options).toArray(function(err,data)
            {
                if (err) 
                {
                    res.status(500).send({"statusMessage":"Error message/doesnt exist"});
                }
                else 
                {
                    if(data.length==0)
                    {
                        //console.log(data.length);
                        res.status(500).send({"statusMessage":"SUbject/Course/Component does not exist"});
                    }
                    else
                    {
                        //console.log(JSON.parse(JSON.stringify(data)));
                        res.send(JSON.parse(JSON.stringify(data)));
                    }
                }
            
        });
    }
        });
});
app.post('/api/schedule', [check('schedule_name').notEmpty().isLength({min:3,max:20}).trim().escape()],function(req,res){

   
    const schedule = req.body;
    const sch_name = schedule.schedule_name;


    const errors =  validationResult(req);
   // console.log(req.body);

    if (!errors.isEmpty())
     {
      res.status(422).send({"statusMessage":"Validation Error"});
    } 
    else 
    {
        MongoClient.connect(url, function(err, db) {
            if (err)
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            //console.log("Success");
            else
            {
            var dbo=db.db("mydb");
            var collection = dbo.collection("schedule_data");
            collection.countDocuments(function(err, count)
            {
                if(!err && count == 0)
                {
                    dbo.collection("schedule_data").insertOne(schedule, function(err,records)
                    {
                        if (err)
                        {
                            res.status(500).send({"statusMessage" : "Error"});
                        }
                        else
                        {
                            res.status(200).send({"statusMessage":"Schedule created successfully",});
                        }
                    });
                }
                else
                {
                    if(count!=0)
                    {
                        dbo.collection("schedule_data").findOne({'schedule_name':sch_name}, function(err,data)
                        {
                            if (err)
                            {
                                res.status(500).send({"statusMessage" : "Error"});
                            }
                            else
                            {
                            if(data)
                            {
                                res.status(500).send({"statusMessage":"Error as schedule name already exists"});
                            }
                            else
                            {
                                dbo.collection("schedule_data").insertOne(schedule, function(err,records)
                                    {
                                        if (err)
                                        {
                                            res.status(500).send({"statusMessage" : "Error"});
                                        }
                                        else
                                        {
                                            res.status(200).send({"statusMessage":"Schedule created successfully", "result":sch_name});
                                        }
                                    });
                            }
                        }
                        });
                    }
                }
            });
        }
        });  
    }
    //console.log(schedule);
    //console.log(sch_name);
    
});
app.put('/api/schedule/:sched_name', [check('course_code').notEmpty().isAlphanumeric().isLength({min:5}).trim().escape(),
check('subject').notEmpty().isAlpha().isLength({min:3,max:20}).trim().escape()],function(req,res)
{
    const sch_name = req.params.sched_name;
    const schedule = req.body;
    const course_code = req.body.course_code;
    const subject = req.body.subject;
    schedule.schedule_name = sch_name;

    const errors =  validationResult(req);
   // console.log(req.body);

    if (!errors.isEmpty())
     {
      res.status(422).send({"statusMessage":"Validation Error"});
    } 
    else
    {

    
    MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
        //console.log("Success");
        var dbo=db.db("mydb");
        var collection = dbo.collection("schedule_data");

        dbo.collection("schedule_data").findOne({'schedule_name':sch_name}, function(err,data)
            {
                if (err)
                {
                    res.status(500).send({"statusMessage" : "Error"});
                }

                else
                {
                if(data)
                {
                    dbo.collection("schedule_data").findOne({'course_code':course_code, 'subject':subject}, function(err,data_body)
                    {
                        if (err)
                        {
                            res.status(500).send({"statusMessage" : "Error"});
                        }
                        else
                        {

                        if(data_body)
                        {
                            dbo.collection('schedule_data').replaceOne({'schedule_name': sch_name},{'schedule_name':sch_name,'course_code': course_code, 'subject': subject }, function(err, result) {
                                if(err) throw err;
                                res.status(200).send({"statusMessage":"Schedule replaced Successfully","result":sch_name});
                                });    
                        }
                        else
                        {
                            var myquery = { 'schedule_name': sch_name };
                            var newvalues = { $set: {'schedule_name': sch_name,'course_code': course_code, 'subject': subject } };
                            dbo.collection('schedule_data').updateOne(myquery, newvalues, function(err, result) {
                            if(err)
                            {
                                res.status(500).send({"statusMessage" : " Update Error"});
                            }
                            else
                            {
                            res.status(200).send({"statusMessage":"Schedule updated Successfully"});
                            }
                            });
                        } 
                    }    
                     });
                        }
                        else
                        {
                            res.status(200).send({"statusMessage":"Error as schedule name does not exists"});
                        }
                    }
                    });
                }
    });
}
});
app.get('/api/schedule/:schedule_name', function(req,res){
    const name_schedule = sanitize(req.params.schedule_name);
    MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        else
        {
        console.log("Success");
        var dbo=db.db("mydb");
        var collection = dbo.collection("schedule_data");
        collection.find({'schedule_name':name_schedule},{projection: { _id: 0},}).toArray(function(err,data)
            {
                if (err)
                {
                    res.status(500).send({"statusMessage" : " Retrieve Error"});
                }
                else
                {
    
                    if(data == null)
                    {
                        res.status(500).send({"statusMessage":"There is no existing schedule name"});
                    }
                    else
                    {
                // console.log(data);
                        res.send(data);
                    }
            }
            });
        }
    });
    });
    
    app.get('/api/courselistTimetable/:schedule_name',function(req,res){
        const name = sanitize(req.params.schedule_name);
        MongoClient.connect(url, function(err, db) {
            if (err)
            {
                res.status(500).send({"statusMessage" : "Error"});
            }
            else{
            //console.log("Success");
            var dbo=db.db("mydb");
            var collection = dbo.collection("schedule_data");
            var query={'schedule_name':name};
            var options= {projection: { _id: 0,schedule_name:0},};
            collection.findOne({'schedule_name':name},{projection:{ _id: 0,schedule_name:0},}, function(err,data){
                if (err) throw err;
               // console.log(data);
                if(data == null)
                {
                    res.status(500).send({"statusMessage" : "Schedule name doesn't exist"});
                }
                else
                {
                   // console.log(data);
                    //res.send(data);
                    var collection_timetable = dbo.collection("timetable_data");
                   // collection_timetable.find({data:{$elemMatch:{'subject':data}} })
                   c = data.course_code;
                   d = data.subject;
                   var length_c = c.length;
                   collection_timetable.find({'catalog_nbr':{$in:c}, 'subject':{$in:d}},{projection: { _id: 0},}).toArray(function(err,rest)
                   {
                       if(err) throw err;
                        var rest_length = rest.length;
                        //console.log(rest_length);
                       if(length_c == rest_length)
                       {
                            res.status(200).send(rest);
                       }
                        else
                       {
                         res.status(500).send({"statusMessage" : "Error"});
                    }
                   });
                }
            
            });
        }
        });
    })
    app.delete('/api/schedule/:schedule_name', function(req,res){
        const name_schedule = sanitize(req.params.schedule_name);
        MongoClient.connect(url, function(err, db) {
        if (err)
        {
            res.status(500).send({"statusMessage" : "Error"});
        }
        //console.log("Success");
        else
        {
        var dbo=db.db("mydb");
        var collection = dbo.collection("schedule_data");
        collection.findOne({'schedule_name':name_schedule}, function(err,result){
            if(result == null)
            {
                res.status(500).send({"statusMessage":"Schedule name does not exist"});
            }
            else
            {
                collection.deleteOne({'schedule_name':name_schedule},function(err,result){
                if (err)
                {
                    res.status(500).send({"statusMessage" : "Delete Error"});
                }
                else
    
                {
                    if(result.deletedCount===0)
                        {
            
                            res.status(500).send({"statusMessage":"There are no schedules to delete"});
                        }
                        else
                        {
                    res.status(200).send({"statusMessage":"Deleted Schedule successfully"});
                        }
                }
    
                });
            }
        });
        }
    });
    });
    
    app.get('/api/schedule_list', function(req,res){
    
        MongoClient.connect(url, function(err, db) {
            if (err)
            {
                res.status(500).send({"statusMessage" : "MongoDB connection Error"});
            }
            else
            {
            //console.log("Success");
            var dbo=db.db("mydb");
            var collection = dbo.collection("schedule_data");
            collection.find({},{projection: { _id: 0},}).toArray(function(err,result){
                if (err)
                {
                    res.status(500).send({"statusMessage" : "Problem in retrieving data!! Try Again!!"});
                }
                else
                {
                    res.status(200).send(result);
                }
    
            });
        }
    
        });
    
    });
    
    app.delete('/api/delete_schedules', function(req,res){
        MongoClient.connect(url, function(err, db) {
            if (err)
            {
                res.status(500).send({"statusMessage" : "MongoDB connection Error"});
            }
            //console.log("Success");
            else
            {
                var dbo=db.db("mydb");
                var collection = dbo.collection("schedule_data");
                collection.deleteMany({}, function(err,result)
                {
                    if (err)
                    {
                        res.status(500).send({"statusMessage" : "Delete Error"});
                    }
                    else
                    {
                        if(result.deletedCount===0)
                        {
            
                            res.status(500).send({"statusMessage":"There are no schedules to delete"});
                        }
                        else
                        {
                            res.status(200).send({"statusMessage":"Schedules are deleted successfully"});
                        }
                        
                    }
                });
            }
        });
    });
    
    app.listen(3000);
    //console.log('Listening on port 3000...');