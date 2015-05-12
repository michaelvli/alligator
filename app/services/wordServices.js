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
services.factory("wordServices", function($http, urls){
	
	var service = {}; // declaration of object that will be returned to calling controller
	var wordsArray = []; // stores an array of words with each word containing object elements (the elements are actually the individual columns of the "Words" db table)
	var currentWordIndex;
	
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

	var getCurrentWordIndex = function(wordsArr){
		
		var index;
		var i = 0;
			
		while (index === undefined)
		{
			if (wordsArr[i].currentWord == true)
			{
				index = i;
			}        
			i = i + 1;
		}
		return index;
	}
		
	service.getCurrentWord = function(){
		return wordsArray[currentWordIndex]; // returns an object
	};
	
	service.getPreviousWord = function(index){		
		var previousWordsArray = wordsArray; // make a copy of array containins all words
		previousWordsArray.splice(currentWordIndex, 1); // remove current word, resulting in previous words only
		return previousWordsArray; // returns an array with elements of the object type
	}
	
	service.setArr = function(wordsArr){
		wordsArray = wordsArr;
		currentWordIndex = getCurrentWordIndex(wordsArr);
	};

	service.resetArr = function(){
		wordsArray = [];
	};

	return service;
});