const ax = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
const file = 'random.txt';

require("dotenv").config();

var keys = require('./keys');
var moment = require('moment');
var input = process.argv[2];

var spotify = new Spotify(keys.spotify);

function concertThis(artist) {
    const urlBand = "https://rest.bandsintown.com/artists/" + artist + `/events?app_id=${process.env["BAND_ID"]}`;
    ax.get(urlBand).then(result => {
        const venue = result.data[0].venue;
        const time = result.data[0].datetime;

        console.log("\nVenue name: " + venue.name + "\nCountry: " + venue.country + "\nCity: " + venue.city + ", " + venue.region);
        console.log("Date: " + moment(time).format('LLLL') + "\n");
    });
}

function spotifyIt(song) {
    if (song === "") {
        song = "The Sign";
    }
    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            //console.log(response.tracks.items[0].artists[0].name);
            let data = response.tracks.items
            for (let i = 0; i < data.length; i++) {
                console.log("Artist: " + data[i].artists[0].name + "\nname: " + data[i].album.name + "\nPreview Link: " + data[i].preview_url + "\nAlbum name: " + data[i].album.name + "\n");
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(movie) {
    const urlMovie = `http://www.omdbapi.com/?apikey=${process.env["MOVIE_ID"]}&t=${movie}`;
    ax.get(urlMovie).then(result => {
        const data = result.data;
        console.log(`\n*Title: ${data.Title} \n*Release Year: ${data.Year} \n*IMDB Rating: ${data.Ratings[0].Value} \n*Rotten Tomatoes Rating: ${data.Ratings[1].Value}`);
        console.log(`*Produced in: ${data.Country} \n*Language: ${data.Language} \n*Plot: ${data.Plot}\n*Actors: ${data.Actors}`);
    });
}
var info = process.argv[3];

function main() {
    if (input === 'concert-this') {
        concertThis(info);
    } else if (input === 'spotify-this-song') {
        if (!info) {
            spotifyIt("");
        } else {
            spotifyIt(info);
        }
    } else if (input === 'movie-this') {
        if (!info) {
            movieThis("");;
        } else {
            movieThis(info);;
        }
    } else {
        fs.readFile(file, (err, data) => {
            if (err) throw err;
            let arr = data.toString().split(',');
            input = arr[0];
            info = arr[1];
            main();
        });
    }
}
main();