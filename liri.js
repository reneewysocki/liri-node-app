//using .env to hide keys
require("dotenv").config();

//project variables
var keys = require('./keys.js');
var fs = require('fs');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var request = require("request");
var liriReturn = process.argv[2];

switch (liriReturn) {
    case "concert-this":
        concertThis();
        break;

    case "spotify-this-song":
        spotifyThisSong();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;
}


function concertThis() {
    console.log("Concert This")
    var bandName = process.argv[3];
    var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp";
    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {

            var bandData = JSON.parse(body);
            console.log(bandData);
            // console.log(response);
        } else {
            console.log("error: " + error);
            return;
        };
    });
};

function spotifyThisSong() {
    var trackName = process.argv[3];
    // console.log(trackName);
    if (!trackName) {
        trackName = "the-sign";
        // console.log(trackName);
    };
    spotify.search({
        type: 'track',
        query: trackName,
        limit: 1
    },
        function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            // console.log(data);
            var trackInfo = data.tracks.items;
            for (var i = 0; i < 5; i++) {
                if (trackInfo[i] != undefined) {
                    var spotifyResults =
                        "Artist: " + trackInfo[i].artists[0].name + "\n" +
                        "Song: " + trackInfo[i].name + "\n" +
                        "Preview URL: " + trackInfo[i].preview_url + "\n" +
                        "Album: " + trackInfo[i].album.name + "\n"

                    console.log(spotifyResults);
                    console.log(' ');
                };
            };
        });


};

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
                "Actors: " + movieData.Actors + "\n"

            console.log(queryUrlResults);
        } else {
            console.log("error: " + err);
            return;
        };
    });

};

function doWhatItSays() {
    fs.writeFile("random.txt", 'spotify-this-song,"I Want It That Way"', function (err) {
        var song = "spotify-this-song 'I Want It That Way'"
        if (err) {
            return console.log(err);
        };

        console.log(song);
    });
};