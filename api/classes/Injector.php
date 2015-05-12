<?php
	
/*
	Class: Injector - uses fluent style to build an object of class properties.  Since objects 
		of the Injector class are intended to use for constructor injection for another class, 
		it's important to that properties of the object, stored as the "key" parameter (see load() 
		method below) matches the actual name of the property of that class that will receive the
		Injector object.
	
	Constructor signature: None
	 
	Public Methods:
		1.  load(key, value) - pushes elements into an associate array, $properties_array 
		    and then returning the array for subsequent pushes.
			
			Usage:
				$injector = new Injector();
				$injector->load("id", "1")->load("firstName", "Vee")->load("lastName", "Li");

			NOTE: The "key" argument should match a property of the class that will receive the 
			Injector object.
			
		2.  getObj() - returns the $args_array property after casting it into an object.
		
	Private Methods:
		None 
 */
 
class Injector {
	private $properties_array = array();

	// dynamically load constructor with an array
	public function __construct(){
	}
	
	// loads arguments into the args_array
	public function load($key, $value){
		$this->args_array[$key] = $value;
		return $this;
	}

	// Prepares the array for injecting into a PDO statement,
	// which requires ":" to be prepended in the associate array
	// (e.g. "array(':email' => $email, ':firstName' => $firstName")
	public function getArrayForSQL(){
		$newPropArray = array();
		
		foreach($this->args_array as $key => $value) {
			$newPropArray[":".$key] = $value;
		}
		return $newPropArray;
	}
	
	public function getObj(){
		return (object) $this->args_array;
	}
}