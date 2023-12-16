const players = [
    {
        name: "Paul Morphy",
        games: [
`[Event "Paris"]
[Site "Paris FRA"]
[Date "1858.??.??"]
[EventDate "?"]
[Round "?"]
[Result "1-0"]
[White "Paul Morphy"]
[Black "Duke Karl / Count Isouard"]
[ECO "C41"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "33"]

1.e4 e5 2.Nf3 d6 3.d4 Bg4 4.dxe5 Bxf3 5.Qxf3 dxe5 6.Bc4 Nf6 7.Qb3 Qe7
8.Nc3 c6 9.Bg5 b5 10.Nxb5 cxb5 11.Bxb5+ Nbd7 12.O-O-O Rd8
13.Rxd7 Rxd7 14.Rd1 Qe6 15.Bxd7+ Nxd7 16.Qb8+ Nxb8 17.Rd8# 1-0`,
`[Event "Paris it"]
[Site "Paris"]
[Date "1858.??.??"]
[Round "?"]
[White "De Saint Amant, Pierre Charles Four"]
[Black "Morphy, Paul "]
[Result "0-1"]
[WhiteElo ""]
[BlackElo ""]
[ECO "C54"]

1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.c3 Nf6 5.d4 exd4 6.cxd4 Bb4+ 7.Bd2 Bxd2+ 8.Nbxd2 d5
9.exd5 Nxd5 10.O-O O-O 11.h3 Nf4 12.Kh2 Nxd4 13.Nxd4 Qxd4 14.Qc2 Qd6 15.Kh1 Qh6
16.Qc3 Bf5 17.Kh2 Rad8 18.Rad1 Bxh3 19.gxh3 Rd3 20.Qxd3 Nxd3 21.Bxd3 Qd6+
22.f4 Qxd3  0-1`
            
        ]
    },
    {
        name: "Mikhail Tal",
        games: [
`[Event "Zurich"]
[Site "Zurich SUI"]
[Date "1959.05.24"]
[EventDate "1959.05.19"]
[Round "5"]
[Result "1-0"]
[White "Mikhail Tal"]
[Black "Erwin Nievergelt"]
[ECO "B63"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "73"]

1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 d6 6.Bg5 e6 7.Qd2
h6 8.Bxf6 gxf6 9.O-O-O a6 10.f4 Bd7 11.Be2 h5 12.Kb1 Qb6
13.Nb3 O-O-O 14.Rhf1 Be7 15.Rf3 Rdg8 16.Bf1 Kb8 17.Rd3 Bc8
18.a3 h4 19.Qe1 Rg4 20.Nd5 exd5 21.exd5 Ne5 22.fxe5 fxe5
23.Na5 Bd8 24.Nc6+ Ka8 25.Rb3 Qc7 26.Rc3 bxc6 27.Rxc6 Qb7
28.Rxd6 Ra4 29.Rd3 Bc7 30.Rf6 Bd8 31.Rc6 e4 32.Rb3 Ba5 33.Qe3
Qa7 34.Qh6 Rd8 35.Bxa6 Bd2 36.Qf6 Qd7 37.Bxc8+ 1-0`,
`[Event "Interpolis 4th"]
[Site "Tilburg NED"]
[Date "1980.09.27"]
[EventDate "?"]
[Round "7"]
[Result "1-0"]
[White "Mikhail Tal"]
[Black "Boris Spassky"]
[ECO "C95"]
[WhiteElo "?"]
[BlackElo "?"]
[PlyCount "87"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3
d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7 11.Nbd2 Bb7 12.Bc2 Re8 13.Nf1
Bf8 14.Ng3 g6 15.a4 c5 16.d5 c4 17.Bg5 h6 18.Be3 Rb8 19.Qd2 h5
20.Ng5 Nh7 21.Nxh7 Kxh7 22.Rf1 Kg8 23.Kh1 Bg7 24.axb5 axb5
25.f4 exf4 26.Bxf4 Qe7 27.Bg5 Qe5 28.Rf3 Ra8 29.Raf1 Rf8
30.Nxh5 gxh5 31.Rf5 Qe8 32.e5 dxe5 33.Bh6 Ra6 34.Bxg7 Kxg7
35.d6 f6 36.Rg5+ Kf7 37.Bg6+ Ke6 38.Bf5+ Kf7 39.Qd1 Rh8
40.Bg6+ Ke6 41.Bxe8 Rxe8 42.Qxh5 Rd8 43.Rg7 Kxd6 44.Qf7 1-0`
        ]
    }
]

module.exports = {players}