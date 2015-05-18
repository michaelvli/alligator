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

services.factory("sessionServices", function($localStorage, $sessionStorage, $location, userServices, wordServices){
	
	var service = {}; // declaration of object that will be returned to calling controller
	var refreshingToken = false;
	
	/* public methods via the service object below: */
	
	service.logout = function(){
		service.setToken(""); // erase token
		userServices.setUser(""); // erase user info
		wordServices.resetWords(); // erase words
		$location.path("/log_in"); // direct user to "log in" page
	};
	
	service.setToken = function(tokenValue){
		$localStorage.token = tokenValue;
		return true;
	};	

	service.getToken = function(){
		return $localStorage.token;
	};

	service.setRefreshingToken = function(ready) {
		refreshingToken = ready;
	};

	service.getRefreshingToken = function() {
		return refreshingToken;
	};
	
	service.loggedIn = function(){
		if (service.getToken() == undefined || service.getToken() == "")
		{
			return false;
		}
		return true;
	};	

	return service;
});