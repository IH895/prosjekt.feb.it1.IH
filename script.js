//board - canvasen
let board;
let boardWidth = 1200; //Hvor bred den skal være
let boardHeight = 780; //hvor høy
let context ; //brukes til å tegne på canvasen

//fuglen
let birdWidth = 34; //hvor bred fuglen er
let birdHeight = 24; //hvor høy fuglen er
//legge x og y kordinat for hvor fuglen skal være på canvasen
let birdX = boardWidth/3; //setter den i den første 8 delen av skjermen
let birdY = boardHeight/2 //setter den i midten av høyden
let birdImg;//brukes til å lagre bilde av fuglen som skal tegnes på canvasen

//koder fuglen (fugl objektet)objekt som lagrer posisjonen og størrelsen til fuglen
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
//bruker en array til å lagre disse, fordi det er flere
let pipeArray = [];
let pipeWidth = 64; //bredden på hver pipe
let pipeHeight = 512; //høyden av hver pipe
let pipeX = boardWidth; //pipe starter utenfor skjermen til høyre
let pipeY = 0; //y-posisjonen starter på toppen

//lagrer bildene av de øverste og nederste pipesene
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipes flytter seg mot venstre
let velocityY = 0; //fuglen hoppe hastighet (legger til at når du trykker på space blir velocityY til et negativt tall)
let gravity = 0.4; //drar fuglen nedover

let gameOver = false //når fuglen treffer er spillet over
let score = 0; //legger inn stilling, starter på 0

//når skjermen lastes inn, lastes inn canvasen
window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") //brukes til å tegne på board, henter inn tegnekonteksten

    //tegner fuglen
   
    //load image
    birdImg = new Image()
    birdImg.src = "bilder/fugl.webp";
    birdImg.onload = function( ) { //maler fuglen på canvasen
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //legger inn pipes som bilder
    topPipeImg = new Image();
    topPipeImg.src = "bilder/toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "bilder/bottompipe.png"

    // Venter på at spilleren trykker på en knapp
    document.addEventListener("keydown", startGame);
}

    function startGame() {
    // Skjuler startmeldingen
    document.getElementById("startMessage").style.display = "none";


    requestAnimationFrame(update); //setter i gang oppdateringsløkken
    //skape en function som legger inn pipes
    setInterval(placePipes, 1500); //hver 1.5s
    document.addEventListener("keydown", moveBird); //hver gang du trykker på en key, kaller den movebird functionen

    // Fjerner event listeneren slik at denne funksjonen ikke kjører flere ganger
    document.removeEventListener("keydown", startGame);
}

//oppdaterer canvasen (tegner den på nytt og på nytt)
//kjører update() igjen for neste bilde
function update () {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    //hver gang vi oppdaterer rammen vil vi "clear" den forrige
    context.clearRect(0, 0, board.width, board.height);

    //fuglen tegnes på nytt hver gang
    velocityY += gravity; //Legger til at den dras ned når den går oppover (den hopper)
    bird.y = Math.max (bird.y + velocityY, 0); //slik at bird.y ikke kommer over toppen av canvasen
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    } //Hvis fuglen går til bunnen av skjærmen taper man

    //pipes legges inn
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX //skifter x posisjonen til pipe-en 2px til høyre hver gang
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 fordi det er 2 pipes. 0.5*2 = 1, så 1 for hver sett av pipes 
            pipe.passed = true; 
        } //! = not

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //fjerner første elementene fra array, fjerner pipes etter de er utenfor
    }

    //stillingen
    context.fillStyle = "white"; //fargen av teksten
    context.font = "45px sans-serif"; //fonten og størrelse
    context.fillText(score, 5, 45); //hvor den er på skjærmen

    if (gameOver) {
        context.fillText("GAME OVER - Du fikk " + score + " poeng", 300, 300) //legger inn at spillet er over med tekst
        context.fillText("Trykk på space eller pil opp for å starte på nytt", 140, 360)
    }
}

function placePipes() {
    if (gameOver) { 
        return;
    }
    //slik at pipes kommer på forskjellige høyder
    //0-1 * pipeHeight/2
    //hvis random returnerer 0 -> blir y posisjonen -128 (pipeheight/4)
    //hvis random returnerer 1 -> blir y posisjonen -128-256 (pipeheight/4 - pipeheight/2) = -3/4 pipeheight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); //flytter pipe-en oppover
    let openingSpace = board.height/4 //rom for fuglen til å fly gjennom

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //om fuglen har gått forbi
    }

    pipeArray.push(topPipe); 
    //hver 1,5s kaller man functionen pipe

    //lager mellomrom mellom pipes
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //hopp
        velocityY = -6;

        //reset game
        //når det er game over, reseter man properties til default value
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0
            gameOver = false;
        }
    }
}

//om fuglen treffer
//skjekker om fuglen (a) treffer en pipe (b)
function detectCollision(a, b) {
    return a.x < b.x + b.width && //Sjekker om venstre side av a er til venstre for høyre side av b.
        a.x + a.width > b.x && //Sjekker om høyre side av a er til høyre for venstre side av b.
        a.y < b.y + b.height && //Sjekker om toppen av a er over bunnen av b.
        a.y + a.height > b.y; //Sjekker om bunnen av a er under toppen av b.
}

//betingelsene må være true for at de to rektanglene skal overlappe. Hvis én av dem er false, betyr det at det er minst én kant som ikke berører den andre, og dermed ingen kollisjon. Hvis funksjon returnerer true, blir spillet game over