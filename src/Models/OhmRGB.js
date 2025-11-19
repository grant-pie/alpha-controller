/*
    TODO:
    add methods -> assign methods
    generate methods -> create methods
    group digital inputs by input_group
    function returns

    rename functions to more appropriate names get/find

*/
import { HardwareInterface } from './HardwareInterface.js';
import { AnalogInput } from './AnalogInput.js';
import { DigitalInput } from './DigitalInput.js';
import { DigitalOutput } from './DigitalOutput.js';
import { SysExMessage } from './SysExMessage.js';

class OhmRGB extends HardwareInterface {
    constructor(digitalInputsTable = [], analogInputsTable = [], digitalOutputsTable = []) {
        super(digitalInputsTable, analogInputsTable, digitalOutputsTable);
    };

    generateButtonsInputTable(){
        let buttons = [];

        let count = 0;
        //grid
        // /   constructor(id, midiValue, toggled = false, group = '', sysExBytePosition = 0, isCC = 0) {
        for(let i = 0; i <= 63; i++) {
            buttons.push( new DigitalInput(count, '', false, 'grid', 0, 0) );
            count++;
        }

        //crossfader
        for(let i = 0; i <= 1; i++) {
            buttons.push( new DigitalInput( count, '', false, 'crossfader',  0, 0) );
            count++;
        }


        //left faders
        for(let i = 0; i <= 3; i++) {
            buttons.push( new DigitalInput( count, '', false, 'leftFaders',  0, 0) );
            count++;
        }

        //right faders
        for(let i = 0; i <= 3; i++) {
            buttons.push( new DigitalInput( count, '', false, 'rightFaders',  0, 0) );
            count++;
        }

        //functions
        for(let i = 0; i <= 5; i++) {
            buttons.push( new DigitalInput(count, '', false, 'function',  0, 0) );
            count++;
        }

        //bpm
        buttons.push( new DigitalInput(count, '', false, 'bpm',  0, 0) );

        return buttons;
    }

    buildAnalogInputsTable(){
        let inputs = [];
        let count = 0;
        //crossfader
        inputs.push(new AnalogInput(count, undefined, 'crossfader'));
        count++;

        //left faders
        for(let i = 0; i <= 3; i++){
            inputs.push(new AnalogInput(count, undefined, 'leftFaders'));
            count++;
        }

        //right faders
        for(let i = 0; i <= 3; i++){
            inputs.push(new AnalogInput(count, undefined, 'rightFaders'));
            count++;
        }

        //leftknobs
        for(let i = 0; i <= 11; i++){
            inputs.push(new AnalogInput(count, undefined, 'leftKnobs'));
            count++;
        }

        //leftknobs
        for(let i = 0; i <= 3; i++){
            inputs.push(new AnalogInput(count, undefined, 'rightKnobs'));
            count++;
        }


        return inputs;
    }

    generateGridLEDOutputTable(){
        let leds = [];

        let column = 0;
        let row = 0;

        let sysExBytePosition = 56;
        let startingSysExBytePosition = 56;

        for(let i = 0; i <= 63; i++) {
            //create group of digital outputs (RGB)
            leds.push({
                'id' : i,
                'r' :  new DigitalOutput(i, false, i, sysExBytePosition, 0, 'led_button_' + i ),
                'g' :  new DigitalOutput(i, false, i, sysExBytePosition, 0, 'led_button_' + i),
                'b' :  new DigitalOutput(i, false, i, sysExBytePosition, 0, 'led_button_' + i),
                'digital_input_id': i,
                'sysex_byte_position' : sysExBytePosition,
                'group': 'grid'
            });

            column++;

            if(column > 7) {
                column = 0;
                row++;
            }

            if(column === 0 && row > 0) {

                if(row % 2 !== 0) {
                    startingSysExBytePosition += 4;
                } else {
                    startingSysExBytePosition -= 3;
                }

                sysExBytePosition = startingSysExBytePosition;

            } else {
                sysExBytePosition -= 8;
            }
        }

        return leds;
    }

