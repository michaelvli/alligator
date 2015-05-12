<?php
	
/**
 * Handles the db connection
 */
 
class dbConnection {

	private $db;

	// create database connection	
	public function __construct(){

		// using $app object to get configuration variables
		$app = \Slim\Slim::getInstance();

		// set db settings
		$db_username = $app->config("db_username");
		$db_password = $app->config("db_password");
		$db_host = $app->config("db_host");
		$db_name = $app->config("db_name");

		// create a PDO object		
		$this->db = new PDO("mysql:host=".$db_host.";dbname=".$db_name, $db_username, $db_password);
		
		// "PDO::ATTR_ERRMODE" and "PDO::ERRMODE_EXCEPTION" causes the PDO object to throws an exception
		$this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	}

	public function getLastInsertId(){
		return $this->db->lastInsertId();
	}
	
	public function prepare($sql){
		return $this->db->prepare($sql);
	}
}