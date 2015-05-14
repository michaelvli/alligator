/* 
	Using "factory", "service", and "provider" services to hide implementation of logic found in:
		1. sessionController.
	
	Resources: 
		1.  BEST - http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/
		2.  http://stackoverflow.com/questions/15666048/service-vs-provider-vs-factory
		3.  http://stackoverflow.com/questions/18939709/when-to-use-service-instead-of-factory
	
*/

"use strict"; // all variables must be declared

// "services" is declared in sessionServices.js
services.factory("wordServices", function($http, urls, $localStorage, $sessionStorage){
	
	var service = {}; // declaration of object that will be returned to calling controller
	var wordsArray = []; // stores an array of words with each word containing object elements (the elements are actually the individual columns of the "Words" db table)
	var currentWordIndex = ""; // stores the index value of the "current" word in wordsArray[].
	
	/* public methods via the service object below: */
	
	// creating a new word
	service.createWord = function(dataObj, successResponse, errorResponse){
		
		var request = {
			method: "POST",
			url: urls.BASE_API + "/create_word",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		};
	
		var showWordsRequest = $http(request).success(successResponse).error(errorResponse);
		
		return showWordsRequest;
	}
	
	// logged in user getting all words
	service.showWords = function(successResponse, errorResponse){
		
		var request = {
			method: "GET",
			url: urls.BASE_API + "/show_words"
		};
	
		var showWordsRequest = $http(request).success(successResponse).error(errorResponse);
		
		return showWordsRequest;
	}
	
	// methods for manipulating wordObject
		
	service.getCurrentWord = function(){
		
		if (wordsArray == "" )
		{
			wordsArray = $localStorage.wordsArray;
		}
		if (currentWordIndex == "")
		{
			currentWordIndex = $localStorage.currentWordIndex;
		}
		return wordsArray[currentWordIndex]; // returns an object
	};
	
	service.getPreviousWord = function(index){		
		var previousWordsArray = wordsArray; // make a copy of array containing all words
		previousWordsArray.splice(currentWordIndex, 1); // remove current word, resulting in previous words only
		return previousWordsArray; // returns an array with elements of the object type
	}

	service.storeWords = function(){
		$localStorage.wordsArray = wordsArray;
	};

	service.storeCurrentWordIndex = function(){
		$localStorage.currentWordIndex = currentWordIndex;
	};
	
	service.setWords = function(wordsArr, index){
		// store array of words
		wordsArray = wordsArr;
		service.storeWords();
		
		// store array index for current word
		// getCurrentWordIndex returns a promise
		currentWordIndex = index;
		service.storeCurrentWordIndex();
	};
	
	service.resetWords = function(){
		// reset array of words
		wordsArray = [];
		service.storeWords();

		// reset array index for current word
		currentWordIndex = "";
		service.storeCurrentWordIndex();
	};

	service.getWordCount = function(){
		// if localStorage doesn't have array of words, then this user isn't associated with any words.
		if ((wordsArray == "" || wordsArray == undefined) && $localStorage.wordsArray == undefined)
		{
			return 0;
		}
		else if (wordsArray == "" || wordsArray == undefined)
		{
			wordsArray = $localStorage.wordsArray;
		}
		return wordsArray.length;
	};
	
	return service;
});