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
		// get userID
		$userID = $user->getID();

		// use SLIM's environment object to set store user id and flags to
		// send proper API response (see Response.php)
		$env = $app->environment();
		$env["userID"] = $userID;
		$env["createTokenFlag"] = true; // Response object will send token
		$env["createUserFlag"] = true; // Response object will send user info
		$env["createWordsFlag"] = true; // Response object will send user's words, if any
						
		// generate success response
		$status = 200;
		$message = "Welcome back!";
	}
	else
	{
		// generate error response
		$status = 401;
		$message = "Please log in first";
	}

	// send response
	$response = new Response();
	$response->send($status, $message);
}


function refreshToken(){
	// use SLIM's environment object to set store user id and flags to
	// send proper API response (see Response.php)
	$app = \Slim\Slim::getInstance();
	$env = $app->environment();
	$env["createTokenFlag"] = true; // Response object will send token
					
	// generate success response
	$status = 200;
	
	// send response
	$response = new Response();
	$response->send($status);
}

?>