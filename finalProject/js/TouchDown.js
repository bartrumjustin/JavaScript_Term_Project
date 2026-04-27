//Top HUD

const $master = $('#sysState');
const $masterGen = $('#masterGen');
const $time = $('#TimeState');
const $masterNameArr = [
    {
        name:"CAUTION",
        color: ["var(--bg)", "var(--hudWarn)"],
        string: [
            "TOO FAST", "OFF LEVEL", "HI HEAT"
        ]
    },
    {
        name:"WARN",
        color: ["var(--effect)", "var(--bg)"],
        string:["PULL UP", "LEVEL OUT", "OVERHEAT"]

    },
    {
        name: "ALERT",
        color: ["var(--hudWarn)", "var(--valueTxt)"],
        string: ["BRACE!", "THRUST T/OUT"]
    },
    {
        name: "System:",
        color: ["", ""],
        string: ["STAND BY"]
    }

];
const lInd = $('#left');
const rInd = $('#right');
const altBox = $('#NumAlt');
const $stat = $('#status');
var $gameComplete = false;
var $TicToc;
var inertiaCoEf = 1;
var inertia = 0;
var angle = 0;
var thrustFlag = false;
var heatMult = 1;
var heatRise = 0;
var terrainLift = 0;


$(function () {
    console.log("DOM is ready!");
    alert("Welcome to TouchDown \n" +
        "You are in charge of safely landing your ship\n"
    );
    alert("Lets cover the HUD indicators you will need to use\n" +
        "\nSystem: \nThis section will provide brief data on thing you will need to take action on\n" +
        "\nDeltaT:\nThis will log the overall time it took from thrust to touchdown\n"
    );
    alert("Left SideBar HUD:\nThis indicates your rate of decent\nThe ground becomes visisble at 100\nBe mindful that you are not angled when landing\n or that you arent to fast as well");
    alert("Right SideBar HUD:\nThis indicates your thrust temps called Temprature Delta\nTwo Arrows represent the left (<) and right(>) thruster\n" +
        "The indicators will move bottom to top as they get hotter\n" +
        "The Side Bar will transition from:\n     Yellow: Caution\n     Red: OverHeat\n" +
        "If your propulsion maxes out on temp, you will lose.");
    
    SelfTest();
    
    


});
function desktopControl() {
    
    $(document).on({
        keydown: function (e) {
            if (e.key === 'a' || e.key === 'd') {
                if ($TicToc==null && !$gameComplete) {
                    startGame();
                    console.log($TicToc);
                }
                else if ($gameComplete) {
                    $(document).off();
                }
            }
            if (e.key === "a") {
                $('#shipLeft').show();
                inertia += 1 * inertiaCoEf;
                thrustFlag = true;
            }
            else if (e.key === "d") {
                $('#shipRight').show();
                inertia -= 1 * inertiaCoEf;
                thrustFlag = true;
            }
            
        },
        keyup: function (e) {
            if (e.key === "a") {
                $('#shipLeft').hide();
                thrustFlag = false;
            }
            else if (e.key === "d") {
                $('#shipRight').hide();
                thrustFlag = false;
            }
            /*else if (e.key === "a" && e.key === "d") {
                $('#shipfull').toggle();
                momentum(10);
            }*/
        }
    })
}

