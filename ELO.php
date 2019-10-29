<html><head><title>Russell's ELO Rating Algorithm Learning Experiment</title></head><body>
<?php

function ELO($A, $B){ // From http://en.wikipedia.org/wiki/Elo_rating_system
		return (1/(1+pow(10,(($B-$A)/400))));
};

//Code below this written by Russell Rounds
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


echo '<h3><strong>Russells <a href="http://en.wikipedia.org/wiki/Elo_rating_system">ELO Rating Algorithm</a> Learning Experiment</strong><br/></h3>';

echo '<strong>The algorithm (as found in Wikipedia, etc.):</strong>';
echo '<font color=green><pre><strong>function ELO($A, $B){
        return <strong>(1/(1+pow(10,(($B-$A)/400))));</strong>
};</pre></font><br/></strong>';

echo '<strong>Same Inputs:</strong><br/>';
echo '• ELO(1,1) = ' . '<font color=red>' . ELO(1,1) . '</font><br/>';
echo '• ELO(1000,1000) = ' . '<font color=red>' . ELO(1000,1000) . '</font><br/>';
echo '• ELO(500,500) = ' . '<font color=red>' . ELO(500,500) . '</font><br/>';
echo '• ELO(100,100) = ' . '<font color=red>' . ELO(100,100) . '</font><br/>';
echo '• ELO(99999,99999) = ' . '<font color=red>' . ELO(99999,99999) . '</font><br/>';

echo '<br/>';

echo '<strong>Different Inputs:</strong><br/>';
echo '• ELO(500,1000) = ' . '<font color=red>' . ELO(500,1000) . '</font><br/>';
echo '• ELO(1000,500) = ' . '<font color=red>' . ELO(1000,500) . '</font><br/>';
echo '• ELO(50,100) = ' . '<font color=red>' . ELO(50,100) . '</font><br/>';
echo '• ELO(100,50) = ' . '<font color=red>' . ELO(100,50) . '</font><br/>';
echo '• ELO(200,400) = ' . '<font color=red>' . ELO(200,400) . '</font><br/>';
echo '• ELO(400,200) = ' . '<font color=red>' . ELO(400,200) . '</font><br/>';
echo '• ELO(4,2) = ' . '<font color=red>' . ELO(4,2) . '</font><br/>';
echo '• ELO(2,4) = ' . '<font color=red>' . ELO(2,4) . '</font><br/>';
echo '• ELO(1,100) = ' . '<font color=red>' . ELO(1,100) . '</font><br/>';
echo '• ELO(100,1) = ' . '<font color=red>' . ELO(100,1) . '</font><br/>';
echo '• ELO(1,1000) = ' . '<font color=red>' . ELO(1,1000) . '</font><br/>';
echo '• ELO(1000,1) = ' . '<font color=red>' . ELO(1000,1) . '</font><br/>';

echo '<br/>';

echo '<strong>Incremental Inputs:</strong><br/>';
echo '• ELO(1,1000) = ' . '<font color=red>' . ELO(1,1000) . '</font><br/>';
echo '• ELO(2,1000) = ' . '<font color=red>' . ELO(2,1000) . '</font><br/>';
echo '• ELO(3,1000) = ' . '<font color=red>' . ELO(3,1000) . '</font><br/>';
echo '• ELO(4,1000) = ' . '<font color=red>' . ELO(4,1000) . '</font><br/>';
echo '• ELO(5,1000) = ' . '<font color=red>' . ELO(5,1000) . '</font><br/>';
echo '• ELO(1,100) = ' . '<font color=red>' . ELO(1,100) . '</font><br/>';
echo '• ELO(2,100) = ' . '<font color=red>' . ELO(2,100) . '</font><br/>';
echo '• ELO(3,100) = ' . '<font color=red>' . ELO(3,100) . '</font><br/>';
echo '• ELO(4,100) = ' . '<font color=red>' . ELO(4,100) . '</font><br/>';
echo '• ELO(5,100) = ' . '<font color=red>' . ELO(5,100) . '</font><br/>';
echo '• ELO(10,100) = ' . '<font color=red>' . ELO(10,100) . '</font><br/>';
echo '• ELO(25,100) = ' . '<font color=red>' . ELO(25,100) . '</font><br/>';
echo '• ELO(50,100) = ' . '<font color=red>' . ELO(50,100) . '</font><br/>';
echo '• ELO(75,100) = ' . '<font color=red>' . ELO(75,100) . '</font><br/>';
echo '• ELO(90,100) = ' . '<font color=red>' . ELO(90,100) . '</font><br/>';
echo '• ELO(99,100) = ' . '<font color=red>' . ELO(99,100) . '</font><br/>';
echo '<br/>';
?>
</strong><br/><br/>
From these inputs and outputs, you should be able to see how it is predicting the score for one player (or both if part of the algorithm is reversed) based on the current ranking (how many games each player has previously won) for both players.  Each decimal number is actually a percentage which just hasn't been converted (.4985XXXX is just 49%, etc.).  From the raw data, it's hard to see that, but if you clean it up and break down the numbers being inputted and outputted for each player, it is easier to see.<br/><br/>

