<!DOCTYPE html>
<html lang="en">
<head>
	<title>Russell's ELO Experiment</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<center>
<h2>Russell's ELO Score Calculator</h2><br/>
<?php
	ob_implicit_flush(true);

	echo '<form action="ELO5000.php" method="POST">';
	
	echo '<br/>';
	echo '<button name="Display" type="submit" value="1">Display All Scores</button>';
	echo '</form>';
?>
</center>
<br/>
</body></html>