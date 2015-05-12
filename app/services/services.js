/* 
	Using "factory", "service", and "provider" services to hide implementation of logic found in:
		1. sessionController.
	
	Resources: 
		1.  BEST - http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/
		2.  http://stackoverflow.com/questions/15666048/service-vs-provider-vs-factory
		3.  http://stackoverflow.com/questions/18939709/when-to-use-service-instead-of-factory
	
*/

"use strict"; // all variables must be declared

var services = angular.module("services", []);

// factory supporting "/app/controllers/sessionController.js"
services.factory("sessionServices", function($http, urls){
	
	var service = {}; // declaration of object that will be returned to calling controller
	
	/* public methods via the service object below: */
	
	// new user sign up
	service.signup = function(dataObj, successResponse, errorResponse){
		
		// create object to capture arguments for the $http request
		var request = {
			method: 'POST',
			url: urls.BASE_API + "/sign_up",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var signupRequest = $http(request).success(successResponse).error(errorResponse);
		
		return signupRequest;		
	}
	
	// existing user log in
	service.login = function(dataObj, successResponse, errorResponse){
		
		// create object to capture arguments for the $http request
		var request = {
			method: 'POST',
			url: urls.BASE_API + "/log_in",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var loginRequest = $http(request).success(successResponse).error(errorResponse);
		
		return loginRequest;
	}

	// creating a new word
	service.createWord = function(dataObj, successResponse, errorResponse){
		
		var request = {
			method: "POST",
			url: urls.BASE_API + "/create_word",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		};
	
		var showWordsRequest = $http(request).success(successResponse).error(errorResponse);
		
		return showWordsRequest;
	};

	service.getCurrentWordIndex = function(wordsArray){
		
		var index;
		var i = 0;
			
		while (index === undefined)
		{
			if (wordsArray[i].currentWord == true)
			{
				index = i;
			}        
			i = i + 1;
		}
		return index;
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
	
	return service;
});

// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
services.factory("authorizationInterceptor", function($localStorage, $sessionStorage){
	var service = {};	
	
	// "Request" interceptors get called with a http config object. The function is free to modify the 
	// config object or create a new one. The function needs to return the config object directly, or 
	// a promise containing the config or a new config object.
	service.request = function(config) { // this is a "request" interceptor
		// adding JSON web token to config object
		config.headers = {
			AuthToken: $sessionStorage.token
		}
		return config;
    }
	
	return service;
})