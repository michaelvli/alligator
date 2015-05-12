<?php

/**
 * Echoing json response to client
 * @param String $status_code Http response code
 * @param Int $response Json response
 */
 
function sendResponse($status_code, $response) {
    $app = \Slim\Slim::getInstance();
		
    // Http response code
	$app->response->setStatus($status_code);

	// setting response content type to json
	$app->response->headers->set("Content-Type", "application/json");

//    echo json_encode($response, JSON_PRETTY_PRINT);
    echo json_encode($response);
}