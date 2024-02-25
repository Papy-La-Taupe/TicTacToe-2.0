/************************************************
 ********           CONTROLLER           ********
 ************************************************/

(function Controller(){
        //CREATE => here, create the game board and the players
    (()=>{
        document.getElementById("Creation").addEventListener("click",(e)=>{
            CreateGame();
        });
    })();
    (()=>{
        document.getElementById("Party").addEventListener("click",(e)=>{
            CreateRound();
        });
    })();
        //READ => here, showing the score
    (()=>{
        document.getElementById("Score").addEventListener("click",(e)=>{
            ReadScore();
        });
    })();
        //UPDATE => here, keeping the score during and after the game
    (()=>{
        document.getElementById("GameGrid").addEventListener("click",(e)=>{
            UpdateGame(e);
        });
    })();


        //DELETE => here, clearing the board
    (()=>{
        document.getElementById("Clear").addEventListener("click",(e)=>{
            DeleteGame();
        });
    })();
})();

/***********************************************
 ********             MODEL             ********
 ***********************************************/

/*****     BLL     *****/

//CREATE MANAGER

function CreateGame(){
    const player1 = document.getElementById("Player1").value;
    const player2 = document.getElementById("Player2").value;
    if(player1 === ""){alert("please enter a name for main player.");return;}
    DeleteGame();
    CreatePlayer(player1,player2);
    CreateGameBoard();
}
function CreateRound(){
    const player1 = localStorage.getItem("player1");
    console.log(player1);
    if(player1 === null){alert("please enter a name for main player and start a game");return;}
    DeleteCurrentBoard();
    CreateGameBoard();
}

//READ MANAGER

function ReadScore(){
    LocalStorageScore();
}

//UPDATE MANAGER

function UpdateGame(e){
    UpdateCellValues(e);
    UpdatePointMechanic();
}

//DELETE MANAGER

function DeleteGame(){
    ClearBoard();
    ClearLocalStorage();
}
function DeleteCurrentBoard(){
    ClearBoard();
    localStorage.removeItem("gameBoard");
    localStorage.removeItem("ScoreP1");
    localStorage.removeItem("ScoreP2");
}

/*****     BO     *****/

function Player(name,token){
    return{
        type:"player",
        name,
        token,
        score:0
    };
}

/*****     DAL     *****/

//CREATE

function CreatePlayer(playerName1,playerName2){
    const player1 = Player(playerName1,"x");
    const player2 = Player(playerName2 ||"computer","y");
    localStorage.setItem("player1", JSON.stringify(player1));
    localStorage.setItem("player2", JSON.stringify(player2));
}
function CreateGameBoard() {
    const gameboard = [];
    const ScoreP1 = [];
    const ScoreP2 = [];
    const boardSize = 3;
    for (let boardLines = 1; boardLines <= boardSize; boardLines++) {
        let lineLetter = String.fromCharCode(64 + boardLines);
        for (let boardColumns = 1; boardColumns <= boardSize; boardColumns++) {
            gameboard.push(lineLetter + boardColumns);
            const parent = document.getElementById("GameGrid");
            const gridCell = document.createElement("div");
            gridCell.setAttribute("id", `${lineLetter+boardColumns}`);
            gridCell.setAttribute("class", "gridCell");
            parent.appendChild(gridCell);
        }
    }
    localStorage.setItem("gameBoard", JSON.stringify(gameboard));
    localStorage.setItem("ScoreP1", JSON.stringify(ScoreP1));
    localStorage.setItem("ScoreP2", JSON.stringify(ScoreP2));
}

//READ

function LocalStorageScore(){
    const player1 = JSON.parse(localStorage.getItem("player1"));
    const player2 = JSON.parse(localStorage.getItem("player2"));
    alert(`${player1.name} : ${player1.score} points. ${player2.name} : ${player2.score}points.`)
}

//UPDATE

function UpdateCellValues(e){
    const stringifiedGridCell = e.target.id;
    const gridCell = document.getElementById(e.target.id);
    const security = /^[A-C][1-3]$/;
    const validation = document.getElementById(e.target.id);
    const currentTurn = localStorage.getItem("currentTurn");
    if(security.test(stringifiedGridCell) && !validation.querySelector('img')){
        const tokenImage = document.createElement("img");
        tokenImage.setAttribute("src", localStorage.getItem("currentTurn")==="player1"?"./medias/CatToken.png":"./medias/CoffeeToken.png");
        tokenImage.setAttribute("class", `tokenImage ${currentTurn==="player1"?"x":"y"}`);
        gridCell.appendChild(tokenImage);
        if(currentTurn==="player1"){
            const score = JSON.parse(localStorage.getItem("ScoreP1"));
            score.push(stringifiedGridCell);
            localStorage.setItem("ScoreP1", JSON.stringify(score));
        }else{
            const score = JSON.parse(localStorage.getItem("ScoreP2"));
            score.push(stringifiedGridCell);
            localStorage.setItem("ScoreP2", JSON.stringify(score));
        }
        localStorage.setItem("currentTurn", currentTurn ==="player1"?"player2":"player1");
    }
}
function UpdatePointMechanic() {
    //la logique s'est déjà inversée attention ! on doit refaire tourner car currentTurn est passé au joueur suivant pour assurer la stabilité des données
    const player = localStorage.getItem("currentTurn")==="player1"?"player2":"player1";
    const score = player==="player1"?JSON.parse(localStorage.getItem("ScoreP1")):JSON.parse(localStorage.getItem("ScoreP2"));
    if(
        score.includes("A1") && score.includes("A2") && score.includes("A3") ||
        score.includes("A1") && score.includes("B2") && score.includes("C3") ||
        score.includes("A1") && score.includes("B1") && score.includes("C1") ||
        score.includes("A2") && score.includes("B2") && score.includes("C2") ||
        score.includes("A3") && score.includes("B3") && score.includes("C3") ||
        score.includes("A3") && score.includes("B2") && score.includes("C1") ||
        score.includes("B1") && score.includes("B2") && score.includes("B3") ||
        score.includes("C1") && score.includes("C2") && score.includes("C3")
    ){
        const winner = player==="player1"?JSON.parse(localStorage.getItem("player1")):JSON.parse(localStorage.getItem("player2"));
        winner.score+=1;
        alert(` <(^.^<) CONGRATULATION ${winner.name.toUpperCase()} !  <(^.^)> your total score is now of ${winner.score} points ! (>^.^)> `)
        player==="player1"?localStorage.setItem("player1",JSON.stringify(winner)):localStorage.setItem("player2", JSON.stringify(winner));
        localStorage.setItem("currentTurn", "player1");

    }
}

//DELETE

function ClearBoard(){
    const parent = document.getElementById("GameGrid");
    while (parent.querySelector('.gridCell')) {
        parent.removeChild(parent.querySelector('.gridCell'));
    }
}
function ClearLocalStorage(){
    localStorage.clear();
    localStorage.setItem("currentTurn", "player1");
}