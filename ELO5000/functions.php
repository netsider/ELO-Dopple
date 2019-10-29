<?php
	//Created On: 9-10-2019 By: Russell Rounds (https://github.com/netsider)
	
	function ELO($A, $B){ 
		return (1/(1+pow(10,(($B-$A)/400)))); // https://en.wikipedia.org/wiki/Elo_rating_system
	};
	function ELO_score_distribution_update($winner_score, $loser_score){
		$k = 32;
		$P1_ELO = ELO($winner_score, $loser_score);
		$P2_ELO = ELO($loser_score, $winner_score);
			
		$winner_new_score = $winner_score + $k * (1 - $P1_ELO); 
		$loser_new_score = $loser_score + $k * (0 - $P2_ELO);
		
		$scores_array = [];
		$scores_array[0] = $winner_new_score;
		$scores_array[1] = $loser_new_score;
		return $scores_array;
	};
	function how_many_games_needed_to_get_this_ELO_score($max_score, $RAND_min, $RAND_max){
		$Counter = 1;
		// $RAND_min = 1500;
		// $RAND_max = 2500;
		$PlayerA_Score = 1500;
		$PlayerB_Score = round(RAND($RAND_min,$RAND_max));
	
		while($PlayerA_Score < $max_score){
		
			// echo 'Game: ' . $Counter . ' PlayerA (Winner) Original Score: ' . $PlayerA_Score . ' PlayerB (Loser) Original Score: ' . $PlayerB_Score . '<br/>';
	
			$ScoreArray = ELO_score_distribution_update($PlayerA_Score, $PlayerB_Score);
			$PlayerA_Score = $ScoreArray[0];
			$PlayerB_Score = round(RAND($RAND_min,$RAND_max)); // enable to randomize player B (loser) score, disable to use variable above
	
			// echo ' PlayerA New Score: ' . $PlayerA_Score . ' PlayerB New Score: ' . $PlayerB_Score . '<br/><br/>';

			$Counter++;
		};
		
		echo 'It took <strong>' . $Counter . '</strong> games to get an ELO score above <strong>' . $max_score . '</strong> (winning every game against a player with an ELO rating between ' . $RAND_min . ' and ' . $RAND_max . ').<br/>';
		
		return $Counter;
	};
?>