    generateCrossfaderLEDOutputTable(){
        let leds = [];

        const crossfaderId = 64;
        let sysExBytePosition = 74;

        for(let i = 0; i <= 1; i++){
            sysExBytePosition = i !== 1 ? 74 : 75;

            leds.push({
                'id' : crossfaderId + i,
                'r' :  new DigitalOutput(crossfaderId + i, false, crossfaderId, sysExBytePosition, 0, 'led_button_' + crossfaderId  + i),
                'g' :  new DigitalOutput(crossfaderId + i, false, crossfaderId, sysExBytePosition, 0, 'led_button_' + crossfaderId + i),
                'b' :  new DigitalOutput(crossfaderId + i, false, crossfaderId, sysExBytePosition, 0, 'led_button_' + crossfaderId + i),
                'digital_input_id': crossfaderId + i,
                'sysex_byte_position' : sysExBytePosition,
                'group': 'crossfader'
            });
        }

        return leds;
    }

    generateFaderLEDOutputTable(){
        let leds = [];

        const faderId = 66;
        let sysExBytePosition = 66;

        let group = 'leftFaders'

        for(let i = 0; i <= 7; i++){
            if(i > 3){
                group = 'rightFaders'
            }

            if(i === 2){
                sysExBytePosition = 70
            }

            if(i === 4){
                sysExBytePosition = 79
            }

            leds.push({
                'id' : faderId + i,
                'r' :  new DigitalOutput(faderId + i, false, faderId, sysExBytePosition, 0, 'led_button_' + faderId  + i),
                'g' :  new DigitalOutput(faderId + i, false, faderId, sysExBytePosition, 0, 'led_button_' + faderId + i),
                'b' :  new DigitalOutput(faderId + i, false, faderId, sysExBytePosition, 0, 'led_button_' + faderId + i),
                'digital_input_id':  faderId + i,
                'sysex_byte_position' : sysExBytePosition,
                'group': group
            });

            if(i % 2 === 0 && i < 4){
                sysExBytePosition++;
            }

            if(i >= 4){
                sysExBytePosition--;
            }


        }

        return leds;
    }

    generateFunctionLEDOutputTable(){
        let leds = [];

        const functionId = 74;
        let sysExBytePosition = 64;

        for(let i = 0; i <= 5; i++){

            leds.push({
                'id' : functionId + i,
                'r' :  new DigitalOutput(functionId + i, false, functionId, sysExBytePosition, 0, 'led_button_' + functionId  + i),
                'g' :  new DigitalOutput(functionId + i, false, functionId, sysExBytePosition, 0, 'led_button_' + functionId + i),
                'b' :  new DigitalOutput(functionId + i, false, functionId, sysExBytePosition, 0, 'led_button_' + functionId + i),
                'digital_input_id': functionId + i,
                'sysex_byte_position' : sysExBytePosition,
                'group': 'function'
            });

            if(i % 2 === 0 ){
                sysExBytePosition++;
            } else {
                sysExBytePosition += 3;
            }

        }

        return leds;
    }

    generateBPMLEDOutputTable() {
        const bpmId =  80;
        const sysExBytePosition = 80;
        return {
            'id' : bpmId,
            'r' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'g' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'b' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'digital_input_id': bpmId,
            'sysex_byte_position' : sysExBytePosition,
            'group': 'bpm'
        };
    }

    generateUnusedEDOutputTable() {
        const bpmId =  82;
        const sysExBytePosition = 81;
        return {
            'id' : bpmId,
            'r' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'g' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'b' :  new DigitalOutput(bpmId, false, bpmId, sysExBytePosition, 0, 'led_button_' + bpmId),
            'digital_input_id': bpmId,
            'sysex_byte_position' : sysExBytePosition,
            'group': 'bpm'
        };
    }

