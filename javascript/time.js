function calcTimeRemaining(targetHour, targetMinute, targetSecond) {
    const now = new Date();
    const targetTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetHour, targetMinute, targetSecond);
  
    let timeDifference = targetTime - now;
  
    if (timeDifference < 0) {
      // If the target time has already passed, calculate time remaining for the next day
      targetTime.setDate(targetTime.getDate() + 1);
      timeDifference = targetTime - now;
    }
  
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
    return { hours, minutes, seconds };
}

function formatTime(number) {
    return number < 10 ? `0${number}` : `${number}`;
}

function updateTimer() {
    const targetHour = 19; 
    const targetMinute = 0;
    const targetSecond = 0;
  
    const timeRemaining = calcTimeRemaining(targetHour, targetMinute, targetSecond);
    const formattedTime = `${formatTime(timeRemaining.hours)}:${formatTime(timeRemaining.minutes)}:${formatTime(timeRemaining.seconds)}`;

    document.getElementById('time-remaining').innerHTML = `The next exercise will appear in: ${formattedTime}`;
}

  // Update the timer every second
setInterval(updateTimer, 1000);

updateTimer();