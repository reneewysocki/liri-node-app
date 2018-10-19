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
var moment = require('moment');

var x = "";
//attaches multiple word arguments
for (var i = 3; i < nodeArgv.length; i++) {
    if (i > 3 && i < nodeArgv.length) {
        x = x + "+" + nodeArgv[i];
    } else {
        x = x + nodeArgv[i];
    }
}

switch (liriReturn) {
    case "concert-this":
        concertThis(x);
        break;

    case "spotify-this-song":
        if (x) {
            spotifyThisSong(x);
        } else {
            spotifyThisSong("The Sign");
        }
        break;

    case "movie-this":
        if (x) {
            movieThis(x)
        } else {
            movieThis("Mr. Nobody")
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    // instructions for first-time user lurking around on the command line
    default: console.log("\n" + "type any command after 'node liri.js': " + "\n" +
        "concert-this 'any band name'" + "\n" +
        "spotify-this-song 'any song title' " + "\n" +
        "movie-this 'any movie title' " + "\n" +
        "do-what-it-says " + "\n");
}



function concertThis(bandName) {
    // console.log("Concert This")
    // var bandName = process.argv[3];
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=ca62766bf3852f06d7defb72472a2a1e";
    request(queryUrl, function (error, response) {

        if (!error && response.statusCode === 200) {
            var bandData = JSON.parse(response.body);
            if (bandData != undefined) {
                var concertDate = bandData[0].datetime
                concertDate = moment(concertDate).format('MM/DD/YYYY');
                var concertResults =
                    "Venue: " + bandData[0].venue.name + "\n" +
                    "Location: " + bandData[0].venue.city + " , " + bandData[0].venue.country + "\n" +
                    "Date and Time: " + concertDate
                console.log("-----------------------");
                console.log(concertResults);
                console.log("-----------------------");
                console.log(' ');

                //adds text to log.txt file
                fs.appendFile("log.txt", "\n" + "concert-this: " + bandName + "\n" + concertResults, function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  });
            };
        } else {
            console.log("error: " + err);
            return;
        };
    });
};

function spotifyThisSong(song) {
    spotify.search({
        type: 'track',
        query: song,
        limit: 5
    }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                var spotifyResults =
                    //artist
                    "Artist: " + songData.artists[0].name + "\n" +
                    //song name
                    "Song: " + songData.name + "\n" +
                    //spotify preview link
                    "Preview URL: " + songData.preview_url + "\n" +
                    //album name
                    "Album: " + songData.album.name + "\n" +
                    "-----------------------"
                console.log(spotifyResults)
                //adds text to log.txt file
                fs.appendFile("log.txt",  "\n" + "spotify-this-song: " + song + "\n" + spotifyResults, function(err) {
                    if (err) {
                      return console.log(err);
                    }
                  });
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function movieThis(movieName) {
    // var movieName = process.argv[3];
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var movieData = JSON.parse(body);
            var movieResults =
                "Title: " + movieData.Title + "\n" +
                "Year: " + movieData.Year + "\n" +
                "IMDB Rating: " + movieData.Ratings[0].Value + "\n" +
                "Rotten Tomatoes Rating: " + movieData.Ratings[1].Value + "\n" +
                "Origin Country: " + movieData.Country + "\n" +
                "Language: " + movieData.Language + "\n" +
                "Plot: " + movieData.Plot + "\n" +
                "Actors: " + movieData.Actors
            console.log("-----------------------");
            console.log(movieResults);
            console.log("-----------------------");
            console.log(' ');

            //adds text to log.txt file
            fs.appendFile("log.txt", "\n" + "movie-this: " + movieName + "\n" + movieResults, function(err) {
                if (err) {
                  return console.log(err);
                }
              });
        } else {
            console.log("error: " + err);
            return;
        };
    });

};

function doWhatItSays() {
    fs.readFile("random.txt", 'utf8' ,function(error, data) {
        if (error) throw error;
        // a = data.split(',');
        loggedTxt = data.split(',');
        console.log(loggedTxt);

        var command;
        var parameter;

        command = loggedTxt[0];
        parameter = loggedTxt[1];

        parameter = parameter.replace('"', '');
        parameter = parameter.replace('"', '');
        // console.log(parameter);

        switch (command) {
           case 'concert-this':
               concertThis(parameter);
               break;

           case 'spotify-this-song':
               spotifyThisSong(parameter);
               break;

           case 'movie-this':
               movieThis(parameter);
               break;
        }
    });

};
