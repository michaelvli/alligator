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
services.factory("wordServices", function($localStorage, $sessionStorage){
	
	var service = {}; // declaration of object that will be returned to calling controller
//	var wordsArray = []; // stores an array of words with each word containing object elements (the elements are actually the individual columns of the "Words" db table)
//	var currentWordIndex = ""; // stores the index value of the "current" word in wordsArray[].
	
	/* public methods via the service object below: */
	
	// methods for manipulating wordObject
		
	service.getCurrentWord = function(){
		return $localStorage.wordsArray[$localStorage.currentWordIndex]; // returns an object
	};
	
	service.getPreviousWord = function(index){		
		var previousWordsArray = $localStorage.wordsArray; // make a copy of array containing all words
		previousWordsArray.splice($localStorage.currentWordIndex, 1); // remove current word, resulting in previous words only
		
		return previousWordsArray; // returns an array with elements of the object type
	}
	
	service.setWords = function(wordsArr, index){
		// store array of words
		$localStorage.wordsArray = wordsArr;
		
		// store array index for current word
		$localStorage.currentWordIndex = index;
		
		return true;
	};
	
	service.resetWords = function(){
		service.setWords("", "");		
		return true;
	};

	service.getWordCount = function(){
		// if localStorage doesn't have array of words, then this user isn't associated with any words.
		if ($localStorage.wordsArray == undefined || $localStorage.wordsArray == "")
		{
			return 0;
		}

		return $localStorage.wordsArray.length;
	};
	
	return service;
});