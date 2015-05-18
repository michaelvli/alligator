// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
// Interceptor for responseErrors (vs. response)- https://code.angularjs.org/1.2.18/docs/api/ng/service/$http

// "services" is declared in sessionServices.js
services.factory("responseInterceptor", function($q, messageServices){
	var service = {};	

	service.response = function(response){
		if (response.data.message != undefined)
		{
			messageServices.setMessage(response.data.message);
		}	
		return response;
	}
	
	return service;
})