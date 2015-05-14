<?php

function createWord(){
	// use SLIM's environment object to retrieve userID
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$userID = $env["userID"];
	
	// use SLIM's request object to retrieve word and story from params
	$word = $app->request()->params("word"); // parameters from Angular request is coming in as serialized parameters (vs. jsonified object); thus, parameters will be passed in via the url (vs. the body) and thus, can use the params() method (vs. getbody() method) unlike in function CreateUser
	$story = $app->request()->params("story");
	
	// create a Word object
	$word = new Word($word, $story);
	$wordID = $word->save($userID);
	
	if ($wordID)
	{
// 		echo "created new word";
		// get all words
		$word = new Word();
		$wordsArray = $word->getWords($userID);

		// generate success response
		$status = 200;
		$response["message"] = "New word saved";
		$response["words"] = $wordsArray;
		$currentWordIndex = $word->getCurrentWordIndex();
		$response["currentWordIndex"] = $currentWordIndex;
	}
	else
	{
// echo "Oh crap";		
		// generate error response
		$status = 500;
		$response["message"] = "Please try again";				
	}
	sendResponse($status, $response);
}


function showWords(){
	// use SLIM's environment object to retrieve userID
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$userID = $env["userID"];	
	
	// get all words
	$word = new Word();
	$wordsArray = $word->getWords($userID);
		
	if($wordsArray)
	{
		// generate success response
		$status = 200;
		$response["words"] = $wordsArray;
	}
	else
	{
		// generate error response
		$status = 500; // 500 Internal Server Error - A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.
		$response["redirectURL"] = "/create_word";
		$response["message"] = "Looks like you'll need to create a word and story first.";	
	}
	
	sendResponse($status, $response);
/*
	// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
	$sql = "SELECT id, user_id, word, story, dateCreated, currentWord FROM words";
	$sql = $db->prepare($sql);
	$result = $sql->execute(); // execute() returns true on success and false on failure
	$wordsArray = $sql->fetchAll(); // Use fetchAll() if you want all results (as an array), or just iterate over the statement, since it implements Iterator

	// cast data type for id, user_id, dateCreated, currentWord; all data returned from db is of string type
	for ($i = 0; $i < count($wordsArray); $i = $i + 1)
	{
		$wordsArray[$i]["id"] = (int) $wordsArray[$i]["id"];
		$wordsArray[$i]["user_id"] = (int) $wordsArray[$i]["user_id"];
		$date = DateTime::createFromFormat("Y-m-d H:i:s", $wordsArray[$i]["dateCreated"]); // need to specify the format of the date that is returned by db
		$wordsArray[$i]["dateCreated"] = $date->format('F d, Y');
		$wordsArray[$i]["currentWord"] = (bool) $wordsArray[$i]["currentWord"];
	}

	echo json_encode($wordsArray);
*/	
}

?>