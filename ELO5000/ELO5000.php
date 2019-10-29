<!DOCTYPE html>
<html lang="en">
<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<center>
<h2></h2><br/>
<?php
ob_implicit_flush(true);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once('functions.php');

echo 'Processing...!<br/>';
$Max_Score = 7000;

for($x = 2000;$x <= $Max_Score;$x+=100){
	// how_many_games_needed_to_get_this_ELO_score($x, 1500, 2700); // First version, with fixed min/max values for Player B
	how_many_games_needed_to_get_this_ELO_score($x, 1500, 3300); // Make Player B max score higher after each increment, giving Player A the ability to gain
};
?>
</body></html>