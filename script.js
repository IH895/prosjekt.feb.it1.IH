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
}

//oppdaterer canvasen (tegner den på nytt og på nytt)
function update () {
    requestAnimationFrame(update);
    //hver gang vi oppdaterer rammen vil vi "clear" den forrige
    context.clearRect(0, 0, board.width, board.height);

    //fuglen tegnes på nytt hver gang
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //pipes legges inn
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
    }
}

function placePipes() {

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : pipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //om fuglen har gått forbi
    }

    pipeArray.push(topPipe); 
    //hver 1,5s kaller man functionen pipe
}
