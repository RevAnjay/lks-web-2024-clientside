// DEFINE VARIABLE YANG DIBUTUHKAN
let username, level, gun, target;

// JS DOM
const playButton = document.getElementById('btnplay');
const instructionButton = document.getElementById('btninstruction');
const closeButton = document.getElementById('close-button');
const closePauseButton = document.getElementById('close-pause-button');
const mainMenu = document.querySelector('.main-menu');
const mainGame = document.querySelector('.game-container');
const instructionMenu = document.getElementById('intruction');
const pauseMenu = document.getElementById('pause');
const continueButton = document.getElementById('continue-button');
const returnButton = document.getElementById('return-button');
const gameOverMenu = document.getElementById('game-over');
const countdownElement = document.getElementById('countdown');
const countdownNumber = document.getElementById('countdown-number');
const saveScoreButton = document.getElementById('save-button');

let isInstruction = false;
let isGameOver = false;
let isPaused = false;
let isCountingDown = false;
let currentGun = null;
let isImage1 = null;
let isGameRunning = false;
const allData = JSON.parse(localStorage.getItem('data'));
let time = 30;
let score = 0;
let currentTarget = null;
let earlyGameStart = false;
let penguranganWaktu = false;
let shooterLeaderboard = JSON.parse(localStorage.getItem('shooterLeaderboard')) || [];
let timerInterval;

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// DEFINE IMAGE
const backgroundImage = new Image();
const gunImage1 = new Image();
const gunImage2 = new Image();
const targetImage1 = new Image();
const targetImage2 = new Image();
const targetImage3 = new Image();
const pointerImage = new Image();
const boomImage = new Image();

backgroundImage.src = '/assets/background.jpg';
gunImage1.src = 'assets/gun1.png';
gunImage2.src = 'assets/gun2.png';
targetImage1.src = 'assets/target1.png';
targetImage2.src = 'assets/target2.png';
targetImage3.src = 'assets/target3.png';
pointerImage.src = 'assets/pointer.png';
boomImage.src = 'assets/boom.png';

// LOGIKA START GAME
function setGunValue() {
    let tempGun = document.getElementsByName('gun');

    for (i = 0; i < tempGun.length; i++) {
        if (tempGun[i].checked) gun = tempGun[i].value;
    }
}

function setTargetValue() {
    let tempTarget = document.getElementsByName('target');

    for (i = 0; i < tempTarget.length; i++) {
        if (tempTarget[i].checked) target = tempTarget[i].value;
    }
}

// DRAW FUNCTION
function drawbg() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 1000, 600);
    ctx.drawImage(backgroundImage, 0, 0, 1000, 600);
    ctx.closePath();
}

function drawScore() {
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillRect(1000, 0, 200, 600);
    ctx.fillText('Score: ', 100, 0);
    ctx.fillText('Score: ' + username, 100, 0);
    ctx.fillText('Score: ', 100, 0);
    ctx.closePath();
}

class gunClass {
    constructor() {
        this.x = 500
        this.y = 300
        this.Image = gunImage1
    }

    draw() {
        ctx.beginPath();
        ctx.drawImage(this.Image, this.x, this.y, 300, 300);
        ctx.closePath();
    }
}

class pointer {
    constructor() {
        this.x = 500
        this.y = 300
    }
    draw() {
        ctx.beginPath();
        ctx.drawImage(pointerImage, this.x, this.y, 50, 50);
        ctx.closePath();
    }
}

class boomClass {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.isVisible = false;
        this.visibleTime = 0;
    }

    draw() {
        if (this.isVisible && this.visibleTime > 0) {
            ctx.beginPath();
            ctx.drawImage(boomImage, this.x, this.y, 75, 75);
            ctx.closePath();
            this.visibleTime--;
        }
    }

    show(x, y) {
        this.x = x;
        this.y = y;
        this.isVisible = true;
        this.visibleTime = 30; // Boom terlihat selama 30 frames
    }
}

