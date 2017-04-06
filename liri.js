//Loading the modules
var fs = require('fs');
var spotify = require('spotify');
var request = require('request');
var twitter = require('twitter');
//Loading in the hidden file keys (will be ignored)
var keys = require('./keys.js');

//Loading in the client requests
var action = process.argv[2];
var value = process.argv[3];

//Switch-case to determine which function will run
switch (action) {
    case "my-tweets":
        getTweets();
        break;

    case "spotify-this-song":
        searchSong();
        break;

    case "movie-this":
        searchMovie();
        break;

    case "do-what-it-says":
        doThis();
        break;
}

//-----~~~~~getTweets function~~~~~-----
function getTweets() {
    //pulling in keys for request
    var client = new twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var params = {
        screen_name: 'tweave09',
        count: 20
    };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("\n", "---~~~Last 20 Tweets~~~---");
        for (var i = 0; i < tweets.length; i++) {
            console.log("\n", tweets[i].created_at, tweets[i].text); //'%j \n' took out the %j... still works
        }
    });
};

//-----~~~~~searchSong function~~~~~-----
function searchSong() {
    var params = {
        type: "track",
        query: value || "the sign ace of base"
    };
    spotify.search(params, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
        console.log("\n", "---~~~Spotify Results~~~---");
        // for (var i = 0; i < data.length; i++){
        var path = data.tracks.items[0];
        console.log("\n", 'Artist(s): ' + path.artists[0].name, "\n", 'Album: ' + path.album.name, "\n", 'Song Name: ' + path.name, "\n", 'Preview Link: ' + path.preview_url);
        // }
    });
};

//-----~~~~~searchMovie function~~~~~-----
function searchMovie() {
    var movie = value || "Mr. Nobody";
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json", function(error, response, body) {
        // If there were no errors and the response code was 200 (i.e. the request was successful)
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Year Released: " + body.Year);
            console.log("IMDB Rating: " + body.imdbRating);
            console.log("Countries: " + body.Country);
            console.log("Language(s): " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            //console.log("Rotten Tomatos Rating: " + body.Ratings.Source);
        }
    });
}
