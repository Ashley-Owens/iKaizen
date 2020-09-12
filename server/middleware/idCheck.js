
const Habit = require("../models/habit");
const Entry = require("../models/entry");
const User = require("../models/user");

const idCheck = (req, res, next, schema) => {
    try {
        var element;
        if(schema === "Entry"){
            element = await Entry.findById(id);
        }else if(schema === "Habit"){
            element = await Habit.findById(id);
        }else if(schema === "User"){
            element = await User.findById(id);
        }else{
            return res.status(500).json({error: "Internal Server Error: Did not enter correct schema type into middleware"});
        }
    } catch (error) {
        return res.status(400).json({ error: "Invalid ID" });
    }

    if (!element) {
        return res.status(404).json({ error: "No such entry exists" });
    }

    if (req.user._id.toString() !== element.user.toString()) {
        return res.status(401).json({ error: "ID not found" });
    }
    req.object = element;
    next();
    
};
  
module.exports = idCheck;