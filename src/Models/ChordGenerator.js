/*
    ChordGenerator - Generates chords from single note input
*/

class ChordGenerator {
    constructor(midiInterface) {
        this.midiInterface = midiInterface;
        this.isActive = false;
        this.activeChords = new Map(); // Map of root note to array of chord notes
        
        // Settings
        this.chordType = 'major';
        this.voicing = 'root';
        this.velocity = 100;
        
        // Chord definitions (intervals from root)
        this.chordIntervals = {
            'major': [0, 4, 7],
            'minor': [0, 3, 7],
            'diminished': [0, 3, 6],
            'augmented': [0, 4, 8],
            'major7': [0, 4, 7, 11],
            'minor7': [0, 3, 7, 10],
            'dominant7': [0, 4, 7, 10],
            'sus2': [0, 2, 7],
            'sus4': [0, 5, 7],
            'major6': [0, 4, 7, 9],
            'minor6': [0, 3, 7, 9],
            'dim7': [0, 3, 6, 9],
            'halfDim7': [0, 3, 6, 10]
        };
    }

    // Start the chord generator
    start(settings = {}) {
        console.log('ChordGenerator: Starting', settings);
        
        if (settings.type) this.chordType = settings.type;
        if (settings.voicing) this.voicing = settings.voicing;
        if (settings.velocity !== undefined) this.velocity = settings.velocity;
        
        this.isActive = true;
    }

    // Stop the chord generator
    stop() {
        console.log('ChordGenerator: Stopping');
        this.isActive = false;
        
        // Send note off for all active chords
        this.activeChords.forEach((chordNotes, rootNote) => {
            this.stopChord(rootNote);
        });
        
        this.activeChords.clear();
    }

    // Play a chord when note on is received
    playChord(rootNote, velocity) {
        if (!this.isActive) return;
        
        console.log(`ChordGenerator: Playing chord on root ${rootNote}`);
        
        // Stop any existing chord on this root
        if (this.activeChords.has(rootNote)) {
            this.stopChord(rootNote);
        }
        
        // Generate chord notes
        const chordNotes = this.generateChord(rootNote);
        
        // Store active chord
        this.activeChords.set(rootNote, chordNotes);
        
        // Send note on for each chord note
        chordNotes.forEach(note => {
            this.sendMIDINote(note, this.velocity, 'noteOn');
        });
        
        console.log(`ChordGenerator: Chord notes`, chordNotes);
    }

    // Stop a chord when note off is received
    stopChord(rootNote) {
        if (!this.activeChords.has(rootNote)) return;
        
        console.log(`ChordGenerator: Stopping chord on root ${rootNote}`);
        
        const chordNotes = this.activeChords.get(rootNote);
        
        // Send note off for each chord note
        chordNotes.forEach(note => {
            this.sendMIDINote(note, 0, 'noteOff');
        });
        
        this.activeChords.delete(rootNote);
    }

    // Generate chord notes based on root, type, and voicing
    generateChord(rootNote) {
        // Get base intervals for chord type
        const intervals = this.chordIntervals[this.chordType];
        if (!intervals) {
            console.error('Unknown chord type:', this.chordType);
            return [rootNote];
        }
        
        // Generate notes from intervals
        let notes = intervals.map(interval => rootNote + interval);
        
        // Apply voicing
        notes = this.applyVoicing(notes);
        
        // Filter out notes outside MIDI range (0-127)
        notes = notes.filter(note => note >= 0 && note <= 127);
        
        return notes;
    }

    // Apply voicing to chord notes
    applyVoicing(notes) {
        if (notes.length < 3) return notes; // Need at least 3 notes for voicings
        
        switch(this.voicing) {
            case 'root':
                // Root position - no change
                return notes;
                
            case 'first':
                // 1st inversion - move lowest note up an octave
                const first = [...notes];
                first.push(first.shift() + 12);
                return first;
                
            case 'second':
                // 2nd inversion - move two lowest notes up an octave
                const second = [...notes];
                second.push(second.shift() + 12);
                second.push(second.shift() + 12);
                return second;
                
            case 'third':
                // 3rd inversion (only for 7th chords)
                if (notes.length < 4) return notes;
                const third = [...notes];
                third.push(third.shift() + 12);
                third.push(third.shift() + 12);
                third.push(third.shift() + 12);
                return third;
                
            case 'drop2':
                // Drop 2 voicing - drop 2nd highest note down an octave
                if (notes.length < 3) return notes;
                const drop2 = [...notes];
                const secondHighest = drop2[drop2.length - 2];
                drop2[drop2.length - 2] = secondHighest - 12;
                return drop2.sort((a, b) => a - b);
                
            case 'drop3':
                // Drop 3 voicing - drop 3rd highest note down an octave
                if (notes.length < 4) return notes;
                const drop3 = [...notes];
                const thirdHighest = drop3[drop3.length - 3];
                drop3[drop3.length - 3] = thirdHighest - 12;
                return drop3.sort((a, b) => a - b);
                
            default:
                return notes;
        }
    }

    // Send MIDI note
    sendMIDINote(note, velocity, type) {
        const outputDevice = this.midiInterface.sequencerOutputDevice;
        
        if (!outputDevice) {
            console.warn('ChordGenerator: No sequencer output device');
            return;
        }
        
        const status = type === 'noteOn' ? 0x90 : 0x90;
        const vel = type === 'noteOn' ? velocity : 0;
        const message = [status, note, vel];
        
        try {
            outputDevice.send(message);
            // console.log(`ChordGenerator MIDI: ${type} note=${note} vel=${vel}`);
        } catch (error) {
            console.error('Error sending chord generator MIDI:', error);
        }
    }

    // Update settings on the fly
    setChordType(type) {
        this.chordType = type;
        
        // Re-trigger active chords with new type
        const activeRoots = Array.from(this.activeChords.keys());
        activeRoots.forEach(rootNote => {
            this.stopChord(rootNote);
            this.playChord(rootNote, this.velocity);
        });
        
        console.log('ChordGenerator: Type changed to', type);
    }

    setVoicing(voicing) {
        this.voicing = voicing;
        
        // Re-trigger active chords with new voicing
        const activeRoots = Array.from(this.activeChords.keys());
        activeRoots.forEach(rootNote => {
            this.stopChord(rootNote);
            this.playChord(rootNote, this.velocity);
        });
        
        console.log('ChordGenerator: Voicing changed to', voicing);
    }

    setVelocity(velocity) {
        this.velocity = velocity;
        console.log('ChordGenerator: Velocity changed to', velocity);
    }

    // Get active chord count (for UI display)
    getActiveChordCount() {
        return this.activeChords.size;
    }
}

export { ChordGenerator };