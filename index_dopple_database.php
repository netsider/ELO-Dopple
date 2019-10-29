<!DOCTYPE html>
<html lang="en">
<head>
	<title>Russell's ELO Experiment</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<link rel="stylesheet" type="text/css" href="styles.css" />
</head>
<body>
<center>
<h2>Russell's ELO Matching Example/Experiment</h2><br/>
<?php
ob_implicit_flush(true);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require_once('functions.php');

//Configurable Variables
$DEBUG = 1;
$Player_LOCKED = FALSE;
$Players_Chosen = FALSE;
$Root_DIR = 'Dopples';
$Score_DIR = $Root_DIR . '/Actress_Score/';
$TextName_DIR = $Root_DIR . '/Actress_Name/';
$Picture_DIR = $Root_DIR . '/Actress_Picture/';
$Counter_DIR = $Root_DIR . '/Counters/';
$Sentence_Hint_DIR = $Root_DIR . '/Sentence_Hints/';
$Picture_Width_Percentage = '20%';
$Picture_Height_Percentage = '20%';
$BaseScore = 1500;
$config = parse_ini_file('C:\xampp\SQLlogin.ini', true, INI_SCANNER_RAW);
$table = 'dopple_newww';

//Non-Configurable Variables
$username = $config['username'];
$pwd = $config['pwd'];
$db = $config['db'];
$serverName = $config['server'];
$DB_connected = FALSE;

// echo $db . '<br/>';echo $username . '<br/>';echo $pwd . '<br/>';

$connectionInfo = array("UID" => $username, "pwd" => $pwd, "Database" => $db, "LoginTimeout" => 30, "Encrypt" => 1, "TrustServerCertificate" => 0, "ReturnDatesAsStrings" => 1);
$conn = sqlsrv_connect($serverName, $connectionInfo);
if($conn == false) {
	echo '<pre>';
	die(print_r(sqlsrv_errors(), true));
}else{
	echo 'Database connected!<br/>';
	$DB_connected = TRUE;
};

