'use strict';

/* Controllers */

var controllers = angular.module("controllers", []);
	
controllers.controller("SessionController", function ($scope, $location, sessionServices, sessionAPIServices){
	
	// initializing
	sessionServices.setRefreshingToken(false); // unhides the <body> in index.html
	$scope.user = {}; // user object used to store user info
	
	$scope.log_in = function(){

		// create object with data from log in form
		var dataObj = {
			email: $scope.user.email,
			password: $scope.user.password
		};

		sessionAPIServices.login(dataObj);
	}	
});