const express = require("express");
const twitter = require("twitter");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const my_consumer_key = require("./config/keys").consumer_key;
const my_consumer_secret = require("./config/keys").consumer_secret;
const my_access_token_key = require("./config/keys").access_token_key;
const my_access_token_secret = require("./config/keys").access_token_secret;

/*
  This is the HTTP Twitter Client used to generate HTTP requests to the TwitterAPI
*/
var client = new twitter({
  consumer_key: my_consumer_key,
  consumer_secret: my_consumer_secret,
  access_token_key: my_access_token_key,
  access_token_secret: my_access_token_secret
});

/*
  This is the HTTP GET request performed on the hashtag inputs
*/
app.get("/tweets/:searchVal", function(req, res) {
  var params = {
    q: encodeURIComponent(req.params.searchVal),
    count: 30
  };
  client.get("search/tweets", params, function(error, tweets, response) {
    if (error) {
      console.log(error);
    }
    res.send(tweets);
  });
});

/*
  This is the HTTP GET request performed to retrieve the set of tweets sent back to the original author of tweet to deduce the num_comments per tweet information per tweet
*/
app.get("/comments/:screen_name/:tweet_id", function(req, res) {
  var tweet_id = req.params.tweet_id;
  var screen_name = req.params.screen_name;
  var params = {
    q: "to:" + screen_name,
    since_id: tweet_id,
    count: 20
  };
  client.get("search/tweets", params, function(error, tweets, response) {
    res.send(tweets);
  });
});

/*
  Heroku Deployment specific code for production release
  Server static assets if in production
*/
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server listening on port " + port));
