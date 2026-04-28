const express = require("express");
const app = express();
const ejs = require('ejs')
const mongoose = require("mongoose")
app.set('view engine', 'ejs');
dotenv = require('dotenv').config()
app.use(express.urlencoded({extended: true}))

app.use(express.json())
app.use(express.static("public"))
const userRoute = require("./routers/user.route")
app.use("/api/v1", userRoute)
app.get("/", (req, res) => {
  // res.send(true)
  // res.send(['pampam', 'nony', ])
  //   res.send(products)

  console.log(__dirname);
  res.sendFile(__dirname + "/index.html");
});

app.get('/ejs', (req, res)=>{
  res.render("index", { gender, arrPerson, prodArr });


let arrPerson = [{
  firstName: "ade",
   lastName: "tope",
   email: "adefokun@gmail.com",
   course: "software"}]


// let arrPerson = [person, person, person]

let gender = 'male';

let prodArr = [
  {
    prodName: "charger",
    prodPrice: 20,
    prodDescription: "Fast charging USB-C wall charger",
  },
  {
    prodName: "wireless earbuds",
    prodPrice: 89.99,
    prodDescription: "Noise-cancelling Bluetooth earbuds with charging case",
  },
  {
    prodName: "laptop stand",
    prodPrice: 34.5,
    prodDescription: "Adjustable aluminum laptop stand for ergonomic setup",
  },
  {
    prodName: "mechanical keyboard",
    prodPrice: 119.99,
    prodDescription: "RGB mechanical keyboard with Cherry MX switches",
  },
  {
    prodName: "smart watch",
    prodPrice: 249.99,
    prodDescription: "Fitness tracker with heart rate monitor and GPS",
  },
];
});
app.get("/products", (req, res) => {
  res.render("products", { prodArr });
});
app.post("/delete/:id",(req, res)=>{
  
  console.log(req.params.id)
  res.render(index, {gender, arrPerson} )
});
app.get("/addUser",(req, res)=>{
  res.render('addUser')
})

app.post("/addUser",(req, res)=>{
  let arrPerson = [];
  // let gender = "male"
  console.log(req.body)
  const {firstName, lastName, email, course} = req.body
    arrPerson.push(req.body)
    res.render("index", {arrPerson: arrPerson})
})

//object document 
app.get("/editUser:id", (req, res)=>{
  const {id} = req.params
   const {firstName, lastName, email, course} = req.body
   arrPerson.splice(id, 1,req.body)
   res.render(index, {gender, arrPerson})
})
const URI = process.env.MONGODB_URI;
mongoose.connect(URI);
mongoose.connection.on("connected", () => {
  console.log("database connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.log("cannot connect to database", err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
