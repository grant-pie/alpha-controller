// SequencerWorker.js - Web Worker for background MIDI playback
// This runs in a separate thread and continues even when tab is inactive

let isPlaying = false;
let recordedEvents = [];
let playbackStartTime = null;
let eventIndex = 0;
let shouldLoop = false;
let playbackInterval = null;

// Listen for messages from main thread
self.onmessage = function(e) {
    const { command, data } = e.data;
    
    switch(command) {
        case 'startPlayback':
            startPlayback(data.events, data.loop);
            break;
        case 'stopPlayback':
            stopPlayback();
            break;
        case 'updateEvents':
            recordedEvents = data.events;
            break;
    }
};

function startPlayback(events, loop) {
    if (events.length === 0) {
        self.postMessage({ type: 'error', message: 'No events to play' });
        return;
    }
    
    recordedEvents = events;
    shouldLoop = loop;
    isPlaying = true;
    playbackStartTime = Date.now();
    eventIndex = 0;
    
    console.log('[Worker] Starting playback with', events.length, 'events');
    
    // Use setInterval for precise timing (1ms resolution)
    // Workers aren't throttled like main thread
    playbackInterval = setInterval(playbackLoop, 1);
}

function playbackLoop() {
    if (!isPlaying) return;
    
    const currentTime = Date.now() - playbackStartTime;
    
    // Play all events that should have happened by now
    while (eventIndex < recordedEvents.length) {
        const event = recordedEvents[eventIndex];
        
        if (event.timestamp <= currentTime) {
            // Send event back to main thread to send MIDI
            self.postMessage({
                type: 'playEvent',
                event: event
            });
            eventIndex++;
        } else {
            break; // Wait for next tick
        }
    }
    
    // Check if we've played all events
    if (eventIndex >= recordedEvents.length) {
        if (shouldLoop) {
            console.log('[Worker] Looping playback');
            eventIndex = 0;
            playbackStartTime = Date.now();
        } else {
            console.log('[Worker] Playback complete');
            stopPlayback();
            self.postMessage({ type: 'playbackComplete' });
        }
    }
}

function stopPlayback() {
    console.log('[Worker] Stopping playback');
    isPlaying = false;
    
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }
    
    self.postMessage({ type: 'stopped' });
}