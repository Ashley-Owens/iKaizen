const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const loginRequired = require("../middleware/loginRequired");
const { checkForCredentials } = require("../utils/checkForCredentials")
const User = require("../models/user");
const Entry = require("../models/entry")
const Habit = require("../models/habits")



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
    const {year,month,day}=req.query
    const user = req.user.Entry
})



module.exports = usersRouter;