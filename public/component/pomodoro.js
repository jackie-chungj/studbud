// Reference - learnt from = nehasoni05 (2021). Pomodoro-Clock. [online] Github. Available at: https://github.com/nehasoni05/Pomodoro-Clock
import { playSound, setSoundEnabled } from './sound.js';

var startBtn        = document.getElementById("pomo-start-button");
var resetBtn        = document.getElementById("pomo-reset-button");
var increaseSession = document.getElementById("plusSession");
var decreaseSession = document.getElementById("minusSession");
var increaseBreak   = document.getElementById("plusBreak");
var decreaseBreak   = document.getElementById("minusBreak");
var pauseBtn        = document.getElementById("pomo-pause-button");
var continueBtn     = document.getElementById("pomo-continue-button");
var skipBtn         = document.getElementById("pomo-skip-button");
var soundToggle     = document.getElementById("pomo-sound-toggle");
var heading         = document.getElementById("pomo-text");
var timerName;
var count           = 0;
var pomoline        = document.querySelector('.line');
var sessionTotalSec = 0;
var breakTotalSec   = 0;
var inBreak         = false;

// ── Sound toggle (shared system lives in sound.js) ─────────
var _soundOn = true;
soundToggle.addEventListener("click", function() {
    _soundOn = !_soundOn;
    setSoundEnabled(_soundOn);
    soundToggle.textContent = _soundOn ? 'Sound on' : 'Sound off';
    soundToggle.classList.toggle('pomo-sound-active', _soundOn);
});

// ── Session +/− ────────────────────────────────────────────
increaseSession.addEventListener("click", function() {
    var stime = document.getElementById("STIME");
    var disptime = document.getElementById("TIME").innerHTML;
    var changedisptime = document.getElementById("TIME");
    var min = parseInt(disptime.split(/[:]/)[0]) + 1;
    changedisptime.innerHTML = min + ":00";
    stime.innerHTML = min + " min";
});

decreaseSession.addEventListener("click", function() {
    var stime = document.getElementById("STIME");
    var disptime = document.getElementById("TIME").innerHTML;
    var changedisptime = document.getElementById("TIME");
    var min = parseInt(disptime.split(/[:]/)[0]);
    if (min > 1) min = min - 1;
    changedisptime.innerHTML = (min < 10 ? "0" + min : min) + ":00";
    stime.innerHTML = min + " min";
});

// ── Break +/− ──────────────────────────────────────────────
increaseBreak.addEventListener("click", function() {
    var btime = document.getElementById("BTIME");
    var min = parseInt(btime.innerHTML.split(/[ ]/)[0]) + 1;
    btime.innerHTML = min + " min";
});

decreaseBreak.addEventListener("click", function() {
    var btime = document.getElementById("BTIME");
    var min = parseInt(btime.innerHTML.split(/[ ]/)[0]);
    if (min > 1) min = min - 1;
    btime.innerHTML = min + " min";
});

// ── Start ──────────────────────────────────────────────────
startBtn.addEventListener("click", function() {
    document.getElementById("SBTN").style.display = 'none';
    document.getElementById("CBTN").style.display = 'none';
    document.getElementById("PBTN").style.display = 'block';
    heading.innerHTML = "Focus in progress";
    sessionTotalSec = parseInt(document.getElementById("STIME").innerHTML) * 60;
    pomoline.style.width = '180px';
    inBreak = false;
    skipBtn.disabled = false;
    increaseSession.disabled = true;
    decreaseSession.disabled = true;
    increaseBreak.disabled = true;
    decreaseBreak.disabled = true;
    playSound('session');
    startTimer();
});

function startTimer() {
    var presentTime = document.getElementById("TIME").innerHTML;
    var changedisptime = document.getElementById("TIME");
    var timeArray = presentTime.split(/[:]/);
    var min = checkMinute(parseInt(timeArray[0] - 0));
    var s = parseInt(timeArray[1]) - 1;
    var sec = checkSeconds(s);

    if (sec == 59) {
        min = min - 1;
        if (min < 10) min = "0" + min;
    }
    changedisptime.innerHTML = min + ":" + sec;

    if (min == 0 && sec == 0) {
        document.getElementById("SBTN").style.display = 'block';
        document.getElementById("CBTN").style.display = 'none';
        document.getElementById("PBTN").style.display = 'none';
        playSound('end');
        breakTime();
        return;
    }
    updateLine(parseInt(min) * 60 + parseInt(sec), sessionTotalSec, 180);
    timerName = setTimeout(startTimer, 1000);
}

