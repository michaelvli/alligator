<?php
	
/**
 * Token Class
 */
 
class Token {
	private $token;
	private $decodedToken_array; // contains the elements of the JSON web token (header, payload, and signature)
	private $key;

	public function __construct(){
		// using $app object to get configuration variables
		$app = \Slim\Slim::getInstance();
		
		// set signature key
		$signature_key = $app->config("signature_key");
		$this->key = $signature_key;
	}
	
	public function createToken($userID){
		
		//get times stamps for registered payload claims, "iat" (issued at) and "exp" (expires at)
		$date = new DateTime();
		$currentTime = $date->getTimestamp();

		// using $app object to get configuration variables
		$app = \Slim\Slim::getInstance();
		
		// load "DURATION"
		$token_duration = $app->config("token_duration");
		$expiration = $currentTime + $token_duration;
		
		$token = array(
			"alg" => "HS256", // header - specifies algorithm
			"typ" => "JWT", // header - specifies JSON Web Token
			"iss" => "https://myintent.org", // registered payload claim
			"aud" => "https://myintent.org", // registered payload claim
			"iat" => $currentTime, // registered payload claim (in Unix time)
// Cookie expires when browser is closed unless "exp" is set
// http://angular-tips.com/blog/2014/05/json-web-tokens-introduction/
			"exp" => $expiration, // registered payload claim (in Unix time)
			"user_id" => $userID // private payload claim
		);

		$this->token = JWT::encode($token, $this->key);

		return true;
	}

	// can only be used after executing authenicateToken()
	public function getToken(){
		return $this->token;
	}

	public function authenticateToken($token){

		// $key is passed into decode() method for authentication purposes.
		// if decoded JWT doesn't match $key, an exception is produced
		try
		{
			$decodedToken_obj = JWT::decode($token, $this->key, array('HS256')); // returns an object
			$this->decodedToken_array = (array) $decodedToken_obj; // casts object into associative array
			return true;
		}
		catch(Exception $e)
		{
//			echo 'Caught exception: ',  $e->getMessage(), "\n";
			return false;
		}
	}

	// can only be used after executing authenicateToken()
	public function getTokenClaim($arrayKey){
		$decodedToken_array = $this->decodedToken_array;
		return $decodedToken_array[$arrayKey];
	}

}