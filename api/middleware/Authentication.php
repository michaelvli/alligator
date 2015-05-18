<?php
	
/**
 * Authentication Middleware
 */

 class Authentication extends \Slim\Middleware
{	
    public function call()
    {
        //The Slim application
        $app = $this->app;
		
		$checkAuth = function($app){
			// list of routes that are accessible without an access token:
			// these routes are relative to the root path (as specified 
			// in "/xampp/apache/httpd.conf" 
			// and <base href="/api" /> in <root dir>/index.html
//			$publicRoutes = ["/","/myintent/api/log_in","/sign_up"];
			$publicRoutes = ["/","/log_in","/sign_up"];

			// if route is accessible without an access token, skip authentication process
			if (in_array($app->request()->getPathInfo(), $publicRoutes))
			{
				$this->next->call(); // call next middleware or the callback
			}
			else // need to authenticate
			{
				// angular-jwt passes json web token via the "Authorization" header in the following format:
				//
				//		"Bearer tokenheader.tokenpayload.tokensignature"
				//
				// Typically, the format of the "Authorization" header is "Basic <some string>" or 
				// "Digest <some string>".  Thus, SLIM cannot parse the "Authorization" header since it doesn't
				// follow the standard format without adding the following line to either the "httpd.conf" (which 
				// is what I modified for this project) or ".htaccess" file:
				//
				// 		SetEnvIf Authorization "(.*)" HTTP_AUTHORIZATION=$1
				//
				// For more info: http://stackoverflow.com/questions/26256730/slimframework-request-headers-don%C2%B4t-read-authorization/26285310#26285310
				$BearerToken = $app->request->headers->get("Authorization");

				$token = new Token();
				if ($token->authenticateToken($BearerToken)) // call next middleware or the next route callback
				{
					// use SLIM's environment object to store userID
					$env = $app->environment();
					$env["userID"] = $token->getTokenClaim("user_id");

					// if validated token (i.e. not expired) is one or more hours old, then refresh token
					$issued_at = $token->getTokenClaim("iat"); // time (in unix) issued
					$date = new DateTime();
					$currentTime = $date->getTimestamp(); // current time (in unix)
					$difference = ($currentTime - $issued_at); // in seconds
					if ($difference >= 60*60) // if token is more than 1 hour old, then create a new token
					{
						// use SLIM's environment object to set createToken flag (used in sendResponse.php)
						$env["createTokenFlag"] = true;
					}	
										
					$this->next->call(); // call next middleware or the callback
				}
				else // friendly forward
				{
					$status = 401;
					$message = "Please log in first";
					$response = new Response();
					$response->send($status, $message);
				}	
			}			
		};

		$app->hook('slim.before.dispatch', $checkAuth($app)); // http://docs.slimframework.com/hooks/defaults/		
    }
}