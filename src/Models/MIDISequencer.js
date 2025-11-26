/*
    MIDISequencer - Handles recording and playback of MIDI events
*/
import SequencerWorkerUrl from '../../public/workers/SequencerWorker.js?worker&url';
class MIDISequencer {
    constructor(midiInterface, tempo = 120) {
        this.midiInterface = midiInterface;
        this.tempo = tempo; // BPM
        this.isRecording = false;
        this.isPlaying = false;
        this.recordedEvents = []; // Array of {note, velocity, timestamp, type}
        this.startTime = null;
        this.playbackStartTime = null;
        this.playbackRAF = null; // RequestAnimationFrame ID
        this.noteOffTimeouts = []; // Track scheduled note-offs
        
        // Initialize Web Worker for background playback
        this.worker = null;
        this.initWorker();
    }

    // Initialize the Web Worker
    initWorker() {
        try {
            // Load worker from public folder
            this.worker = new Worker('/workers/SequencerWorker.js', { type: 'module' });
            
            this.worker.onmessage = (e) => {
                const { type, event } = e.data;
                
                switch(type) {
                    case 'playEvent':
                        // Send MIDI message from main thread
                        this.sendMIDINote(event.note, event.velocity, event.type);
                        break;
                    case 'playbackComplete':
                        console.log('MIDISequencer: Playback complete');
                        this.isPlaying = false;
                        break;
                    case 'stopped':
                        this.isPlaying = false;
                        break;
                    case 'error':
                        console.error('Worker error:', e.data.message);
                        break;
                }
            };
            
            this.worker.onerror = (error) => {
                console.error('Worker error:', error);
                console.error('Worker failed to load - using fallback');
                this.worker = null; // Set to null so fallback works
            };
            
            console.log('MIDISequencer: Worker initialized');
        } catch (error) {
            console.error('Failed to initialize worker:', error);
            console.log('Falling back to main thread playback');
            this.worker = null;
        }
    }

    // Start recording MIDI events
    startRecording() {
        console.log('MIDISequencer: Starting recording');
        this.recordedEvents = [];
        this.startTime = performance.now();
        this.isRecording = true;
    }

    // Stop recording
    stopRecording() {
        console.log('MIDISequencer: Stopping recording');
        this.isRecording = false;
        console.log(`Recorded ${this.recordedEvents.length} events`);
    }

    // Record a MIDI event
    recordEvent(note, velocity, type) {
        if (!this.isRecording) return;
        
        const timestamp = performance.now() - this.startTime;
        
        const event = {
            note: note,
            velocity: velocity,
            timestamp: timestamp,
            type: type // 'noteOn' or 'noteOff'
        };
        
        this.recordedEvents.push(event);
        console.log(`Recorded event: ${type} note=${note} vel=${velocity} time=${timestamp.toFixed(2)}ms`);
    }

    // Start playback
    startPlayback(loop = true) {
        if (this.recordedEvents.length === 0) {
            console.log('MIDISequencer: No events to play');
            return;
        }

        console.log(`MIDISequencer: Starting playback (loop=${loop})`);
        this.isPlaying = true;
        
        // Try to use worker if available, otherwise fallback to main thread
        if (this.worker) {
            console.log('Using Web Worker for playback');
            
            // Serialize events to plain objects (remove any circular references or functions)
            const serializedEvents = this.recordedEvents.map(event => ({
                note: event.note,
                velocity: event.velocity,
                timestamp: event.timestamp,
                type: event.type
            }));
            
            this.worker.postMessage({
                command: 'startPlayback',
                data: {
                    events: serializedEvents,
                    loop: loop
                }
            });
        } else {
            console.log('Using main thread for playback');
            this.startPlaybackMainThread(loop);
        }
    }

