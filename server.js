import express from "express";
import session from "express-session"
import authRouter from "./routes/auth.js"
import fileRouter from "./routes/file.js"
import meRouter from "./routes/me.js"
import peopleRouter from "./routes/people.js"
import appointmentRouter from "./routes/appointment.js"
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
//lets you use PUT/DELETE in forms
import methodOverride from 'method-override'
import expressLayouts from "express-ejs-layouts";
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import connectDB from "./db/db.js";
import attachUser from "./middleware/attachUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()

//use ejs templates
app.use(expressLayouts)
app.set('layout', './layouts/main')
app.set('view engine', 'ejs')

//cookie parser
app.use(cookieParser());

app.use(methodOverride('_method'))

//serve any file inside the 'public' folder publicly
app.use(express.static(path.join(__dirname, 'public')));

const secret = process.env.SECRET
//to be able to grab body from api ajax
app.use(express.json())
//to be able to grab body from form
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
//get current user globaly
app.use(attachUser);

//connect to db
connectDB()

const PORT = 5001

app.use('/', fileRouter)
app.use('/api', meRouter)
app.use('/api', authRouter)
app.use('/api', peopleRouter)
app.use('/api', appointmentRouter)

// import Book from "./db/models/Book.js"
// async function updateUser(){
//   await Book.updateMany(
//   { is_available: { $exists: false } },
//   { $set: { is_available: true } }
// );
// }
// updateUser()

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})