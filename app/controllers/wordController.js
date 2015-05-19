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
		
		wordAPIServices.createWord(dataObj);
	}	
});