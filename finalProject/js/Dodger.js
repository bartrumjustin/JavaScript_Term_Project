//var gameAsteroid;
let shipSpeed = 5;
let asteroidSpeed = 3;
let gameAsteroid = [];
let stars = [];
let factor = 0;
let starID;
let frameID;
let HeartBeatID;
var startGame = {
    //gameScreen is the whole screen
    //.start begins
    //.clear will remove the content within for advancing frames
    gameScreen: document.createElement("canvas"),
    start: function () {
        //gets rid of forced margins
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "hidden";
        //start of canvas and define the gamescreen
        this.context = this.gameScreen.getContext("2d");
        this.gameScreen.width = window.innerWidth;
        this.gameScreen.height = window.innerHeight;
        this.gameScreen.style.display = "block";
        this.context.fillStyle = "#181425";
        this.context.fillRect(0, 0, this.gameScreen.width, this.gameScreen.height);
        document.body.insertBefore(this.gameScreen, document.body.childNodes[0]);
        //display instructions

        //set frame refresh and heartbeat
        frameID = setInterval(frames, 33);
        HeartBeatID = setInterval(HeartBeat, 1000);
        
    },
    clear: function () {
        //clears the screen for the next update
        this.context.fillStyle = "#181425";
        this.context.clearRect(0, 0, this.gameScreen.width, this.gameScreen.height);
        this.context.fillRect(0, 0, this.gameScreen.width, this.gameScreen.height);
    },
    stop: function () {
        clearInterval(frameID);
        clearInterval(HeartBeatID);

    }
}


//on load 
window.onload = function () {
    this.alert("Welcome to Dodger\n\n"+
        "You have found yourself venturing into a pallisade of asteroids, Dodge them for as long as you can!\n" +
        "Above the incoming asteroids is your score, as you gain more points the asteroids will move faster towards you\n"
        + "the next alert will display the functions necessary to play\n\n" +
        "This game, art and likeness are original to me, Justin Bartrum, any similiarities to other games is coincental\n"
        + "If you wish to copy or fork this work, please give proper referrence to this game, Dodger, and the creator, Justin Bartrum\n\n" +
"If you like this game or wish to offer your thoughts on it, you may reach out to me @ BartrumJustin@gmail.com");
    if (window.innerWidth <= 800) {
        alert("touch/hold the side you want to move")
        console.log("User is mobile, use touch functions");
        window.addEventListener('touchend', (e) => {
            
                startGame.key = false;
            
        });
        window.addEventListener('touchstart', (e) => {
            if (e.cancelable) e.preventDefault(); //dont zoom or alt click
            const touchX = e.touches[0].clientX; // Get horizontal tap position
            const screenCenter = window.innerWidth / 2;
            if (touchX < screenCenter) {
                startGame.key = "f";
            }
            else {
                startGame.key = "j";
            }
        });
    }
        
    else{
            //enable controls for desktop
            window.addEventListener('keydown', function (e) {
                startGame.key = e.key;
                console.log(startGame.key);
            })
            window.addEventListener('keyup', function (e) {
                startGame.key = false;
            })
            alert("With desktop use:\n" +
                "[ F ] for left\n" +
                "[ J ] for right");
        }
    console.log(`ideal asteroid count ${Math.round((window.innerWidth - 80) / 35)} `);

    for (var i = 0; i < Math.round((window.innerWidth / 8)); i++) {
        var x = Math.random() * window.innerWidth; //give a random arrangement horizontally
        var y = window.innerHeight * Math.random(); //needs to be populated in the game area


        stars.push(new Paralax(x, y)); //push the values to the stars array to be created later
    }
    for (var i = 0; i < Math.round((window.innerWidth - 80) / 35); i++) {
        var x = Math.random() * window.innerWidth;
        var y = -5 * Math.random() * 200;
        var size = 16;

        gameAsteroid.push(new Asteroid(size, x, y));
    }

    //gameAsteroid = new Asteroid(16, (window.innerWidth / 2), (window.innerHeight / 2));
    gameShip = new Ship(window.innerWidth / 2, ((window.innerHeight / 6) * 5)); //this is ship placement on game field
    //hitBox = new HitBox(); //create hit box object;
    startGame.start();
    gameAsteroid.forEach(function (rock) {
        rock.make();
    });

}
function HeartBeat() {
    factor++;

    console.log(factor);
    asteroidSpeed += .1;

}
//updates every 30 fps roughly
function frames() {


    //controls for desktop
    if (startGame.key && startGame.key == "f") { gameShip.x += shipSpeed * -1; }
    if (startGame.key && startGame.key == "j") { gameShip.x += shipSpeed; }
    //clear the old screen
    startGame.clear();
    //create ship
    
    //populate stars
    stars.forEach(function (point) {
        point.y += asteroidSpeed / 6;
        if (point.y > window.innerHeight) {
            point.y = Math.random() * -20;
            console.log(point.y);
            point.x = Math.random() * window.innerWidth;
        }
        point.make();
    })
    //populate the new asteroid positions
    gameAsteroid.forEach(function (rock) {

        rock.y += asteroidSpeed;

        //hits the bottom and sets them back to the top
        if (rock.y > window.innerHeight) {
            rock.y = Math.random() * -20;
            rock.x = Math.random() * window.innerWidth;
        }

        rock.make(); // Draw the current asteroid with the above changes
        //hitBox.make(rock.x, rock.y, rock.size * 2, rock.size * 2);
        checkCollisions(rock.x, rock.y, rock.size, gameShip.x, gameShip.y);
        var ctx = startGame.context;
        ctx.font = "5em Arial";
        ctx.fillStyle = "#F0DE5F";
        ctx.fillText(`${factor}`, window.innerWidth / 2 - 20, window.innerHeight / 8);

    });
    //checkCollisions();
    gameShip.make();
    if (gameShip.x >= window.innerWidth) {
        gameShip.x = window.innerWidth;
    }
    else if (gameShip.x <= 0) {
        gameShip.x = 0;
    }

    //debug collisions
    // hitBox.make((gameShip.x), (gameShip.y), 40, 40);
    //invoke the hitbox
    //gameAsteroid.make();


}