    addSiblingOutputsRefsToOutputTable(){
        let output;
        let outputSiblingId;

        for( let i = 0; i <= this.digital_outputs_table.length - 1; i++) {
            output = this.digital_outputs_table[i];

            if(  output.sysex_byte_position % 2 === 0) {
                outputSiblingId = DigitalOutput.findDigitalOutputBySysExBytePos( this.digital_outputs_table,output.sysex_byte_position + 1);
            } else {
                outputSiblingId = DigitalOutput.findDigitalOutputBySysExBytePos( this.digital_outputs_table,output.sysex_byte_position - 1);
            }

            this.digital_outputs_table[i].sibling_id = outputSiblingId;
        }
    }
    /*
        Request MIDI map for all Buttons. The OhmRGB will respond with Command 0B, and the bits are formatted identically.
        07.0C : Request MIDI Basic Channel

        F0 00 01 61 07 07 0C F7

    */
    assignSysExBytePosToDigitalInputsTable(){
        let gridColumn = 0;
        let gridRow =0;
        let sysexBytePosition = 0;

        //grid btns
        for(let i = 0; i <= 63; i++) {
            sysexBytePosition = gridRow + (gridColumn * 8);

            this.digital_inputs_table[i].sysex_byte_position = sysexBytePosition;
            //grid btns

            gridColumn++;
            if(gridColumn === 8) {
                gridColumn = 0;
                gridRow++
            }

        }

        //crossfader
        this.digital_inputs_table[64].sysex_byte_position = 64;
        this.digital_inputs_table[65].sysex_byte_position = 72;

        //faders
        let faderStartPos = 65
        for(let i = 66; i<=73; i++){
            this.digital_inputs_table[i].sysex_byte_position = i % 2 === 0 ? faderStartPos++ : (faderStartPos + 7);
        }

        //function
        let functonStartPos = 69
        for(let i = 74; i<=79; i++){

            this.digital_inputs_table[i].sysex_byte_position = i % 2 === 0 ? functonStartPos++ : (functonStartPos + 7);
        }

        //bpm
        this.digital_inputs_table[80].sysex_byte_position = 87;
    }

    //TODO: This needs to be properly refactored
    assignSysExBytePosToAnalogInputsTable(){
        let sysExBytePosition = 24;
        //crosfader
        this.analog_inputs_table[0].sysex_byte_position =  sysExBytePosition;

        sysExBytePosition--;
        //faders
        for(let i = 1; i <= 8; i++) {


            if(i === 3){
                sysExBytePosition = 15;
            }

            if(i === 5){
                sysExBytePosition = 5;
            }

            if(i === 7){
                sysExBytePosition = 6;
            }

            this.analog_inputs_table[i].sysex_byte_position = sysExBytePosition;

            if(i > 4 && i < 6){
                sysExBytePosition = sysExBytePosition +2;
            }

            else if(i > 6){
                sysExBytePosition = sysExBytePosition -2;
            }

            else {
                sysExBytePosition--;
            }

        }

        //left knobs
        sysExBytePosition = 17;
        for(let i= 9; i <= 20; i++){

            if(i === 11) {
                sysExBytePosition = 9;
            }

            if(i === 13) {
                sysExBytePosition = 19;
            }

            if(i === 15) {
                sysExBytePosition = 11;
            }

            if(i === 17) {
                sysExBytePosition = 21;
            }

            if(i === 19) {
                sysExBytePosition = 13;
            }

            this.analog_inputs_table[i].sysex_byte_position =  sysExBytePosition;

            sysExBytePosition--;
        }

        //right knobs
        this.analog_inputs_table[21].sysex_byte_position =  3;
        this.analog_inputs_table[22].sysex_byte_position =  1;
        this.analog_inputs_table[23].sysex_byte_position =  0;
        this.analog_inputs_table[24].sysex_byte_position =  2;

        //crossfader: 24 eight faders, from left to right: 23, 22, 15, 14, 5, 7, 6, 4 upper left knobs: 17, 16, 9, 8 19, 18, 11, 10 21, 20, 13, 12 right knobs: 3, 1, 0, 2
    }

    assignMidiValuesToDigitalInputTable(midiValues){
        console.log({
            name:'assignMidiValuesToDigitalInputTable',
            value: midiValues
        });

        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++){
            this.digital_inputs_table[i].MIDI_value = midiValues[this.digital_inputs_table[i].sysex_byte_position * 2];
            this.digital_inputs_table[i].is_CC = midiValues[(this.digital_inputs_table[i].sysex_byte_position * 2) + 1 ]
        };

