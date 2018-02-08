require("dotenv").config()
var request = require('request')
var fs = require('fs')

var keys = require('./keys')
var Spotify = require('node-spotify-api')
var Twitter = require('twitter')

var commandArg = process.argv[2]
var titleArg = process.argv[3]

var spotify = new Spotify(keys.spotify)
var client = new Twitter(keys.twitter)

if (commandArg === 'my-tweets') {
	console.log('my tweets')
}
else if (commandArg === 'spotify-this-song') {
	console.log('spotify')
	checkSongTitle()
}

function checkSongTitle() {
	if (!titleArg) {
		// console.log('there is no song name')
		titleArg = 'The Sign'
		getSongAttributes()
	} else {
		// console.log('song title ' + titleArg)
		getSongAttributes()
	}
}

function getSongAttributes() {
	spotify.search({type: 'track', query: titleArg, limit: 1}, function(err, data){
		if (err) {
		    return console.log('Error occurred: ' + err);
		  }
		var songInfo = data.tracks.items[0]
		var songArtist = data.tracks.items[0].artists[0].name
		var songAlbum = data.tracks.items[0].album.name
		var songPreview = data.tracks.items[0].preview_url

		if (!songPreview) {
			songPreview = 'None Available'
		}

		// console.log(songInfo)
		console.log('Artist: ' + songArtist)
		console.log('Song Title: ' + data.tracks.items[0].name)
		console.log('Album Name: ' + songAlbum)
		console.log('Preview URL: ' + songPreview)
	  })
}