//collision check
function checkCollisions(rx, ry, rsize, sx, sy) {

    //rock hitbox area
    let rX = Math.round(rx);
    let rX2 = Math.round(rx + rsize * 2);
    let rY = Math.round(ry + rsize * 2);
    let rY2 = Math.round(ry + rsize * 2);
    //ship hitbox area
    let sX = Math.round(sx);
    let sX2 = Math.round(sx + 35);
    let sY = Math.round(sy);
    let sY2 = Math.round(sy + 40);
    //if statement to check x area

    if (rY >= sY && rY <= sY2) {

        if (rX2 >= sX && rX <= sX2) {
            startGame.stop();
        }
    }


}


function Ship(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40; //defines the ships width
    this.height = 40; //defines the ships height

    //new image object
    this.image = new Image();
    this.image.src = "././media/fighterShip-removebg-preview.png";
    //.make for updating position
    this.make = function () {
        var ctx = startGame.context;
        ctx.drawImage(
            this.image,
            this.x - this.width / 2, //center on itself
            this.y - this.height / 2, //center on itself
            this.width,
            this.height);


    };

}
/*function HitBox(){
    
    //make function
    this.make = function(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    var ctx = startGame.context;
    ctx.beginPath();
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect((this.x - (this.width / 2)), (this.y - (this.height / 2)), this.width, this.height );
    
    ctx.closePath
    }
}*/

//specifies the asteroid and 
//.make will create and update the asteroid
function Asteroid(size, x, y) {

    this.size = size;
    this.x = x;
    this.y = y;

    //separating param from drawing function
    this.make = function () {
        var ctx = startGame.context; //reference the gameScreen
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#4e5a65";
        ctx.fill();
        ctx.closePath();
    }
}
function Paralax(x, y) {

    let size = 2;
    this.x = x;
    this.y = y;

    //separating param from drawing function
    this.make = function () {
        var ctx = startGame.context; //reference the gameScreen
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF1E8";
        ctx.fill();
        ctx.closePath();
    }

}
