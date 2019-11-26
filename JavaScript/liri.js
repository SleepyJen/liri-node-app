const ax = require('axios');
const Spotify = require('node-spotify-api');

require("dotenv").config();

var keys = require('./keys.js');
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
    spotify.search({ type: 'track', query: 'All the Small Things' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log(data);
    });
}

function main() {
    if (input === 'concert-this') {
        let name = process.argv[3];
        concertThis(name);
    }
}