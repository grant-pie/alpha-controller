class HardwareInterface {
    constructor(digitalInputsTable = [], analogInputsTable = [], digitalOutputsTable = []) {
        this.digital_inputs_table = digitalInputsTable;
        this.analog_inputs_table =  analogInputsTable;
        this.digital_outputs_table =  digitalOutputsTable;
    };
}

