<?php

class Response{
	private $response;

	public function __construct(){
		// get flags from SLIM's environment object
		$app = \Slim\Slim::getInstance();
		$env = $app->environment();
		$userID = $env["userID"];
		
		// generates a new token and inserts into API response
		if ($env["createTokenFlag"] == true)
		{
			// create a new token
			$token = new Token();
			$token->createToken($userID);
			$encoded_token = $token->getToken();
			
			// insert token in response
			$this->response["token"] = $encoded_token;
		}
		
		// generates a user object and inserts into API response
		if ($env["createUserFlag"] == true)
		{
			// create $user object via constructor injection
			$injector = new Injector();
			$injector = $injector ->load("id", $userID)->
									getObj();
			$user = new User($injector);
			$user->fillByID();
			$this->response["user"] = $user->makeUserObj();
		}
		
		// generates an array of the user's words and inserts into API response
		if ($env["createWordsFlag"] == true)
		{
			// get all words for the user
			$word = new Word();
			$wordsArray = $word->getWords($userID);

			// only send $wordsArray in the response if at least 1 word was returned
			if($wordsArray)
			{
				$this->response["words"] = $wordsArray;
				$currentWordIndex = $word->getCurrentWordIndex();
				$this->response["currentWordIndex"] = $currentWordIndex;
			}
		}
	}
		
	public function send($status_code, $message=""){
	    $app = \Slim\Slim::getInstance();
		
		// setting response content type to json
		$app->response->headers->set("Content-Type", "application/json");

		// adds the Http response code to the API response
		$app->response->setStatus($status_code);

		// adds a message to the API response
		if ($message !== "")
		{	
			$this->response["message"] = $message;
		}	
		
		// send the API response
		echo json_encode($this->response);
	}
}