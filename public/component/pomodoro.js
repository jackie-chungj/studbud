// Reference - learnt from = nehasoni05 (2021). Pomodoro-Clock. [online] Github. Available at: https://github.com/nehasoni05/Pomodoro-Clock
var startBtn=document.getElementById("pomo-start-button");
var resetBtn=document.getElementById("pomo-reset-button");
var increaseSession=document.getElementById("plusSession");
var decreaseSession=document.getElementById("minusSession");
var increaseBreak=document.getElementById("plusBreak");
var decreaseBreak=document.getElementById("minusBreak");
var pauseBtn=document.getElementById("pomo-pause-button");
var continueBtn=document.getElementById("pomo-continue-button");
var heading=document.getElementById("pomo-text");
var timerName;
var count=0;
var pomoline = document.querySelector('.line');
var sessionTotalSec = 0;
var breakTotalSec = 0;
var inBreak = false;

// Increase sessions
increaseSession.addEventListener("click",function(){
    var stime=document.getElementById("STIME");
    var btime=document.getElementById("BTIME").innerHTML;
    var disptime=document.getElementById("TIME").innerHTML;
    var changedisptime=document.getElementById("TIME");
    let timeArray = disptime.split(/[:]/);
    var min=parseInt(timeArray[0]);
    min=min+1;
    changedisptime.innerHTML=min+":00";
    stime.innerHTML=min+" min";
})

// Decrease sessions
decreaseSession.addEventListener("click",function(){
    var stime=document.getElementById("STIME");
    var disptime=document.getElementById("TIME").innerHTML;
    var changedisptime=document.getElementById("TIME");
    let timeArray = disptime.split(/[:]/);
    var min=parseInt(timeArray[0]);

    if(min>1)
    {
    min=min-1;
    }
     if(min<10)
     {
     changedisptime.innerHTML="0"+min+":00";    
     }
     else
    changedisptime.innerHTML=min+":00";
    stime.innerHTML=min+" min";
})

// Increase breaks
increaseBreak.addEventListener("click",function(){
    var btime=document.getElementById("BTIME");
    var breaktime=document.getElementById("BTIME").innerHTML;
    let timeArray = breaktime.split(/[ ]/);
    var min=parseInt(timeArray[0]);
    min=min+1;
    btime.innerHTML=min+" min";
})

// Decrease breaks
decreaseBreak.addEventListener("click",function(){
    var btime=document.getElementById("BTIME");
    var breaktime=document.getElementById("BTIME").innerHTML;
    let timeArray = breaktime.split(/[ ]/);
    var min=parseInt(timeArray[0]);
    if(min>1)
    min=min-1;
    btime.innerHTML=min+" min";
})

// start button event listener
    startBtn.addEventListener("click",function()
    {
    var SBTN=document.getElementById("SBTN");
    var PBTN=document.getElementById("PBTN");
    var CBTN=document.getElementById("CBTN");
    SBTN.style.display='none';
    CBTN.style.display='none';
    PBTN.style.display='block';
    //console.log(time);
    heading.innerHTML="Session Starts";
    sessionTotalSec = parseInt(document.getElementById("STIME").innerHTML) * 60;
    pomoline.style.width = '150px';
    inBreak = false;
    document.getElementById("SKIPBTN").style.display = 'block';
    increaseSession.disabled=true;
    decreaseSession.disabled=true;
    increaseBreak.disabled=true;
    decreaseBreak.disabled=true;
    startTimer();
    })

function startTimer()
{
    var presentTime=document.getElementById("TIME").innerHTML;
    var changedisptime=document.getElementById("TIME");
    var timeArray=presentTime.split(/[:]/);
    var min=checkMinute(parseInt(timeArray[0]-0));
    var s=parseInt(timeArray[1])-1;
    console.log(s);
    var sec=checkSeconds(s);

    if(sec==59)
    {
        min=min-1;
        if(min<10)
        min="0"+min;
    }
    changedisptime.innerHTML=min+":"+sec;

    if(min==0 && sec==0)
    {
    var SBTN=document.getElementById("SBTN");
    var PBTN=document.getElementById("PBTN");
    var CBTN=document.getElementById("CBTN");
    SBTN.style.display='block';
    CBTN.style.display='none';
    PBTN.style.display='none';
        breakTime();

        return;
    }
    updateLine(parseInt(min)*60 + parseInt(sec), sessionTotalSec, 150);
    timerName=setTimeout(startTimer,1000);
}

