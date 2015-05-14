// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
// "services" is declared in sessionServices.js
services.factory("authorizationInterceptor", function($rootScope, $location, $localStorage, $sessionStorage){
	var service = {};	
	
	// "Request" interceptors get called with a http config object. The function is free to modify the 
	// config object or create a new one. The function needs to return the config object directly, or 
	// a promise containing the config or a new config object.
	service.request = function(config) { // this is a "request" interceptor
		
		// adding JSON web token to config object
		config.headers = {
			AuthToken: $localStorage.token
		}
		return config;
    }
	
	return service;
})