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
services.factory("userServices", function($localStorage, $sessionStorage){
	
	var service = {}; // declaration of object that will be returned to calling controller
	
	/* public methods via the service object below: */
	
	// manipulating userObject
	service.getUser = function(){
		return $localStorage.userObject;
	};
	
	service.setUser = function(userObj){
		$localStorage.userObject = userObj;
		
		return true;
	};
	
	service.isEmpty = function(){
		for(var prop in $localStorage.userObject) {
			if($localStorage.userObject.hasOwnProperty(prop))
				return false;
		}
		return true;
	};
	
	return service;
});