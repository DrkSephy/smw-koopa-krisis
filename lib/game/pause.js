var pauseBtn = document.getElementById("pause");
var gamePaused = false;

if(pauseBtn){
    pauseBtn.onclick = function() {
        if(gamePaused) {
            ig.system.startRunLoop();
            document.getElementById("pause").innerHTML = "PAUSE";
        }
        else {
            ig.system.stopRunLoop();
            document.getElementById("pause").innerHTML = "RESUME";
            window.alert("Game Paused.");
        }
        
        gamePaused = !gamePaused;
    };
}
