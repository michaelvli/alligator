<?php
	
/**
 * Word Class
 */
 
class Word {
	private $word;
	private $story;
//	private $dateCreated;
	private $currentWord;
	private $wordArray = array();
		
protected $db;	
	
	public function __construct($word="", $story=""){
		$this->word = $word;
		$this->story = $story;
		$this->db = new dbConnection();
	}
	
	// 	Saves new word and story into the Words table
	//  success: returns the id of the inserted record
	// 	failure: false
	public function save($user_id){
		
		// $objects of dbHandler class retrieve information from databases
		$db = new dbHandler();
		$newWordID = $db->insert_Words($user_id, $this->word, $this->story);
		return $newWordID;
	}
	
	public function getWords($user_id){
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "SELECT id, user_id, word, story, dateCreated, currentWord FROM words WHERE user_id = :user_id";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(':user_id', $user_id);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$result = $sql->fetchAll(PDO::FETCH_ASSOC); // returns an associative array				
//				echo json_encode($result, JSON_PRETTY_PRINT); // http://www.dyn-web.com/tutorials/php-js/json/multidim-arrays.php
				return $result;
			}
			else
			{
				return false;
			}
		}
		else
		{
			echo "Failed query: word.getCurrentWord() ";
		}
	}
/*	
	public function getCurrentWord($user_id){
		// for more info on using prepared statements, see http://stackoverflow.com/questions/767026/how-can-i-properly-use-a-pdo-object-for-a-select-query
		$sql = "SELECT id, user_id, word, story, dateCreated, currentWord FROM words WHERE currentWord = true AND user_id = :user_id";
		$sql = $this->db->prepare($sql);
		$sql->bindParam(':user_id', $user_id);
		if ($sql->execute()) // execute() returns true on success and false on failure
		{
			if ($sql->rowcount() > 0)
			{
				$result = $sql->fetch(PDO::FETCH_OBJ);
				$this->word = $result->word;
				$this->story = $result->story;
				$this->dateCreated = $result->dateCreated;
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			echo "Failed query: word.getCurrentWord() ";
		}
	}
*/
}