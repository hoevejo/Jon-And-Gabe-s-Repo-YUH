/**
 * @author Gabe Armstrong
 * @author Jon Hoeve
 * Functions for the note routes.
 *
 */

// Pull in the mongoose library.
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

// Grab the Schema object.
const { Schema } = mongoose;

// Make a new Schema for what we wish a Note
// to look like.
const noteSchema = new Schema({
	userId: mongoose.ObjectId,
	subject: String,
	course: Number,
	date: { type: Date, default: Date.now },
	note: String
});

// "Compile" the Schema into a model.
const Note = mongoose.model('Note', noteSchema);

// Create the function for getting ALL the notes.
// export it so we can use it in app.js.
exports.getAll = async function(req, res) {
	const notes = await Note.find({});
	res.json(notes);
}

// Create the getOne function.
// export it so we can use it in app.js.
exports.getOne = async function(req, res){
	// The getOne function searches the note field in
	// all of our notes for a search term.  It returns
	// all the notes that match.
	// We are using a regex to search.
	const notes = await Note.find({ 
		note: { 
			$regex: req.params.searchTerm 
		}
	});
	
	// If there are none that match, send a 404.
	if(notes.length == 0){
		res.sendStatus(404);
		return;
	}

	// Else, send the results back as json.
	res.json(notes);
}

// Create the function for creating a new note.
// export is so we can use it in app.js.
exports.postOne = async function(req, res){
	const note = new Note({
		subject: req.body.subject,
		course: req.body.course,
		note: req.body.note
	});

	let error = note.validateSync();
	if(error){
		res.sendStatus(400);
		console.log(error);
		return;
	}
	note.save();
	res.sendStatus(200);
	return;
}

// Create the function for deleting a note.
// export is so we can use it in app.js.
exports.delete = async function(req, res){
	const notes = await Note.find({ 
		ObjectId: { 
			$regex: req.params.searchTerm 
		}
	});

	if(notes.length == 0){
		res.sendStatus(404);
		return;
	}
	
	notes.deleteOne();
	res.sendStatus(200);
	return;
}

// Create the function for overwrite a note.
// export is so we can use it in app.js.
exports.putOne = async function(req, res){
	let notes = await Note.find({ 
		ObjectId: { 
			$regex: req.params.searchTerm 
		}
	});

	if(notes.length == 0){
		res.sendStatus(404);
		return;
	}
	
	Note.findOne(req.params.ObjectId).then(doc => {
		item["subject"] = req.body.subject;
		item["course"] = req.body.course;
		item["note"] = req.body.note;
		item["date"] = req.body.date;
		doc.save();
	});

}

// Create the function for update a note.
// export is so we can use it in app.js.
exports.updateOne = async function(req, res){
	Note.findByIdAndUpdate(ObjectId, {note : req.body.note});
	Note.findByIdAndUpdate(ObjectId, {subject : req.body.subject});
	Note.findByIdAndUpdate(ObjectId, {course: req.body.course});
	Note.findByIdAndUpdate(ObjectId, {date : req.body.date});
}
