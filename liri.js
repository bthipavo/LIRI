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
var dataInfo = {}

checkCommand(commandArg, titleArg, updateFile2)

function checkCommand(commandArg, titleArg, updateFile) {
	if (commandArg === 'my-tweets') {
		// console.log('my tweets')
		printMyTweets(commandArg, titleArg, updateFile)
	}
	else if (commandArg === 'spotify-this-song') {
		// console.log('spotify')
		checkSongTitle(commandArg, titleArg, updateFile)
	}
	else if (commandArg === 'movie-this') {
		// console.log('movie')
		checkMovieTitle(commandArg, titleArg, updateFile)
	}
	else if (commandArg === 'do-what-it-says') {
		// console.log('do what it says')
		checkFile(commandArg, titleArg, updateFile)
	}
	updateFile(dataInfo)
}


function checkSongTitle(commandArg, titleArg, updateFile) {
	if (!titleArg) {
		// console.log('there is no song name')
		titleArg = 'The Sign'
		getSongAttributes(commandArg, titleArg, updateFile)
	} else {
		// console.log('song title ' + titleArg)
		getSongAttributes(commandArg, titleArg, updateFile)
	}
	updateFile(dataInfo)
}

function getSongAttributes(commandArg, titleArg, updateFile) {

	spotify.search({type: 'track', query: titleArg, limit: 1}, function(err, data){
		if (err) {
		    return console.log('Error occurred: ' + err);
		  }
		dataInfo = {
		 	songArtist: data.tracks.items[0].artists[0].name,
		 	songAlbum: data.tracks.items[0].album.name,
		 	songPreview: data.tracks.items[0].preview_url,
		 	songTitle: data.tracks.items[0].name
		}
		updateFile(dataInfo)

		if (!dataInfo.songPreview) {
			dataInfo.songPreview = 'None Available'
		}

		// console.log(dataInfo)
		console.log('Artist: ' + dataInfo.songArtist)
		console.log('Song Title: ' + dataInfo.songTitle)
		console.log('Album Name: ' + dataInfo.songAlbum)
		console.log('Preview URL: ' + dataInfo.songPreview)
	  })
	
}

function printMyTweets(commandArg, titleArg, updateFile) {
	var params = {screen_name: 'b3ckyb33', count: 20};
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {	  
			for (var i in tweets) {
			  	var createTime = tweets[i].created_at
			  	var tweet = tweets[i].text

				// console.log(response.body[0].created_at)
				dataInfo["createTime"+i] = createTime
				dataInfo["tweet"+i] = tweet
				// console.log('date' +i+': ' + createTime)
				// console.log('tweet: ' + tweet)
			}
		}
		console.log(dataInfo)
		updateFile(dataInfo)
	})
	
}

function checkMovieTitle(commandArg, titleArg, updateFile) {
	if (!titleArg) {
		// console.log('there is no song name')
		titleArg = 'Mr. Nobody'
		checkMovie(commandArg, titleArg, updateFile)
	} else {
		// console.log('song title ' + titleArg)
		titleArg = titleArg.replace(/>/g, '')
		titleArg = titleArg.replace(/</g, '')
		titleArg = titleArg.replace(/ /g, '+')
		console.log('song title ' + titleArg)
		checkMovie(commandArg, titleArg, updateFile)
	}
	updateFile(dataInfo)
}
function checkMovie(commandArg, titleArg, updateFile) {
	var omdbUrl = "http://www.omdbapi.com/?t=" + titleArg + "&y=&plot=short&apikey=trilogy"

	request(omdbUrl, function(error, response, body) {
 	 // If the request is successful
  		if (!error && response.statusCode === 200) {
    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
   	 		dataInfo = {
   	 			movie: titleArg,
   	 			link: omdbUrl,
   	 			Title: JSON.parse(body).Title,
   	 		// console.log("Data: " + body)
   	 			ReleaseYear: JSON.parse(body).Year,
   	 			IMDBRating: JSON.parse(body).imdbRating,
   	 			RottenTomatoesRating: JSON.parse(body).Ratings[1].Value,
   	 			CountryofOrigin: JSON.parse(body).Country,
   	 			Plot: JSON.parse(body).Plot,
   	 			Actors: JSON.parse(body).Actors
   	 	}
   	 	console.log(dataInfo)
   	 	updateFile(dataInfo)
  } else {
  	console.log("movie error")
  	console.log("link: " + omdbUrl)
  }
})
}

function checkFile(commandArg, titleArg, updateFile) {
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
		checkCommand(commandArg, titleArg, updateFile)
	})

}
 
function updateFile2(dataInfo) {
	console.log("print")
	if(isEmpty(dataInfo)) {
		console.log("still empty")
	} else {
		fs.appendFile("log.txt", commandArg + " " + titleArg + "\r\n" + JSON.stringify(dataInfo) + "\r\n", function(err) {
				// If the code experiences any errors it will log the error to the console.
				if (err) {
				return console.log(err)
				}
			console.log("log.txt was updated!")
			console.log(dataInfo)
		})
	}
}

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}