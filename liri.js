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

checkCommand()

function checkCommand() {
	if (commandArg === 'my-tweets') {
		// console.log('my tweets')
		printMyTweets()
	}
	else if (commandArg === 'spotify-this-song') {
		// console.log('spotify')
		checkSongTitle()
	}
	else if (commandArg === 'movie-this') {
		// console.log('movie')
		checkMovieTitle()
	}
	else if (commandArg === 'do-what-it-says') {
		// console.log('do what it says')
		checkFile()
	}
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

function printMyTweets() {
	var params = {screen_name: 'b3ckyb33', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {	  
			for (var i in tweets) {
			  	var createTime = tweets[i].created_at
			  	var tweet = tweets[i].text

				// console.log(response.body[0].created_at)
				console.log('date' +i+': ' + createTime)
				console.log('tweet: ' + tweet)
			}
		}
	})
}

function checkMovieTitle() {
	if (!titleArg) {
		// console.log('there is no song name')
		titleArg = 'Mr. Nobody'
		checkMovie()
	} else {
		// console.log('song title ' + titleArg)
		titleArg = titleArg.replace(/>/g, '')
		titleArg = titleArg.replace(/</g, '')
		titleArg = titleArg.replace(/ /g, '+')
		console.log('song title ' + titleArg)
		checkMovie()
	}
}
function checkMovie() {
	var omdbUrl = "http://www.omdbapi.com/?t=" + titleArg + "&y=&plot=short&apikey=trilogy"

	request(omdbUrl, function(error, response, body) {
 	 // If the request is successful
  		if (!error && response.statusCode === 200) {
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
   	 		console.log("movie: " + titleArg)
   	 		console.log("link: " + omdbUrl)
   	 		console.log("Title: " + JSON.parse(body).Title)
   	 		// console.log("Data: " + body)
   	 		console.log("Release Year: " + JSON.parse(body).Year)
   	 		console.log("IMDB Rating: " + JSON.parse(body).imdbRating)
   	 		console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value)
   	 		console.log("Country of Origin: " + JSON.parse(body).Country)
   	 		console.log("Plot: " + JSON.parse(body).Plot)
   	 		console.log("Actors: " + JSON.parse(body).Actors)
  } else {
  	console.log("movie error")
  	console.log("link: " + omdbUrl)
  }
})
}

function checkFile() {
	fs.readFile("random.txt", "utf8", function(error, data) {
	// If the code experiences any errors it will log the error to the console.
		if (error) {
		return console.log(error)
		}
		// We will then print the contents of data
		// console.log(data)
		// Then split it by commas (to make it more readable)
		var dataArr = data.split(",")
		// We will then re-display the content as an array for later use.
		// console.log(dataArr)
		commandArg = dataArr[0]
		titleArg = dataArr[1]
		// console.log(commandArg)
		// console.log(titleArg)
		checkCommand()
	})

}