    // Fallback: Main thread playback (original implementation)
    startPlaybackMainThread(loop = true) {
        this.playbackStartTime = performance.now();
        let eventIndex = 0;

        const playNext = () => {
            if (!this.isPlaying) {
                console.log('MIDISequencer: Playback stopped');
                return;
            }

            const currentTime = performance.now() - this.playbackStartTime;
            
            // Play all events that should have happened by now
            while (eventIndex < this.recordedEvents.length) {
                const event = this.recordedEvents[eventIndex];
                
                if (event.timestamp <= currentTime) {
                    // Send MIDI message
                    this.sendMIDINote(event.note, event.velocity, event.type);
                    eventIndex++;
                } else {
                    break; // Wait for next frame
                }
            }

            // Check if we've played all events
            if (eventIndex >= this.recordedEvents.length) {
                if (loop) {
                    console.log('MIDISequencer: Looping...');
                    eventIndex = 0;
                    this.playbackStartTime = performance.now();
                } else {
                    console.log('MIDISequencer: Playback complete');
                    this.stopPlayback();
                    return;
                }
            }

            // Continue playback
            this.playbackRAF = requestAnimationFrame(playNext);
        };

        // Start the playback loop
        this.playbackRAF = requestAnimationFrame(playNext);
    }

    // Stop playback
    stopPlayback() {
        console.log('MIDISequencer: Stopping playback');
        this.isPlaying = false;
        
        // Stop worker if it exists
        if (this.worker) {
            this.worker.postMessage({ command: 'stopPlayback' });
        }
        
        // Cancel the animation frame (for main thread fallback)
        if (this.playbackRAF) {
            cancelAnimationFrame(this.playbackRAF);
            this.playbackRAF = null;
        }

        // Clear any pending note-offs
        this.noteOffTimeouts.forEach(timeout => clearTimeout(timeout));
        this.noteOffTimeouts = [];

        // Send all notes off to prevent stuck notes
        this.sendAllNotesOff();
    }

    // Clear all recorded events
    clearRecording() {
        console.log('MIDISequencer: Clearing recording');
        this.recordedEvents = [];
        this.stopPlayback();
    }

    // Send a MIDI note message
    sendMIDINote(note, velocity, type) {
        // Use the dedicated sequencer output device
        const outputDevice = this.midiInterface.sequencerOutputDevice;
        
        if (!outputDevice) {
            console.warn('MIDISequencer: No sequencer output device');
            return;
        }

        // MIDI status bytes: 0x90 = Note On, 0x80 = Note Off
        // Using Note On with velocity 0 as Note Off (common practice)
        const status = type === 'noteOn' ? 0x90 : 0x90;
        const vel = type === 'noteOn' ? velocity : 0;
        
        const message = [status, note, vel];
        
        try {
            outputDevice.send(message);
            console.log(`Sent MIDI (sequencer): ${type} note=${note} vel=${vel}`);
        } catch (error) {
            console.error('Error sending MIDI:', error);
        }
    }

    // Send All Notes Off message
    sendAllNotesOff() {
        const outputDevice = this.midiInterface.sequencerOutputDevice;
        if (!outputDevice) return;

        // MIDI All Notes Off: CC 123, value 0
        const allNotesOffMessage = [0xB0, 123, 0];
        
        try {
            outputDevice.send(allNotesOffMessage);
            console.log('Sent All Notes Off (sequencer)');
        } catch (error) {
            console.error('Error sending All Notes Off:', error);
        }
    }

    // Update tempo (for future use)
    setTempo(bpm) {
        this.tempo = bpm;
        console.log(`MIDISequencer: Tempo set to ${bpm} BPM`);
    }

    // Get recording duration in milliseconds
    getRecordingDuration() {
        if (this.recordedEvents.length === 0) return 0;
        
        const lastEvent = this.recordedEvents[this.recordedEvents.length - 1];
        return lastEvent.timestamp;
    }

    // Get recording duration in bars (assuming 4/4 time)
    getRecordingDurationInBars() {
        const durationMs = this.getRecordingDuration();
        const beatDuration = 60000 / this.tempo; // milliseconds per beat
        const barDuration = beatDuration * 4; // 4 beats per bar
        return durationMs / barDuration;
    }
}

export { MIDISequencer };