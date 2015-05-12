<?php

function loginUser(){

	// using $app object to get contents of request from Angular app
	$app = \Slim\Slim::getInstance();
	$email = $app->request()->params("email"); // parameters from Angular request is coming in as serialized parameters (vs. jsonified object); thus, parameters will be passed in via the url (vs. the body) and thus, can use the params() method (vs. getbody() method) unlike in function CreateUser
	$password = $app->request()->params("password");

	// create $user object via constructor injection
	$injector = new Injector();
	$injector = $injector ->load("email", $email)->
							load("password", $password)->
							getObj();
	$user = new User($injector);
		
	// check if user email and password match
	if ($user->authenticateEmailPassword()) // if email and password matches, then
	{	
		// get userID and role
		$userID = $user->getID();
		
		// create token
		$token = new Token();
		$token->createToken($userID);
		$encoded_token = $token->getToken();		
		
		// get all words
		$word = new Word();
		$wordsArray = $word->getWords($userID);
				
		// generate success response
		$status = 200;
		$response["message"] = "Welcome back!";
		$response["token"] = $encoded_token;
		$response["user"] = $user->makeUserObj();
		
		// only send $wordsArray in the response if at least 1 word was returned
		if($wordsArray)
		{
			$response["words"] = $wordsArray;	
		}

	}
	else
	{
		// generate error response
		$status = 401;
		$response["message"] = "Email and password are not valid";
	}

	sendResponse($status, $response);
}


function logoutUser(){
	echo "logged out!";
}

?>