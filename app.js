var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var path = require('path');

var models = require('./models/data');
var app = express();

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
app.get('/cat', function(req,res){
  models.Category.find({},function(err, cats){
    res.json({
      category:cats
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
app.get('/cat/coz', function(req,res){
  models.Course.find({},function(err, cos){
    res.json({
      course:cos
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
app.get('/cat/coz/yr', function(req,res){
  models.Year.find({},function(err, yrm){
    res.json({
      Year:yrm
    });
  });
});

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
// app.get('/examQuestions', function(req, res, next) {
//   res.send('examQuestions', { title: 'Express' });
// });
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

app.get('/testing', function(req, res){
  var aa = {
    Jamb : req.param('catid'),
    Economics : req.param('courid'),
    2010 : req.param('yeaid'),
  };
  res.json({
    param : aa,
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

app.listen(3009,function(){
  console.log('Example listening on port 3009');
});
module.exports = app;
