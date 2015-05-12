<?php
	
/**
 * password class
 */
 
class Password {
	
	// creates a hash from the user's password
	public static function createHash($password){
	
		// using $app object to get configuration variables
		$app = \Slim\Slim::getInstance();
	
		// set password cost
		$password_cost = $app->config("password_cost");
		
		// Password is hashed using PHP's password hashing API - http://www.sitepoint.com/hashing-passwords-php-5-5-password-hashing-api/
		// Salt and Cost are automatically provided but can be specified in the $options argument
		$options = [
			"cost" => $password_cost // the default cost is 10
		];
		$hash = password_hash($password, PASSWORD_BCRYPT, $options); // 2nd argument specifies using bcrypt

		return $hash; // returns a hash or false
	}
	
	// checks if the hash needs to be updated
	public static function checkReHash($passwordHash){
		// using $app object to get configuration variables
		$app = \Slim\Slim::getInstance();

		// set password cost
		$password_cost = $app->config("password_cost");
		
		$options = [
			"cost" => $password_cost // the default cost is 10
		];
		// Check if a newer hashing algorithm is available
		// or the cost has changed	
		$needsrehash = password_needs_rehash($passwordHash, PASSWORD_DEFAULT, $options);
		if ($needsrehash) 
		{
			return true;
		}
		return false;
	}

}