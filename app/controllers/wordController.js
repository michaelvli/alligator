'use strict';

/* Controllers */
// "controllers" is declared in sessionController.js
controllers.controller('WordController', function ($rootScope, $scope, $location, wordServices, wordAPIServices, userServices) {

	$scope.user = {
		firstName: userServices.getUser().firstName,
		lastName: userServices.getUser().lastName,
		city: userServices.getUser().city,
		state: userServices.getUser().state
	}

	if (wordServices.getWordCount() > 0)
	{	
		$scope.word = {
			word: wordServices.getCurrentWord().word,
			story: wordServices.getCurrentWord().story,
			dateCreated: wordServices.getCurrentWord().dateCreated
		}
	}
	
	$scope.createWord = function(){
		var dataObj = {
			word: $scope.word.word,
			story: $scope.word.story
		};

		var successCallback = function(data, status, headers, config){
			console.log(data.message);
			
			// store words and array index of current word into wordServices
			wordServices.setWords(data.words, data.currentWordIndex);

			// take user to "show words" page
			$location.path("/show_words"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t
		};
		
		var errorCallback = function(data, status, headers, config){
			console.log(data.message);
		};
		
		wordAPIServices.createWord(dataObj, successCallback, errorCallback);
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
				// take user to the current word page
				$location.path("/log_in"); // http://stackoverflow.com/questions/14201753/angular-js-how-when-t		
				console.log(data.message);
			}	
		};
		
		wordAPIServices.showWords(successCallback, errorCallback);
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