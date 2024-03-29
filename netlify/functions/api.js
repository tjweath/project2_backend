import 'dotenv/config'
import express, { Router } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import serverless from 'serverless-http'

const api = express()
api.use(cors())
api.use(bodyParser.json())

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

const router = Router()

router.post('/user/login', async (req, res) => {
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

    const activitySchema = new Schema({
        activity: String,
        day: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        // completed: Boolean
    })
    
    const User = mongoose.model('User', userSchema)
    const Activity = mongoose.model('Activity', activitySchema)
  
    router.post('/account/add' , async (req, res) => {
        try { 
            const createActivity = await Activity.create(req.body)
            res.status(200).json(createActivity)
        } 
        catch(error){
            console.log(error)
            res.sendStatus(500)
        }
    })

    router.get('/activity', async (req, res) => {
        try {
            const allActivity = await Activity.find({}).populate('user')
            res.json(allActivity)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })

    router.get('/activity/:id', async (req, res) => {
        const activity = await Activity.findById(req.params.id).populate('day')
        res.json(activity)
    })
    
    
      router.put('/activity/:id', async (req, res) => {
        try {
            console.log('Request Body:', req.body);
            console.log('Request Params ID', req.params.id);
            const id = req.params.id;
            const updatedActivity = await Activity.findByIdAndUpdate (
                id,
                {
                    activity: req.body.activity,
                    day: req.body.day, 
                    // completed: req.body.completed 
                },
                { new: true }
            );
    
            if (!updatedActivity) {
                return res.status(404).json({ message: "Activity not updated" });
            }
    
            return res.status(200).json(updatedActivity);
        } catch (err) {
            console.log(err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    });

    router.delete('/activity/:id', (req, res) => {
        Activity.deleteOne({"_id": req.params.id})
        .then(() => {
            res.sendStatus(200)
        })
        .catch( err => {
            req.sendStatus(500)
        })
    })
  
    api.use("/api/", router)

    export const handler = serverless(api)
    
