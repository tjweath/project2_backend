import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = process.env.PORT || 4000

app.listen(port, () => {
    console.log(`listening on port: ${port}`);
})

mongoose.connect(process.env.DATABASE_URL)

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userEmail: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    }
})

app.post('/user/login', async (req, res) => {
    const now = new Date() 
    if (await User.countDocuments({ "userEmail": req.body.userEmail }) === 0) {
        const newUser = new User({
            userEmail: req.body.userEmail,
            lastLogin: now
        });
        newUser.save()
            .then(() => {
                res.sendStatus(200);
            })
            .catch(err => {
                res.sendStatus(500);
            });
    } else {
        await User.findOneAndUpdate({ "userEmail": req.body.userEmail }, { lastLogin: now });
        res.sendStatus(200);
    }
    })

    const accountSchema = new Schema({
        name: String,
    })

    const activitySchema = new Schema({
        activity: String,
        day: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Day'
        }
    })
    
    const daySchema = new Schema({
        day: String,
    })
    
    const User = mongoose.model('User', userSchema)
    const Account = mongoose.model('Account', accountSchema)
    const Activity = mongoose.model('Activity', activitySchema)
    const Day = mongoose.model('Day', daySchema)

    app.get('/account', async (req, res) => {
        const allAccount = await Account.find({}).populate('account')
        res.json(allAccount)
    })

    app.post('/account/add', async (req, res) => {
        if( await Activity.countDocuments({"activity": req.body.activity}) === 0 ) {
            const newActivity = new Activity({activity: req.body.activity})
            newActivity.save()
            .then(() => {
                addDay(req.body.activity)
            })
        }
        else {
            addDay(req.body.activity)
        }
    
        async function addDay(reqActivity) {
            const activity = await Activity.findOne({"activity": reqActivity})
            const day = new Day({
                day: req.body.day,
                activity: activity,
            })
            day.save()
            .then(() => {
                console.log('New activity added')
                res.sendStatus(200)
            })
            .catch(err => console.error(err))
        }
    })

    app.get('/activity', async (req, res) => {
        console.log('Received request for activity ID:', req.params.id);
        try {
            const allActivity = await Activity.find({}).populate('activity')
            res.json(allActivity)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

    app.get('/activity/:id', async (req, res) => {
        const activity = await Activity.findById(req.params.id).populate('day')
        res.json(activity)
    })





    // app.put('/activity/:id', async (req, res) => {
    //     try {
    //       let day = await Day.findOne({ "day": req.body.day })
    //       if (!day) {
    //         const newDay = new Day({ name: req.body.day })
    //         day = await newDay.save()
    //       }
      
    //       const id = req.params.id
    //       const updatedActivity = await Day.findByIdAndUpdate(
    //         id,
    //         {
    //           activity: req.body.activity,
    //           day: day._id
    //         },
    //         { new: true }
    //       )
      
    //       if (!updatedActivity) {
    //         return res.status(404).json({ message: "Activity not updated" })
    //       }
      
    //       return res.status(200).json(updatedActivity)
    //     } catch (err) {
    //       console.log(err.message)
    //       res.status(500).json({ message: 'Internal Server Error' })
    //     }
    //   })

