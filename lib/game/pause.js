var pauseBtn = document.getElementById("pause");
var gamePaused = false;

if(pauseBtn){
    pauseBtn.onclick = function() {
        if(gamePaused) {
            ig.system.startRunLoop();
            pauseBtn.innerHTML = "PAUSE";
        } else {
            ig.system.stopRunLoop();
            pauseBtn.innerHTML = "RESUME";
            window.alert("Game Paused.");
        }
        gamePaused = !gamePaused;
    };
}
