<strong>Questions People May Have:</strong><br />
• <strong>Is this project done/working?</strong> Kind of (technically yes), but it's a little buggy and rough.  It does work, however.  If you want to run it, just clone/download this whole folder/repo, since some files had to be created manually at first.<br/>

<strong>Why I made this:</strong><br />
I did this just to see how algorithms and formulas are used.  I feel like I've learned a lot from this project.

<strong>When I thought of this:</strong><br />
While watching the movie <a href="https://www.imdb.com/title/tt1285016/">The Social Network</a>, about Mark Zuckerberg when he founded Facebook while at Harvard, I saw the part where they come up with the initial idea for Facemash, a website which would later be used to rate pictures of girls at Harvard (similar to <a href="https://en.wikipedia.org/wiki/Hot_or_Not">Hot or Not</a>, a more popular version), which was actually a precursor to Facebook.  During one of the scenes, Mark consults with his friend about the algorithm, which is written on a blackboard.  Since the movie glorifies the algorithm, I wanted to explore it further and actually apply it to some kind of app, and what better than similar to the original Facemash, which used the original algorithm?  At the time of this writing, there isn't any sites I could find that makes use of it, but only pages that discuss it.

Here is a still image from the movie of the algorithm on the blackboard: https://i.pinimg.com/originals/fc/ff/a0/fcffa093c3ba1dd02ebda0e5a83388c1.png

Note:  I did NOT write/invent the ELO rating formula/algorithm.  I am just studying and applying it since it's been used in software numerous times.  Also, this isn't a production-ready scalable website, but this all probably goes without saying.

<hr>

