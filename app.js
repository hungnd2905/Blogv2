//jshint esversion:6

// require relevant npm packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//const variables
const homeStartingContent = "Welcome to Duy Hung.Nguyen's Personal Homepage";
const aboutContent = "I aspire to become a professional software developer, especially for web-based applications. With the knowledge gained from my studies at TU Darmstadt and HTWK Leipzig, I am passionate to continue learning and expanding my knowledge. I am an easy-going, optimistic person and enjoy swimming, photography and traveling.";
const contactContent = "Contact me at www.github.com/hungnd2905";

// use npm packages
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// connect to a database called BlogDB in localhost
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

//connect to a database called BlogDb in Mongodb-Cloud, username and password is hidden.
mongoose.connect("mongodb+srv://<hidden-username>:<hidden-password>@cluster0.6jrin.mongodb.net/blogDB", {useNewUrlParser: true});
//create postSchema
const postSchema = {
  title: String,
  content: String
};

//create mongoose model using the schema to define posts collection
const Post = mongoose.model("Post", postSchema);


//if home-route is called, all data in mongoose model Post will be transfered via 2 var "startingContent" and "posts"
// to home.ejs file,which then will be rendered
app.get("/", function(req, res){
  //find all posts in posts collection and render that in the home.ejs file
  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

// if compose-route is called, compose.ejs file will rendered
app.get("/compose", function(req, res){
  res.render("compose");
});

// post-method to parse input-data ("title" and "content") from input-form in compose-ejs-page
app.post("/compose", function(req, res){
  //create a new post document using mongoose model
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  //save the document to database
  // add a call back to the mongoose save() method
  // redirect to the home-route
  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

//if posts-route with var :postID is called, the post.ejs file with current postID is rendered.
app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

//if about-route is called, the about.ejs file is rendered
app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

//if contact-route is called, the contact.ejs file is rendered
app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if (port == null || port == ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server has started successfully");
});
