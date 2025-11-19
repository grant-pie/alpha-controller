class DigitalOutput {
    constructor(id, toggled,  digitalInputId, sysExBytePosition = 0, value = 0, group = '') {
        this.id = id;
        this.toggled = toggled;
        this.sysex_byte_position = sysExBytePosition,
        this.digital_input_id = digitalInputId;
        this.value = value;
        this.group = group;

    };


    static findDigitalOutputBySysExBytePos(digitalOutputsTable, sysExBytePosition){
        const hasSysExBytePos = (element) => element.sysex_byte_position === sysExBytePosition;

        return digitalOutputsTable.findIndex(hasSysExBytePos)
    }

    static findDigitalOutputByDigitalInputId(digitalOutputsTable, digitalInputId){
        const hasDigitalInputId = (element) => element.digital_input_id === digitalInputId;

        return digitalOutputsTable.findIndex(hasDigitalInputId)
    }

}



