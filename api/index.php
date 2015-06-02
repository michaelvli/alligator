<?php
require '../vendor/autoload.php'; // Load the Slim framework

$app = new \Slim\Slim(); //Instantiate a Slim application

// using environment variables (an associative array) to hold variables (e.g. $userID) that may need to be passed into different functions
$env = $app->environment();

// environment configurations:
// heroku will have the environment variable, "SLIM_MODE", set to "test" which will trigger SLIM to use "test" mode (vs. "development" mode)

if (getenv('SLIM_MODE') === true) // if environment variable, "SLIM_MODE", exists, then set 
{
	$_ENV['SLIM_MODE'] = getenv('SLIM_MODE'); // automatically triggers SLIM to use "test" or "production" mode
}

// Only invoked if mode is "production"
$app->configureMode("production", function () use ($app) {
    $app->config(array(
        "log.enable" => true,
        "debug" => false,		
		"db_username" => DB_USERNAME,
		"db_password" => DB_PASSWORD,
		"db_host" => DB_HOST,
		"db_name" => DB_NAME,
		"password_cost" => 11, 
		"signature_key" => SIGNATURE_KEY,
		"token_duration" => 30
    ));
});

// Only invoked if mode is "development"
$app->configureMode("development", function () use ($app) {
	// load db settings
	require_once dirname(__FILE__) . '/config/db.php';
	
	// load password and token settings
	require_once dirname(__FILE__) . '/config/env.php';
	
    $app->config(array(
        "log.enable" => false,
        "debug" => true,
		"db_username" => DB_USERNAME,
		"db_password" => DB_PASSWORD,
		"db_host" => DB_HOST,
		"db_name" => DB_NAME,
		"password_cost" => 11, 
		"signature_key" => SIGNATURE_KEY,
		"token_duration" => 30
    ));
});


/**
 *	Load Classes
 */
require 'classes/dbConnection.php';
require 'classes/dbHandler.php';
require 'classes/Injector.php';
require 'classes/Password.php';
require 'classes/Token.php';
require 'classes/Session.php';
require 'classes/User.php';
require 'classes/Word.php';
require 'classes/Response.php';

/**
  * Middleware
  */
require 'middleware/Authentication.php'; // loading Middleware class

$app->add(new \authentication()); // Adding Middleware instance to SLIM application

/**
 *	Defining routes
 */

// including route callback functions
require "routes/sessionCallbacks.php";
require "routes/userCallbacks.php";
require "routes/wordCallbacks.php";

// set up route group for API requests
//$app->group("/myintent/api", function () use ($app) {

	// Routes - Sessions
	$app->post("/log_in", "loginUser");
	$app->post("/refresh_token", "refreshToken");

	// Routes - User
	$app->post("/sign_up", "createUser");

	// Routes - Words
	$app->post("/create_word","createWord");

//});

/**
 * Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
