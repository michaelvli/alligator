<?php
	
/**
 * Word Class
 */
 
class Word {
	private $word;
	private $story;
//	private $dateCreated;
	private $currentWord;
	private $wordsArray = array();
			
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
		$db = new dbHandler();
		$rows_array = $db->select_Words_userid($user_id);
//		$row_obj = $db->selectQuery("words", "", $user_id); // dynamic select statement
		$this->wordsArray = $rows_array;
		return $rows_array;
	}
	
	public function getCurrentWordIndex(){
		$index = "";
		$i = 0;
		
		while ($index === "") 
		{
			if ($this->wordsArray[$i]["currentWord"] == true)
			{
				$index = $i;
			}        
			$i = $i + 1;
		}
		return $index;
	}
}