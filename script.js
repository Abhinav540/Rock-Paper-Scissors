var CHOICES = ["rock", "paper", "scissors"];
var EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };
var MAX_ROUNDS = 5;
var TIMER_SECONDS = 5;

var roundsPlayed = 0, userWins = 0, compWins = 0, draws = 0;
var roundActive = false, currentTimer = null, secondsLeft = TIMER_SECONDS;

var roundText = document.getElementById("roundText");
var timerText = document.getElementById("timerText");
var yourChoiceEl = document.getElementById("yourChoice");
var yourChoiceLabel = document.getElementById("yourChoiceLabel");
var compChoiceEl = document.getElementById("compChoice");
var compChoiceLabel = document.getElementById("compChoiceLabel");
var roundResultEl = document.getElementById("roundResult");
var historyBody = document.getElementById("historyBody");
var youScoreEl = document.getElementById("youScore");
var compScoreEl = document.getElementById("compScore");
var drawScoreEl = document.getElementById("drawScore");

var btnRock = document.getElementById("btnRock");
var btnPaper = document.getElementById("btnPaper");
var btnScissors = document.getElementById("btnScissors");
var restartBtn = document.getElementById("restartBtn");

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * 3)];
}
function decideResult(user, comp) {
  if (user === comp) return "Draw";
  if ((user === "rock" && comp === "scissors") ||
      (user === "scissors" && comp === "paper") ||
      (user === "paper" && comp === "rock")) return "Win";
  return "Lose";
}
function updateScores() {
  youScoreEl.textContent = userWins;
  compScoreEl.textContent = compWins;
  drawScoreEl.textContent = draws;
}
function addHistoryRow(roundNumber, user, comp, result) {
  var tr = document.createElement("tr");
  tr.innerHTML = "<td>"+roundNumber+"</td>"
               + "<td>"+EMOJI[user]+" "+user+"</td>"
               + "<td>"+EMOJI[comp]+" "+comp+"</td>"
               + "<td class='"+result.toLowerCase()+"'>"+result+"</td>";
  historyBody.appendChild(tr);
}
function disableInput() {
  btnRock.disabled = btnPaper.disabled = btnScissors.disabled = true;
  roundActive = false;
}
function enableInput() {
  btnRock.disabled = btnPaper.disabled = btnScissors.disabled = false;
  roundActive = true;
}
function clearTimer() {
  if (currentTimer) { clearInterval(currentTimer); currentTimer=null; }
}
function startTimer() {
  secondsLeft = TIMER_SECONDS;
  timerText.textContent = secondsLeft+"s";
  clearTimer();
  currentTimer = setInterval(function() {
    secondsLeft--;
    timerText.textContent = secondsLeft+"s";
    if (secondsLeft <= 0) { clearTimer(); autoPickUser(); }
  }, 1000);
}
// Automatically picks a random user choice if timer runs out
function autoPickUser() {
  if (!roundActive) return;
  processRound(getRandomChoice(), true);
}
function processRound(userChoice, autoFlag) {
  if (!roundActive) return;
  roundActive = false;
  disableInput();
  clearTimer();

  yourChoiceEl.textContent = EMOJI[userChoice];
  yourChoiceLabel.textContent = autoFlag ? userChoice+" (auto)" : userChoice;

  var compChoice = getRandomChoice();
  compChoiceEl.textContent = EMOJI[compChoice];
  compChoiceLabel.textContent = compChoice;

  var result = decideResult(userChoice, compChoice);
  roundResultEl.textContent = result;
  roundResultEl.className = "result " + (result==="Win"?"win":result==="Lose"?"lose":"draw");

  roundsPlayed++;
  if (result==="Win") userWins++;
  if (result==="Lose") compWins++;
  if (result==="Draw") draws++;

  addHistoryRow(roundsPlayed, userChoice, compChoice, result);
  updateScores();

  var someoneReached3 = (userWins>=3 || compWins>=3);
  var reachedMaxRounds = (roundsPlayed>=MAX_ROUNDS);

  if (someoneReached3 || reachedMaxRounds) { finishMatch(); return; }

  setTimeout(function() {
    yourChoiceEl.textContent="—"; yourChoiceLabel.textContent="waiting";
    compChoiceEl.textContent="—"; compChoiceLabel.textContent="waiting";
    roundResultEl.textContent="Make your move"; roundResultEl.className="result";
    roundText.textContent = (roundsPlayed+1);
    startRound();
  }, 900);
}
function startRound() {
  roundText.textContent = (roundsPlayed+1);
  timerText.textContent = TIMER_SECONDS+"s";
  enableInput(); startTimer();
}
function finishMatch() {
  disableInput(); clearTimer();
  var finalMessage="";
  if (userWins>compWins) finalMessage="Match Over — You WON! ("+userWins+" - "+compWins+")";
  else if (compWins>userWins) finalMessage="Match Over — Computer WON. ("+userWins+" - "+compWins+")";
  else finalMessage="Match Over — It's a DRAW. ("+userWins+" - "+compWins+")";
  roundResultEl.textContent = finalMessage;
  roundResultEl.className="result";
  roundText.textContent = roundsPlayed+" / "+MAX_ROUNDS;
}
function restartMatch() {
  clearTimer();
  roundsPlayed=userWins=compWins=draws=0;
  historyBody.innerHTML="";
  yourChoiceEl.textContent=compChoiceEl.textContent="—";
  yourChoiceLabel.textContent=compChoiceLabel.textContent="waiting";
  roundResultEl.textContent="Make your move"; roundResultEl.className="result";
  youScoreEl.textContent=compScoreEl.textContent=drawScoreEl.textContent="0";
  roundText.textContent="1"; timerText.textContent=TIMER_SECONDS+"s";
  startRound();
}

// Event Listeners
btnRock.addEventListener("click", ()=>processRound("rock",false));
btnPaper.addEventListener("click", ()=>processRound("paper",false));
btnScissors.addEventListener("click", ()=>processRound("scissors",false));
restartBtn.addEventListener("click", ()=>restartMatch());
document.addEventListener("keydown", function(evt){
  if(evt.key==="Enter"){ restartMatch(); }
  if(!roundActive) return;
  var k = evt.key.toLowerCase();
  if(k==="r") processRound("rock",false);
  else if(k==="p") processRound("paper",false);
  else if(k==="s") processRound("scissors",false);
});

// Start game
restartMatch();
