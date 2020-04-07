let words = [
    'javascript',
    'frontend',
    'hangman',
    'application',
    'function',
    'object',
    'animation',
    'imagination',
    'neighbour'
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

    update: function(letter) {
        if (this.usedLetters.has(letter)) {
            showPopup();
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
        if (letter.length !== 1 || letter.charCodeAt(0) < 97 || letter.charCodeAt(0) > 122) return;
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


function showPopup() {
    let popup = document.querySelector('.hangman__popup');
    popup.style.left = 0;
    setTimeout(() => {
        popup.style.left = '-200px';
    }, 1500);
}


function addRightLetter(letter, i) {
    let wordField = document.querySelector('.game__input');
    wordField.children[i].textContent = letter;
    // setTimeout(() => {
    //     wordField.children[i].classList.add('game__letter_up');
    //     setTimeout(() => {
    //         wordField.children[i].classList.remove('game__letter_up');
    //     }, 300);
    // }, 1000);
}


function addWrongLetter(letter) {
    let wrongField = document.querySelector('.game__wrong-field');

    let p = document.createElement('p');
    p.className = 'wrong-field__letter';
    p.textContent = letter;
    wrongField.append(p);
}


function endGame(isWon) {
    // for (let child of document.querySelector('.game__input').children) {
    //     setTimeout(() => {
    //     child.classList.add('game__letter_up');
    //     setTimeout(() => {
    //         child.classList.remove('game__letter_up');
    //         }, 500);
    //     }, 0);
    // }
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
        // i++;
        // if (i === wordField.children.length) {
        //     clearInterval(up);
        // }
    }, 100);

    setTimeout(() => {
        let finalWindow = document.querySelector('.hangman__end-game');
        finalWindow.querySelector('.end-game__title').textContent = isWon ? 'YOU WON!' : 'You lost :(';
        finalWindow.style.display = 'flex';

        let finalMessage = document.querySelector('.end-game__window');
        finalMessage.style.top = document.documentElement.clientHeight / 2 - 75 + 'px';
        finalMessage.style.left = document.documentElement.clientWidth / 2 - 135 + 'px';
    }, gameState.word.length * 100 + 1000);
    // let finalWindow = document.querySelector('.hangman__end-game');
    // finalWindow.querySelector('.end-game__title').textContent = isWon ? 'YOU WON!' : 'You lost :(';
    // finalWindow.style.display = 'flex';

    // let finalMessage = document.querySelector('.end-game__window');
    // finalMessage.style.top = document.documentElement.clientHeight / 2 - 75 + 'px';
    // finalMessage.style.left = document.documentElement.clientWidth / 2 - 135 + 'px';
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

    document.querySelector('.hangman__end-game').style.display = 'none';
    document.querySelector('.end-game__window').style.top = '-200px';

    startGame();
})


startGame();
