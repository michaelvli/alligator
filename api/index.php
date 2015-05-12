<?php
require '../vendor/autoload.php'; // Load the Slim framework

$app = new \Slim\Slim(); //Instantiate a Slim application

// using environment variables (an associative array) to hold variables (e.g. $userID) that may need to be passed into different functions
$env = $app->environment();

// environment configurations:
// heroku will have the environment variable, "SLIM_MODE", set to "test" which will trigger SLIM to use "test" mode (vs. "development" mode)

if (getenv('SLIM_MODE') === true)
{
	$_ENV['SLIM_MODE'] = getenv('SLIM_MODE'); // triggers SLIM to use "test" mode
}

// Only invoked if mode is "production"
$app->configureMode("test", function () use ($app) {
	// $url represents db access info to using mysql db on heroku - https://devcenter.heroku.com/articles/cleardb#using-cleardb-with-php
	$url = parse_url(getenv("CLEARDB_DATABASE_URL"));

    $app->config(array(
        "log.enable" => true,
        "debug" => false,
		"db_username" => $url["user"], 
		"db_password" => $url["pass"],
		"db_host" => $url["host"],
		"db_name" => substr($url["path"], 1),
		"password_cost" => getenv("PASSWORD_COST"), 
		"signature_key" => getenv("SIGNATURE_KEY"),
		"token_duration" => getenv("TOKEN_DURATION")
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
		"password_cost" => PASSWORD_COST, 
		"signature_key" => SIGNATURE_KEY,
		"token_duration" => TOKEN_DURATION
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

/**
  * Middleware
  */
require 'middleware/Authentication.php'; // loading Middleware class

$app->add(new \authentication()); // Adding Middleware instance to SLIM application

/**
 * 	Load Helpers
 */
require "helpers/sendResponse.php";

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
	$app->get("/log_out","logoutUser");

	// Routes - User
	$app->post("/sign_up", "createUser");

	// Routes - Words
	$app->post("/create_word","createWord");
	$app->get("/show_words","showWords");

//});

/**
 * Run the Slim application
 *
 * This method should be called last. This executes the Slim application
 * and returns the HTTP response to the HTTP client.
 */
$app->run();
