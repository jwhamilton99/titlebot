var accessToken = "K_NvPiOJYeExNZYBj047Zj3kn3rZutRfFUCtFrrCEgs98Q05d7WeUO2mhKWUktBc";
var urlArray = [];
var nameArray = [];
var cacheValue = "";

class LinkedList {
	first = null;
	last = null;
	length = 0;
	
	constructor() {
		this.first = null;
		this.last = null;
		this.length = 0
	}
	
	find(word) {
		var currNode = this.first;
		while(currNode.next != null) {
			if(currNode.baseWord == word) {
				return currNode;
			}
			currNode = currNode.next;
		}
		return null;
	}
	
	getRandomWord() {
		var i = Math.floor(Math.random()*this.length);
		console.log(i);
		
		var n = this.first;
		
		for(var j = 0; j < i; j++) {
			n = n.next;
		}
		
		return n.baseWord;
	}
	
	addNode(word, next) {
		if(this.length == 0) {
			var n = new Node(word, next);
			this.first = n;
			this.last = n;
			this.length = 1;
		} else {
			var n = this.find(word);
			if(n != null) {
				n.addWord(next);
			} else {
				n = new Node(word, next);
				this.last.next = n;
				this.last = n;
				this.length++;
			}
		}
	}
}

class Node {
	nextList = [];
	baseWord = "";
	nextNode = null;
	
	constructor(word, next) {
		this.baseWord = word;
		this.nextList = ([next]);
		this.nextNode = null;
	}
	
	addWord(next) {
		this.nextList.push(next);
	}
	
	getRandomNext() {
		return this.nextList[Math.floor(Math.random()*(this.nextList.length-1))];
	}
}

//taken from https://www.html5rocks.com/en/tutorials/cors/
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

function getArtistId(str) {
	var req = new XMLHttpRequest();
	req.open("GET", "https://api.genius.com/search?q="+str+"&access_token="+accessToken, false);
	req.send();
	var parsedRes = JSON.parse(req.response);
	var hits = parsedRes.response.hits;
	var id = (hits[0].result.primary_artist.id);
	return id;
}

function getSongs(artistId) {
	var urlStr = "";
	var page = 1;
	var next = 2;
	
	while(next != null) {
		var req = new XMLHttpRequest();
		req.open("GET", "https://api.genius.com/artists/"+artistId+"/songs?per_page=50&page="+page+"&access_token="+accessToken, false);
		req.send();
		var parsedRes = JSON.parse(req.response);
		var songs = parsedRes.response.songs;
		next = parsedRes.response.next_page;
		for(var i = 0; i < songs.length; i++) {
			nameArray.push(songs[i].title);
			urlArray.push(("http://www.genius.com"+songs[i].api_path));
		}
		page++;
		if(next != null) {
			next++;
		}
	}
	//return urlStr;
}

function getArtistName(artistId) {
	var req = new XMLHttpRequest();
	req.open("GET", "https://api.genius.com/artists/"+artistId+"?access_token="+accessToken, false);
	req.send();
	var parsedRes = JSON.parse(req.response);
	return parsedRes.response.artist.name;
}

function makeNewTitle() {
	var wordLengthArray = [];
	for(i in nameArray) {
		console.log(nameArray[i]);
		var splName = nameArray[i].split(" ");
		wordLengthArray.push(splName.length);
		for(var j = 0; j < splName.length-1; j++) {
			nameList.addNode(splName[j], splName[j+1]);
		}
	}
	
	var min = wordLengthArray[0];
	var max = wordLengthArray[0];
	for(var i = 1; i < wordLengthArray.length; i++) {
		if(wordLengthArray[i] > max) {
			max = wordLengthArray[i];
		} else if(wordLengthArray[i] < min) {
			min = wordLengthArray[i];
		}
	}
	var length = Math.floor(Math.random()*max)+min;
	
	var outputStr = "";
	
	var firstWord = nameList.getRandomWord();
	outputStr+=firstWord;
	currentWord = firstWord;
	for(var i = 1; i < length; i++) {
		if(nameList.find(currentWord) != null) {
			currentWord = nameList.find(currentWord).getRandomNext();
		} else {
			currentWord = nameList.getRandomWord();
		}
		outputStr+=(" "+currentWord);
	}
	return outputStr;
}

function scrapeLyrics(url) {
	var req = createCORSRequest('GET', url);
	req.send(null);
	return req.responseText;
}


	var nameList = new LinkedList();

function getLyrics() {	
	if(document.getElementById("artist").value != cacheValue) {
	urlArray = [];
	nameArray = [];
	nameList = new LinkedList();
	cacheValue = document.getElementById("artist").value;
	document.getElementById("out").innerHTML = "Searching For Artist...";
	var artistString = document.getElementById("artist").value;
	var artistId = getArtistId(artistString);
	var resultArtist = getArtistName(artistId);
	document.getElementById("out").innerHTML += ("<br>Found artist \""+resultArtist+"\"");
	document.getElementById("out").innerHTML += ("<br>Searching for songs... (This might take a while)");
	getSongs(artistId);
	document.getElementById("out").innerHTML += ("<br>Found "+(urlArray.length)+" songs by "+resultArtist+"<br>Getting song titles...");
	} else {
		document.getElementById("out").innerHTML = ("");
	}
	document.getElementById("out").innerHTML += ("<br>Generating new title...");
	document.getElementById("out").innerHTML += ("<br><br>New Title: "+makeNewTitle());
	
	document.getElementById("progressOut").innerHTML = "";
	document.getElementById("out").innerHTML += "<br><br>Done<br>Press the button again to get another title!";
}