class AnalogInput {
    constructor(id, midiValue, group = '', sysExBytePosition = 0) {
        this.id = id;
        this.MIDI_value = midiValue;
        this.sysex_byte_position = sysExBytePosition;
        this.group = group;
    };

    setMIDIValue(MIDIValue){
        this.MIDI_value = MIDIValue;
    }

}

