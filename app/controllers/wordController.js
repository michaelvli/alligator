'use strict';

/* Controllers */
// "controllers" is declared in sessionController.js
controllers.controller('WordController', function ($scope, $location, userServices, wordServices, urls) {
	
	$scope.user = {
		firstName: userServices.getObj().firstName,
		lastName: userServices.getObj().lastName,
		city: userServices.getObj().city,
		state: userServices.getObj().state
	}

	// need to check if wordArray is empty
	if (wordServices.getCurrentWord() !== undefined)
	{
		$scope.word = {
			word: wordServices.getCurrentWord().word,
			story: wordServices.getCurrentWord().story,
			dateCreated: wordServices.getCurrentWord().dateCreated
		}
	}
	else
	{
		$scope.word = {};
	}

	$scope.createWord = function(){
		var dataObj = {
			word: $scope.word.word,
			story: $scope.word.story
		};

		var successCallback = function(data, status, headers, config){
			console.log(data.message);
			
			// store word data into wordServices
			wordServices.setArr(data.words);
			
			$location.path("/show_words"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t
		};
		
		var errorCallback = function(data, status, headers, config){
			console.log(data.message);
		};
		
		wordServices.createWord(dataObj, successCallback, errorCallback);
	}
	
	$scope.showWords = function(){
		var successCallback = function(data, status, headers, config){
	//		this.word = current word object???
//			$scope.word = data.word;
//			$scope.story = data.story;
//			$scope.dateCreated = data.dateCreated;
			console.log(data.message);
		};
		
		var errorCallback = function(data, status, headers, config){
			// friendly-forwarding
			if (status === 401) // unauthorized
			{
				// store for friendly forwarding
				// $sessionStorage.friendlyRedirect = $location.url();
				
				// take user to the current word page
				$location.path("/log_in"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t		
				console.log(data.message);
			}	
		};
		
		wordServices.showWords(successCallback, errorCallback);
	}
	
//	$http.get('../myIntent/api/words').success(function(data) {
//		console.log("called words api");
	//	$scope.words = data;
//	});
 /* 
	$scope.getCurrentWord = function(){
		for (var i = 0; i < $scope.words.length; i = i + 1)
		{
			if ($scope.words[i].currentWord === true)
			{
				return $scope.words[i];
			}
		}
	};
	
	$scope.getPreviousWords = function(){
		var previousWordsArray = [];
		for (var i = 0; i < $scope.words.length; i = i + 1)
		{
			if ($scope.words[i].current === false)
			{
				previousWordsArray.push($scope.words[i]);
			}
		}
		return previousWordsArray;
	};
*/	
});