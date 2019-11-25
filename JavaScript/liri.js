const ax = require('axios');

require("dotenv").config();

var keys = require('./keys.js');
var moment = require('moment');

//var spotify = new Spotify(keys.spotify);

function concertThis(artist) {
    const urlBand = "https://rest.bandsintown.com/artists/" + artist + `/events?app_id=${process.env["BAND_ID"]}`;
    ax.get(urlBand).then(result => {
        console.log(result.data[0]);
        const venue = result.data[0].venue;
        console.log("Venue name: " + venue.name + "\nCountry: " + venue.country + "\nCity: " + venue.city + ", " + venue.region + "\n");

    });
}

concertThis("Celine Dion");