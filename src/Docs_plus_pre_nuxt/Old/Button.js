class Button {
    constructor(id, toggled, func, group, ledPosition, ledBytePosition, midiBytePosition, midiValue, isCC, row, column) {
        this.id = id;
        this.toggled = toggled;
        this.func = func;
        this.group = group;
        this.ledPosition = ledPosition;
        this.ledBytePosition = ledBytePosition;
        this.midiBytePosition = midiBytePosition;
        this.midiValue = midiValue;
        this.isCC = isCC;
        this.row = row;
        this.column = column;
    };

    setMidiValue(midiValue) {
        this.midi_value = midiValue;
    };

    static getBtnByMidiValue(btnArray, midiValue){

        const hasMidiVal = (button) => button.midiValue === midiValue;

        return btnArray.findIndex(hasMidiVal)

    }
  }