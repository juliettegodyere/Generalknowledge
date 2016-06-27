var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.connect('mongodb://127.0.0.1:27017/gemIQ');

var categorySchema = new mongoose.Schema({

	catName: {type: String, unique: true, required: true},
	
});
categorySchema.plugin(uniqueValidator);
var courseSchema = new mongoose.Schema({
	cozName: { 
		type:String, 
		unique:true
	}

});
categorySchema.plugin(uniqueValidator);

var coursesSchema = new mongoose.Schema({
	cozName: { 
		type:String, 
		unique:true
	}

});
coursesSchema.plugin(uniqueValidator);

var yearSchema = new mongoose.Schema({
	yrName: { 
		type:String, 
		unique:true
	}

});
yearSchema.plugin(uniqueValidator);

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
var Course = mongoose.model('Course', coursesSchema);
var Year = mongoose.model('Year', yearSchema);
var Question = mongoose.model('Question', questionSchema);


module.exports = {
	Category:Category,
	Course:Course,
	Year:Year,
	Question:Question,
};


