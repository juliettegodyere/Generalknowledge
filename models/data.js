var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/general');

var categorySchema = new mongoose.Schema({
	catName: { 
		type:String, 
		unique:true
	}
});

var courseSchema = new mongoose.Schema({
	cozName: { 
		type:String, 
		unique:true
	}

});

var yearSchema = new mongoose.Schema({
	yrName: { 
		type:String, 
		unique:true
	}

});

var questionSchema = new mongoose.Schema({
	question: String,
	answer: String,
	option:String,
	explanation:String,
	image:Date,
	categoryID: String,
	courseID: String,
	yearID: String

});

var Category = mongoose.model('Category',categorySchema);
var Course = mongoose.model('Course', courseSchema);
var Year = mongoose.model('Year', yearSchema);
var Question = mongoose.model('Question', questionSchema);


module.exports = {
	Category:Category,
	Course:Course,
	Year:Year,
	Question:Question,
};


