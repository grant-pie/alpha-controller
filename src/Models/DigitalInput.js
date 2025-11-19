class DigitalInput {
    constructor(id, midiValue, toggled = false, group = '', sysExBytePosition = 0, isCC = 0) {
        this.id = id;
        this.toggled = toggled;
        this.MIDI_value = midiValue;
        this.sysex_byte_position = sysExBytePosition;
        this.group = group;
        this.is_CC = isCC;
    };

    setMIDIValue(MIDIValue){
        this.MIDI_value = MIDIValue;
    }

    setIsCC(isCC){
        this.is_CC = isCC;
    }

    static findDigitalInputByMIDIValue(digitalInputsTable, midiValue){

        const hasMidiValue = (element) => element.MIDI_value === midiValue && element.is_CC === 0;
        //if note is cc dont add



        //const id =;
        return digitalInputsTable[ digitalInputsTable.findIndex(hasMidiValue)]
    }

    static findDigitalInputByCCValue(digitalInputsTable, midiValue){

        const hasMidiValue = (element) => element.MIDI_value === midiValue && element.is_CC === 1;
        //if note is cc dont add

        return digitalInputsTable.findIndex(hasMidiValue)
    }
}

export { DigitalInput };