var express = require('express');
var bodyParser = require('body-parser');
var json2csv = require('json2csv');
var Converter = require("csvtojson").Converter;
var fs = require('fs');
var http = require('http');
var path = require('path');

var models = require('./models/data');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(express.static(path.join(__dirname, 'public')));

//Category routes
app.get('/category', function(req, res) {
  res.render('category', { title: 'Category' });
});

app.post('/category', function(req,res){
  var catName  = req.body.catName;
  var data     = new models.Category();
  data.catName = catName,

  data.save(function(err,cat){
    if (err) return res.status(err);
      console.log(cat);
      res.json({
        cat:cat
      });
    });      
});
//Get all categories
app.get('/cat', function(req,res){
  models.Category.find({},function(err, cats){
    res.json({
      category:cats
    });
  });
});

//Course routes
app.get('/category/course', function(req, res) {
  res.render('course', { title: 'Course' });
});

app.post('/category/course', function(req,res){
  var cozName   = req.body.cozName;
  var data2     = new models.Course();
  data2.cozName = cozName

  data2.save(function(err,coz){
    if (err) return res.status(err);
      console.log(coz);

      res.json({
        coz:coz
      });
    });      
});
//Get all courses
app.get('/cat/coz', function(req,res){
  models.Course.find({},function(err, cos){
    res.json({
      course:cos
    });
  });
});

//Year route
app.get('/category/course/year', function(req, res) {
  res.render('year', { title: 'Year' });
});

app.post('/category/course/year', function(req,res){
  var yrName   = req.body.yrName;
  var data3    = new models.Year();
  data3.yrName = yrName

  data3.save(function(err,yr){
    if (err) return res.status(err);
      console.log(yr);

      res.json({
        yr:yr
      });
    });      
});
//Get all years
app.get('/cat/coz/yr', function(req,res){
  models.Year.find({},function(err, yrm){
    res.json({
      Year:yrm
    });
  });
});

//Question route
app.get('/category/course/year/question', function(req, res, next) {
  
  // STAGE 1
  models.Category.find().exec(function(err, categories){
      if(err){
        return res.status(500).send();
      }else{
        // STAGE 2
        models.Course.find().exec(function(err, courses){
        if(err){
          return res.status(500).send();
        }else{
          // console.log(courses);
          
          // STAGE 3
          models.Year.find().exec(function(err, years){
          if(err){
            return res.status(500).send();
          }else{
            // console.log(years);
            
            // FINAL
            res.render('question', { 
              title: 'Questions',
              categories:categories,
              courses: courses,
              years: years
              });
            }
          });
        }
      });
    }
  });
  
});

app.post('/category/course/year/question', function(req,res){
  var question    = req.body.question;
  var answer      = req.body.answer;
  var option      = req.body.option;
  var explanation = req.body.explanation;
  var image       = req.body.image;
  var categoryID  = req.body.categoryID;
  var courseID    = req.body.courseID;
  var yearID      = req.body.yearID;

  var data4         = new models.Question();
  data4.question    = question,
  data4.answer      = answer,
  data4.option      = option,
  data4.explanation = explanation,
  data4.image       = image,
  data4.categoryID  = categoryID,
  data4.courseID    = courseID,
  data4.yearID      = yearID,

  data4.save(function(err,quest){
    if (err) return res.status(err);
      console.log(quest);
      res.json({
        quest:quest
      });
    });      
});

//Get all questions and return it as json array
app.get('/', function(req,res){
  models.Question.find({}, function(err, find2){
    var sortedArray = [];
    find2.forEach(function(item){
      // if (catID==item.categoryID && cozID==item.courseID && yrID==item.yearID){
        var newGuy = {
          "question": item.question,
          "answer": item.answer,
          "explanation":item.explanation,
          "image": item.image,
          "options": item.option ? item.option.split('|') : ''
        }
        sortedArray.push(newGuy); 
        // console.log('passed');
      // } else {
      //   console.log('failed');
      // }
    });
    res.json({
      users: sortedArray
    })
    
  })
});