        console.log('-----------------------------------');
    }

    assignMidiValuesToAnalogInputTable(midiValues){
        console.log({
            name:'assignMidiValuesToanalogInputTable',
            value: midiValues
        });

        for(let i = 0; i <= this.analog_inputs_table.length - 1; i++){
            this.analog_inputs_table[i].MIDI_value = midiValues[this.analog_inputs_table[i].sysex_byte_position * 2];
        };

        console.log('-----------------------------------');
    }

    getLEDsOutputTable(){
        return this.generateGridLEDOutputTable().concat(this.generateCrossfaderLEDOutputTable(), this.generateFaderLEDOutputTable(), this.generateFunctionLEDOutputTable(), this.generateBPMLEDOutputTable(), this.generateUnusedEDOutputTable());
    }

    getLEDsSysExMessage(){
        let sysExData= new Array(42).fill(0);

        let ledVal;
        let output;


        //todo test speed
        for(let i = 0; i <= this.digital_outputs_table.length -1 ; i++){


            output = this.digital_outputs_table[i];
            ledVal = this.getDigitalOutputGroupBinaryValue(output);


            sysExData[Math.floor(output.sysex_byte_position / 2)] += ledVal;

        }

        let sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x04], sysExData, [0xF7]);

        return sysExMessage;
    }

    getDefaultMidiButtonSysex(){
        let sysExData = new Array(176).fill(0);

        let btn;

        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++){
            btn = this.digital_inputs_table[i];
            sysExData[btn.sysex_byte_position * 2] = i;
            sysExData[btn.sysex_byte_position * 2 + 1] = 0;

        }

        //todo this needs to be constructed using ohm rgb properties for man id and product id
        let sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x0B], sysExData, [0xF7]);

        return sysExMessage;
    }

    getButtonMIDIValuesSysExMessage() {
        let sysExData = new Array(176).fill(0);

        let btn;

        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++){
            btn = this.digital_inputs_table[i];
            sysExData[btn.sysex_byte_position * 2] = btn.MIDI_value;
            sysExData[btn.sysex_byte_position * 2 + 1] = btn.is_CC;

        }

        let sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x0B], sysExData, [0xF7]);

        return sysExMessage;
    }

    getDefaultMidiKnobSysex(){
        let sysExData = new Array(50).fill(0);

        let knob;

        for(let i = 0; i <= this.analog_inputs_table.length - 1; i++){
            knob = this.analog_inputs_table[i];
            sysExData[knob.sysex_byte_position * 2] = i;
            sysExData[knob.sysex_byte_position * 2 + 1] = 0;

        }
        //F0 00 01 61 07 0A (25)*[LL HH] F7

        //todo this needs to be constructed using ohm rgb properties for man id and product id
        let sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x0A], sysExData, [0xF7]);

        return sysExMessage;
    }

    getKnobMIDIValuesSysExMessage() {
        let sysExData = new Array(50).fill(0);

        let knob;

        for(let i = 0; i <= this.analog_inputs_table.length - 1; i++){
            knob = this.analog_inputs_table[i];
            sysExData[knob.sysex_byte_position * 2] = knob.MIDI_value;
            sysExData[knob.sysex_byte_position * 2 + 1] = 0;
        }

        let sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x0A], sysExData, [0xF7]);

        return sysExMessage;
    }

    getDigitalOutputGroupBinaryValue(digitalOutputGroup){
        let val1;
        let val2;
        let val3;
        if(digitalOutputGroup.sysex_byte_position % 2 === 0){

            val1 = digitalOutputGroup.r.value === 1 ? 0b001 : 0;
            val2 = digitalOutputGroup.g.value === 1 ? 0b010 : 0;
            val3 = digitalOutputGroup.b.value === 1 ? 0b100 : 0;

        } else {

            val1 = digitalOutputGroup.r.value === 1 ? 0b001000 : 0;
            val2 = digitalOutputGroup.g.value === 1 ? 0b010000 : 0;
            val3 = digitalOutputGroup.b.value === 1 ? 0b100000 : 0;
        }

        return val1 + val2 + val3;

    }

    getDigitalInputsByGroup(groupName) {
        let result = this.digital_inputs_table.filter(obj => {
            return obj.group === groupName
        })

        return result;
    }

    findDigitalInputsByMIDIVal(midiVal) {
        let result = this.digital_inputs_table.filter(obj => {
            return obj.MIDI_value === midiVal
        })

        return result;
    }


    getDigitalOutputsByGroup(groupName) {
        let result = this.digital_outputs_table.filter(obj => {
            return obj.group === groupName
        })

        return result;
    }

    findDigitalOutputsByDigitalInputId(id) {
        let result = this.digital_outputs_table.filter(obj => {
            return obj.digital_input_id === id
        })

        return result;
    }


    getAnalogInputsByGroup(groupName) {
        let result = this.analog_inputs_table.filter(obj => {
            return obj.group === groupName
        })

        return result;
    }

    findAnalogInputByMIDIValue(MIDIValue){

        let result = this.analog_inputs_table.filter(obj => {
            return obj.MIDI_value === MIDIValue
        })

        return result;
    }

    getDigitalInputGroupMidiValues(groupName){

        let midiValues = [];
        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++) {
            if(this.digital_inputs_table[i].group === groupName) {
                midiValues.push(this.digital_inputs_table[i].MIDI_value);
            };
        };

        return midiValues;
    }

    getAnalogInputGroupMidiValues(groupName){

        let midiValues = [];
        for(let i = 0; i <= this.analog_inputs_table.length - 1; i++) {
            if(this.analog_inputs_table[i].group === groupName) {
                midiValues.push(this.analog_inputs_table[i].MIDI_value);
            };
        };

        return midiValues;
    }


    getDigitalInputsMidiValues(){

        let midiValues = [];
        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++) {
            midiValues.push(this.digital_inputs_table[i].MIDI_value);
        };

        return midiValues;
    }

    getDigitalNoteInputsMidiValues() {
        let midiValues = [];
        console.log({
            'getDigitalCCInputsMidiValues' : this.digital_inputs_table
        });
        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++) {
            if(!this.digital_inputs_table[i].is_CC) {
                midiValues.push(this.digital_inputs_table[i].MIDI_value);
            };
        };

        return midiValues;
    }

    getDigitalCCInputsMidiValues() {
        let midiValues = [];
        console.log({
            'getDigitalCCInputsMidiValues' : this.digital_inputs_table
        });
        for(let i = 0; i <= this.digital_inputs_table.length - 1; i++) {
            if(this.digital_inputs_table[i].is_CC) {
                midiValues.push(this.digital_inputs_table[i].MIDI_value);
            };
        };

        return midiValues;
    }

    getAnalogInputsMidiValues(){

        let midiValues = [];
        for(let i = 0; i <= this.analog_inputs_table.length - 1; i++) {
            midiValues.push(this.analog_inputs_table[i].MIDI_value);
        };

        return midiValues;
    }

    //TODO: return single input
    getDigitalInputById(id){
        let result = this.digital_inputs_table.filter(obj => {
            return obj.id === id
        })

        return result[0];
    }

    getDigitalOutputById(id){
        let result = this.digital_outputs_table.filter(obj => {
            return obj.id === id
        })

        return result[0];
    }

}

export { OhmRGB };
/*

0A : Map Analog Inputs

F0 00 01 61 07 0A (25)*[LL HH] F7

This command updates the MIDI map for all (25) Analog inputs. If HH is 00, then LL specifies the 7-bit Control number, but only valid control numbers 00 to 78 are accepted. If HH is 01, then LL selects between 14-bit Control numbers and Pitch Bend. In the latter case, LL between 60 and 6F specifies a Pitch Bend message on Channel (1) through (16), respectively. Otherwise, LL selects a 14-bit Control number, of which the only valid control numbers are 00 to 1F. All other values for LL, 20 through 5F and 70 through 7F are reserved for future use. Values of HH above 1 are similarly reserved.

There are (25) sets of LL HH value pairs in this message, each corresponding to the index of an Analog input. These indices do not conveniently match up with the physical layout. The index codes are arranged as follows (all indices are decimal in this table, and start with 0):

crossfader: 24 eight faders, from left to right: 23, 22, 15, 14, 5, 7, 6, 4 upper left knobs: 17, 16, 9, 8 19, 18, 11, 10 21, 20, 13, 12 right knobs: 3, 1, 0, 2

The OhmRGB responds with ACK when finished processing this command.

*/