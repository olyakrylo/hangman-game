let words = [
    'hangman',
    'application',
    'function',
    'object',
    'animation',
    'imagination',
    'neighbour',
    'basement',
    'airplane',
    'birthday',
    'engineer',
    'programming',
    'excellence',
    'advance'
];

let isKeyboardShowing = false;

let keyboardButton = document.querySelector('.hangman__keyboard-button');
keyboardButton.onclick = function() {
    document.querySelector('.hangman__keyboard').classList.toggle('hangman__keyboard_hidden');
    isKeyboardShowing = !isKeyboardShowing;
    keyboardButton.textContent = isKeyboardShowing ? 'Hide keyboard' : 'Show keyboard';
}

let gameState = {
    word: [],
    usedLetters: new Set(),
    rightLetters: 0,
    uniqueLetters: 0,
    bodyParts: [],
    score: 0,

    update: function(letter) {
        if (this.usedLetters.has(letter)) {
            showPopup('Already used');
            return;
        }
        this.usedLetters.add(letter);
    
        let found = false;
        this.word.forEach((elem, i) => {
            if (elem === letter) {
                addRightLetter(letter, i);
                found = true;
            }
        })
    
        if (found) {
            this.rightLetters++;
        } else {
            addWrongLetter(letter);
            let part = this.bodyParts.shift();
            document.querySelector(`#${part}`).style.display = 'inline';
            // document.querySelector(`#${part}`).classList.add('part_show');
            // if (part === 'body') {
                // document.querySelector(`#${part}`).setAttribute('y2', '17');
            //     let body = document.querySelector('#body');
            //     let i = 9;
            //     let interval = setInterval(() => {
            //         body.setAttribute('y2', i++);
            //         if (i > 17) clearInterval(interval);
            //     }, 10);
            // }
        }
    
        if (this.rightLetters === this.uniqueLetters) {
            endGame(true);
            return;
        }
    
        if (!this.bodyParts.length) {
            endGame(false);
            return;
        }
    }
}

function initGameState() {
    gameState.word = (words[Math.floor(Math.random() * words.length)]).split('');
    gameState.rightLetters = 0;
    gameState.usedLetters.clear();
    gameState.uniqueLetters = (new Set(gameState.word)).size;
    gameState.bodyParts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
}

function startGame() {
    initGameState();

    addLetterSpaces(gameState.word.length);

    document.onkeyup = function(e) {
        let letter = e.key.toLowerCase();
        if (letter.length !== 1) return;
        if (letter.charCodeAt(0) >= 1072 && letter.charCodeAt(0) <= 1103) {
            showPopup('Change keyboarg language to English!')
            return;
        }
        if (letter.charCodeAt(0) < 97 || letter.charCodeAt(0) > 122) return;
        gameState.update(letter);
    }

    let keyboard = document.querySelector('.hangman__keyboard');
    keyboard.onclick = function(e) {
        if (e.target.tagName !== 'SPAN') return;
        e.target.style.color = '#A0522D';
        gameState.update(e.target.textContent.toLowerCase());
    }
}


function addLetterSpaces(amount) {
    let wordField = document.querySelector('.game__input');
    for (let i = 0; i < amount; ++i) {
        let p = document.createElement('p');
        p.className = 'game__letter';
        p.textContent = '';
        wordField.append(p);
    }
} 


function showPopup(text) {
    let popup = document.querySelector('.hangman__popup');
    popup.querySelector('p').textContent = text;
    popup.classList.add('hangman__popup_show');
    setTimeout(() => {
        popup.classList.remove('hangman__popup_show');
    }, 1500);
}


function addRightLetter(letter, i) {
    let wordField = document.querySelector('.game__input');
    wordField.children[i].textContent = letter;
}


function addWrongLetter(letter) {
    let wrongField = document.querySelector('.game__wrong-field');

    let p = document.createElement('p');
    p.className = 'wrong-field__letter';
    p.textContent = letter;
    wrongField.append(p);
}


function endGame(isWon) {
    let wordField = document.querySelector('.game__input');
    let i = 0;
    let up = setInterval(() => {
        let child = wordField.children[i];
        child.classList.add('game__letter_up');
        i++;
        if (i === wordField.children.length) {
            clearInterval(up);
        }
        setTimeout(() => {
            child.classList.remove('game__letter_up');
        }, 400);
    }, 100);

    gameState.score = isWon ? gameState.score + 1 : 0;

    setTimeout(() => {
        let finalWindow = document.querySelector('.hangman__end-game');
        let finalMessage = finalWindow.querySelector('.end-game__title');
        finalMessage.textContent = isWon ? 'YOU WON!' : 'You lost :(';
        document.querySelector('.end-game__score').textContent = 'Score: ' + gameState.score;
        finalWindow.classList.add('hangman__end-game_show');
        setTimeout(() => {
            document.querySelector('.end-game__window').classList.add('end-game__window_show');
        }, 0);
    }, gameState.word.length * 100 + 1000);
}


let button = document.querySelector('.end-game__button');
button.addEventListener('click', () => {
    for (let letter of document.querySelectorAll('.game__letter')) {
        letter.remove();
    }
    for (let letter of document.querySelectorAll('.wrong-field__letter')) {
        letter.remove();
    }
    for (let bodyPart of document.querySelector('#man').children) {
        bodyPart.style.display = 'none';
    }
    for (let letter of document.querySelectorAll('.hangman__keyboard span')) {
        letter.style.color = '#008080';
    }

    document.querySelector('.end-game__window').classList.remove('end-game__window_show');
    setTimeout(() => {
        document.querySelector('.hangman__end-game').classList.remove('hangman__end-game_show');
    }, 500)

    startGame();
})


startGame();
