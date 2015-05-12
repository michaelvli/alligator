'use strict';

/* Controllers */

var controllers = angular.module("controllers", []);
	
controllers.controller("SessionController", function ($rootScope, $scope, $location, sessionServices, userServices, wordServices, $localStorage, $sessionStorage){
	
	$scope.user = {};
	
	$scope.log_in = function(){

		// create object with data from log in form
		var dataObj = {
			email: $scope.user.email,
			password: $scope.user.password
		};
		
		var successCallback = function(data, status, headers, config){
			// store token in session
			$sessionStorage.token = data.token;
		    $rootScope.token = $sessionStorage.token; // presence of non-null token in $rootScope triggers navigation pane
//			console.log(data.user); // data.user is an object
//			console.log(data.words); // data.words is an array with elements of the object type
//			console.log ("current Word is: " + data.words[0].word);

			// store user data into userServices
			userServices.setObj(data.user);
		
			// if user doesn't have a word, then need to create a word
			if(typeof(data.words) === "undefined") // data.words is an array with elements of object type
			{	
				$location.path("/create_word"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t
			}
			else // user has at least one word
			{
				// store word data into wordServices
				wordServices.setArr(data.words);

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
	
	$scope.log_out = function(){
		
	};
	
});