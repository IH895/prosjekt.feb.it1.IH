//board - canvasen
let board;
let boardWidth = 360; //Hvor bred den skal være
let boardHeight = 640; //hvor høy
let context ; //brukes til å tegne på canvasen

//fuglen
let birdWidth = 34; //hvor bred fuglen er
let birdHeight = 24; //hvor høy fuglen er
//legge x og y kordinat for hvor fuglen skal være på canvasen
let birdX = boardWidth/8; //setter den i den første 8 delen av skjermen
let birdY = boardHeight/2 //setter den i midten av høyden
let birdImg;

//koder fuglen (fugl objektet)
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
//bruker en array til å lagre disse, fordi det er flere
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let veloxityX = -2; //pipes flytter seg til høyre
let veloxityY = 0; //fuglen hoppe hastighet (legger til at når du trykker på space blir velocityY til et negativt tall)

//når skjermen lastes inn, lastes inn canvasen
window.onload = function() {
    board = document.getElementById("board")
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d") //brukes til å tegne på board

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

    requestAnimationFrame(update);
    //skape en function som legger inn pipes
    setInterval(placePipes, 1500); //hver 1.5s
    document.addEventListener("keydown", moveBird); //hver gang du trykker på en key, kaller den movebird functionen
}

//oppdaterer canvasen (tegner den på nytt og på nytt)
function update () {
    requestAnimationFrame(update);
    //hver gang vi oppdaterer rammen vil vi "clear" den forrige
    context.clearRect(0, 0, board.width, board.height);

    //fuglen tegnes på nytt hver gang
    bird.y += veloxityY;
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipes legges inn
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += veloxityX //skifter x posisjonen til pipe-en 2px til høyre hver gang
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function placePipes() {

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
    if (e.code == "space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //hopp
        velocityY = -6;
    }
}