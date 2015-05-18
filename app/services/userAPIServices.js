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
services.factory("userAPIServices", function($http, $location, urls, userServices, wordServices, messageServices){
	
	var service = {}; // declaration of object that will be returned to calling controller
	
	/* public methods via the service object below: */
	
	// new user sign up
	service.signup = function(dataObj){
		
		// create object to capture arguments for the $http request
		var request = {
			method: 'POST',
			url: urls.BASE_API + "/sign_up",
			skipAuthorization: true, // doesn't send JWT - https://github.com/auth0/angular-jwt
			params: dataObj // passing "params" (vs. "data") - means API will need to use SLIM's $app->request()->params("email") (vs. $app->request()->getBody()->email followed by json_decode($request)->email)
		}
		
		var signupRequest = $http(request).success(function(data, status, headers, config){
			// store user data into userServices
			userServices.setUser(data.user);			
			
			// reset words
			wordServices.resetWords();
			
			// success message
			messageServices.getMessageNow();
			
			// take user to the current word page
			$location.path("/create_word"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t		
		}).error(function(response){
			messageServices.getMessageNow();
		});
		
		return signupRequest;		
	};
		
	return service;
});