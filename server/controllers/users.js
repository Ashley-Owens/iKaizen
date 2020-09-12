const usersRouter = require("express").Router();

const bcrypt = require("bcrypt");
const validator = require("validator");
const loginRequired = require("../middleware/loginRequired");
const { checkForCredentials } = require("../utils/checkForCredentials");
const User = require("../models/user");
const Entry = require("../models/entry")
const Habit = require("../models/habits")

/* --------------------------------------------
        REMEMBER TO NPM INSTALL VALIDATOR
    ------------------------------------------- */

usersRouter.post("/",async (req, res) => {
    const { username, password, email, firstName, lastName } = req.body;
  const { credentialsProvided, message } = checkForCredentials(
    username,
    password
  );

  if (!credentialsProvided) {
    return res.status(400).json({ error: message });
  }

  const passwordHash = await bcrypt.hash(password, 14);
  const newUser = await User.create({ firstName, lastName, username, passwordHash, email });

  res.status(201).json(newUser);
});

usersRouter.put("/myself",loginRequired,async(req,res)=> {
    const updateUser = req.user._id
    let editables = {}
    switch (req.body){
        case req.body.username:
            editables.username=req.body.username;
        case req.body.firstName:
            editables.firstName=req.body.firstName;
        case req.body.lastName:
            editables.lastName=req.body.lastName;
        case req.body.email:
            editables.email=req.body.email;
        case req.body.password:
            {
                const passwordHash = await bcrypt.hash(req.body.password, 14);
                editables.password=passwordHash;
            }
        default:
            break;
    }
    if (editables.length === 0) {
       return res.status(204).end();
    }
    else{
        User.findByIdAndUpdate(updateUser,editables)
    }

});

usersRouter.get("/my/entries",loginRequired,async(req,res)=>{
    const {year, month, day, view = "weekly"} = req.query;
    const userID = req.user._id;


    //When they don't enter a query:
    if(Object.keys(req.query).length === 0){
        return res.status(400).json({error: "No date query entered"});
    }
    try{
        if(view === "weekly"){
            const firstDayofWeek = new Date();
            const lastDayofWeek = new Date();
            const firstDayofWeekOffset = (24*60*60*1000) * firstDayofWeek.currentDay(); 
            const lastDayofWeekOffset = (24*60*60*1000) * (6 - firstDayofWeek.currentDay()); 
            firstDayofWeek.setTime(firstDayofWeek.getTime() - firstDayofWeekOffset);
            lastDayofWeek.setTime(lastDayofWeek.getTime() + lastDayofWeekOffset);
    
            var weekEntries = await Entry.find({user: userID, date: {"$gte": firstDayofWeek, "$lte": lastDayofWeek}});
            res.json(weekEntries);
        } else if(view === "monthly"){
            const date = new Date();
            const currentMonth = date.getMonth();
            const currentYear = date.getFullYear();

            var monthEntries = await Entry.find({user: userID, date: {"$gte": new Date(currentYear, currentMonth, 1), "$lte": date}});
            res.json(monthEntries);
        }else {
            //checking when year or month is not provided:
            if(!year || !month){
                res.status(400).json({error: "Invalid date query"});
            }
            //case when year and month are provided but not the day
            else if(!day){
                var dateFormat = year + "-" + month + "-1";
                if(validator.isDate(dateFormat[new Date()])){ 
                    var searchEntriesNoDay = await Entry.find({user: userID, date: {"$gte": new Date(year, month, 1), "$lte": date}});
                    res.json(searchEntriesNoDay);
                }else{
                    res.status(400).json({error: "Invalid date query"});
                }
            //case when year, month and day are provided
            }else {
                var dateFormat = year + "-" + month + "-" + day;
                if(validator.isDate(dateFormat[new Date()])){ 
                    var searchEntriesWithDay = await Entry.find({user: userID, date: {"$gte": new Date(year, month, day), "$lte": date}});
                    res.json(searchEntriesWithDay);
                }else{
                    res.status(400).json({error: "Invalid date query"});
                }
            }
        }
    }
    catch(error){
        res.status(500).json({error: "Unknown server error"});
    }
    
});

usersRouter.post("/my/habit", loginRequired, async(req, res) => {
    var isRecurring = true;
    if(req.query.isLongTerm != "true" && req.query.isLongTerm != "false"){ //testing if they pass isLongTerm and it is valid
        return res.status(400).json({error: "Invalid query string"});
    }else{
        isRecurring = Boolean(req.query.isLongTerm)
    }

    const {name,isBinary}=req.body;

    if (!name && !isBinary){
        return res.status(400).json({error: "Name or isBinary not given in request"});
    }
    const habit = {};
    const fields = ["name","isBinary"];
    for (let field of fields){
        if (req.body[field]){
            if(field === "isBinary"){
                habit[field] = Boolean(req.body[field])
            }else{
                habit[field] = req.body[field];
            }
        }
    }
    try{
        if(!isRecurring){
            var newHabit = await Habit.create(habit);
            const habitID = newHabit._id;
            req.user.longTermHabits.push(habitID);
        }else{ //is reaccuring
            req.user.reoccurringHabits.set(habit.name, habit.isBinary);
        }
    }
    catch(error){
        return res.status(400).json({error: "Malformed request"});
    }
    res.status(201).end();

});



usersRouter.post("/login", passport.authenticate("local"), async(req, res) => {
    res.status(200).end();
});

usersRouter.post("/logout", loginRequired, async(req, res) => {
    req.logout();
    res.status(200).end();
});

usersRouter.use((err, req, res, next) => {
    return res.status(500).json({
      error: "an error occurred on the server ",
    });
  })


module.exports = usersRouter;