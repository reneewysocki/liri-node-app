//using .env to hide keys
require("dotenv").config();

//project variables
var keys = require('./keys.js');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var liriReturn = process.argv[2];
var nodeArgv = process.argv;

//movie or song
var x = "";
//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

switch (liriReturn) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
    if(x){
        spotifyThisSong(x);
      } else{
        spotifyThisSong("The Sign");
      }
    break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    // instructions for first-time user lurking around on the command line
    default: console.log("\n" + "type any command after 'node liri.js': " + "\n" +
        "concert-this 'any band name'" + "\n" +
        "spotify-this-song 'any song title' " + "\n" +
        "movie-this 'any movie title' " + "\n" +
        "do-what-it-says " + "\n" +
        "Use quotes for multiword titles!");
}



function concertThis() {
    console.log("Concert This")
    var bandName = process.argv[3];
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=ca62766bf3852f06d7defb72472a2a1e";
    request(queryUrl, function (error, response) {

        if (!error && response.statusCode === 200) {
            var bandData = JSON.parse(response.body);
            if (bandData != undefined) {
                var concertResults =
                    "Venue: " + bandData[0].venue.name + "\n" +
                    "Location: " + bandData[0].venue.city + " , " + bandData[0].venue.country + "\n" +
                    "Date and Time: " + bandData[0].datetime 
                console.log("-----------------------");
                console.log(concertResults);
                console.log("-----------------------");
                console.log(' ');
            };
        } else {
            console.log("error: " + err);
            return;
        };
    });
};

function spotifyThisSong(song){
    spotify.search({ 
        type: 'track', 
        query: song,
        limit: 5
    }, function(error, data){
      if(!error){
        console.log("spotify");
        for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");
        }
      } else{
        console.log('Error occurred.');
      }
    });
  }

function movieThis() {
    var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var movieData = JSON.parse(body);
            var queryUrlResults =
                "Title: " + movieData.Title + "\n" +
                "Year: " + movieData.Year + "\n" +
                "IMDB Rating: " + movieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + movieData.Ratings[1].Value + "\n" +
                "Origin Country: " + movieData.Country + "\n" +
                "Language: " + movieData.Language + "\n" +
                "Plot: " + movieData.Plot + "\n" +
                "Actors: " + movieData.Actors 
            console.log("-----------------------");
            console.log(queryUrlResults);
            console.log("-----------------------");
            console.log(' ');
        } else {
            console.log("error: " + err);
            return;
        };
    });

};

function doWhatItSays() {
    fs.writeFile("random.txt", 'spotify-this-song,"I Want It That Way"', function (err) {
        var song = "'I Want It That Way'"
        if (err) {
            return console.log(err);
        };
        trackName = song;
        spotifyThisSong(song);
    });
};
