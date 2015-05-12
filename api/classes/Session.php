<?php
	
/**
 * Session Class
 */
 
class Session {
	private $userID;
	protected $db;	
		
	public function __construct($userID){
		$this->userID = $userID;
	}
	
	public function getUserID(){
		return $this->userID;
	}

}