class targetClass {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.isVisible = false;
        this.visibleTime = 0;
        this.useTargetImage = currentTarget;
    }

    draw() {
        if (this.isVisible && this.visibleTime > 0 && this.useTargetImage) {
            ctx.beginPath();
            ctx.drawImage(this.useTargetImage, this.x, this.y, 150, 150);
            ctx.closePath();
            this.visibleTime--;
        }
    }

    show(x, y) {
        this.x = x;
        this.y = y;
        this.useTargetImage = currentTarget;
        this.isVisible = true;
        this.visibleTime = 300; // Time target sebelum despawn
    }
}
class targetClass2 {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.isVisible = false;
        this.visibleTime = 0;
        this.useTargetImage = currentTarget;
    }

    draw() {
        if (this.isVisible && this.visibleTime > 0 && this.useTargetImage) {
            ctx.beginPath();
            ctx.drawImage(this.useTargetImage, this.x, this.y, 150, 150);
            ctx.closePath();
            this.visibleTime--;
        }
    }

    show(x, y) {
        this.x = x;
        this.y = y;
        this.useTargetImage = currentTarget;
        this.isVisible = true;
        this.visibleTime = 300; // Time target sebelum despawn
    }
}
class targetClass3 {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.isVisible = true;
        this.visibleTime = 300;
        this.useTargetImage = currentTarget;
    }

    draw() {
        if (this.isVisible && this.visibleTime > 0 && this.useTargetImage) {
            ctx.beginPath();
            ctx.drawImage(this.useTargetImage, this.x, this.y, 150, 150);
            ctx.closePath();
            this.visibleTime--;
        }
    }

    show(x, y) {
        this.x = x;
        this.y = y;
        this.useTargetImage = currentTarget;
        this.isVisible = true;
        this.visibleTime = 300; // Time target sebelum despawn
    }
}

const drawGun = new gunClass();
const drawPointer = new pointer();
const drawBoom = new boomClass();
const drawTarget = new targetClass();
const drawTarget2 = new targetClass2();
const drawTarget3 = new targetClass3();

function drawheader() {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0, 0, 1000, 60);
        ctx.globalAlpha = 1.0;
        ctx.font = '30px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(allData.username, 100, 40);
        ctx.fillText(`Score : ${score}`, 500, 40);
        ctx.fillText(`Time : 00:${time <= 9 ? "0" + time : time}`, 900, 40);
        ctx.closePath();
    }

instructionButton.addEventListener('click', () => {
    if (isInstruction == false) {
        isInstruction = true;
        instructionMenu.classList.remove('hide');
    } else if (isInstruction == true) {
        isInstruction = false;
        instructionMenu.classList.add('hide');
    }
})

closeButton.addEventListener('click', () => {
    if (isPaused || isInstruction) {
        isInstruction = false;
        instructionMenu.classList.add('hide');
    };
});

closePauseButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseMenu.classList.add('hide');
    }
});

continueButton.addEventListener('click', () => {
    if (isPaused) {
        isPaused = false;
        pauseMenu.classList.add('hide');
    }
})

returnButton.addEventListener('click', () => {
    isGameOver = false;
    gameOverMenu.classList.add('hide');
    mainGame.classList.add('hide');
    mainMenu.classList.remove('hide');
    isInstruction = false;
    isPaused = false;
    isCountingDown = false;
    currentGun = null;
    isImage1 = null;
    isGameRunning = false;
    time = 30;
    score = 0;
    currentTarget = null;
    earlyGameStart = false;
    penguranganWaktu = false;
});

