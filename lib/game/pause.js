var pauseBtn = document.getElementById("pause");
var gamePaused = false;

if(pauseBtn){
    pauseBtn.onclick = function() {
        if(gamePaused)
            ig.system.startRunLoop();
        else {
            ig.system.stopRunLoop();
            window.alert("Game Paused.");
        }
        
        gamePaused = !gamePaused;
    };
}
