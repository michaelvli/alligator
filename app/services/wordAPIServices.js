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
services.factory("wordAPIServices", function($http, $location, urls, wordServices){
	
	var service = {}; // declaration of object that will be returned to calling controller
	
	/* public methods via the service object below: */
	
	// creating a new word
	service.createWord = function(dataObj){
		
		var request = {
			method: "POST",
			url: urls.BASE_API + "/create_word",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		};
	
		var showWordsRequest = $http(request).success(function(data, status, headers, config){
//			console.log(data.message);
			
			// store words and array index of current word into wordServices
			wordServices.setWords(data.words, data.currentWordIndex);

			// take user to "show words" page
			$location.path("/show_words"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t
		}).error(function(data, status, headers, config){
//			console.log(data.message);
		});
		
		return showWordsRequest;
	}

	return service;
});