// ── Pause ──────────────────────────────────────────────────
pauseBtn.addEventListener("click", function() {
    clearTimeout(timerName);
    document.getElementById("SBTN").style.display = 'none';
    document.getElementById("CBTN").style.display = 'block';
    document.getElementById("PBTN").style.display = 'none';
    skipBtn.disabled = true;
    heading.innerHTML = "Paused";
});

// ── Resume ─────────────────────────────────────────────────
continueBtn.addEventListener("click", function() {
    clearTimeout(timerName);
    document.getElementById("SBTN").style.display = 'none';
    document.getElementById("CBTN").style.display = 'none';
    document.getElementById("PBTN").style.display = 'block';
    skipBtn.disabled = false;
    heading.innerHTML = "Focus in progress";
    startTimer();
});

// ── Skip ───────────────────────────────────────────────────
skipBtn.addEventListener("click", function() {
    clearTimeout(timerName);
    if (inBreak) {
        playSound('end');
        resetPomodoro();
    } else {
        playSound('end');
        breakTime();
    }
});

// ── Reset ──────────────────────────────────────────────────
resetBtn.addEventListener("click", resetPomodoro);

function resetPomodoro() {
    clearTimeout(timerName);

    var sessionMin = parseInt(document.getElementById("STIME").innerHTML);
    var displayMin = sessionMin < 10 ? "0" + sessionMin : "" + sessionMin;
    document.getElementById("TIME").innerHTML = displayMin + ":00";

    document.getElementById("SBTN").style.display = "block";
    document.getElementById("PBTN").style.display = "none";
    document.getElementById("CBTN").style.display = "none";

    heading.innerHTML = "Start Working!";
    pomoline.style.background = "red";
    pomoline.style.width = '180px';
    skipBtn.disabled = true;
    inBreak = false;

    increaseSession.disabled = false;
    decreaseSession.disabled = false;
    increaseBreak.disabled = false;
    decreaseBreak.disabled = false;

    count = 0;
}

// ── Break ──────────────────────────────────────────────────
function breakTime() {
    var bMin = document.getElementById("BTIME").innerHTML;
    var changedisptime = document.getElementById("TIME");
    var timeArray = bMin.split(/[ ]/);
    var min = timeArray[0];
    changedisptime.innerHTML = "0" + min + ":00";
    count = count + 1;
    heading.innerHTML = "Break time";
    pomoline.style.background = 'blue';
    breakTotalSec = parseInt(timeArray[0]) * 60;
    pomoline.style.width = '180px';
    inBreak = true;
    skipBtn.disabled = false;
    playSound('break');
    startBreak();
}

function startBreak() {
    var presentTime = document.getElementById("TIME").innerHTML;
    var changedisptime = document.getElementById("TIME");
    var timeArray = presentTime.split(/[:]/);
    var min = checkMinute(parseInt(timeArray[0] - 0));
    var s = parseInt(timeArray[1]) - 1;
    var sec = checkSeconds(s);

    if (sec == 59) {
        min = min - 1;
        if (min < 10) min = "0" + min;
    }
    changedisptime.innerHTML = min + ":" + sec;

    if (min == 0 && sec == 0) {
        clearTimeout(timerName);
        playSound('end');
        alert("Break over. You can start your session again!");
        resetPomodoro();
        return;
    }
    updateLine(parseInt(min) * 60 + parseInt(sec), breakTotalSec, 180);
    timerName = setTimeout(startBreak, 1000);
}

// ── Helpers ────────────────────────────────────────────────
function updateLine(remainingSec, totalSec, maxPx) {
    var ratio = totalSec > 0 ? remainingSec / totalSec : 1;
    pomoline.style.width = Math.round(ratio * maxPx) + 'px';
}

function checkMinute(min) {
    if (min < 10) min = "0" + min;
    return min;
}

function checkSeconds(s) {
    var sec = parseInt(s);
    if (sec < 10 && sec >= 0) sec = "0" + sec;
    if (sec < 0) sec = "59";
    return sec;
}
