let winningDoor;
let tries;
let gameOver;
const totalDoors = 10;

const doorGrid = document.getElementById('doorGrid');
const triesDisplay = document.getElementById('tries');
const messageDisplay = document.getElementById('message');
const restartBtn = document.getElementById('restartBtn');

function initGame() {
    tries = 3;
    gameOver = false;
    winningDoor = Math.floor(Math.random() * totalDoors);

    triesDisplay.textContent = tries;
    messageDisplay.textContent = "SELECT TARGET DOOR";
    messageDisplay.style.color = "var(--effect)";
    restartBtn.style.display = "none";
    doorGrid.innerHTML = '';

    for (let i = 0; i < totalDoors; i++) {
        const frame = document.createElement('div');
        frame.classList.add('door-frame');

        const door = document.createElement('div');
        door.classList.add('door');
        door.innerHTML = `<span style="color: var(--bg); font-weight:bold;">${i + 1}</span>`;

        const content = document.createElement('div');
        content.classList.add('content');
        content.textContent = (i === winningDoor) ? '✔️' : 'Ø';

        frame.appendChild(content);
        frame.appendChild(door);
        frame.addEventListener('click', () => handleGuess(frame, i));

        doorGrid.appendChild(frame);
    }
}

function handleGuess(element, index) {
    if (gameOver || element.classList.contains('open')) return;

    element.classList.add('open');

    if (index === winningDoor) {
        endGame(true);
    } else {
        tries--;
        triesDisplay.textContent = tries;

        if (tries <= 0) {
            endGame(false);
        } else {
            messageDisplay.textContent = "ACCESS DENIED - TRY AGAIN";
            messageDisplay.style.color = "var(--hudWarn)";
        }
    }
}

function endGame(isWin) {
    gameOver = true;
    restartBtn.style.display = "block";

    if (isWin) {
        messageDisplay.textContent = "PRIZE LOCATED - ACCESS GRANTED";
        messageDisplay.style.color = "var(--mainHudTxt)";
    } else {
        messageDisplay.textContent = "CRITICAL FAILURE - LOCKDOWN ACTIVE";
        messageDisplay.style.color = "var(--hudWarn)";

        // Show the winner
        document.querySelectorAll('.door-frame')[winningDoor].classList.add('open');
    }
}

initGame();