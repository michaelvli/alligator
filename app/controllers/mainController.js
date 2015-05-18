'use strict';

/* Controllers */
controllers.controller("MainController", function ($scope, sessionServices, messageServices){
//	$scope.flash = messageServices;
  
	$scope.getMessage = function(){
		return messageServices.getMessage();
	};
  
	// controls show/hide of <body> in index.html
	$scope.refreshingToken = function(){
		return sessionServices.getRefreshingToken();
	};
	
	$scope.checkSession = function(){
		return sessionServices.loggedIn();
	};
	
	$scope.logout = function(){
		sessionServices.logout();
	};
});