function mobileControl() {
    const midScreen = $(window).width() / 2;
    $(document).on({
        
        touchstart: function (e) {
            var touchX = e.originalEvent.touches[0].pageX;
            if (touchX > midScreen || touchX < midScreen) {
                if ($TicToc == null && !$gameComplete) {
                    startGame();
                    console.log($TicToc);
                }
                else if ($gameComplete) {
                    $(document).off();
                }
            }
            if (touchX < midScreen) {
                $('#shipLeft').show();
                inertia += 1 * inertiaCoEf;
                thrustFlag = true;
            }
            else if (touchX > midScreen) {
                $('#shipRight').show();
                inertia -= 1 * inertiaCoEf;
                thrustFlag = true;
            }

        },
        touchend: function (e) {
            var releaseX = e.originalEvent.changedTouches[0].pageX;
            if (releaseX < midScreen) {
                $('#shipLeft').hide();
                thrustFlag = false;
            }
            else if (releaseX > midScreen) {
                $('#shipRight').hide();
            }
                thrustFlag = false;
            
            /*else if (e.key === "a" && e.key === "d") {
                $('#shipfull').toggle();
                momentum(10);
            }*/
        }
    })

}

    function SelfTest() {
        var x = 0;
        var testing = setInterval(function () {
            if (x < $masterNameArr.length) {
                //console.log($masterNameArr[x]);
                $masterGen.text($masterNameArr[x].name);
                $('#sysCont').css({
                    'background-color': $masterNameArr[x].color[0],
                    'color': $masterNameArr[x].color[1],
                    'border': `3px solid ${$masterNameArr[x].color[1]}`
                });
            
                $.each($masterNameArr[x].string, function (index, item) {
                    setTimeout(function () {
                        //console.log(item + " " + index * 250);
                        $master.text(item);
                    }, 100 * index);
                })
            
            }
    
            x++;
            if (x > 9) {
                console.log("testing ended");
                clearInterval(testing);
                x = 0;
            }
        
        
            //console.log(x);
            $time.html(`${x}${x}:${x}${x}`);
        
        }, 300);
        var count = 0;
        
    
        var TempIndFLow = setInterval(function () {
        
        
            let pos = $('#left').offset().top;
        
            let y = 8 * count;
            altBox.css('transform', `translateY(${y}px)`);
            altBox.text(Math.floor($(window).height() - altBox.offset().top));
            lInd.css('transform', `translateY(-${y}px)`);
            rInd.css('transform', `translateY(-${y}px)`);
            if (lInd.offset().top < $(window).height() / 2) {
                $('#rightHud').css({
                    'background-color': 'var(--effect)',
                    'color': 'var(--bg)'
                });
            }
            if (lInd.offset().top < $(window).height() / 4) {
                $('#rightHud').css({
                    'background-color': 'var(--hudWarn)',
                    'color': 'var(--bg)'
                });
            }
            if (pos < ($(window).height() / 5)) {
                
                lInd.css('transform', `translateY()`);
                rInd.css('transform', `translateY()`);
                $('#rightHud').css({
                    'background-color': '',
                    'color': ''
                });
                altBox.css('transform', `translateY()`);
                altBox.text(Math.floor($(window).height() - altBox.offset().top));
                clearInterval(TempIndFLow);
                determineUser();
            }
        
            count++;
        }, 50);
        $('#shipfull').toggle();
        $('#shipLeft').toggle();
        $('#shipRight').toggle();
        $('#terra').toggle();
        function determineUser() {
            if ($(window).width() >= 780) {
                console.log("Desktop User");
                desktopControl();
                alert("[A] key for left thruster\n[D] for your right thruster")
            }
            else {
                console.log("Mobile User");
                mobileControl();
                alert("Tap the left side of your screen for the left thruster\nTap the right side of your screen for your right thruster")
            }
        }
};

