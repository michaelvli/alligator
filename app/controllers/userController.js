'use strict';

/* Controllers */

// "controllers" is declared in sessionController.js
controllers.controller("UserController", function ($scope, $location, sessionServices, userServices, wordServices){	
	
	$scope.user = {};
	
	$scope.sign_up = function(){
		
		// create object with data from sign in form
		var dataObj = {
			email: $scope.user.email,
			password: $scope.user.password,
			firstName: $scope.user.firstName,
			lastName: $scope.user.lastName
		};
		
		var successCallback = function(data, status, headers, config){
			
			// store token in session
			sessionServices.setToken(data.token);

			// store user data into userServices
			userServices.setUser(data.user);			
			
			// reset words
			wordServices.resetWords();
			
			// success message
			$scope.message = data;
			
			// take user to the current word page
			$location.path("/create_word"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t

		};
		
		var errorCallback = function(data, status, headers, config){
//			console.log("data: " + JSON.stringify(dataObj));
			console.log(data.message);
			$scope.user.message = data.message;
		};

		userServices.signup(dataObj, successCallback, errorCallback);		
	};

});