const keyboard = document.getElementById('keyboard');
const gameBoard = document.getElementById('gameBoard');

const curInput = []; // the current guess

// Initial Values
const maxGuess = 6;
var totalGuesses = 0;
var answerWord=['C','A','N','O','E'];

// keyboard setup
const keyRows = 'Q,W,E,R,T,Y,U,I,O,P,A,S,D,F,G,H,J,K,L,Enter,Z,X,C,V,B,N,M,Delete';
    let keyRowSplit = keyRows.split(',');
    keyboard.innerHTML = "<div id='krow1'></div><div id='krow2'></div><div id='krow3'></div>";
    for(i=0;i<keyRowSplit.length;i++){
        let val = keyRowSplit[i];
        var rowId;
        if(i <= 9){ // first row
            rowId='krow1';
        }else if(i <= 18){// second row
            rowId='krow2';
        }else{// third row
            rowId='krow3';
        }

        if(val != 'Enter' && val != 'Delete'){
            document.getElementById(rowId).innerHTML += '<div id="btn-'+val+'" onclick="btnPress(\''+val+'\')">'+val+'</div>';
        }else if(val == 'Enter'){
            document.getElementById(rowId).innerHTML += '<div id="btn-'+val+'" onclick="btnPress(\''+val+'\')">✅</div>';
        }else if(val == 'Delete'){
            document.getElementById(rowId).innerHTML += '<div id="btn-'+val+'" onclick="btnPress(\''+val+'\')">🗑️</div>';
        }
    }
    // set Enter key to inactive (must have 5 letters guessed)
    document.getElementById('btn-Enter').classList.add('removed');

// Gameboard setup
var gBrow=0; var gBcol=0;
for(i=0;i<maxGuess*5;i++){
    if(gBcol==5){gBcol=0; gBrow+=1;}
    gameBoard.innerHTML += "<div id='row-"+gBrow+"-col-"+gBcol+"'></div>";
    gBcol +=1;
}

// Keyboard Button Pressed
function btnPress(val){
    let btnId = document.getElementById('btn-'+val);
    if(val == 'Enter'){ // Submit the current guess
        if(curInput.length == 5){
            window.scrollTo({top:0,left:0,behavior:'smooth'}); // scroll to top of page
            keyboard.style.display = 'none';
            submitGuess();
        }else{
            console.log('Not enough or too many inputs');
        }
    }else if(val == 'Delete'){ // delete last input
        if(curInput.length > 0){
            let curCol = curInput.length-1;
            let divId = document.getElementById('row-'+totalGuesses+'-col-'+curCol);
            divId.innerHTML = '';
            curInput.splice(curInput.length-1,1);
        }
    }else{ // add a letter to current guess
        if(curInput.length < 5){
            curInput.push(val);
            let curCol = curInput.length-1;
            let divId = document.getElementById('row-'+totalGuesses+'-col-'+curCol);
            divId.innerHTML = '<div id="'+'row-'+totalGuesses+'-col-'+curCol+'-child">'+val+'</div>';
            if(curInput.length == 5){document.getElementById('btn-Enter').classList.remove('removed')}
        }else{console.log('Too many inputs');}
    }
}

// Test the answer
var intervalCount;
function submitGuess(){
    intervalCount = 0;
    for(i=0;i<answerWord.length;i++){ // hide guessed letters
        let divId = document.getElementById('row-'+totalGuesses+'-col-'+i+'-child');
        divId.style.opacity=0;
    }
    const revealAnswer = setInterval(function(){
        console.log('Checking row-'+totalGuesses+'-col-'+intervalCount+'-child');
        let divId = document.getElementById('row-'+totalGuesses+'-col-'+intervalCount+'-child');
        if(divId.innerHTML == answerWord[intervalCount]){ // check if right letter in right place
            document.getElementById('row-'+totalGuesses+'-col-'+intervalCount).classList.add('correct'); // change gameboard tile color
            document.getElementById('btn-'+divId.innerHTML).classList.add('correct'); // change keyboard key color
        }else if(answerWord.includes(divId.innerHTML)){ // correct letter, incorrect location
            document.getElementById('row-'+totalGuesses+'-col-'+intervalCount).classList.add('hint');
            if(document.getElementById('btn-'+divId.innerHTML).classList.contains('correct') != true){
                 document.getElementById('btn-'+divId.innerHTML).classList.add('hint'); // change keyboard key color
            }
        }else{
            document.getElementById('btn-'+divId.innerHTML).classList.add('removed');
        }
        divId.style.opacity = 1;
        intervalCount += 1;
        if(intervalCount == 5){clearInterval(revealAnswer); resetGuess();}
    },500);
}
    function resetGuess(){
        totalGuesses += 1; // move to new row for next guess
        if(JSON.stringify(curInput) == JSON.stringify(answerWord)){
            setTimeout(runWin,500);
        }
        else if(totalGuesses < maxGuess && curInput != answerWord){
            keyboard.style.display = 'block';
            curInput.length = 0; // clear previous guess
            document.getElementById('btn-Enter').classList.add('removed');
        }
        else{
            setTimeout(runLost(),500);
        }
    }

function beginGuesing(){
    document.getElementById('popUpWindow').classList.add('hidden');
    let guessWord = document.getElementById('wordToGuess').value.toUpperCase();
    answerWord = guessWord.split("");
    console.log('Guess word is '+answerWord);
}

function runWin(){
    document.getElementById('popUpWindow').innerHTML = "<div>\
        <h1 class='lexend-font'>You Win! Yayyy</h1>\
        <img style='width:300px; height:auto; margin:auto; border-radius:10px;' src='https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExNno5endza3Nxdm53YWpjMWhydGtwcXFuZmh2dHNyMDRwbzdkd2x4eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/k5SZBJqzdOnF6Tdjj4/giphy.gif'>\
        <br><br><button onclick='location.reload();'>Play Again</button> <button onclick='document.getElementById(\"popUpWindow\").classList.add(\"hidden\")'>View Puzzle</button></div>"
    document.getElementById('popUpWindow').classList.remove('hidden');
}

function runLost(){
    document.getElementById('popUpWindow').innerHTML = "<div>\
        <h1 class='lexend-font'>You Lose :(</h1>\
        <p>The word is "+answerWord+"</p><br>\
        <img style='width:300px; height:auto; margin:auto; border-radius:10px;' src='https://media3.giphy.com/media/v1.Y2lkPTZjMDliOTUyMzVuanZ5eWRkZmRjM2Y1b2I5bnoyYmZlbXNxZjUyaXJtMnI4cDR6aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/BEob5qwFkSJ7G/200w.gif'>\
        <br><br><button onclick='location.reload();'>Play Again</button> <button onclick='document.getElementById(\"popUpWindow\").classList.add(\"hidden\")'>View Puzzle</button></div>"
    document.getElementById('popUpWindow').classList.remove('hidden');
}

document.getElementById('wordToGuess').select();
