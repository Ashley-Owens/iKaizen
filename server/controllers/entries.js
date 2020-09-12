const entriesRouter = require("express").Router();

const validator = require("validator");
const loginRequired = require("../middleware/loginRequired");
const User = require("../models/user");
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const user = require("../models/user");

entriesRouter.get("/:id", loginRequired, async(req, res) => {
    const id = req.params.id;

    try{
        var entry = await Entry.findById(id);
    }
    catch(error){
        return res.status(400).json({error: "Invalid ID"});
    }
    if(!entry){
        return res.status(404).json({error: "No such entry exists"});
    }
    if (req.user._id.toString() !== entry.user.toString()){
        return res.status(401).json({error: "ID not found"});
    }
    res.status(200).end();
});

entriesRouter.post("/", loginRequired, async(req, res) => {
    const {emotions, habitSelected, date} = req.body;
    const newEntry;
    if(req.body.date){
        if(validator.isDate(req.body.date)){
            date = req.body.date.toDate();
            if(emotions){
                newEntry = await Entry.create({emotions, date});
            }else{
                newEntry = await Entry.create({date});
            }
        } else {
            return res.status(400).json({error: "Invalid Date"});
        }
    } else {
        if(emotions){
            newEntry = await Entry.create({emotions});
        }else{
            newEntry = await Entry.create({});
        }
    }
    try{
        const reoccurringHabits = newEntry.user.reoccurringHabits;
        //creating a habit object for each recurring habit
        for([habitName, isBinary] of reoccurringHabits){
            const habit = Habit.create({habitName, isBinary, date, user:req.user._id})
            newEntry.habitsSelected.push(habit._id); //entering reference for current user
        }
        newEntry.habitsSelected = newEntry.habitsSelected.concat(req.user.longTermHabits);
        newEntry.user = req.user._id;
        req.user.entries.push(newEntry._id);
    }
    catch(error){
        res.status(500).json({error: "Unknown server error"});
    }
});

entriesRouter.put("/:id", loginRequired, async(req, res) => {
    try{
        var entry = await Entry.findById(id);
    }
    catch(error){
        return res.status(400).json({error: "Invalid ID"});
    }
    if(!entry){
        return res.status(404).json({error: "No such entry exists"});
    }
    if (req.user._id.toString() !== entry.user.toString()){
        return res.status(401).json({error: "ID not found"});
    }
    if(!req.body.emotions){
        return res.status(400).json({error: "No Emotion Sent"});
    }


});


module.exports = entriesRouter;
