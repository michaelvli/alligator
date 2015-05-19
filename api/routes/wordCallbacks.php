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
		// set flag to include words in proper API response (see Response.php)
		$env["createWordsFlag"] = true; // Response object will send user's words
		
		// generate success response
		$status = 200;
		$message = "New word saved";
	}
	else
	{
		// generate error response
		$status = 500;
		$message = "Please try again";				
	}
	
	// send response
	$response = new Response();
	$response->send($status, $message);
}

?>