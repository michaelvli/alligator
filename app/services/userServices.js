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
services.factory("userServices", function($http, urls){
	
	var service = {}; // declaration of object that will be returned to calling controller
	var userObject = {}; // declaration of object that stores user information
	
	/* public methods via the service object below: */
	
	// new user sign up
	service.signup = function(dataObj, successResponse, errorResponse){
		
		// create object to capture arguments for the $http request
		var request = {
			method: 'POST',
			url: urls.BASE_API + "/sign_up",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var signupRequest = $http(request).success(successResponse).error(errorResponse);
		
		return signupRequest;		
	};
	
	// manipulating userObject
	service.getObj = function(){
		return userObject;
	};
	
	service.setObj = function(userObj){
		userObject = userObj;
	};
		
	return service;
});