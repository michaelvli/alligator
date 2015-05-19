// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
// Interceptor for responseErrors (vs. response)- https://code.angularjs.org/1.2.18/docs/api/ng/service/$http

// "services" is declared in sessionServices.js
services.factory("responseErrorInterceptor", function($q, $location, sessionServices, messageServices){
	var service = {};	

	service.responseError = function(rejection){
		// http status codes:
		// 401 - not authorized (username does not exist, wrong password, invalid token)
		// 403 - forbidden (user account was flagged)
		if (rejection.status === 401 || rejection.status === 403)
		{
			sessionServices.logout();
		}
		messageServices.setMessage(rejection.data.message)
		return $q.reject(rejection);
	}
	
	return service;
})