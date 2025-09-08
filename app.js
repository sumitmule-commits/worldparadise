 const express = require("express");
 const app = express();
 const mongoose = require("mongoose");
 const Listing = require("./models/listing.js")
 const path = require("path");
 const methodOverride = require("method-override");
 const ejsMate = require("ejs-mate");
 const wrapAsync = require("./utils/wrapAsync.js")
 const ExpressError = require('./utils/ExpressError');
 const { listingSchema } = require ("./schema.js")

 const MONGO_URL = "mongodb://127.0.0.1:27017/worldparadise";

 main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public"))); // this is for to join the static files like css , and here we used it for css 


//home route
 app.get("/",(req,res) =>
        res.send("hello")
)

//index route
 app.get("/listings" , async(req,res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
 });

 //new route , write it before show route otherwise system will recognise it by id and u get error 
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id" , async(req,res) =>{
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//create new listing
app.post("/listings", wrapAsync (async (req, res,next ) => {
  let result = listingschema.validate(req.body);
  console.log(result);
  const newListing = newListing(req.body.listing);
  await newlisting.save();
  res.redirect("/listings");
})
);

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});


//Update Route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});


//Delete Route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});







//testing
// app.get("/testing" , async(req , res) =>{
//   let sampleListing = new Listing ({
//     title: " homevilla",
//     description :"lovegoa",
//     price : 2000,
//     location : "goa",
//     country : "india"
//   })

//   await sampleListing.save();
//   console.log("sample is listed")
//   res.send("sample is tested")
// })

// app.all('*', (req, res, next) => {
//   next(new ExpressError (404,"page not found!"));
// });

// app.use((err, req, res, next) => {
//   let {statusCode,messege} = err;
//   res.status(statusCode).send(messege);
// });


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
