<?php

function createUser() {

		// using $app object to get contents of request from Angular app
		$app = \Slim\Slim::getInstance();
		$email = $app->request()->params("email"); // parameters from Angular request is coming in as serialized parameters (vs. jsonified object); thus, parameters will be passed in via the url (vs. the body) and thus, can use the params() method (vs. getbody() method) unlike in function CreateUser
		$password = $app->request()->params("password");
		$firstName = $app->request()->params("firstName");
		$lastName = $app->request()->params("lastName");

		// create $user object via constructor injection
		$injector = new Injector();
		$injector = $injector ->load("email", $email)->
								load("password", $password)->
								load("firstName", $firstName)->
								load("lastName", $lastName)->
								getObj();
		$user = new User($injector);

		// check if email already exists in db
		$row_obj = $user->checkEmail(); // returns a object containing a row of data if email exists in db.  Otherwise, returns false.

		if($row_obj)
		{
// echo "Email is taken";			
			// generate error response
			$status = 409;
			$message = "Email is already in use";
		}
		else
		{
			$userID = $user->save(); // returns the id of newly inserted row on success (or false on failure)

			if ($userID)
			{
				// use SLIM's environment object to set store user id and flags to
				// send proper API response (see Response.php)
				$env = $app->environment();
				$env["userID"] = $userID;
				$env["createTokenFlag"] = true; // Response object will send token
				$env["createUserFlag"] = true; // Response object will send user info
				
				// generate success response
				$status = 200;
				$message = "Welcome to MyIntent!  To get started, please share meaningful word and story.";
			}
			else
			{
				// generate error response
				$status = 500;
				$message = "Please try again";				
			}
		}

	// send response
	$response = new Response();
	$response->send($status, $message);
}

?>