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
services.factory("sessionAPIServices", function($http, $location, urls, sessionServices, userServices, wordServices, messageServices){
	
	var service = {}; // declaration of object that will be returned to calling controller
		
	/* public methods via the service object below: */	
	// existing user log in
	service.login = function(dataObj){

		// create object to capture arguments for the $http request
		var request = {
			method: "POST",
			url: urls.BASE_API + "log_in",
			skipAuthorization: true, // doesn't send JWT - https://github.com/auth0/angular-jwt
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var loginRequest = $http(request).success(function(data, status, headers, config){
//			console.log ("current Word is: " + data.words[0].word); // data.words is an array with elements of the object type

			// store user data into userServices
			userServices.setUser(data.user);

			// if user doesn't have a word, then need to create a word
			if(typeof(data.words) === "undefined") // data.words is an array with elements of object type
			{	
				$location.path("/create_word"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t
			}
			else // user has at least one word
			{
				// store word data into wordServices
				wordServices.setWords(data.words, data.currentWordIndex);
			
				// take user to the words page
				$location.path("/show_words"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t				
			}

		}).error(function(response){
			messageServices.getMessageNow();
		});
		
		return loginRequest;
	};
	
	service.refreshToken = function(){
		// create object to capture arguments for the $http request
		var request = {
			method: "POST",
			url: urls.BASE_API + "refresh_token"
		}
	
		var refreshRequest = $http(request).success(function(data, status, headers, config){
				// hide page while refreshing token
				sessionServices.setRefreshingToken(false);
			}).error(function(data, status, headers, config){
				// log out user
				sessionServices.logout();
			});
		
		return refreshRequest;
	};

	return service;
});