pauseBtn.addEventListener("click",function()
{
    clearTimeout(timerName);
    var SBTN=document.getElementById("SBTN");
    var PBTN=document.getElementById("PBTN");
    var CBTN=document.getElementById("CBTN");
    SBTN.style.display='none';
    CBTN.style.display='block';
    PBTN.style.display='none';
    document.getElementById("SKIPBTN").style.display = 'none';
    heading.innerHTML="Session Paused";

});
continueBtn.addEventListener("click",function()
{
    clearTimeout(timerName);
    var SBTN=document.getElementById("SBTN");
    var PBTN=document.getElementById("PBTN");
    var CBTN=document.getElementById("CBTN");
    SBTN.style.display='none';
    CBTN.style.display='none';
    PBTN.style.display='block';
    document.getElementById("SKIPBTN").style.display = 'block';

    startTimer();
    heading.innerHTML="Session Starts";
});

document.getElementById("pomo-skip-button").addEventListener("click", function() {
    clearTimeout(timerName);
    if (inBreak) {
        resetPomodoro();
    } else {
        breakTime();
    }
});

resetBtn.addEventListener("click", resetPomodoro);

function resetPomodoro() {
    // Stop any running timer or break countdown
    clearTimeout(timerName);

    // Restore the timer display to the current session setting
    var sessionMin = parseInt(document.getElementById("STIME").innerHTML);
    var displayMin = sessionMin < 10 ? "0" + sessionMin : "" + sessionMin;
    document.getElementById("TIME").innerHTML = displayMin + ":00";

    // Restore button visibility: show Start, hide Pause and Continue
    document.getElementById("SBTN").style.display = "block";
    document.getElementById("PBTN").style.display = "none";
    document.getElementById("CBTN").style.display = "none";

    // Restore heading text and progress line
    heading.innerHTML = "Start Working!";
    document.querySelector(".line").style.background = "red";
    pomoline.style.width = '150px';
    document.getElementById("SKIPBTN").style.display = "none";
    inBreak = false;

    // Re-enable session and break controls
    increaseSession.disabled = false;
    decreaseSession.disabled = false;
    increaseBreak.disabled = false;
    decreaseBreak.disabled = false;

    // Reset internal counter
    count = 0;
}

function updateLine(remainingSec, totalSec, maxPx) {
    var ratio = totalSec > 0 ? remainingSec / totalSec : 1;
    pomoline.style.width = Math.round(ratio * maxPx) + 'px';
}

function checkMinute(min)
{
    if(min<10)
    {
        min="0"+min;
    }
    return min;
}	
function checkSeconds(s)
{
    var sec=parseInt(s);
if (sec < 10 && sec >= 0) 
{
    sec = "0" + sec;
} 
  if (sec < 0)
   {
       sec = "59";
  }

console.log("return time"+sec);
return sec;
}    

// Break
function breakTime()
{
    var bMin=document.getElementById("BTIME").innerHTML;
    var changedisptime=document.getElementById("TIME");
    var timeArray=bMin.split(/[ ]/);
    var min=timeArray[0];
    changedisptime.innerHTML="0"+min+":00";
    count=count+1;
    heading.innerHTML="Break Time :)";
    document.querySelector('.line').style.background = 'blue';
    breakTotalSec = parseInt(timeArray[0]) * 60;
    pomoline.style.width = '150px';
    inBreak = true;
    document.getElementById("SKIPBTN").style.display = 'block';
    startBreak();
}
function startBreak()
{
    var presentTime=document.getElementById("TIME").innerHTML;
    var changedisptime=document.getElementById("TIME");
    var timeArray=presentTime.split(/[:]/);
    var min=checkMinute(parseInt(timeArray[0]-0));
    var s=parseInt(timeArray[1])-1;
    console.log(s);
    var sec=checkSeconds(s);

    if(sec==59)
    {
        min=min-1;
        if(min<10)
        min="0"+min;
    }
    changedisptime.innerHTML=min+":"+sec;
    // if session and breaks are done alert done message
    if(min==0 && sec==0)
    {
        clearTimeout(timerName);
        alert("Break over. You can start your session again!");
        resetPomodoro();
        return;
    }
    updateLine(parseInt(min)*60 + parseInt(sec), breakTotalSec, 150);
    timerName=setTimeout(startBreak,1000);
}
