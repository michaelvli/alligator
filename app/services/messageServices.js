/* 
	Using "factory", "service", and "provider" services to hide implementation of logic found in:
		1. sessionController.
	
	Resources: 
		1.  BEST - http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/
		2.  http://stackoverflow.com/questions/15666048/service-vs-provider-vs-factory
		3.  http://stackoverflow.com/questions/18939709/when-to-use-service-instead-of-factory
	
*/

"use strict"; // all variables must be declared

// "services" is declared in sessionServices.js
services.factory("messageServices", function($rootScope){
	
	var service = {}; // declaration of object that will be returned to calling controller
	var queue = [];
	var currentMessage = "";
	
	$rootScope.$on('$routeChangeSuccess', function (event, next, current) {
		currentMessage = queue.shift() || "";
	});
	
	service.getMessage = function(){
		return currentMessage;
	};	

	// if page doesn't change, user may still need to see a message (e.g. failure to log in)
	service.getMessageNow = function(){
		currentMessage = queue.shift() || "";
	};	
	
	service.setMessage = function(message){
		queue.push(message);
	};

	return service;
});