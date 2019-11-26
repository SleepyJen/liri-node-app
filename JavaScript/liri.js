const ax = require('axios');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var inq = require('inquirer');

const file = 'random.txt';
const appendFile = 'log.txt';

require("dotenv").config();

var keys = require('./keys');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);

var input = process.argv[2];
var info = process.argv[3];
var ok = false;

if (!input) {
    mainMenu();
} else {
    if (!info) {
        info = '';
        main();
    } else {
        for (let i = 4; i < process.argv.length; i++) {
            (i === 4) ? info = process.argv[i] : info = info + " " + process.argv[i];
        }
        main();
    }
}

function mainMenu() {
    ok = true;
    inq.prompt({
        type: 'list',
        message: 'What would you like to do?',
        choices: ['concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-say', 'Quit'],
        name: 'Choice'
    }).then(result => {
        const chosen = result.Choice;
        if (chosen === 'Quit') {
            process.exit();
        } else if (chosen === 'concert-this') {
            input = 'concert-this';
            getInfo('Artist');
        } else if (chosen === 'spotify-this-song') {
            input = 'spotify-this-song';
            getInfo('Song');
        } else if (chosen === 'movie-this') {
            input = 'movie-this';
            getInfo('Movie');
        } else {
            input = 'do-what-it-say';
            main();
        }
    });

}

function getInfo(search) {
    inq.prompt({
        type: 'input',
        message: `Please type in a ${search}`,
        name: 'in'
    }).then(result => {
        info = result.in;
        main();
    });
}

function concertThis(artist) {
    const urlBand = "https://rest.bandsintown.com/artists/" + artist + `/events?app_id=${process.env["BAND_ID"]}`;
    ax.get(urlBand).then(result => {
        const venue = result.data[0].venue;
        const time = result.data[0].datetime;
        let string1 = `\nArtist: ${artist}\nVenue name: ` + venue.name + "\nCountry: " + venue.country + "\nCity: " + venue.city + ", " + venue.region + "\nDate: " + moment(time).format('LLLL') + "\n";
        fs.appendFile(appendFile, string1, err => {
            if (err) throw err;
        });
        console.log(string1);
        if (ok) {
            mainMenu();
        }
    }).catch(err => {
        throw err;
    });
}

function spotifyIt(song) {
    if (song === "") {
        song = "The Sign";
    }

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            let data = response.tracks.items
            for (let i = 0; i < data.length; i++) {
                let string = "Artist: " + data[i].artists[0].name + "\nname: " + data[i].album.name + "\nPreview Link: " + data[i].preview_url + "\nAlbum name: " + data[i].album.name + "\n";
                console.log(string);
                fs.appendFile(appendFile, "\n" + string, err => {
                    if (err) throw err;
                });
            }
            if (ok) {
                mainMenu();
            }
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movieThis(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
    }
    const urlMovie = `http://www.omdbapi.com/?apikey=${process.env["MOVIE_ID"]}&t=${movie}`;
    ax.get(urlMovie).then(result => {
        const data = result.data;
        console.log(data.Ratings);
        let IMDBratings;
        let rottenTomatoes;
        if (data.Ratings.length > 1) {
            IMDBratings = data.Ratings[0].Value;
            rottenTomatoes = data.Ratings[1].Value;
        } else {
            if (data.Ratings.length === 0) {
                IMDBratings = "N/A";
                rottenTomatoes = "N/A";
            } else {
                if (data.Ratings[0].Source === 'Internet Movie Database') {
                    IMDBratings = data.Ratings[0].Value;
                    rottenTomatoes = "N/A";
                } else {
                    IMDBratings = "N/A";
                    rottenTomatoes = data.Ratings[0].Value;
                }
            }
        }
        let string = `\n*Title: ${data.Title} \n*Release Year: ${data.Year} \n*IMDB Rating: ${IMDBratings} \n*Rotten Tomatoes Rating: ${rottenTomatoes}` +
            `\n*Produced in: ${data.Country} \n*Language: ${data.Language} \n*Plot: ${data.Plot}\n*Actors: ${data.Actors}`;
        console.log(string);
        fs.appendFile(appendFile, string, err => {
            if (err) throw err;
        });
        if (ok) {
            mainMenu();
        }
    });
}

function main() {
    if (input === 'concert-this') {
        if (!info) {
            concertThis('Celine Dion');
        } else {
            concertThis(info);
        }
    } else if (input === 'spotify-this-song') {
        if (!info) {
            console.log('this was hit')
            spotifyIt("");
        } else {
            spotifyIt(info);
        }
    } else if (input === 'movie-this') {
        if (!info) {
            movieThis("");;
        } else {
            movieThis(info);
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