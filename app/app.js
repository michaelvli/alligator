'use strict';

/* App Module */

var myIntentProject = angular.module("myIntentProject", [
  "ngRoute",
  "angular-loading-bar", // http://chieffancypants.github.io/angular-loading-bar/
  "ngStorage", // https://github.com/gsklee/ngStorage
  "services",
  "controllers"
]);


// Constants
myIntentProject.constant("urls", {
	BASE: "/", // or	BASE: "http://localhost/myIntent"
	BASE_API: "api/", // or BASE_API: "http://localhost/myIntent/api"
	BASE_APP: "app/", //	or BASE_APP: "http://localhost/myIntent/app"
});
 
// ROUTES
myIntentProject.config(["$routeProvider", "$httpProvider", "$locationProvider", "urls",
	function($routeProvider, $httpProvider, $locationProvider, urls) {
		$routeProvider.
			when("/", { // path is relative to "localhost/projects/myIntent/public/"
				templateUrl: urls.BASE_APP + "templates/show_words.html",
				controller: "WordController"
//				templateUrl: urls.BASE_APP + "templates/log_in.html", // path is relative to "myIntent/public/index.html"
//				controller: "SessionController" // specifying controller here makes it unnecessary to specify the controller in the html
			}).
			when("/sign_up", {
				templateUrl: urls.BASE_APP + "templates/sign_up.html",
				controller: "UserController"
			}).
			when("/log_in", {
				templateUrl: urls.BASE_APP + "templates/log_in.html",
				controller: "SessionController"
			}).	  
			when("/create_word", {
				templateUrl: urls.BASE_APP + "templates/create_word.html",
				controller: "WordController"
			}).
			when("/show_words", {
				templateUrl: urls.BASE_APP + "templates/show_words.html",
				controller: "WordController"
			}).
			otherwise({ 
				redirectTo: '/' 
			});
		// $httpProvider is an Array containing service factories for all synchronous or asynchronous 
		// $http pre-processing of request or postprocessing of responses.
		// authorizationInterceptor is an interceptor that is added to the $httpProvider.interceptors array.		
//		$httpProvider.interceptors.push("routeInterceptor"); // see app/services
		$httpProvider.interceptors.push("authorizationInterceptor"); // see app/services
//		$httpProvider.interceptors.push("refreshTokenInterceptor"); // see app/services
		// use the HTML5 History API
        $locationProvider.html5Mode(true);
	}
]);


myIntentProject.run(function($rootScope, $location, sessionServices, wordServices){

	// urls listed in the publicRoutes array indicate pages that do not require user to be logged in
	var publicRoutes = ["/log_in", "/sign_up"]; // "log in" and "sign up" pages
	
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
//	To figure out the properties and values of the "next" object:
//		for(var propertyName in next) {
//		console.log("property: " + propertyName + " : " + next[propertyName]);   
//		}

		// Make sure that user is logged in to access pages requiring authorization
		if (publicRoutes.indexOf(next.originalPath)== -1) // paths requiring authorization
		{
			// if user is not logged on, direct him to "log in" page
			if(!sessionServices.loggedIn())
			{
				$location.path('/log_in'); // redirect back to log in
			}
		}

		// if user is logged on, then prevent him from going back to "log in" or "sign up" pages
		if(sessionServices.loggedIn()) // user is logged in
		{
			if (wordServices.getWordCount() > 0)
			{
				$location.path("/show_words");
			}
			else
			{
				$location.path("/create_word");
			}
		}		

	});
 
});