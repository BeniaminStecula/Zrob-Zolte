var size = 6;
var randnum = 3;
var moves = [];
var boardState = [];
var borderOrdinary = 'outset grey 0.5vw';
var borderSolver = 'outset red 0.5vw';


function boardGenerate()
{
	document.getElementById('foot').innerHTML = localStorage.moves+"<br />"+localStorage.boardState;
	
	moves = [];										//nowa historia gry
	boardState = [];								//nowa plansza
	for (var i=size*size-1; i>=0; i--) boardState.push(0);	//nowa plansza
	boardShow();
	
	if (localStorage.moves && localStorage.boardState)	//przywracanie gry
	{
		moves = JSON.parse(localStorage.moves);
		boardState = JSON.parse(localStorage.boardState);
	}
	else 
	{
		boardRandomize();
	}
	
	
	
	boardShow();			//pokaż planszę
	
	
}



function boardRandomize()
{
	var randd;
	for (var i=randnum; i>=0; i--)
	{
		randd = Math.floor(Math.random() * size*size);     //dowolne pole
		move(document.getElementById('board').getElementsByTagName('td')[randd]);
	}
}



function boardShow()
{
	var n=0;
	var board;
	var colour="color1";
	
	board = "<table>";
	for (var i=0; i<size; i++)
	{
		board+="<tr>";
		for (var j=0; j<size; j++)
		{
			switch (boardState[n])
			{
				case 0:	colour="color1";
						break;
				case 1:	colour="color2";
						break;
				default:colour="color1";
			}
			
			board+="<td class='"+colour+"' onclick='move(this)' id='"+n+"'>"
					+n+"</td>";
			n++;
		}
		board+="</tr>";
	}
	
	board+="</table>";
	
	document.getElementById('board').innerHTML = board;
	
	makeTest();
	
}



function localStorageFun(n)
{
	// Check browser support
	if (typeof(Storage) !== "undefined")
	{
		localStorage.moves = JSON.stringify(moves);
		localStorage.boardState = JSON.stringify(boardState);
	} else
	{
		window.alert("Nie obsługujesz Web Storage.");
		document.getElementById('foot').innerHTML = "Niestety twoja przeglądarka nie obsługuje Web Storage...";
	}
}

function makeTest()				//foot z danymi
{
	if (localStorage.moves && localStorage.boardState)
	{
		document.getElementById('test').innerHTML = 	//wyświetl
			JSON.parse(localStorage.moves).length+"<br />"+localStorage.moves+"<br />"+localStorage.boardState;
	}
}


function move(that)
{	
	var n = that.id;
	
	moveCross(that);
	
	moves.push(n);							//historia ruchów
	
	localStorageFun(n);						//zapisz
	
	//boardShow();							//wyświetl
	makeTest();
	
	win();									//test końca gry
}



function moveCross(that)
{
	var n = that.id/1;
	var elem = document.getElementById('board');
	var t=n;
	
	moveChangeColour(elem.getElementsByTagName('td')[n]);
	if (n%size!=0)
	{
		moveChangeColour(elem.getElementsByTagName('td')[n-1]);
	}
	if (n%size!==(size-1)) 
	{
		moveChangeColour(elem.getElementsByTagName('td')[n+1]);
	}
	if (Math.floor(n/size)!=0) moveChangeColour(elem.getElementsByTagName('td')[n-size]);
	if (Math.floor(n/size)!=size-1) moveChangeColour(elem.getElementsByTagName('td')[n+size]);
	
	
	switch (that.className)
	{
		case 'color1sol':	that.className='color1';
							break;
		case 'color2sol':	that.className='color2';
							break;
		default:			break;
	}
}



function moveChangeColour(that)
{
	switch (that.className)
	{
		case 'color1':		that.className = 'color2';
							break;
		case 'color2':		that.className = 'color1';
							break;
		case 'color1sol':	that.className = 'color2sol';
							break;
		case 'color2sol':	that.className = 'color1sol';
							break;
		default:			break;
	}
	
	
	boardState[that.id] = (boardState[that.id]+1)%2;	//stan planszy
}



function newGame()
{
	localStorage.clear();
	document.getElementById('test').innerHTML = null;
	boardGenerate();
}



function solveIt()
{
	var tede = document.getElementById('board').getElementsByTagName('td');
	var solver = [];
	for (var i=size*size-1; i>=0; i--) solver.push(0);	//nowa tablica rozwiązań
	
	for (var i=moves.length-1; i>=0; i--)				//każdy ruch do rozwiązań
	{
		solver[moves[i]] = (solver[moves[i]]+1)%2;
	}
	
	for (var i=size*size-1; i>=0; i--) 					//wyświetl rozwiązania
	{
		if (solver[i]==1)
		{
			switch (tede[i].className)
			{
				case 'color1':	tede[i].className='color1sol';
								break;
				case 'color2':	tede[i].className='color2sol';
								break;
				default:		break;
			}
		}
	}
}



function solveItFake()	//celowy żart z pseudo-rozwiązaniem
{
	for (var i=size*size-1; i>=0; i--)
	{
		document.getElementById('board').getElementsByTagName('td')[i].className='color1';
	}
}



function win()
{
	var win=1;								//test końca gry
	for (var i=size*size-1; i>=0; i--) if (boardState[i]!=0) win=0;
	if (win==1) setTimeout(function(){window.alert("Brawo! Wygrałeś!")}, 500);
}