document.addEventListener('keydown', (e) => {
    if (e.key == 'SPACE' || e.key == ' ' && isImage1) {
        isImage1 = false
        currentGun = gunImage2;
    } else if (e.key == 'SPACE' || e.key == ' ' && isImage1 == false) {
        isImage1 = true
        currentGun = gunImage1;
    }

    if (e.key == "Escape" && !isInstruction && !isPaused && isGameRunning && !isGameOver && !isCountingDown) {
        isPaused = true;
        pauseMenu.classList.remove('hide');
    } else if (e.key == "Escape" && !isInstruction && isPaused && isGameRunning && !isGameOver && !isCountingDown) {
        isPaused = false;
        pauseMenu.classList.add('hide');
    }

    // BUAT TESTING
    if (e.key == "L") {
        username = "JalurAdmin";
        isImage1 = true
        level = 1;
        currentGun = gunImage1;
        currentTarget = targetImage1;

        let data = {
            username: username,
            level: level,
            gun: gun,
            target: target
        };

        localStorage.setItem('data', JSON.stringify(data));

        mainMenu.classList.add('hide');
        mainGame.classList.remove('hide');
        
        RunGame();
        startCountdown();
    }
});

saveScoreButton.addEventListener('click', () => {
    let datas = {
        username: username,
        level: level,
        score: score,
        time: time,
        date: new Date().toISOString('id-ID')
    }

    if (!Array.isArray(shooterLeaderboard)) {
        shooterLeaderboard = [shooterLeaderboard];
    }

    shooterLeaderboard.push(datas);
    localStorage.setItem('shooterLeaderboard', JSON.stringify(shooterLeaderboard));

    alert('Data permainan berhasil disimpan!');
})

canvas.addEventListener('mousemove', (event) => {
    if (isPaused) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    drawGun.x = mouseX - 150;
    drawPointer.x = mouseX - 25;
    drawPointer.y = mouseY - 25;
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    drawBoom.show(mouseX - 30, mouseY - 30);

    // Cek collision dengan target 1
    if (drawTarget.isVisible && 
        mouseX >= drawTarget.x && mouseX <= drawTarget.x + 150 &&
        mouseY >= drawTarget.y && mouseY <= drawTarget.y + 150) {
        score += 10; // Tambah skor
        drawTarget.isVisible = false; // Sembunyikan target
    } else if (drawTarget2.isVisible && 
        mouseX >= drawTarget2.x && mouseX <= drawTarget2.x + 150 &&
        mouseY >= drawTarget2.y && mouseY <= drawTarget2.y + 150) {
        score += 10;
        drawTarget2.isVisible = false;
    } else if (drawTarget3.isVisible && 
        mouseX >= drawTarget3.x && mouseX <= drawTarget3.x + 150 &&
        mouseY >= drawTarget3.y && mouseY <= drawTarget3.y + 150) {
        score += 10;
        drawTarget3.isVisible = false;
    } else {
        penguranganWaktu = true;
    }
});

function isTabrakan(x, y, targetSize = 150) {
    // Cek dengan drawTarget
    if (drawTarget.isVisible && Math.abs(x - drawTarget.x) < targetSize && Math.abs(y - drawTarget.y) < targetSize) return;
    // Cek dengan drawTarget2
    if (drawTarget2.isVisible && Math.abs(x - drawTarget2.x) < targetSize && Math.abs(y - drawTarget2.y) < targetSize) return;
    // Cek dengan drawTarget3
    if (drawTarget3.isVisible && Math.abs(x - drawTarget3.x) < targetSize && Math.abs(y - drawTarget3.y) < targetSize) return;

    return false;
}

function generateRandomKordinat() {
    let x;
    let y;
    let countLooping = 0;

    do {
        x = Math.floor(Math.random() * (900 - 100 + 1)) + 100;
        y = Math.floor(Math.random() * (450 - 100 + 1)) + 50;

        countLooping++
    } while (isTabrakan(x, y) && countLooping < 100);

    return {x, y};
}

// COUNTDOWN
function startCountdown() {
    isCountingDown = true;
    let count = 3;
    countdownElement.classList.remove('hide');
    countdownNumber.textContent = count;
    
    const countdownInterval = setInterval(() => {
        count--;
        
        if (count > 0) {
            countdownNumber.textContent = count;
        } else if (count === 0) {
            countdownNumber.textContent = 'GO!';
        } else {
            clearInterval(countdownInterval);
            countdownElement.classList.add('hide');
            isCountingDown = false;
            earlyGameStart = true;
            startTimer();
        }
    }, 1000);
}

