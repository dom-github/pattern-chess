# pattern-chess
master-level strategy, beginner-level chess

Chess is one of both the oldest and most popular strategy games ever made. It is both simple in its rules and complex in its possibilities. Both players have exactly the same abilities, with the only asymmetry coming from which side gets the first move. But although it is widely played around the world, it takes long hours of practice and study to achieve not simply mastery, but even basic proficiency in the game. Even people who play regularly commit grave mistakes - not strategic in foundation, but simply blundering by overlooking a single move, or forgetting an obvious threat. The fairness and equality fundamental to Chess means that one wrong move can be the deciding factor in the outcome of a game, and differences in skill level are compounded. But without the confines of a physical wooden board and carven pieces, can we build a representation of a Chess board that mitigates the risk of these simple “blunders” (without cheating or suggesting moves) and instead let players of any skill level compete purely on the basis of strategy?
Below is a screenshot of pattern-chess, an online chess-board that places the focus on the board itself as much as the pieces. Using a simple “heatmap” of Red vs Blue, and disabling the familiar checkered pattern, players can see at a glance which parts of the board are controlled by whom, and how powerfully those squares are held.

![Starting Board position](/screenshots/startBoard.png)

In the starting position, the front row of pawns is each defended by one piece on the row behind, except the 2 center pawns which are defended four times each. The pawns also control the empty row in front - with the help of the Knights in the back row helping to protect the outside squares, and reinforcing the squares around the middle columns.


The sidebar gives options to import or set up games using either FEN notation or full move history (PGN). The notations are both read- and write- able: Move pieces on the left to change the output on the right, and vice versa. Players can also import their games from Chess.com, or check famous Examples that are stored in a MongoDB Database.

![Colour Blending and Move Options](/screenshots/knightSelect.png)

As the game progresses, the red and blue highlights mix according to the amount of control each team has over a given square. The black Knight is selected, highlighting in yellow its potential moves. Note the blending of colours where the white pieces also have “control” of the Knight’s potential destination squares.

