'use strict';

/* Controllers */
controllers.controller("NavigationController", function ($scope, $location, sessionServices, userServices, wordServices){
	$scope.checkSession = function(){
		return sessionServices.loggedIn();
	};
	
	$scope.logout = function(){
		sessionServices.setToken(""); // erase token
		userServices.setUser(""); // erase user info
		wordServices.resetWords(); // erase words
		$location.path("/"); // take user back to "log in" page
	};
	
});