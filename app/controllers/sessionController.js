'use strict';

/* Controllers */

var controllers = angular.module("controllers", []);
	
controllers.controller("SessionController", function ($scope, $location, sessionServices, userServices, wordServices){
	
	$scope.user = {};
	
	$scope.log_in = function(){

		// create object with data from log in form
		var dataObj = {
			email: $scope.user.email,
			password: $scope.user.password
		};
		
		var successCallback = function(data, status, headers, config){
			// store token in session
			sessionServices.setToken(data.token);

//			console.log(data.user); // data.user is an object
//			console.log(data.words); // data.words is an array with elements of the object type
//			console.log ("current Word is: " + data.words[0].word);

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
		};
		
		var errorCallback = function(data, status, headers, config){
//			console.log("data: " + JSON.stringify(dataObj));
			$scope.user.message = data.message;
		};
		
		sessionServices.login(dataObj, successCallback, errorCallback);
	}	
});