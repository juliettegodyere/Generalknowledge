var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var models = require('./models/data');
var app = express();

// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(express.static(path.join(__dirname, 'public')));



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

// models.Category.find({_id:"57711c6c4322fbf0721d3803"}, function(err,cat){
//     console.log(cat._id);
// });

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

app.listen(3001,function(){
  console.log('Example listening on port 3001');
});
module.exports = app;
