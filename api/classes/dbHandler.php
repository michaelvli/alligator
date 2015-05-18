<?php

/* 
	Class: dbHandler
	Purpose: exposes queries to access database(s)
	
*/

class dbHandler{
	protected $db;
//	protected $magentoDB;
	
	public function __construct(){
		$this->db = new dbConnection();
//		$this->magentoDB = new dbConnection();
	}
/*
	// For building dynamic queries, see - http://patrickallaert.blogspot.com/2007/09/building-dynamic-sql-queries-elegant.html
	public function selectQuery($table, $email, $id){
//		$sql = "SELECT id, passwordHash, email, firstName, lastName, birthday FROM users WHERE email = :email";
		switch($table)
		{
			case "users":
				$query = "SELECT * FROM users";
				break;
			case "words":
				$query = "SELECT * FROM words";
				break;
			default:
				echo "Failed selectQuery()";
				return false;
		}
		
		$cond = array();
		$params = array();
		
		if (!empty($email)) {
			$cond[] = "email = ?";
			$params[] = $email;
		}

		if (count($cond)) {
			$query .= ' WHERE ' . implode(' AND ', $cond);
		}
		
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$stmt = $this->db->prepare($query);
		
		if ($stmt->execute($params)) // execute() returns true on success and false on failure
		{
			if ($stmt->rowcount() > 0)
			{
				$row = $stmt->fetch(PDO::FETCH_OBJ); // returns false on failure
				if ($row === false)
				{
					return null;	
				}
				return $row; // returns a db row as an object
			}
			else
			{
				return null;
			}
		}
		else
		{
			echo "Failed query: user.checkEmail() ";
		}
		
	}
*/	
	
	public function select_Users_email($email)
	{	
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "SELECT id, passwordHash, email, firstName, lastName, birthday FROM users WHERE email = :email";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":email", $email);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$row = $sql->fetch(PDO::FETCH_OBJ); // returns false on failure
				if ($row === false)
				{
					return null;	
				}
				return $row; // returns a db row as an object
			}
			else
			{
				return null;
			}
		}
		else
		{
			echo "Failed query: user.checkEmail() ";
		}	
	}
	
	public function select_Users_id($id)
	{	
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "SELECT * FROM users WHERE id = :id";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":id", $id);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$row = $sql->fetch(PDO::FETCH_OBJ); // returns false on failure
				if ($row === false)
				{
					return null;	
				}
				return $row; // returns a db row as an object
			}
			else
			{
				return null;
			}
		}
		else
		{
			echo "Failed query: user.checkEmail() ";
		}	
	}
	
	public function select_Words_userid($user_id)
	{	
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "SELECT * FROM words WHERE user_id = :user_id";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":user_id", $user_id);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$rows_array = $sql->fetchAll(PDO::FETCH_ASSOC); // returns an associative array				
//				echo json_encode($rowsArray, JSON_PRETTY_PRINT); // http://www.dyn-web.com/tutorials/php-js
				if ($rows_array === false)
				{
					return null;	
				}
				return $rows_array; // returns a db rows as an associative array
			}
			else
			{
				return null;
			}
		}
		else
		{
			echo "Failed query: select_Words_userid() ";
		}	
	}
	
	public function update_Users_password($id, $password)
	{
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "UPDATE users SET password = :password WHERE id = :id";		
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":id", $id);

		$hash = Password::createHash($password); // returns a hash or false
		if ($hash !== false)
		{
			$sql->bindParam(":password", $hash);
			if ($sql->execute()) // execute() returns true or false
			{
				return true;
			}
			return false;
		}	
		return true;
	}
	
	// 	Inserts a new record into the Users table
	// 	success: returns the id of the newly inserted record
	// 	failure: false
	public function insert_Users($injectorArray){
//echo json_encode($injectorArray);
				
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "INSERT INTO users (firstName, lastName, email, passwordHash, birthday) VALUES (:firstName, :lastName, :email, :passwordHash, :birthday)";		
		$sql = $this->db->prepare($sql);
		
		if ($sql->execute($injectorArray)) // execute() returns true on success and false on failure
		{
		    $lastInsertId = $this->db->getLastInsertId();
			return $lastInsertId;
		}
		else
		{
			return false;
		}
	}
	
	private function getCurrentWord($userID){
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		
		$sql = "SELECT id, user_id, word, story, dateCreated, currentWord FROM words WHERE currentWord = true AND user_id = :userID";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":userID", $userID);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$row = $sql->fetch(PDO::FETCH_OBJ); // returns false on failure
				if ($row === false)
				{
					return null;
				}
				return $row; // returns a db row as an object
			}
			else
			{
				return null;
			}
		}
		else
		{
			echo "Failed query: getCurrentWord ";
		}	
	}
	
	private function update_Words_currentWord($wordID, $value){
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "UPDATE words SET currentWord = :value WHERE id = :id";		
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":value", $value);
		$sql->bindParam(":id", $wordID);

		if ($sql->execute()) // execute() returns true or false
		{
			return true;
		}
		return false;
	}
	
	
	// 	Inserts a new record into the Words table
	// 	success: returns the id of the newly inserted record
	// 	failure: false
	public function insert_Words($userID, $word, $story){
		// set the current "current" word, if it exists, to "previous" before insert new current word
		$currentWord_obj = $this->getCurrentWord($userID);
		if ($currentWord_obj !== null)
		{
			$currentWordID = $currentWord_obj->id;
			if(!$this->update_Words_currentWord($currentWordID, false))
			{
				return false;
			}
		}
		
		// defaults values for new words and stories
		$dateCreated = "";
		
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "INSERT INTO words (user_id, word, story, dateCreated, currentWord) VALUES (:user_id, :word, :story, :dateCreated, :currentWord)";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(":user_id", $userID);
		$sql->bindParam(":word", $word);
		$sql->bindParam(":story", $story);
		$sql->bindParam(":dateCreated", $dateCreated);
		$sql->bindValue(":currentWord", true); // new record is defaulted to the current word
		
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
		    $lastInsertId = $this->db->getLastInsertId();
			return $lastInsertId;
		}
		else
		{
			return false;
		}
	}
	
}