'use strict';

/* Controllers */

// "controllers" is declared in sessionController.js
controllers.controller("UserController", function ($scope, userAPIServices){	
	
	// initializing
	$scope.user = {}; // user object used to store user info
	
	$scope.sign_up = function(){
		
		// create object with data from sign in form
		var dataObj = {
			email: $scope.user.email,
			password: $scope.user.password,
			firstName: $scope.user.firstName,
			lastName: $scope.user.lastName
		};

		userAPIServices.signup(dataObj);		
	};

});