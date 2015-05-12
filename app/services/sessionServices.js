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

services.factory("sessionServices", function($http, urls){
	
	var service = {}; // declaration of object that will be returned to calling controller
	
	/* public methods via the service object below: */
		
	// existing user log in
	service.login = function(dataObj, successResponse, errorResponse){
		
		// create object to capture arguments for the $http request
		var request = {
			method: 'POST',
			url: urls.BASE_API + "/log_in",
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var loginRequest = $http(request).success(successResponse).error(errorResponse);
		
		return loginRequest;
	}
	
	return service;
});