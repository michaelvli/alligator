// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
// "services" is declared in sessionServices.js
services.factory("tokenInterceptor", function(sessionServices){
	var service = {};	
	
	service.response = function(response){
		
		// if a token was included in the response, set the new token
		if (response.data.token != undefined)
		{
			sessionServices.setToken(response.data.token);
		}	
		
		return response;
	}
	
	return service;
})