<strong>For example:</strong><br/>
Player 1 has won 10 games.  Player 2 has won 100 games.  Based on this information alone, and using the ELO algorithm, we'll compute the percentage chance Player 1 has of winning against Player 2, and vice versa.<br/><br/>

The formula for calculating Player 1's chance of winning against Player 2 is: <strong><font color="green">1/(1+pow(10,(($B-$A)/400))).</strong></font><br/>
<strong><?php echo 'Chance Player 1 has of beating Player 2: ' . ELO(10,100) . ' (' . 100*ELO(10,100) . '%)'; ?></strong><br/><br/>

The formula for calculating Player 2's chance of winning against Player 1 is: <strong><font color="green">1/(1+pow(10,(($A-$B)/400))).</font></strong><br/>
<strong><?php echo 'Chance Player 2 has of beating Player 1: ' . ELO(100,10) . ' (' . 100*ELO(100,10) . '%)'; ?></strong><br/><br/>

So, now that we know how to calculate the <i>expected chance</i> of each player winning, what about the score adjustment if they do win?  Well, according to Wikipedia, if a player wins against the other, the winner takes points from the losing player, in amount of the difference "of the ratings of the players". Seems easy, but I guess I haven't done it yet.<br/><br/>

Now that I think I've got the algorithm figured out, I think I can actually do that now.  Update: Here is what I eventually did (in ELO-FACEMASH):<br/>

<?php
//FIDE's Implementation of winner/loser score distribution:
$k = 32;
$P1_Original_Score = 1500;
$P2_Original_Score = 1500;

$P1_ELO = ELO($P1_Original_Score, $P2_Original_Score);
$P2_ELO = ELO($P2_Original_Score, $P1_Original_Score);
		
$P1_Points = $P1_Original_Score + $k * (1 - $P1_ELO); 
$P2_Points = $P2_Original_Score + $k * (0 - $P2_ELO);

echo '<strong><br/>Example:<br/></strong>';
echo 'Player 1 Original Score: ' . $P1_Original_Score . ' ELO: ' . $P1_ELO . ' New Score: ' . $P1_Points . ' (winner)<br/>';
echo 'Player 2 Original Score: ' . $P2_Original_Score . ' ELO: ' . $P2_ELO . ' New Score: ' . $P2_Points . '<br/>';
echo '<br/>';

$Player_scores = ELO_score_distribution_update($P1_Original_Score, $P2_Original_Score);

echo '<strong><br/>Example 2:<br/></strong>';
echo 'Player 1 Original Score: ' . $P1_Original_Score . ' ELO: ' . $P1_ELO . ' New Score: ' . $Player_scores[0] . ' (winner)<br/>';
echo 'Player 2 Original Score: ' . $P2_Original_Score . ' ELO: ' . $P2_ELO . ' New Score: ' . $Player_scores[1] . '<br/><br/>';
?>

Why is this important?  For the average web developer, it's not, but it is good to be able to implement a simple algorithm such as this into a program if he need ever arises, and that's the only reason for this experiment.<br/><br/>

I guess I'll need to make the example application a separate page from this one.  I'll provide the link right here once I have created it.
<br/>
</body></html>