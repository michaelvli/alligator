'use strict';

/* App Module */

var myIntentProject = angular.module("myIntentProject", [
  "ngRoute",
  "angular-loading-bar", // http://chieffancypants.github.io/angular-loading-bar/
  "ngStorage", // https://github.com/gsklee/ngStorage
  "services",
  "controllers",
  "angular-jwt"
]);


// Constants
myIntentProject.constant("urls", {
	BASE: "/", // or	BASE: "http://localhost/myIntent"
	BASE_API: "api/", // or BASE_API: "http://localhost/myIntent/api"
	BASE_APP: "app/", //	or BASE_APP: "http://localhost/myIntent/app"
});
 
// ROUTES
myIntentProject.config(["$routeProvider", "$httpProvider", "$locationProvider", "urls", "jwtInterceptorProvider",
	function($routeProvider, $httpProvider, $locationProvider, urls, jwtInterceptorProvider) {
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
		// Interceptors
		$httpProvider.interceptors.push("responseInterceptor"); // responseError interceptor
		$httpProvider.interceptors.push("responseErrorInterceptor"); // responseError interceptor
		$httpProvider.interceptors.push("tokenInterceptor"); // response interceptor
		
		// request interceptor from Oath
		jwtInterceptorProvider.tokenGetter = ["config", "sessionServices", function(config, sessionServices) {

			// Skip authentication for any requests ending in .html
			if (config.url.substr(config.url.length - 5) == ".html") 
			{
			  return null;
			}
			
		    return sessionServices.getToken();
		}];
		$httpProvider.interceptors.push('jwtInterceptor'); // request interceptor
		
		// use the HTML5 History API
        $locationProvider.html5Mode(true);
	}
]);

// Need to address the following routing scenarios:
// 1) User is not logged in and wants to access restricted content
// 2) User is logged in but hasn't created a word before
// 3) User is logged in and wants to access "Sign up" and "Log in" pages
myIntentProject.run(function($rootScope, $location, sessionServices, sessionAPIServices, wordServices){

	// Check type of content user is trying to access
	var publicRoutes = ["/log_in", "/sign_up"]; // all public content
	var basicRoutes = ["/log_in", "/sign_up"]; // "log in" and "sign up" pages only
	var showWordsRoutes = ["/", "/show_words"] // "show words" page

	$rootScope.$on('$locationChangeStart', function(event, next, current){

		// get a refresh token if logged in user is opening up application directly via url (vs. clicking to it)
		if (sessionServices.loggedIn() && current == next) // current == undefined when directly accessing page via url
		{			
			// hide page while refreshing token
			sessionServices.setRefreshingToken(true);
			
			// send token refresh request to API
			sessionAPIServices.refreshToken();
		}	
	});	
	
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
//	To figure out the properties and values of the "next" object:
//		for(var propertyName in next) {
//			console.log("next property: " + propertyName + " : " + next[propertyName]);   
//		}
		
		// Scenario 1: if user is accessing restricted content, user needs to be logged in
		if (publicRoutes.indexOf(next.originalPath) == -1 && !sessionServices.loggedIn()) // restricted content
		{	
			if(!sessionServices.loggedIn()) // user not logged in
			{
				$location.path("/log_in"); // direct user to "log in" page
			}
		}

		// Scenario 2: if request "show words" page, check logged in user has at least one word
		if(showWordsRoutes.indexOf(next.originalPath) >= 0 && sessionServices.loggedIn())
		{
			if (wordServices.getWordCount() == 0) // user doesn't have a word
			{
				$location.path("/create_word"); // direct user to "create word" page
			}
		}

		// Scenario 3: if user is logged on, then prevent him from going back to "log in" or "sign up" pages
		if(basicRoutes.indexOf(next.originalPath) == 0 && sessionServices.loggedIn())
		{
			event.preventDefault();
		}

	});
 
});