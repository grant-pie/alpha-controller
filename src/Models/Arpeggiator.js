/*
    Arpeggiator - Generates arpeggiated patterns from held notes
*/

class Arpeggiator {
    constructor(midiInterface, tempo = 120) {
        this.midiInterface = midiInterface;
        this.tempo = tempo;
        this.isActive = false;
        this.heldNotes = new Set(); // Set of currently held MIDI note numbers
        this.arpPattern = []; // Current arpeggiated pattern
        this.currentStep = 0;
        this.intervalId = null;
        
        // Settings
        this.mode = 'up'; // up, down, updown, downup, random, asplayed
        this.rate = '1/16'; // Note division
        this.octaves = 1; // Number of octaves to arpeggiate
        this.gateLength = 80; // Percentage of note length (0-100)
        this.noteDuration = 0; // Calculated from rate and tempo
        this.gateTime = 0; // Calculated from noteDuration and gateLength
        
        this.lastPlayedNote = null; // Track last note for note off
    }

    // Start the arpeggiator
    start(settings = {}) {
        console.log('Arpeggiator: Starting', settings);
        
        // Update settings
        if (settings.mode) this.mode = settings.mode;
        if (settings.rate) this.rate = settings.rate;
        if (settings.octaves) this.octaves = settings.octaves;
        if (settings.gateLength) this.gateLength = settings.gateLength;
        if (settings.tempo) this.tempo = settings.tempo;
        
        this.isActive = true;
        this.currentStep = 0;
        
        // Calculate timing
        this.calculateTiming();
        
        // Start arpeggio loop if we have notes
        if (this.heldNotes.size > 0) {
            this.updatePattern();
            this.startArpeggioLoop();
        }
    }

    // Stop the arpeggiator
    stop() {
        console.log('Arpeggiator: Stopping');
        this.isActive = false;
        
        // Stop the interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Send note off for last played note
        if (this.lastPlayedNote !== null) {
            this.sendMIDINote(this.lastPlayedNote, 0, 'noteOff');
            this.lastPlayedNote = null;
        }
        
        // Clear held notes
        this.heldNotes.clear();
        this.arpPattern = [];
    }

    // Add a note to the arpeggiator
    addNote(note) {
        console.log('Arpeggiator: Adding note', note);
        this.heldNotes.add(note);
        this.updatePattern();
        
        // Start arpeggio if not already running
        if (this.isActive && !this.intervalId) {
            this.startArpeggioLoop();
        }
    }

    // Remove a note from the arpeggiator
    removeNote(note) {
        console.log('Arpeggiator: Removing note', note);
        this.heldNotes.delete(note);
        this.updatePattern();
        
        // Stop arpeggio if no notes left
        if (this.heldNotes.size === 0 && this.intervalId) {
            this.stopArpeggioLoop();
        }
    }

    // Update the arpeggiated pattern based on held notes and mode
    updatePattern() {
        if (this.heldNotes.size === 0) {
            this.arpPattern = [];
            return;
        }
        
        // Convert held notes to sorted array
        const baseNotes = Array.from(this.heldNotes).sort((a, b) => a - b);
        
        // Generate pattern based on mode
        let pattern = [];
        
        switch(this.mode) {
            case 'up':
                pattern = this.generateUpPattern(baseNotes);
                break;
            case 'down':
                pattern = this.generateDownPattern(baseNotes);
                break;
            case 'updown':
                pattern = this.generateUpDownPattern(baseNotes);
                break;
            case 'downup':
                pattern = this.generateDownUpPattern(baseNotes);
                break;
            case 'random':
                pattern = this.generateRandomPattern(baseNotes);
                break;
            case 'asplayed':
                pattern = baseNotes; // Keep order as played (held notes set maintains insertion order in modern JS)
                break;
        }
        
        // Add octaves
        if (this.octaves > 1) {
            pattern = this.addOctaves(pattern);
        }
        
        this.arpPattern = pattern;
        console.log('Arpeggiator: Pattern updated', this.arpPattern);
    }

    // Generate up pattern
    generateUpPattern(notes) {
        return [...notes];
    }

    // Generate down pattern
    generateDownPattern(notes) {
        return [...notes].reverse();
    }

    // Generate up-down pattern (with repeated top/bottom notes)
    generateUpDownPattern(notes) {
        if (notes.length === 1) return notes;
        const up = [...notes];
        const down = [...notes].slice(1, -1).reverse();
        return [...up, ...down];
    }

    // Generate down-up pattern
    generateDownUpPattern(notes) {
        if (notes.length === 1) return notes;
        const down = [...notes].reverse();
        const up = [...notes].slice(1, -1);
        return [...down, ...up];
    }

