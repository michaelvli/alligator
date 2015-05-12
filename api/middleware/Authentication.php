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

//			echo $app->request()->getPathInfo();

			// if route is accessible without an access token, skip authentication process
			if (in_array($app->request()->getPathInfo(), $publicRoutes))
			{
				$this->next->call(); // call next middleware or the callback
			}
			else // need to authenticate
			{
				$AuthToken = $app->request->headers->get("AuthToken");
				
				$token = new Token();
				if ($token->authenticateToken($AuthToken)) // call next middleware or the next route callback
				{
					
					// use SLIM's environment object to store userID
					$env = $app->environment();
					$env["userID"] = $token->getTokenClaim("user_id");

					$this->next->call(); // call next middleware or the callback
				}
				else // friendly forward
				{
					// store the route
					// send user to log_in page
					// after user logs in, take them to the stored route
					$status = 401;
					$response["WTF"] = $app->request()->getPathInfo();		 
					$response["message"] = "Please log in first";
					sendResponse($status, $response);
				}	
			}			
		};

		$app->hook('slim.before.dispatch', $checkAuth($app)); // http://docs.slimframework.com/hooks/defaults/		
    }
}