if($DB_connected){
		$q = 'if not exists (select * from sysobjects where name=\'' . $table . '\' and xtype=\'U\') create table ' . $table . '([id] [bigint] IDENTITY PRIMARY KEY, [Name] [nvarchar](MAX), [Score] BIGINT, [Player] [nvarchar](MAX), [Wins] BIGINT)';
		$theQuery = sqlsrv_query($conn, $q);
			if ($theQuery == false) {
				echo '<pre>';
				die(print_r(sqlsrv_errors()));
				echo '</pre>';
			}else{
				echo 'Insert Complete!<br/>';
				echo '<pre>';
				print_r(sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
				echo '</pre>';
		};
		sqlsrv_free_stmt($theQuery);
};

if(isset($_POST) AND $_SERVER['REQUEST_METHOD'] === 'POST' AND filter_array($_POST) AND $DB_connected){
	if(isset($_POST['LockToPlayer']) AND isset($_POST['LockPlayerCheckBox'])){
		$Player_LOCKED = TRUE;
	};
	if(isset($_POST['ToggleScoreBoard'])){
		echo '<div id="Player_Scores" style="border: 0;border-style: dashed;width: 20%;min-height: 10%;left: 7.5%;">';
		$number_of_scores_to_display = count_files_in_DIR($Score_DIR) / 2;
		
		echo '<table border="1" width="100%"><tr><td colspan="2" align="center"><strong>Current Player Scores</strong></td></tr>';
		echo '<tr><td align="center"><strong>Player:</strong></td><td align="center"><strong>Score:</strong></td></tr>';
		for($x = 1; $x <= $number_of_scores_to_display; $x++){
			$current_score_filename = $Score_DIR . $x . '.txt';
			$current_D_score_filename = $Score_DIR . $x . 'D.txt';
			
			$current_textname_filename = $TextName_DIR . $x . '.txt';
			$current_D_textname_filename = $TextName_DIR . $x . 'D.txt';
			
			if(file_exists($current_score_filename)){
				$current_score = read($current_score_filename);
				if(file_exists($current_textname_filename)){
					$current_playerName = read($current_textname_filename);
					echo '<tr><td align="center">' . $current_playerName . ' (Pair: ' . $x . ')</td><td align="center">' . Round($current_score, 2) . '</td></tr>';
				};
			};
			if(file_exists($current_D_score_filename)){
				$current_D_score = read($current_D_score_filename);
				if(file_exists($current_D_textname_filename)){
					$current_D_playerName = read($current_D_textname_filename);
					echo '<tr><td align="center">' . $current_D_playerName . ' (Pair: ' . $x . ')</td><td align="center">' . Round($current_D_score, 2) . '</td></tr>';
				};
			};
		};
		echo '</table></div><br/>';
	};
	if(isset($_POST['Reset'])){ 
		if($_POST['Reset'] === "1"){
			$number_of_scores_to_reset = count_files_in_DIR($Score_DIR) / 2;
			
			if($DEBUG){ echo 'Reset Pressed!<br/>'; echo 'Number of scores to reset = ' . $number_of_scores_to_reset . '<br/>'; };
			
			if($DB_connected){
				for($x = 1;$x <= $number_of_scores_to_reset;$x++){
					$current_filename = (string)$x;
					$current_D_filename = $x . 'D';
				
					$q = 'UPDATE ' . $table . ' SET Score = ' . $BaseScore . ' WHERE Player = \'' . $current_filename . '\'';
					$Q = 'UPDATE ' . $table . ' SET Score = ' . $BaseScore . ' WHERE Player = \'' . $current_D_filename . '\'';
					if(sqlsrv_query($conn, $q)){
						echo 'Score Reset!<br/>';
					}else{
						echo '<pre>';
						die(print_r(sqlsrv_errors()));
					};
					
					if(sqlsrv_query($conn, $Q)){
						echo 'Score Reset!<br/>';
					}else{
						echo '<pre>';
						die(print_r(sqlsrv_errors()));
					};
					sqlsrv_free_stmt(sqlsrv_query($conn, $q);
					sqlsrv_free_stmt(sqlsrv_query($conn, $Q);
			};
			echo 'Scores Reset.<br/>';
			};
		};
	};
	if(isset($_POST['Left_button']) OR isset($_POST['Right_button'])){
		if(isset($_POST['Left_button'])){
			$winners_array = base64_decode($_POST['Left_button']);
			$new = array();
			$new = json_decode($winners_array);
			$winner = $new[0];
			$Loser = $new[1];
		};
		if(isset($_POST['Right_button'])){
			$winners_array = base64_decode($_POST['Right_button']);
			$new = array();
			$new = json_decode($winners_array);
			$winner = $new[1];
			$Loser = $new[0];
		};
		
		if($DEBUG){
			echo '<pre>';
			echo '<br/>POST:<br/>';
			print_r($winners_array);
			echo '<br/>';
			echo '<br/>';
			print_r($new);
			echo '</pre>';
		};
		
		if(!isset($winner)){
			die('No Winner! Exiting...');
		};
		
		// $WinnerScoreFilename = $Score_DIR . $winner . '.txt';
		// $Winner_Old_Score = read($WinnerScoreFilename);
		// $LoserScoreFilename = $Score_DIR . $Loser . '.txt';
		// $Loser_Old_Score = read($LoserScoreFilename);
	

	$tsql = 'SELECT Score FROM ' . $table . ' WHERE Player = \'' . $winner . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		$row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		$Winner_Old_Score = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);
	
	$tsql = 'SELECT Score FROM ' . $table . ' WHERE Player = \'' . $Loser . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		$row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		$Loser_Old_Score = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);
		
		
		$WinnerCounterFilename = $Counter_DIR . $winner . '.txt';
		if(file_exists($WinnerCounterFilename)){
			$counter = read($WinnerCounterFilename);
			$counter = $counter + 1;
			write($WinnerCounterFilename, $counter);
			if ($DEBUG){ echo 'Winner Counter Updated!<br/>'; };
		};
		
		//FIDE's Implementation of ELO score distribution:
		$k = 32; // ELO K value
		$Winner_Previous_ELO_Expected_Score = ELO($Winner_Old_Score, $Loser_Old_Score);
		$Loser_Previous_ELO_Expected_Score = ELO($Loser_Old_Score, $Winner_Old_Score);
		
		$WinnerTotalPoints = $Winner_Old_Score + $k * (1 - $Winner_Previous_ELO_Expected_Score); 
		$LoserTotalPoints = $Loser_Old_Score + $k * (0 - $Loser_Previous_ELO_Expected_Score);
		
		
		
	$tsql = 'UPDATE ' . $table . ' SET Score = ' . $WinnerTotalPoints . ' WHERE Player = \'' . $winner . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		echo 'Done!<br/>';
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		// $row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		// $Loser_Old_Score = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);
	
	$tsql = 'UPDATE ' . $table . ' SET Score = ' . $LoserTotalPoints . ' WHERE Player = \'' . $Loser . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		echo 'Done!<br/>';
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		// $row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		// $Loser_Old_Score = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);
		
		//Update scores for both players -- Old code
		// if(write($WinnerScoreFilename, $WinnerTotalPoints)){ 
			// if(!isset($_POST['ToggleScoreUpdates'])){
				// echo '<font color="green"><strong>Winner score updated! (Old Score: ' . $Winner_Old_Score . ') (New Score: ' . $WinnerTotalPoints . ') (Change: ' . ($WinnerTotalPoints - $Winner_Old_Score) . ')</font></strong><br/>';
			// };
			
			// if(write($LoserScoreFilename, $LoserTotalPoints)){ 
				// if(!isset($_POST['ToggleScoreUpdates'])){
					// echo '<font color="green"><strong>Loser score updated! (Old Score: ' . $Loser_Old_Score . ') (New Score: ' . $LoserTotalPoints . ') (Change: ' . ($LoserTotalPoints - $Loser_Old_Score) . ')</font></strong><br/>';
				// }
			// };
		// };
		if($DEBUG){
			echo '<br/><strong>Last Round:</strong><br/>';
			echo 'Winner: ' . $winner . ' (' . read($TextName_DIR . $winner . '.txt') . ') ' . ' (Score: ' . read($Score_DIR . $winner . '.txt') . ')';
			echo ' (Old Score: ' . $Winner_Old_Score . ')<br/>';
			echo 'Loser: ' . $Loser . ' (' . read($TextName_DIR . $Loser . '.txt') . ') ' . ' (Score: ' . read($Score_DIR . $Loser . '.txt') . ')';
			echo ' (Old Score: ' . $Loser_Old_Score . ')<br/>';
		};
	};
	if($DEBUG){ echo '<pre>$_POST DATA: '; print_r($_POST); echo '</pre>'; };
};

	//New Game - Choose Players
	$NUM_Files_in_DIR = count_files_in_DIR($Picture_DIR);
	$NUM_Sets_of_Dopples = $NUM_Files_in_DIR / 2; // ÷ by 2, Since we're doing sets
	
	//Randomize Players
	if($Player_LOCKED != TRUE){
		if(RAND(1,2) === 1){
			$Player1 = RAND(1,$NUM_Sets_of_Dopples);
			$Player2 = $Player1 . 'D';
			
			$Designated_Player = $Player1; // Numbered Player will be designated player, since scores are meaningless if not tied to certain player
		}else{
			$Player2 = RAND(1,$NUM_Sets_of_Dopples);
			$Player1 = $Player2 . 'D'; // Numbered files with "D" attached denote the doppleganger (non designated player)
			
			$Designated_Player = $Player2; // So numbered player is designated player
		};
	}else{
		if(isset($_POST['LockToPlayer'])){
			if(RAND(1,2) === 1){
				$Player1 = $_POST['LockToPlayer'];
				$Designated_Player = $Player1; // So numbered player is designated player
				$Player2 = $Player1 . 'D';
			}else{
				$Player2 = $_POST['LockToPlayer'];
				$Designated_Player = $Player2; // So numbered player is designated player
				$Player1 = $Player2 . 'D';
			};
		};
	};
	
	//Check if players chosen correctly (needs update when reverted back to normal version)
	if(isset($Player1) AND isset($Player2)){
		if(is_numeric($Player1)){ // Player 1 is numbered player
			if($Player2 === $Player1 . 'D'){
				$Players_Chosen = TRUE;
			};
		}else{
			if(is_numeric($Player2)){ // Player 2 is numbered player
				if($Player1 === $Player2 . 'D'){
					$Players_Chosen = TRUE;
				};
			};
		};
		if($Player1 === 'D' OR $Player2 === 'D'){
			if($DEBUG){ echo 'A Player is just D!'; };
			$Players_Chosen = FALSE;
		};
	};
	
	if($Players_Chosen === FALSE){
		if($DEBUG){ echo 'Players Chosen!<br/>Player 1: ' . $Player1 . '<br/>Player 2: ' . $Player2 . '<br/>'; };
		echo 'Problem Choosing Players<br/>';
		die('Problem Choosing Players! Die()');
	};
	
	if($DEBUG){ echo 'Players Chosen!<br/>Player 1: ' . $Player1 . '<br/>Player 2: ' . $Player2 . '<br/>'; };
	
	$Player1_filename = $Score_DIR . $Player1 . '.txt';
	$Player2_filename = $Score_DIR . $Player2 . '.txt';

	$Player1_picture_filename = $Picture_DIR . $Player1 . '.jpg';
	$Player2_picture_filename = $Picture_DIR . $Player2 . '.jpg';

	$Player1_name_filename = $TextName_DIR . $Player1 . '.txt';
	$Player2_name_filename = $TextName_DIR . $Player2 . '.txt';
	
	$Player1_counter_filename = $Counter_DIR . $Player1 . '.txt';
	$Player2_counter_filename = $Counter_DIR . $Player1 . '.txt';
	
	if(isset($Designated_Player)){
		$Designated_Player_Text = read($TextName_DIR . $Designated_Player . '.txt');
		$Player_sentence_hint_filename = $Sentence_Hint_DIR . $Designated_Player . '.txt'; // For designated player only
	
		// Check and/or create "Sentence Hint" file for Designated Player -- optional, but useful for proving additional info to the user
		if(!file_exists($Player_sentence_hint_filename)){
			if(write($Player_sentence_hint_filename, 'DEFAULT')){
				if($DEBUG){ echo '<font color="green">Player 1 Sentence Hint File Written!</font><br/>'; };
			}else{
				if($DEBUG){ echo '<font color="red">Player 1 Sentence Hint File NOT Written!</font><br/>'; };	
			};
		}else{
			$Designated_Player_Sentence_Hint_Text = read($Player_sentence_hint_filename);
		};
	};

	// Check and/or create counter file for Player 1/2
	if(!file_exists($Player1_counter_filename)){
		if(write($Player1_counter_filename, 0)){
			if($DEBUG){ echo '<font color="green">Player 1 Counter File Written!</font><br/>'; };
		};
	};
	if(!file_exists($Player2_counter_filename)){
		if(write($Player2_counter_filename, 0)){
			if($DEBUG){ echo '<font color="green">Player 2 Counter File Written!</font><br/>'; };
		};
	};
	
//Check and/or create score file for Player 1/2
if($DB_connected){
		// $Q = 'IF NOT EXISTS (SELECT  1 FROM ' . $table . ' WHERE Player = \'' . $Player1 . '\') BEGIN INSERT ' . $table . ' (id, Player) VALUES (NEXT VALUE FOR dbo.standardsequence, \'' . $Player1 . '\') END;';
		$Q = 'IF NOT EXISTS (SELECT  1 FROM ' . $table . ' WHERE Player = \'' . $Player1 . '\' AND Score > 0) BEGIN INSERT ' . $table . ' (Player, Score) VALUES (\'' . $Player1 . '\', 1500) END;';
		echo $Q . '<br/>';
		$theQuery = sqlsrv_query($conn, $Q);
			if ($theQuery == false) {
				echo $Q;
				echo '<pre>';
				die(print_r(sqlsrv_errors()));
				echo '</pre>';
			}else{
				echo 'Insert Complete!<br/>';
				echo '<pre>';
				print_r(sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
				echo '</pre>';
		};
		sqlsrv_free_stmt($theQuery);
		
		$Q2 = 'IF NOT EXISTS (SELECT  1 FROM ' . $table . ' WHERE Player = \'' . $Player2 . '\' AND Score > 0) BEGIN INSERT ' . $table . ' (Player, Score) VALUES (\'' . $Player2 . '\', 1500) END;';
		echo $Q2 . '<br/>';
		$theQuery = sqlsrv_query($conn, $Q2);
			if ($theQuery == false) {
				echo $Q2;
				echo '<pre>';
				die(print_r(sqlsrv_errors()));
				echo '</pre>';
			}else{
				echo 'Insert Complete!<br/>';
				echo '<pre>';
				print_r(sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
				echo '</pre>';
		};
		sqlsrv_free_stmt($theQuery);
};
	
	if(!file_exists($Player1_filename)){
		if($DEBUG){ echo '<br/><font color="red">Player 1 Score File Not Found.</font><br/>'; };
		
		if(write($Player1_filename, $BaseScore)){ // This is where the database update will go
			if($DEBUG){ echo '<font color="green">Player 1 Score File Written!</font><br/>'; };
		}else{
			if($DEBUG){ echo '<br/><font color="red">Player 1 Score File <strong>creation</b> also failed.</strong><br/>'; };
		}
	}else{
		if($DEBUG){ echo 'Player 1 Score File Exists!<br/>'; };
	};
	
	if(!file_exists($Player2_filename)){ 
		if($DEBUG){ echo '<br/><font color="red">Player 2 Score File Not Found.</font><br/>'; };
		
		if(write($Player2_filename, $BaseScore)){ // This is where the database update will go
			if($DEBUG){ echo '<font color="green">Player 2 Score File Written!</font><br/>'; };
		}else{
			if($DEBUG){ echo '<br/><font color="red">Player 2 Score File <strong>creation</b> also failed.</strong><br/>'; };
		}
	}else{
		if($DEBUG){ echo 'Player 2 Score File Exists!<br/>'; };
	};
	
	//Debugging output
	if($DEBUG){
		echo '-----------------------------------------<br/>';
		echo 'Main DIR = /' . $Root_DIR . '<br/>';
		echo '$Score_DIR (Subdirectory) = ' . $Score_DIR . ' (Files in Dir: ' . count_files_in_DIR($Score_DIR) . ')<br/>';
		echo '$TextName_DIR (Subdirectory) = ' . $TextName_DIR . ' (Files in Dir: ' . count_files_in_DIR($TextName_DIR) . ')<br/>';
		echo '$Picture_DIR (Subdirectory) = ' . $Picture_DIR . ' (Files in Dir: ' . count_files_in_DIR($Picture_DIR) . ')<br/>';
		echo 'Player 1 Score File: ' . $Player1_filename . '<br/>';
		echo 'Player 2 Score File: ' . $Player2_filename . '<br/>';
		echo 'Player 1 Picure Path: ' . $Player1_picture_filename . '<br/>';
		echo 'Player 2 Picure Path: ' . $Player2_picture_filename . '<br/>';
		echo 'Player 1 Text/Name Path: ' . $Player1_name_filename . '<br/>';
		echo 'Player 2 Text/Name Path: ' . $Player2_name_filename . '<br/>';
		if(isset($Designated_Player)){ echo 'Designated Player: ' . $Designated_Player . '<br/>'; };
		echo '-----------------------------------------<br/>';
	};

	//Read current scores, calculate ELO, etc.
	
	// $Player1_currentScore = read($Player1_filename);  // This is where the database update will go
	$Player1_name = read($Player1_name_filename);
	$tsql = 'SELECT Score FROM ' . $table . ' WHERE Player = \'' . $Player1 . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		$row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		$Player1_currentScore = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);
	
	// $Player2_currentScore = read($Player2_filename); // This is where the database update will go
	$Player2_name = read($Player2_name_filename);
	$tsql = 'SELECT Score FROM ' . $table . ' WHERE Player = \'' . $Player2 . '\'';
	$theQuery = sqlsrv_query($conn, $tsql);
	if ($theQuery == false){
		echo '<pre>';
		die(print_r(sqlsrv_errors()));
	}else{
		// echo '<pre>';
		// print_r($row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC));
		$row = sqlsrv_fetch_array($theQuery, SQLSRV_FETCH_ASSOC);
		$Player2_currentScore = $row['Score'];
		// echo '</pre>';
	};
	sqlsrv_free_stmt($theQuery);

	$Player1_ELO = ELO($Player1_currentScore, $Player2_currentScore);
	$Player2_ELO = ELO($Player2_currentScore, $Player1_currentScore);

	//Make Prediction
	$ELO_Link = '<a href="https://en.wikipedia.org/wiki/Elo_rating_system">ELO Rating</a>';
	if($Player1_ELO > $Player2_ELO){
			$Prediction = 'Based on previous user input, <font color="green"><strong>Person 1</font></strong> is most likely <strong>' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="green"><strong>' . Round(100 * $Player1_ELO, 3) . '%.' . '</strong></font>';
			$Prediction_2 = 'Based on previous user input, <font color="red"><strong>Person 2</font></strong> is most likely <strong>NOT ' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="red"><strong>' . Round(100 * $Player2_ELO, 3) . '%.' . '</strong></font>';
	}else{
		if($Player1_ELO === $Player2_ELO){
			$Prediction = '<font color="red"><strong>Both people have an <strong>equal chance</strong> to win</strong></font>, with both having an ' . $ELO_Link . ' of <strong><font color="red">' . $Player1_ELO . ' (' . Round(100 * $Player2_ELO, 3) . '%)' . '</strong></font>';
		};	
		if($Player1_ELO < $Player2_ELO){
			$Prediction = 'Based on previous user input, <font color="green"><strong>Person 2</font></strong> is most likely <strong>' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="green"><strong>' . Round(100 * $Player2_ELO, 3) . '%.' . '</strong></font>';
			$Prediction_2 = 'Based on previous user input, <font color="red"><strong>Person 1</font></strong> is most likely <strong>NOT ' . $Designated_Player_Text . '</strong>, with an ' . $ELO_Link . ' of <font color="red"><strong>' . Round(100 * $Player1_ELO, 3) . '%.' . '</strong></font>';
		};
	};
	
	//Display Score/Info for both players for debug
	if($DEBUG){
		echo '<br/>Person 1 (Left): ' . $Player1_name . ' (<strong>Score: ' . $Player1_currentScore . '</strong>) ' . '(<strong>ELO: ' . $Player1_ELO . ' ---<font color="red"> ' . (100 * $Player1_ELO) . '%</font></strong>)';
		echo '<br/>Person 2 (Right): ' . $Player2_name . ' (<strong>Score: ' . $Player2_currentScore . '</strong>) ' . '(<strong>ELO: ' . $Player2_ELO . ' ---<font color="red"> ' . (100 * $Player2_ELO) . '%</font></strong>)<br/>';
	};
	
	//Display Prediction
	if(!isset($_POST['HidePrediction']) AND isset($Prediction)){
		echo '<br/><div id="prediction_box">' . $Prediction;
		if(isset($Prediction_2)){ 
			echo '<br/>' . $Prediction_2;
		};
		echo '</div><br/>';
	};
	
	//Display Sentence Hint
	if(isset($Designated_Player_Sentence_Hint_Text) AND $Designated_Player_Sentence_Hint_Text != 'DEFAULT'){
		echo '<div id="sentence_hint_text_box">' . $Designated_Player_Sentence_Hint_Text . '</div><br/>';
	};
	
	//Reveal Players (if toggled)
	if(isset($_POST['RevealPlayers'])){
		echo '<div style="border: 0;border-style: solid;left: 13.5%;top: 50%;position: fixed;"><strong>This is actually ' . $Player1_name . '! ----></strong></div>';
		echo '<div style="border: 0;border-style: solid;right: 13.5%;top: 50%;position: fixed;"><strong><---- This is actually ' . $Player2_name . '!</strong></div>';
	};

	//Display Player Pictures
	echo '<img src="' . $Player1_picture_filename . '" width="' . $Picture_Width_Percentage . '" height="' . $Picture_Height_Percentage . '" />';
	echo '<img src="' . $Player2_picture_filename . '" width="' . $Picture_Width_Percentage . '" height="' . $Picture_Height_Percentage . '" /><br/>';
	
	// Make Array
	$Players_Array = [(string)$Player1,(string)$Player2];
	
	//Display Buttons
	echo '<strong>Choose below:</strong>';
	echo '<form action="' . $_SERVER['PHP_SELF'] . '" method="POST">';
	echo '<button name="Left_button" type="submit" value="' . base64_encode(json_encode($Players_Array)) . '"><strong>This is ';
	if(isset($Designated_Player_Text)){
		echo $Designated_Player_Text . ' (Left)</button> ';
	}else{
		echo 'Player 1</button> '; // If not using randomized version
	};
	echo '</strong><button name="Right_button" type="submit" value="' . base64_encode(json_encode($Players_Array)) . '"><strong>No, this is ';
	if(isset($Designated_Player_Text)){
		echo $Designated_Player_Text . ' (Right)</button>';
	}else{
		echo 'Player 2</button>';
	};
	echo '</strong><br/><br/>';
	
	//Display Options
	echo '<div id="options" style="border: .5px; border-style: solid;width:30%;padding: 4px;"><strong>Options:</strong><br/>';
	echo '<input type="checkbox" name="RevealPlayers" value="1"';
	if(isset($_POST['RevealPlayers'])){
		echo 'checked = checked';
	};
	echo '> Show true player names* (cheating)<br/>';
	echo '<input type="checkbox" name="ToggleScoreBoard" value="1" ';
	if(isset($_POST['ToggleScoreBoard'])){
		echo 'checked = checked';
	};
	echo '> Show/Toggle Scoreboard*<br/>';
	echo '<input type="checkbox" name="ToggleScoreUpdates" value="1" ';
	if(isset($_POST['ToggleScoreUpdates'])){
		echo 'checked = checked';
	};
	echo '> Hide Score Updates*<br/>';
	echo '<input type="checkbox" name="HidePrediction" value="1" ';
	if(isset($_POST['HidePrediction'])){
		echo 'checked = checked';
	};
	echo '> Hide ELO Prediction* (not recommended)<br/>';
	echo '<select name="LockToPlayer" onchange="CheckTheBox()">';
	for($x = 1; $x <= $NUM_Sets_of_Dopples; $x++){
		$current = $TextName_DIR . $x . '.txt';
		if(file_exists($current)){ 
			$current_textname = read($current);
		}
		if(isset($_POST['LockPlayerCheckBox'])){
			if($_POST['LockToPlayer'] == $x){
				echo '<option value="' . $x . '" selected>' . $x;
				if(isset($current_textname)){
					echo ' - ' . $current_textname;
				};
				echo '</option>';
			}else{
				echo '<option value="' . $x . '">' . $x;
				if(isset($current_textname)){
					echo ' - ' . $current_textname;
				};
				echo '</option>';
			};
		}else{
			echo '<option value="' . $x . '">' . $x;
			if(isset($current_textname)){
				echo ' - ' . $current_textname;
			};
			echo '</option>';
		};
	};
	echo '</select> Lock to Player/Set #*';
	echo '<input type="checkbox" name="LockPlayerCheckBox" value="1" id="LockPlayerCheckBox" onclick="UncheckTheBox()" ';
	if(isset($_POST['LockPlayerCheckBox'])){
		echo 'checked = checked';
	};
	echo '>';
	if($Player_LOCKED){
		echo '<div id="lockedLabel" style="visibility: visible;"><font color="red">Players Locked!</font></div>';
	}else{
		echo '<div id="lockedLabel" style="visibility: hidden;"><font color="red">Players Locked!</font></div>';
	};
	echo '<br/><button name="Reset" type="submit" value="1">Reset All Scores</button></form><br/>* = Will take effect after choosing winner, until unchecked.</div>';
?>
<script>
function CheckTheBox(){
	document.getElementById("LockPlayerCheckBox").checked = true;
	document.getElementById("lockedLabel").style.visibility = "visible";
}
function UncheckTheBox(){
	if(document.getElementById("LockPlayerCheckBox").checked === true){
		document.getElementById("lockedLabel").style.visibility = "visible";
	}else{
		if(document.getElementById("lockedLabel").style.visibility === "visible"){
			document.getElementById("lockedLabel").style.visibility = "hidden";
		}
	}
}
</script></center><br/></body></html>