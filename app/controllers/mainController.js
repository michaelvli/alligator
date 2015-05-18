'use strict';

/* Controllers */
controllers.controller("MainController", function ($scope, sessionServices, messageServices){
  
	$scope.getMessage = function(){
		return messageServices.getMessage();
	};
  	
	$scope.checkSession = function(){
		return sessionServices.loggedIn();
	};
	
	$scope.logout = function(){
		sessionServices.logout();
	};
});