    // Generate random pattern (pre-generate for one cycle)
    generateRandomPattern(notes) {
        // Create a shuffled version for this cycle
        const shuffled = [...notes];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Add octaves to pattern
    addOctaves(basePattern) {
        const fullPattern = [];
        for (let octave = 0; octave < this.octaves; octave++) {
            for (let note of basePattern) {
                const transposedNote = note + (octave * 12);
                // Only add if within MIDI range (0-127)
                if (transposedNote <= 127) {
                    fullPattern.push(transposedNote);
                }
            }
        }
        return fullPattern;
    }

    // Calculate timing based on rate and tempo
    calculateTiming() {
        const beatDuration = 60000 / this.tempo; // milliseconds per beat
        
        switch(this.rate) {
            case '1/4':
                this.noteDuration = beatDuration;
                break;
            case '1/8':
                this.noteDuration = beatDuration / 2;
                break;
            case '1/16':
                this.noteDuration = beatDuration / 4;
                break;
            case '1/32':
                this.noteDuration = beatDuration / 8;
                break;
            case '1/8t': // Eighth note triplet
                this.noteDuration = (beatDuration * 2) / 3;
                break;
            case '1/16t': // Sixteenth note triplet
                this.noteDuration = beatDuration / 3;
                break;
        }
        
        // Calculate gate time (how long note stays on)
        this.gateTime = (this.noteDuration * this.gateLength) / 100;
        
        console.log(`Arpeggiator timing: noteDuration=${this.noteDuration.toFixed(2)}ms, gateTime=${this.gateTime.toFixed(2)}ms`);
    }

    // Start the arpeggio loop
    startArpeggioLoop() {
        if (this.intervalId) return; // Already running
        
        console.log('Arpeggiator: Starting loop');
        this.currentStep = 0;
        
        // Play first note immediately
        this.playStep();
        
        // Set up interval for subsequent notes
        this.intervalId = setInterval(() => {
            this.playStep();
        }, this.noteDuration);
    }

    // Stop the arpeggio loop
    stopArpeggioLoop() {
        console.log('Arpeggiator: Stopping loop');
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Send note off for last note
        if (this.lastPlayedNote !== null) {
            this.sendMIDINote(this.lastPlayedNote, 0, 'noteOff');
            this.lastPlayedNote = null;
        }
    }

    // Play one step of the arpeggio
    playStep() {
        if (this.arpPattern.length === 0) return;
        
        // Send note off for previous note
        if (this.lastPlayedNote !== null) {
            this.sendMIDINote(this.lastPlayedNote, 0, 'noteOff');
        }
        
        // Get current note
        const note = this.arpPattern[this.currentStep];
        
        // Send note on
        this.sendMIDINote(note, 100, 'noteOn'); // Fixed velocity of 100
        this.lastPlayedNote = note;
        
        // Schedule note off based on gate length
        setTimeout(() => {
            if (this.lastPlayedNote === note) {
                this.sendMIDINote(note, 0, 'noteOff');
                this.lastPlayedNote = null;
            }
        }, this.gateTime);
        
        // Move to next step
        this.currentStep = (this.currentStep + 1) % this.arpPattern.length;
        
        // For random mode, regenerate pattern when cycle completes
        if (this.currentStep === 0 && this.mode === 'random') {
            this.updatePattern();
        }
    }

    // Send MIDI note
    sendMIDINote(note, velocity, type) {
        const outputDevice = this.midiInterface.sequencerOutputDevice;
        
        if (!outputDevice) {
            console.warn('Arpeggiator: No sequencer output device');
            return;
        }
        
        const status = type === 'noteOn' ? 0x90 : 0x90;
        const vel = type === 'noteOn' ? velocity : 0;
        const message = [status, note, vel];
        
        try {
            outputDevice.send(message);
            // console.log(`Arpeggiator MIDI: ${type} note=${note} vel=${vel}`);
        } catch (error) {
            console.error('Error sending arpeggiator MIDI:', error);
        }
    }

    // Update settings on the fly
    setMode(mode) {
        this.mode = mode;
        this.updatePattern();
        this.currentStep = 0; // Reset step
        console.log('Arpeggiator: Mode changed to', mode);
    }

    setRate(rate, tempo) {
        this.rate = rate;
        this.tempo = tempo;
        this.calculateTiming();
        
        // Restart the loop with new timing
        if (this.intervalId) {
            this.stopArpeggioLoop();
            this.startArpeggioLoop();
        }
        
        console.log('Arpeggiator: Rate changed to', rate);
    }

    setOctaves(octaves) {
        this.octaves = octaves;
        this.updatePattern();
        console.log('Arpeggiator: Octaves changed to', octaves);
    }

    setGateLength(gateLength) {
        this.gateLength = gateLength;
        this.calculateTiming();
        console.log('Arpeggiator: Gate length changed to', gateLength);
    }

    // Get held note count (for UI display)
    getHeldNoteCount() {
        return this.heldNotes.size;
    }
}

export { Arpeggiator };