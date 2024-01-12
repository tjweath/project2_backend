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

const userSchema = new mongoose.Schema({
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

    // const bookSchema = new Schema({
    //     title: String,
    //     author: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'Author'
    //     }
    // })

    // const Book = mongoose.model('Book', bookSchema)

    const accountSchema = new Schema({
        name: String,
    })

    const Account = mongoose.model('Account')

    // Following app.get /book endpoint built in Library 
    // app.get('/book', async (req, res) => {
    //     const allBooks = await Book.find({}).populate('author')
    //     res.json(allBooks)
    // })

    app.get('/account', async (req, res) => {
        const allAccount = await Account.find({}).populate('account')
        res.json(allAccount)
    })