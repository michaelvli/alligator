// For more info on injectors, see: http://www.webdeveasy.com/interceptors-in-angularjs-and-useful-examples/
// "services" is declared in sessionServices.js
services.factory("refreshTokenInterceptor", function($rootScope, $localStorage, $sessionStorage){
	var service = {};	
	
	service.response = function(response){
		console.log("in response interceptor ");
		if (response.status===401 && response.data.error && response.data.error === "invalid_token") 
		{
			console.log("response status: " + response.status);
		}
		else if ($sessionStorage.token != undefined)
		{
			$rootScope.token = $sessionStorage.token; // presence of non-null token in $rootScope triggers navigation pane	
		}		
		return response;
	}
	
	return service;
})