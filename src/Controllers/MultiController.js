/*

TODO:

rename alphasynth to multicontroller where applicable

*/

import {MIDIRouter} from '../Static/MIDIRouter.js';
import {Controller} from './Controller.js';
import { SysExMessage } from '../models/SysExMessage.js';
import { DigitalInput } from '../models/DigitalInput.js';

import { DigitalOutput } from '../models/DigitalOutput.js';

class MultiController extends Controller {
    constructor(hardwareInterface, midiInterface){
        super(hardwareInterface, midiInterface);
        this.state = this.initiate();
    }

    initiate(){
        //TODO: Uneeded variables.

        //TODO: this function should accept routes and custom midi vals arg and the rest should not be changed when creating a new preset
        const midiInterface = this.midiInterface;

        const ohmRGB = this.hardwareInterface;

        ohmRGB.digital_inputs_table = ohmRGB.generateButtonsInputTable(); //rename to build

        ohmRGB.digital_outputs_table = ohmRGB.getLEDsOutputTable(); //rename to build

        ohmRGB.analog_inputs_table = ohmRGB.buildAnalogInputsTable();

        ohmRGB.addSiblingOutputsRefsToOutputTable(); //todo these two functions might be beter suited in ohm rgb generate btns intput table

        ohmRGB.assignSysExBytePosToDigitalInputsTable();

        ohmRGB.assignSysExBytePosToAnalogInputsTable();

        const midiRouter = new MIDIRouter(midiInterface, ohmRGB ,  this,this.routes);
        const alphaSynth = this;
        //set btn midi vals to default
        let sysExMessage = ohmRGB.getDefaultMidiButtonSysex();
        midiInterface.outputDevice.send(sysExMessage.sysExMessage);

        //request btn midi vals;
        sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x07], [0x0B], [0xF7]);
        midiInterface.outputDevice.send(sysExMessage.sysExMessage);

        //add alpha synth midi values to input tables
        const handleButtonMidiMapRequest = function(event){
            console.log('handleButtonMidiMapRequest received');

            const midiRouter = event.detail.midiRouter;

            midiRouter.removeEventListener('sysExMessageReceived', handleButtonMidiMapRequest);

            const hardwareInterface = midiRouter.hardware_interface;
            const midiInterface = midiRouter.midi_interface;

            //assign default midi vals to OHM RGB after receiving midi val request
            let midiValues = Array.from(event.detail.data);
            midiValues.pop();
            midiValues.splice(0, 6);
            hardwareInterface.assignMidiValuesToDigitalInputTable(midiValues);



            //add custom midi vals
            //TODO: this needs to be passed from somewhere more convenient
            //set Crossdfader btns midivals
            //64 + 65
            ohmRGB.digital_inputs_table[64].MIDI_value = 104;
            ohmRGB.digital_inputs_table[64].is_CC = 1;
            ohmRGB.digital_inputs_table[65].MIDI_value = 105;
            ohmRGB.digital_inputs_table[65].is_CC = 1;

            //flip grid btns so that high notes is at top

            let rowBottom = 7;
            let column = 0;
            let val1;

            for(let i = 0; i <= 31; i ++){
                val1 = hardwareInterface.digital_inputs_table[i].MIDI_value;
                hardwareInterface.digital_inputs_table[i].MIDI_value = hardwareInterface.digital_inputs_table[rowBottom * 8 + column].MIDI_value;
                hardwareInterface.digital_inputs_table[rowBottom * 8 + column].MIDI_value = val1;

                column++;
                if(column > 7){
                    column = 0;

                    rowBottom--;
                }
            }

            //set fader btns midi vals
            //67 -> 74
            let set1Start = 85;
            let set2Start = 102;
            for(let i = 66; i < 74; i++) {
                if(i < 72) {
                    //ohmRGB.digital_inputs_table[i].MIDI_value = set1Start++;
                    ohmRGB.digital_inputs_table[i].MIDI_value = set1Start++;

                } else {
                    ohmRGB.digital_inputs_table[i].MIDI_value =  set2Start++;

                }
                ohmRGB.digital_inputs_table[i].is_CC = 1;

            }

            let sysExMessage = ohmRGB.getButtonMIDIValuesSysExMessage();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);
            //add custom midivals done

            //set knob vals to default
            sysExMessage = ohmRGB.getDefaultMidiKnobSysex();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);
            //F0 00 01 61 07 07 0A F7
            sysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x07], [0x0A], [0xF7]);

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);

            const handleKnobMidiMapRequest = function(event) {


                const midiRouter = event.detail.midiRouter;

                midiRouter.removeEventListener('sysExMessageReceived', handleKnobMidiMapRequest);


                const hardwareInterface = midiRouter.hardware_interface;
                const midiInterface = midiRouter.midi_interface;

                //assign default midi vals to OHM RGB after receiving midi val request
                let midiValues = Array.from(event.detail.data);
                midiValues.pop();
                midiValues.splice(0, 6);
                hardwareInterface.assignMidiValuesToAnalogInputTable(midiValues);
                console.log({
                    name: 'knob midi val request received',
                    value: hardwareInterface.analog_inputs_table
                });

                //add routes TODO: this needs to be passed from somewhere more convenient
                const routes  = {
                    notes: {
                        'noteBtnIn': {
                            notes: [...Array(177).keys()],
                            callBack: alphaSynth.handleNoteIn
                        },
                    },

                    cc: {
                        'analogIn': {
                            ids: ohmRGB.getAnalogInputsMidiValues(),
                            callBack: alphaSynth.handleAnalogIn
                        },

                        'digitalIn': {
                            ids: ohmRGB.getDigitalCCInputsMidiValues(),
                            callBack: alphaSynth.handleDigitalCCIn
                        },
                    },
                }

                console.log({
                    'routes' : routes
                });
                midiRouter.createRoutes(routes);
            }
            midiRouter.addEventListener('sysExMessageReceived', handleKnobMidiMapRequest);

        }

        midiRouter.addEventListener('sysExMessageReceived', handleButtonMidiMapRequest);

        return 'ready';

    }

    handleNoteIn(event) {
        console.log('now handling grid btn in');
        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const midiInterface = midiRouter.midi_interface;
        const velocityReceived = event.detail.velocity;
        const midiValReceived = event.detail.note;
        const btn = DigitalInput.findDigitalInputByMIDIValue(ohmRGB.digital_inputs_table,  midiValReceived);

        const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btn.id);
        const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];

        btn.toggled = 1;
        if(velocityReceived > 0) {
            digitalOutput.r.value = 1;
            digitalOutput.g.value = 1;
            digitalOutput.b.value = 1;

        } else {
            digitalOutput.r.value = digitalOutput.r.defaultValue;
            digitalOutput.g.value = digitalOutput.g.defaultValue;
            digitalOutput.b.value = digitalOutput.b.defaultValue;

        }
        const sysExMessage = ohmRGB.getLEDsSysExMessage();

        midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }


    handleAnalogIn(event) {

        console.log('now handling knob in');

        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const midiInterface = midiRouter.midi_interface;
        const id = event.detail.id;
        const value = event.detail.value;
        const input = ohmRGB.findAnalogInputByMIDIValue(id)[0];

        input.value = value;

        console.log({
            'now handling knob in' : {
                'event' : event,
                'id' : id,
                'value' : value,
                'knob' : input
            }
        });

    }

    handleDigitalCCIn() {

        console.log('now handling digital cc in');

        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const alphaSynth = midiRouter.controller;
        const midiInterface = midiRouter.midi_interface;
        const ccIdReceived = event.detail.id;
        const ccValue =  event.detail.value

        const btnId = DigitalInput.findDigitalInputByCCValue(ohmRGB.digital_inputs_table,  ccIdReceived);
        const btn = ohmRGB.digital_inputs_table[btnId];

        const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btnId);
        const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];


        if(ccValue > 0){
            btn.toggled = !btn.toggled
            if(btn.toggled){

                digitalOutput.r.value = 1;
                digitalOutput.g.value = 1;

            } else {

                digitalOutput.r.value = 0;
                digitalOutput.g.value = 0;

            }

            const sysExMessage = ohmRGB.getLEDsSysExMessage();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);
        }

    }

    //TODO: Move to approptiate file

    getNotes(){
        const gridBtns = this.hardwareInterface.getDigitalInputsByGroup('grid');

        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let octave;
        let note;
        for(let i = 0; i <= gridBtns.length - 1; i++){


            octave = Math. trunc(gridBtns[i].MIDI_value / 12) - 1;
            note = notes[gridBtns[i].MIDI_value - 12 * (octave + 1)];
            gridBtns[i].note =  note;
            gridBtns[i].octave =  octave;
            //note + ' ' + octave;


        }
    }

    showMiddleC(){
        const middleCInput = this.hardwareInterface.findDigitalInputsByMIDIVal(60)[0];
        const middleCOutput = this.hardwareInterface.findDigitalOutputsByDigitalInputId( middleCInput.id)[0];

        middleCOutput.r.defaultValue = 1;
        middleCOutput.r.value = 1;

        const sysExMessage = this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    hideMiddleC(){
        const middleCInput = this.hardwareInterface.findDigitalInputsByMIDIVal(60)[0];
        const middleCOutput = this.hardwareInterface.findDigitalOutputsByDigitalInputId( middleCInput.id)[0];



        middleCOutput.r.defaultValue = 0;
        middleCOutput.r.value = 0;

        const sysExMessage = this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    transpose(direction){
        const gridBtns = this.hardwareInterface.getDigitalInputsByGroup('grid');
        for(let i = 0; i <= gridBtns.length - 1; i++){

            if(direction){
                gridBtns[i].MIDI_value =  gridBtns[i].MIDI_value + 12

            } else {
                gridBtns[i].MIDI_value =  gridBtns[i].MIDI_value - 12
            }


        }


        let sysExMessage = this.hardwareInterface.getButtonMIDIValuesSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }


    showOctaves(){
        const gridLeds = this.hardwareInterface.getDigitalOutputsByGroup('grid');

        let octave;
        let input
        for(let i = 0; i <= gridLeds.length - 1; i++){


            input = this.hardwareInterface.getDigitalInputById(gridLeds[i].id);
            octave = this.MIDIToNote(input.MIDI_value).octave;

            if((octave + 1) % 2 == 0){
                gridLeds[i].b.value = 1;
                gridLeds[i].b.defaultValue = 1;
            }

        }

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    hideOctaves(){
        const gridLeds = this.hardwareInterface.getDigitalOutputsByGroup('grid');

        let octave;
        let input
        for(let i = 0; i <= gridLeds.length - 1; i++){


            input = this.hardwareInterface.getDigitalInputById(gridLeds[i].id);
            octave = this.MIDIToNote(input.MIDI_value).octave;

            if((octave + 1) % 2 == 0){
                gridLeds[i].b.value = 0;
                gridLeds[i].b.defaultValue = 0;
            }

        }

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    //TODO: this function needs refactoring
    showBlackKeys(){
        const gridLeds = this.hardwareInterface.getDigitalOutputsByGroup('grid');

        let note;
        let input
        for(let i = 0; i <= gridLeds.length - 1; i++){

            input = this.hardwareInterface.getDigitalInputById(gridLeds[i].id);
            note = this.MIDIToNote(input.MIDI_value);


            if(note.note.substring(1) === '#'){
                gridLeds[i].g.value = 1;
                gridLeds[i].g.defaultValue = 1;
            }

        }

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);

    }

    hideBlackKeys(){
        const gridLeds = this.hardwareInterface.getDigitalOutputsByGroup('grid');

        let note;
        let input
        for(let i = 0; i <= gridLeds.length - 1; i++){

            input = this.hardwareInterface.getDigitalInputById(gridLeds[i].id);
            note = this.MIDIToNote(input.MIDI_value);


            if(note.note.substring(1) === '#'){
                gridLeds[i].g.value = 0;
                gridLeds[i].g.defaultValue = 0;
            }

        }

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);

    }

    //TODO: Put in appropriate file and rename
    MIDIToNote(MIDIValue) {
        const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        const octave = Math.trunc(MIDIValue / 12) - 1;
        const note = notes[MIDIValue - 12 * (octave + 1)];
        const noteNumber = MIDIValue - 12 * (octave + 1)

        return {
            note: note,
            note_number: noteNumber,
            octave: octave
        };

    }

    showMajorScale(root) {
        this.showScale(root, [2, 2, 1, 2, 2, 2, 1])
    }

    showMinorScale(root) {
        this.showScale(root, [2, 1, 2, 2, 1, 2, 2])
    }

    showScale(root, pattern){
        console.log(root);
        //hide previous scales
        this.hideScales();

        //get min value
        let minOctaves = this.MIDIToNote(this.hardwareInterface.digital_inputs_table[63].MIDI_value).octave;
        let maxOctaves = this.MIDIToNote(this.hardwareInterface.digital_inputs_table[0].MIDI_value).octave + 1;

        //get sorted inputs TODO: Put in seperate function
        let sortedInputs= [];

        //get inputs in octave
        for(let i = minOctaves; i <= maxOctaves; i++){

            let inputsInOctave =  this.getInputsByOctave(i);

            //remove last 4 inputs of the last octave
            if(i === maxOctaves ){
                inputsInOctave =  inputsInOctave.slice(0, 4);
            }

            //sort octave by notes
            let octaveSorted = this.sortInputsByNoteNumbers(inputsInOctave);

            //append to sorted inputs
            sortedInputs = [...sortedInputs, ...octaveSorted];

            //get note values TODO: Only for development
            for(let i = 0 ; i <= sortedInputs.length - 1; i++){
                sortedInputs[i].note = this.MIDIToNote(sortedInputs[i].MIDI_value);
                sortedInputs[i].key = i;
            }

        }

        //get root input in sorted inputs
        const rootInput = this.findDigitalInputById(sortedInputs, root.id)
        console.log({
            'rootInput' :  this.MIDIToNote(rootInput.MIDI_value).note + ' ' + this.MIDIToNote(rootInput.MIDI_value).octave,
        });

        //switch on leds
        let currentKey = rootInput.key;
        for(let i = 0; i <= pattern.length - 1 ; i++){

            currentKey = currentKey + pattern[i];

            if(sortedInputs[ currentKey ] != undefined){

                this.hardwareInterface.getDigitalOutputById( sortedInputs[ currentKey ].id ).g.value = 1;
                this.hardwareInterface.getDigitalOutputById( sortedInputs[ currentKey ].id ).g.defaultValue = 1;

            }



        }

        this.hardwareInterface.getDigitalOutputById( root.id ).g.value = 1;
        this.hardwareInterface.getDigitalOutputById( root.id ).g.defaultValue = 1;

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    hideScales(){
        const gridLeds = this.hardwareInterface.getDigitalOutputsByGroup('grid');

        let note;
        let input
        for(let i = 0; i <= gridLeds.length - 1; i++){

            gridLeds[i].g.value = 0;
            gridLeds[i].g.defaultValue = 0;

        }

        const sysExMessage =  this.hardwareInterface.getLEDsSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    getInputsByOctave(octave){
        let result = this.hardwareInterface.getDigitalInputsByGroup('grid').filter(obj => {
            return this.MIDIToNote(obj.MIDI_value).octave === octave
        })

        return result;
    }

    findDigitalInputById(inputs, id) {
        let result = this.hardwareInterface.digital_inputs_table.filter(obj => {
            return obj.id === id
        })

        return result[0];
    }

    sortInputsByNoteNumbers(inputs){

        return inputs.sort((a, b) => (this.MIDIToNote(a.MIDI_value).note_number > this.MIDIToNote(b.MIDI_value).note_number) ? 1 : -1);
    }

    sortInputsByOctaves(inputs){

        return inputs.sort((a, b) => (this.MIDIToNote(a.MIDI_value).octave > this.MIDIToNote(b.MIDI_value).octave) ? 1 : -1);
    }

}

export {MultiController};