//Routes to submit desired category, course, year
app.get('/main', function(req,res,next){
  models.Category.find().exec(function(err, categories){
      if(err){
        return res.status(500).send();
      }else{
        // STAGE 2
        models.Course.find().exec(function(err, courses){
        if(err){
          return res.status(500).send();
        }else{
          
          // STAGE 3
          models.Year.find().exec(function(err, years){
          if(err){
            return res.status(500).send();
          }else{

            // FINAL STAGE
            res.render('main', { 
              title: 'Main',
              categories:categories,
              courses: courses,
              years: years
              });
            }
          });
        }
      });
    }
  });
});
app.post('/main', function(req,res){
  models.Question.find({},function(err,find){
    if(err){
      return res.status(500).send();
    }else{
      var catID        = req.body.catID;
      var cozID        = req.body.cozID;
      var yrID         = req.body.yrID;
      var sortedArrays = [];
      var data5        = new models.Main({
        catID : catID,
        cozID : cozID,
        yrID  : yrID
      });
      sortedArrays.push(data5);
      console.log(sortedArrays);
      res.json({
        sortedArrays:sortedArrays
      })
      // res.render('examQuestions',{
      //   title:'Exam Questions',
      //   sortedArrays:sortedArrays,
      //   find:find
       
      // });
    }
  });
});

app.get('/testing', function(req, res){

  models.Question.find({}, function(err, jule){
    var sortedArray = [];
    var catid =  req.param('catid');
    var courid = req.param('courid');
    var yeaid = req.param('yeaid');
    jule.forEach(function(gan){
      if(catid==gan.categoryID && courid==gan.courseID && yeaid==gan.yearID){
        var give = {
          "question": gan.question,
          "answer": gan.answer,
          "explanation":gan.explanation,
          "image": gan.image,
          "options": gan.option ? gan.option.split('|') : ''
        }
        sortedArray.push(give); 
        // console.log('passed');
      // } else {
      //   console.log('failed');
      }
    });
    res.json({
      users: sortedArray
    })
  })
}); 
//Export Database
var fields = ['question', 'answer', 'option', 'explanation', 'image','categoryID','courseID','yearID'];

app.get('/export', function(res, req){
     models.Question.find({}, function(err, questions){
        if (err) {
            console.log(err);
            return res.status(500).send();
        }else{
           console.log(questions.length+'--------------------------------');
           json2csv({
            data:questions,
            fields: fields
           }, function(err,csv){
            if (err) console.log(err);
                fs.writeFile('file.csv', csv, function(err) {
                    if (err) throw err;
                    console.log('file saved');
                });
           }); 
        } 
    });
});

app.get('/import', function(res,req){
    var converter = new Converter({});
    converter.fromFile("./file.csv", function(err,items){
      if (err) console.log(err);
        var numberOfSavedRecords = 0;
        var numberOfErrorRecords = 0;
        console.log(items.length);
        items.forEach(function(item){
          var current     = item;
          var data        = new models.Question();
          data.question   = current.question;
          data.answer     = current.answer;
          data.image      = current.image;
          data.option     = current.option;
          data.categoryID = current.categoryID;
          data.courseID   = current.courseID;
          data.yearID     = current.yearID;

          data.save(function(err, qtn) {
              if (err) {
                  console.log(err);
                  numberOfErrorRecords++;
              } else {
                console.log();
                  numberOfSavedRecords++;  
              }
          });
        })
        console.log('Report: '+numberOfSavedRecords + 'records completed and ' + numberOfErrorRecords + ' records failed');
    })
    
})
app.get('/category/:category_id',function(req, res) {
  var allExams = [];
  var _id =req.params.category_id;
  var mainArray = [];
  //
  models.Question.find({categoryID:_id}, function(err, questions) {
    var tempArr = [];
    console.log(questions.length);
    var questionIndex = 0;
    questions.forEach(function(item){
          models.Course.find({_id:item.courseID}, function(err, selected){
             var name = selected[0].cozName;
             var newObj = {
                id : item.courseID, 
                name : name
             }
             if (tempArr.indexOf(item.courseID) == -1){
                mainArray.push(newObj);
                tempArr.push(item.courseID);
             }
             questionIndex++;  
             if (questionIndex == questions.length){
                res.json({result: mainArray});
             }
             console.log(questionIndex);
             
          });
    });
    
  });
});
app.get('/category/:category_id/course/:course_id', function(req,res){
  var allExams = [];
  var _id =req.params.category_id;
  var course_id =req.params.course_id;
  var mainArray = [];
  //
  models.Question.find({categoryID:_id, courseID:course_id}, function(err, questions) {
    var tempArr = [];
    console.log(questions.length);
    var questionIndex = 0;
    questions.forEach(function(item){
          models.Year.find({_id:item.yearID}, function(err, selected){
             var name = selected[0].yrName;
             var newObj = {
                id : item.yearID, 
                name : name
             }
             if (tempArr.indexOf(item.yearID) == -1){
                mainArray.push(newObj);
                tempArr.push(item.yearID);
             }
             questionIndex++;  
             if (questionIndex == questions.length){
                res.json({result: mainArray});
             }
             // console.log(questionIndex);
             
          });
    });
    
  });
});

app.listen(3009,function(){
  console.log('Example listening on port 3009');
});
module.exports = app;