// TIMER
function startTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    timerInterval = setInterval(() => {
        if (time > 0 && !isPaused && isGameRunning && !isCountingDown && !penguranganWaktu) {
            time--
        }

        if (penguranganWaktu) {
            time = time - 5;
            penguranganWaktu = false;
        }
        
        if (time <= 0 && isGameRunning && !isGameOver) {
            isGameOver = true;
            isGameRunning = false;
            gameOverMenu.classList.remove('hide');
        }

        if (earlyGameStart) {
            let kordinat = generateRandomKordinat();
            let kordinat2 = generateRandomKordinat();
            let kordinat3 = generateRandomKordinat();
            drawTarget.show(kordinat.x, kordinat.y);
            drawTarget2.show(kordinat2.x, kordinat2.y);
            drawTarget3.show(kordinat3.x, kordinat3.y);
            earlyGameStart = false;
        }

        if (time % 3 === 0 && isGameRunning && !isGameOver && !isPaused) {
            earlyGameStart = false;
            let kordinat = generateRandomKordinat();
            console.log(kordinat);
            drawTarget.show(kordinat.x, kordinat.y)
        }
        if (time % 3 === 0 && isGameRunning && !isGameOver && !isPaused) {
            earlyGameStart = false;
            let kordinat = generateRandomKordinat();
            console.log(kordinat);
            drawTarget2.show(kordinat.x, kordinat.y)
        }
        if (time % 3 === 0 && isGameRunning && !isGameOver && !isPaused) {
            earlyGameStart = false;
            let kordinat = generateRandomKordinat();
            console.log(kordinat);
            drawTarget3.show(kordinat.x, kordinat.y)
            
        }
    }, 1000)
}

function RunGame() {
    requestAnimationFrame(RunGame);

    isGameRunning = true
    drawbg();
    drawheader();
    drawScore();
    drawGun.Image = currentGun;
    drawTarget.draw();
    drawTarget2.draw();
    drawTarget3.draw();

    // LANGSUNG MUNCULIN 3 TARGET DI AWAL PERMAINAN
    if (earlyGameStart) {
        let kordinat = generateRandomKordinat();
        let kordinat2 = generateRandomKordinat();
        let kordinat3 = generateRandomKordinat();
        drawTarget.show(kordinat.x, kordinat.y);
        drawTarget2.show(kordinat2.x, kordinat2.y);
        drawTarget3.show(kordinat3.x, kordinat3.y);
        earlyGameStart = false;
    }
    
    drawGun.draw();
    drawBoom.draw();
    drawPointer.draw();
}

playButton.addEventListener('click', () => {
    username = document.getElementById('username').value;
    level = document.getElementById('level').value;
    setGunValue();
    setTargetValue();

    if (!username && username == '') return alert('Masukan Username!');
    if (!level && level == '') return alert('Pilih Level!');
    if (!gun && gun == null) return alert('Pilih Senjata!');
    if (!target && target == null) return alert('Pilih Target!');

    if (gun == 1) {
        isImage1 = true
        currentGun = gunImage1;
    } else if (gun == 2) {
        isImage1 = false
        currentGun = gunImage2;
    }

    if (target == 1) {
        currentTarget = targetImage1;
    } else if (target == 2) {
        currentTarget = targetImage2;
    } else if (target == 3) {
        currentTarget = targetImage3;
    }

    if (level == 'easy') {
        time = 30;
    } else if (level == 'medium') {
        time = 20;
    } else if (level == 'hard') {
        time = 15;
    }

    alert('Game Akan Segera dimulai, Persapkan dirimu');
    let data = {
        username: username,
        level: level,
        gun: gun,
        target: target
    };

    localStorage.setItem('data', JSON.stringify(data));

    mainMenu.classList.add('hide');
    mainGame.classList.remove('hide');
    
    RunGame();
    startCountdown();
});