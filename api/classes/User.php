<?php
	
/*
	Class: User
	
	Constructor signature: requires an object ($injector) from the Injector class to deliver 
		information for the following User class properties:
			1. id			
			2. email		
			3. password		
			4. firstName	
			5. lastName		
			6. birthday
 
	Public Methods:
		1. __construct(array) - constructor
		2. getID() - returns id
		
	Private Methods:
		1. loadConstruct(array) - private - loads the private User class properties with values 
				from the Injector object, $injector.
		2. updateHash() - updates the hash as necessary (i.e. when the password_cost changes)
		3. loadDbRow(object) - loads properties of the User class with values in from the object 
				($db)of the dbHandler class.
		4. checkEmail
		5. authenticateEmailPassword
		6. save
 */
 
class User {
	private $id;
	private $firstName;
	private $lastName;
	private $email;
	private $password; // user entered password - this value is NOT stored in db
	private $passwordHash; // system-generated/db-stored hash - this value NOT entered by user
	private $birthday;

	// dynamically load constructor with an array
	public function __construct($injector_obj)
	{							
		$this->loadConstruct($injector_obj);
	}
	
	// assigns properties to User class to properties of the $injector object
	private function loadConstruct($injector_obj)
	{
		foreach($injector_obj as $key => $value)
		{
			$this->$key = $value;
		}
	}
		
	// returns false only if there was a problem
	private function updateHash(){

		// checks if the hash needs to be updated
		if (Password::checkReHash($this->passwordHash))
		{
			// $objects of dbHandler class retrieve information from databases
			$db = new dbHandler();
			$success = $db->update_Users_password($this->id, $this->password);

			if($success === false)
			{
				return false; // indicates there was a problem with the update_Users_password query 
			}
		}
		return true;
	}
	
	// loads all info from the users table for a specific user
	private function loadDbRow($row_obj){
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$this->id = $row_obj->id;
		$this->email = $row_obj->email;
		$this->firstName = $row_obj->firstName;
		$this->lastName = $row_obj->lastName;
		$this->birthday = $row_obj->birthday;
		
		// db doesn't contain a column that stores an unhashed password
		$this->passwordHash = $row_obj->passwordHash; // passwordHash is first set in the class here
	}
	
	public function getID(){
		return $this->id;
	}

	// check if email exists in db
	// if email is found, $row_obj will be set to an object containing all db columns for the 
	// specific email will be returned; otherwise, $row_obj = false. 
	public function checkEmail(){
		// $objects of dbHandler class retrieve information from databases
		$db = new dbHandler();
//		$row_obj = $db->select_Users_email($this->email); 
		$row_obj = $db->selectQuery("users", $this->email);
		return $row_obj;
	}

	// check to see if hash and password match
	public function authenticateEmailPassword(){
		$row_obj = $this->checkEmail();
		
		if ($row_obj)
		{
			if(password_verify($this->password, $row_obj->passwordHash))
			{
				// loads data from query into User class properties
				$this->loadDbRow($row_obj);
				
				// updates hash if necessary
				if (!$this->updateHash()) // updateHash() only returns false if there was a problem
				{	
					return false;
				}
				return true;
			}
		}
		return false;
	}

	// creates an object that is "safe" to send back to client (i.e. without sensitive info)
	public function makeUserObj(){
		// creating a object of stdClass
		$userObj = new stdClass();
		
		// adding properties to the new object
		$userObj->firstName = $this->firstName;;
		$userObj-> lastName = $this->lastName;
		$userObj-> email = $this->email;
		$userObj-> birthday = $this->birthday;		
		
		return $userObj;
	}

	// 	Saves new user info into the Users table
	//  success: returns the id of the inserted record
	// 	failure: false
	public function save(){
		// set the "passwordHash" property to a new hashed password (brand new user doesn't have one yet)
		$this->passwordHash = Password::createHash($this->password); // create a hash for the password		

		// Except for "id" and "password, create an Injector object that holds the User class properties.
		// "id" is generated by db 
		// "password" (vs. "passwordHash") is not stored in db; "password" is entered by the user
		$injector = new Injector();
		foreach($this as $key => $value) {
			if ($key !== "id" && $key !== "password")
			{	
				$injector = $injector->load($key, $value);
			}
		}
		// transform $injector into an array with a ":" prepended to the key of each element
		$injector = $injector->getArrayForSQL();
		
		// $objects of dbHandler class retrieve information from databases
		$db = new dbHandler();
		$newUserID = $db->insert_Users($injector);
		return $newUserID;
	}
}