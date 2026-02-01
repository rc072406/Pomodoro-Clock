document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const breakLengthEl = document.getElementById('break-length');
    const sessionLengthEl = document.getElementById('session-length');
    const timerLabelEl = document.getElementById('timer-label');
    const timeLeftEl = document.getElementById('time-left');
    const startStopBtn = document.getElementById('start_stop');
    const resetBtn = document.getElementById('reset');
    const timerDisplayEl = document.getElementById('timer-display');
    const audioEl = document.getElementById('beep');

    // --- State Variables ---
    let breakLength = 5;
    let sessionLength = 25;
    let timerLabel = 'Session';
    let timeLeft = sessionLength * 60; // Time in seconds
    let isRunning = false;
    let intervalID = null;

    // --- Utility Functions ---

    /**
     * Formats total seconds into MM:SS string (User Story #8)
     */
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const minutesStr = String(minutes).padStart(2, '0');
        const secondsStr = String(remainingSeconds).padStart(2, '0');
        
        return `${minutesStr}:${secondsStr}`;
    };

    /**
     * Updates the DOM with current state.
     */
    const updateDisplay = () => {
        breakLengthEl.textContent = breakLength;
        sessionLengthEl.textContent = sessionLength;
        timerLabelEl.textContent = timerLabel;
        timeLeftEl.textContent = formatTime(timeLeft);
        
        // Update timer display style based on phase
        timerDisplayEl.classList.remove('session-time', 'break-time');
        timerDisplayEl.classList.add(timerLabel === 'Session' ? 'session-time' : 'break-time');
    };

    // --- Timer Control Logic ---

    /**
     * Clears the timer interval.
     */
    const clearTimer = () => {
        if (intervalID !== null) {
            clearInterval(intervalID);
            intervalID = null;
        }
    };

    /**
     * Handles the countdown logic and phase switching (User Stories #19, #22-#25).
     */
    const handleCountdown = () => {
        timeLeft--; // Decrement time (User Story #19)

        if (timeLeft < 0) {
            // Time hit zero (User Story #22, #23, #24, #25)
            
            // Play sound (User Story #26)
            audioEl.currentTime = 0;
            audioEl.play();

            if (timerLabel === 'Session') {
                // Switch to Break
                timerLabel = 'Break';
                timeLeft = breakLength * 60;
            } else {
                // Switch to Session
                timerLabel = 'Session';
                timeLeft = sessionLength * 60;
            }
        }
        
        updateDisplay();
    };

    /**
     * Starts or pauses the timer (User Stories #9, #18, #20, #21).
     */
    const handleStartStop = () => {
        isRunning = !isRunning;
        
        if (isRunning) {
            // Start the timer (User Story #18, #21)
            startStopBtn.innerHTML = '<i class="fas fa-pause"></i>';
            intervalID = setInterval(handleCountdown, 1000);
        } else {
            // Pause the timer (User Story #20)
            startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
            clearTimer();
        }
    };

    /**
     * Resets the entire clock (User Stories #10, #11, #28).
     */
    const handleReset = () => {
        clearTimer(); // Stop the timer (User Story #11)
        isRunning = false;

        // Reset lengths to default (User Story #11)
        breakLength = 5;
        sessionLength = 25;

        // Reset timer label and time (User Story #11)
        timerLabel = 'Session';
        timeLeft = 25 * 60;

        // Reset audio (User Story #28)
        audioEl.pause();
        audioEl.currentTime = 0;

        // Reset button icon
        startStopBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        updateDisplay();
    };

    // --- Length Control Logic ---

    /**
     * Handles incrementing/decrementing break/session lengths (User Stories #12-#17).
     */
    const handleLengthChange = (type, operation) => {
        if (isRunning) return; // Cannot change lengths while timer is running

        let length = type === 'break' ? breakLength : sessionLength;

        if (operation === 'increment') {
            length = length < 60 ? length + 1 : 60; // User Story #13, #15, #17
        } else {
            length = length > 1 ? length - 1 : 1; // User Story #12, #14, #16
        }

        if (type === 'break') {
            breakLength = length;
        } else {
            sessionLength = length;
            
            
            if (timerLabel === 'Session') {
                timeLeft = sessionLength * 60;
            }
        }
        
        updateDisplay();
    };

    
    
    // Break Length Controls
    document.getElementById('break-decrement').addEventListener('click', () => handleLengthChange('break', 'decrement'));
    document.getElementById('break-increment').addEventListener('click', () => handleLengthChange('break', 'increment'));

    // Session Length Controls
    document.getElementById('session-decrement').addEventListener('click', () => handleLengthChange('session', 'decrement'));
    document.getElementById('session-increment').addEventListener('click', () => handleLengthChange('session', 'increment'));

    // Main Timer Controls
    startStopBtn.addEventListener('click', handleStartStop);
    resetBtn.addEventListener('click', handleReset);
    
   
    updateDisplay(); 
});
