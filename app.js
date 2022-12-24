const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");  // pakage required to make request to external API

const app = express();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req,res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req,res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  //console.log(firstName, lastName, email);

  // Creating the javascipt object in format accepted by mailchimp 
  // members is a list of member to be added , each member have some data associated with it
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  // URL to send data
  const url = "https://us13.api.mailchimp.com/3.0/lists/94709ab38f";

  // Method of sending data and authorization
  const options = {
    method: "POST",
    auth: "AshS26:1b04ef9f0e3597ef6f6d69e28a20f2bf-us13"
  };

  // we need to stringify ie compress data which is expected format
  var jsonData = JSON.stringify(data);

  // we use request module from https pakage to send https request to mmailchimp server to add
  // member to our newsletter 
  const request = https.request(url, options, function(response){
      response.on("data", function(data){
      var stat = response.statusCode;
      if(stat === 200)
      {
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }
    });
  });

  request.write(jsonData);
  request.end();



});

app.post("/failure", function(req, res){
  res.redirect("/");
});


// Listner

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

// api key
// 1b04ef9f0e3597ef6f6d69e28a20f2bf-us13

// list id
// 94709ab38f

// @gmail.com