//Start Game heartbeat and routine behaviours
var a=0, b=0, i = 0, y= 0, adj = 0, mult = 0, statFlag = false, speedLimit = 0, c=0,d=0;
function startGame() {
    var timeout = false;
    var heartbeat = setInterval(function () {
        $TicToc = !$TicToc;
        
        $time.html(`${a}:${b}`);
        i++;
        //altimeter and falling mechanic
        if (thrustFlag) {
            adj -= 0.03;
            console.log("burn");
        }
        else if (!thrustFlag && adj < 0) {
            
                adj += .02; 
        }
        y += (adj + .5 + mult);
        //timer
        if (i === 5) {
            
            i = 0;
            b++;
            if (b === 10) {
                b = 0;
                a++; 
                mult += .0001;
            }
        }
        let altimeter = $(window).height() - altBox.offset().top;
        altBox.css('transform', `translateY(${y.toFixed(2)}px)`);
        altBox.text(altimeter.toFixed(2));
        terrain(altimeter);
    }, 20);
    //terrain
    function terrain(x) {
        if (x < 100) {
            
            terrainLift = -4.5 * (100 - x);

            $('#terra').show();
            $('#terra').css({
                'transform': `translateY(${terrainLift.toFixed(2)}px)`,
                'width': '100%',
                'height': '10px',
                'align-self': 'flex-end',
                'background-color': '#2cff05'
            });
            if (x <= 50 && Math.abs(angle) > 20 && statFlag == true) {
                
                    $stat.css({
                        'background-color': $masterNameArr[2].color[0],
                        'color': $masterNameArr[2].color[1],
                        'border': `3px solid ${$masterNameArr[2].color[1]}`
                    });
                    $stat.text($masterNameArr[2].string[0]);
            }
            if (x < 25 && x >= 20) {
                c = a + 1;
            }
            if (x <= 8 && a < c) {
                endGame("You crashed by landing too fast");
            }
            if (x <= 5) {
                endGame("You Landed Safely!");
            }
            
        }
    
        else if(x>100){
            $('#terra').hide();
        }
    }
    var rotation = setInterval(function () {
        
        if ($TicToc == true) {
                angle += 1 * (inertia/10);  
        }
        $('.ships').css({
            'position': 'absolute',
            'transform': `scale(.25) rotate(${angle}deg)`
        });
        if (Math.abs(angle) > 20 && statFlag ==false) {
            statFlag = true;
            $stat.css({
                'background-color': $masterNameArr[0].color[0],
                'color': $masterNameArr[0].color[1],
                'border': `3px solid ${$masterNameArr[0].color[1]}`
            });
            $stat.text($masterNameArr[0].string[1]);
        }
        if (Math.abs(angle) > 45) {
            statFlag = false;
            $stat.css({
                'background-color': $masterNameArr[1].color[0],
                'color': $masterNameArr[1].color[1],
                'border': `3px solid ${$masterNameArr[2].color[1]}`
            });
            $stat.text($masterNameArr[1].string[1]);
        }
        
        if (Math.abs(angle) > 80) {
            endGame("You have exceeded the free fall angle greater than 80 degrees!");
        }
        else if (Math.abs(angle) < 20 && statFlag == true) {
            statFlag = false;
            $stat.css({
                'background-color': $masterNameArr[3].color[0],
                'color': $masterNameArr[3].color[1],
                'border': `3px solid ${$masterNameArr[3].color[1]}`
            });
            $stat.text("");
        }
    }, 20);
    
    
    var thrustInt = setInterval(function () {
        if (thrustFlag) {
            heatRise -= 1 * heatMult;
            //console.log("thrust heat" + heatRise);
            document.getElementById("markerCont").style.transform = `translateY(${heatRise}px)`;
        }
        else if (heatRise != 0) {
            heatRise += 1 * heatMult / 2;
            //console.log("thrust cool" + heatRise);
            document.getElementById("markerCont").style.transform = `translateY(${heatRise}px)`;
        }
        if (heatRise <= -565) {
            endGame("You Have overheated and destroyed your propulsion!");
            thrustFlag = false;
            timeout = true;
            heatRise = -565;
            $masterGen.text($masterNameArr[2].name);
            $('#sysCont').css({
                'background-color': $masterNameArr[2].color[0],
                'color': $masterNameArr[2].color[1],
                'border': `3px solid ${$masterNameArr[2].color[1]}`
            });
            $master.text($masterNameArr[2].string[1]);
        };
        if(!timeout) {
            if (lInd.offset().top < $(window).height() / 2 && heatRise > -565) {
                $('#rightHud').css({
                    'background-color': 'var(--effect)',
                    'color': 'var(--bg)'
                });
                $masterGen.text($masterNameArr[0].name);
                $('#sysCont').css({
                    'background-color': $masterNameArr[0].color[0],
                    'color': $masterNameArr[0].color[1],
                    'border': `3px solid ${$masterNameArr[0].color[1]}`
                });
                $master.text($masterNameArr[0].string[2]);
            };
            if (lInd.offset().top < $(window).height() / 4 && heatRise > -565) {
                $('#rightHud').css({
                    'background-color': 'var(--hudWarn)',
                    'color': 'var(--bg)'
                });
                $masterGen.text($masterNameArr[1].name);
                $('#sysCont').css({
                    'background-color': $masterNameArr[1].color[0],
                    'color': $masterNameArr[1].color[1],
                    'border': `3px solid ${$masterNameArr[1].color[1]}`
                });
                $master.text($masterNameArr[1].string[2]);
            };
        }
        if (lInd.offset().top > $(window).height() / 2) {
            timeout = false;
            $('#rightHud').css({
                'background-color': '',
                'color': ''
            });
            $masterGen.text($masterNameArr[3].name);
            $('#sysCont').css({
                'background-color': $masterNameArr[3].color[0],
                'color': $masterNameArr[3].color[1],
                'border': `3px solid ${$masterNameArr[3].color[1]}`
            });
            $master.text($masterNameArr[3].string[0]);
        };
        
    }, 20);
}

function endGame(d) {
    $gameComplete = true;
    
    alert("Game Over:\n" + d);
    var highestID = setInterval(function () { }, 0);
    for (var i = 0; i <= highestID; i++) { clearInterval(i); }
    window.location.href = "././gameinterface.html";
}