<strong>Description of Files:</strong><br />
• readme.md - This file (the one you're reading).<br/>
• <strong>ELO.php</strong> - a standalone, browser-based, file which explores the algorithm in detail.  It would be redundant to explain more here.<br />
• <strong>index.php</strong> - This page attempts to recreate Facemash, the precursor to Facebook, which is simply a program that presents the user with two images of whom the user selects the winner, and the program scores using the ELO algorithm, and repeats.  This implementation only uses about half of the ELO implementation FIDE uses to calculate rankings.<br/>
• <strong>index_formal.php</strong> - This page utilizes the the ELO formula in full (the one found on Wikipedia), and uses the same version of ELO that FIDE uses for chess player rankings.<br/>
• <strong>index_dopple.php</strong> - A version of index_formal that can handle "doppleganger" players (players who look alike).  This way, users can rate who they think is actually the person in question (designated by a designated hint or designated question).<br/>
• <strong>index_non-dopple.php</strong> - A version of index_formal.php that was created by stripping down the more complex/better index_dopple.php.  Improvements were made in index_dopple.php that weren't in index_formal.php, so this version has everything index_dopple.php does.<br/>
• <strong>functions.php</strong> - Miscellaneous functions used in mostly all other .php files.<br/>

<hr>

<strong>What I've learned about the ELO formula:</strong><br/>
• ELO is a linear algorithm, since it can be plotted on a line graph (such as the line graph Wikipedia shows).<br/>
• It may seem like the ELO formula (the "first part") has two inputs and/or two outputs, but it's actually only one input and one output -- the difference between scores as input (A-B), and the decimal/percentage chance as output.  Both are just reversed for the second player, which is probably why two variables are even presented in the formula.<br/>
• The ELO formula is only good for ranking two players at a time, since the score difference can only be between two players (since you can only subtract two things at once). ELO is also only good for zero-sum games, as stated by Wikipedia, where a winner takes points from a loser.  For example, ELO is great for rating two people via a simple numberic score (like in FIDE's chess rankings), but wouldn't work for a list of links even if each had the same numeric score as used when rating chess players. You could technically just sort those links by the numeric score of each link, but updating the score for each link after one is selected would only work for two links at most because the score distribution algorithm that updates the scores (the "2nd part") also uses the first part of the algorithm (which, again, requires the difference between two player's scores as input, which can only be the difference between two players without the number losing its meaning).  If you just ranked players by score, you'd still need another method of updating the score and calculating how many points each winner/loser should get.  <strong>Basically, you can't rate or update the score of more than two things at a time using the ELO formula.</strong>  You could use ELO to predict the chance of many players each winning against one another, but you'd still only be able to do two players each time.<br/> 
• The ELO formula is actually two parts.  The first part calculates the % chance a player will win, given the difference in scores between two players.  The second part updates the original score(s) used in the first part (when calculating the score difference required as input) by using the decimal/percentage also obtained in the first part (this sounds confusing, but is correct), along with other values like the k value.<br />
• The ELO formula doesn't seem to play nicely with negative numbers, and this is pretty much confirmed by the fact that FIDE doesn't allow ratings below 1000 to be used (in mind).  It's not negative numbers themselves, but the fact that the formula just doesn't work well when the starting score isn't in the 1000-2000 range.  Nothing says ELO can't be used with negative numbers, but just that it doesn't give the best results when you do this.<br />
• The ELO formula, when fully implemented, is way better than anything I could personally create.  No wonder it was used for this purpose, and why it's not hard to find a job if you have those types of mathematics skills.<br/>
• Even simple algorithms can sometimes be confusing and hard to implement programmatically.

<hr>

<strong>What I'm doing next:</strong><br />

<br/><strong>Known Bugs to Fix:</strong><br/>
• <strike>Find out why/when D.txt is being created by error, or prevent it from being created as a temp. fix.</strike> <strong>(DONE - 8/20/2019)</strong><br/>
• <strike>Find out why array is coming through as 10 elements instead of just two (with each letter per numbered array).</strike><strong>(DONE - 8/21/2019)<br/>
• <strike>Although understood/solved, keep looking for better solution to POST/Array error (found in Bugs folder), so any format/form of players will work, and not just single/double digit players.</strike> (DONE - 8/22/2019)<br/>

<br/><strong>Small Changes:</strong><br/>
• Create simple form for ELO5000 to change max score.<br/>
• Move ELO5000 to own repo?<br/>
• See what happens when you take the /1 part out (see if it becomes a non-decimal).<br/>
• Modulize this as much as possible, in preparation for further versions.<br/>
• Make "true" player indicators cosmetically better.<br/>
• Make "true" player indicators use JS instead of PHP.<br/>
• Move all styling to separate file.<br/>
• Use Ajax for reset and/or display scoreboard.<br/>
• Add times chosen to scoreboard.<br/>
• Add % and # of players who choose Player 1 versus 2 (another metric to compare the ELO function to).<br/>
• <strike>Change function so it'll accept min/max ELO score for Player B.</strike> (DONE 9/9/2019)<br/>
• <strike>Create readme.md for ELO5000.<strike> (DONE 9/9/2019)<br/>
• <strike>Make function from score distribution part, like with first part.</strike> (DONE - 8/27/2019)<br/>
• <strike>Add score distribution part (2nd half of formula) to ELO.php.</strike> (DONE - 8/27/2019)<br/>
• <strike>Add simple form validation to prevent injection attacks, just in case.</strike> (DONE - 8/23/2019)<br/>
• <strike>Make this version handle non-doppleganger players, or make that version a separate file.</strike> (DONE - 9/25/2019)<br/>
• <strike>Change this so it locks both players instead of just designated player</strike> (DONE - 9/25/2019)<br/>
• <strike>Use JS to make checkbox automatically check after selecting something from the dropdown next to it.</strike> <strong>(DONE - 8/19/2019)</strong><br/>
• <strike>See if negative numbers affects FIDE implementation of ELO.</strike> <strong>(Solved, see "What I've Learned")</strong><br/>
• <strike>Create dropdown box to select, and limit, number of players.</strike> <strong>(DONE - ~8/18/2019)</strong><br />
• <strike>Finish separate scoreboard.</strike> <strong>(DONE - 8/12/2019)</strong><br />
• <strike>Add more players.</strike> <strong>(DONE ~8/18/2019)</strong><br />
• <strike>Add thing so prediction isn't displayed until after user chooses, or so there's an option for the user to not see it.</strike> <strong>(DONE - 8/12/2019)</strong><br/>
• <strike>Creating a little CSS for cosmetic purposes, but not much since I want to modernize it more anyway.</strike> <strong>(DONE ~8/18/2019)</strong><br />
• <strike>Add Simple Counter to see how many times each was chosen before reset, and add corresponding code to reset function.</strike> <strong>(DONE ~8-18-2019)</strong><br/>
• <strike>Add hints for players, in case they don't know their names (what movie they're from, etc.)</strike> <strong>(DONE ~8/18/2019)</strong><br/>

<br/><strong>Major Revisions and Other Versions:</strong><br/>
• Simple form to calculate two players' ELO rating, and score.<br/>
• Mobile version, using front-end framework.<br/>
• Scalable version.<br/>
• Database-backed version.<br/>
• NodeJS version, to see how this would work differently.<br />
• Python version, to see how this would work differently.<br />
• Explore additional versions (serverless?). <br />
• <strike>Possible version that uses FIDE's implementation of ELO</strike><strong> (DONE - 8/7/2019).</strong>.<br />
• <strike>Simple PHP script to calculate how many games it takes to reach a certain score.</strike>  (DONE - 9/7/2019).<br/>
• <strike>Doppleganger version, and thinking about how to implement that in current version.</strike> <strong>(DONE)</strong><br/>

<br/><strong>References/See also:</strong><br/>
• <a href="https://stackoverflow.com/questions/3848004/facemash-algorithm">https://stackoverflow.com/questions/3848004/facemash-algorithm</a><br/>
• <a href="http://en.wikipedia.org/wiki/Elo_rating_system">http://en.wikipedia.org/wiki/Elo_rating_system</a><br/>
• <a href="https://en.wikipedia.org/wiki/Elo_hell">https://en.wikipedia.org/wiki/Elo_hell</a><br/>
