<?php
	if(isset($_GET['books'])) {
		$myfile = fopen("dist/dbs/books.json", "w");
		fwrite($myfile, $_GET['books']);
	} elseif (isset($_GET['classrooms'])) {
		$myfile = fopen("dist/dbs/classrooms.json", "w");
		fwrite($myfile, $_GET['classrooms']);
	} elseif (isset($_GET['logs'])) {
		$myfile = fopen("dist/dbs/logs.json", "w");
		fwrite($myfile, $_GET['logs']);
	}  elseif (isset($_GET['messages'])) {
		$myfile = fopen("dist/dbs/messages.json", "w");
		fwrite($myfile, $_GET['messages']);
	} elseif (isset($_GET['students'])) {
		$myfile = fopen("dist/dbs/students.json", "w");
		fwrite($myfile, $_GET['students']);
	} elseif (isset($_GET['teachers'])) {
		$myfile = fopen("dist/dbs/teachers.json", "w");
		fwrite($myfile, $_GET['teachers']);
	} elseif (isset($_GET['users'])) {
		$myfile = fopen("dist/dbs/users.json", "w");
		fwrite($myfile, $_GET['users']);
	}
?>