import {MIDIRouter} from '../Static/MIDIRouter.js';
import {Controller} from './Controller.js';
import { SysExMessage } from '../models/SysExMessage.js';
import { DigitalInput } from '../models/DigitalInput.js';

import { DigitalOutput } from '../models/DigitalOutput.js';

class AlphaSynth extends Controller {
    constructor(hardwareInterface, midiInterface){
        super(hardwareInterface, midiInterface);
        this.state = this.initiate();
        this.activeLFO = undefined;
        this.activeEnv = undefined;
        this.activeMode = undefined;

    }

    initiate(){
        //TODO: Uneeded variables.
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

            //add cusom midi vals after default midi vals have been added
            //set Crossdfader btns midivals
            //64 + 65
            ohmRGB.digital_inputs_table[64].MIDI_value = 104;
            ohmRGB.digital_inputs_table[64].is_CC = 1;
            ohmRGB.digital_inputs_table[65].MIDI_value = 105;
            ohmRGB.digital_inputs_table[65].is_CC = 1;

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

            //add routes TODO this needs to be passed from somewhere more convenient
            const routes  = {
                notes: {
                    'gridButtonIn': {
                        notes: ohmRGB.getDigitalInputGroupMidiValues('grid'),
                        callBack: alphaSynth.handleGridButtonIn
                    },
                },

                cc: {
                    'lfoControl': {
                        ids: [85, 86, 87, 88],
                        callBack: alphaSynth.hanldeLFOSwitch
                    },

                    'envControl': {
                        ids: [89, 90, 102, 103],
                        callBack: alphaSynth.hanldeEnvSwitch
                    },

                    'modeControl': {
                        ids: [104, 105],
                        callBack: alphaSynth.hanldeModeSwitch
                    },
                },
            }

            midiRouter.createRoutes(routes);


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
            }
            midiRouter.addEventListener('sysExMessageReceived', handleKnobMidiMapRequest);

        }

        midiRouter.addEventListener('sysExMessageReceived', handleButtonMidiMapRequest);



    }

    handleGridButtonIn(event) {

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
            digitalOutput.r.value = 0;
            digitalOutput.g.value = 0;
            digitalOutput.b.value = 0;

        }
        const sysExMessage = ohmRGB.getLEDsSysExMessage();

        midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    hanldeLFOSwitch(event){
        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const alphaSynth = midiRouter.controller;
        const midiInterface = midiRouter.midi_interface;
        const ccIdReceived = event.detail.id;


        const btnId = DigitalInput.findDigitalInputByCCValue(ohmRGB.digital_inputs_table,  ccIdReceived);
        const btn = ohmRGB.digital_inputs_table[btnId];
        const ccValue =  event.detail.value

        const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btnId);
        const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];

        if(ccValue > 0){

            if(alphaSynth.activeLFO !== undefined){
                const previousDigitalOutputId = alphaSynth.activeLFO + 66;
                const digitalOutputIdToSwitchOff = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, previousDigitalOutputId);
                const digitalOutputToSwitchOff = ohmRGB.digital_outputs_table[digitalOutputIdToSwitchOff];

                digitalOutputToSwitchOff.r.value = 0;
                digitalOutputToSwitchOff.g.value = 0;

            }

            digitalOutput.r.value = 1;
            digitalOutput.g.value = 1;

            alphaSynth.activeLFO = btnId - 66;

            const newLFO = alphaSynth.activeLFO;

            const newMidiVals = function(newLFO) {
                switch (newLFO) {
                    case 0:
                        return [1, 2, 3, 4];
                        break;
                    case 1:
                        return  [25, 26, 27, 28];
                        break;
                    case 2:
                        return [29, 30, 31, 32];
                        break;
                    case 3:
                        return [33, 34, 35, 36];
                        break;
                }
            };

            alphaSynth.switchLFOKnobValues(newMidiVals(newLFO));

            const sysExMessage = ohmRGB.getLEDsSysExMessage();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);

        }
    }

    hanldeEnvSwitch(event){
        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const alphaSynth = midiRouter.controller;
        const midiInterface = midiRouter.midi_interface;
        const ccIdReceived = event.detail.id;


        const btnId = DigitalInput.findDigitalInputByCCValue(ohmRGB.digital_inputs_table,  ccIdReceived);
        const btn = ohmRGB.digital_inputs_table[btnId];
        const ccValue =  event.detail.value

        const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btnId);
        const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];


        if(ccValue > 0){

            if(alphaSynth.activeEnv !== undefined){
                const previousDigitalOutputId = alphaSynth.activeEnv + 70;
                const digitalOutputIdToSwitchOff = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, previousDigitalOutputId);
                const digitalOutputToSwitchOff = ohmRGB.digital_outputs_table[digitalOutputIdToSwitchOff];


                digitalOutputToSwitchOff.r.value = 0;
                digitalOutputToSwitchOff.g.value = 0;
            }

            digitalOutput.r.value = 1;
            digitalOutput.g.value = 1;

            alphaSynth.activeEnv = btnId - 70;

            const newEnv = alphaSynth.activeEnv;

            const newMidiVals = function(newEnv) {
                switch (newEnv) {
                    case 0:
                        return [5, 6, 7, 8];
                        break;
                    case 1:
                        return  [37, 38, 39, 40];
                        break;
                    case 2:
                        return [41, 42, 43, 44];
                        break;
                    case 3:
                        return [45, 46, 47, 48];
                        break;
                }
            };

            alphaSynth.switchEnvKnobValues(newMidiVals(newEnv));
            const sysExMessage = ohmRGB.getLEDsSysExMessage();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);

        }

    }

    hanldeModeSwitch(event){
        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const alphaSynth = midiRouter.controller;
        const midiInterface = midiRouter.midi_interface;
        const ccIdReceived = event.detail.id;


        const btnId = DigitalInput.findDigitalInputByCCValue(ohmRGB.digital_inputs_table,  ccIdReceived);
        const btn = ohmRGB.digital_inputs_table[btnId];
        const ccValue =  event.detail.value

        const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btnId);
        const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];


        if(ccValue > 0){

            if(alphaSynth.activeMode !== undefined){
                const previousDigitalOutputId = alphaSynth.activeMode + 64;
                const digitalOutputIdToSwitchOff = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, previousDigitalOutputId);
                const digitalOutputToSwitchOff = ohmRGB.digital_outputs_table[digitalOutputIdToSwitchOff];


                digitalOutputToSwitchOff.r.value = 0;
                digitalOutputToSwitchOff.b.value = 0;
            }

            digitalOutput.r.value = 1;
            digitalOutput.b.value = 1;
            alphaSynth.activeMode = btnId - 64;

            const sysExMessage = ohmRGB.getLEDsSysExMessage();

            midiInterface.outputDevice.send(sysExMessage.sysExMessage);


        }
    }

    //todo this should be in ohm rgb model
    switchLFOKnobValues(midiValues){

        for(let i = 1; i <= midiValues.length; i++){
            this.hardwareInterface.analog_inputs_table[i].MIDI_value = midiValues[i -1];
        }

        const sysExMessage = this.hardwareInterface.getKnobMIDIValuesSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    switchEnvKnobValues(midiValues){

        for(let i = 5; i <= 8; i++){
            this.hardwareInterface.analog_inputs_table[i].MIDI_value = midiValues[i -5];
        }

        const sysExMessage = this.hardwareInterface.getKnobMIDIValuesSysExMessage();

        this.midiInterface.outputDevice.send(sysExMessage.sysExMessage);
    }

    /*

        LFO SWITCH MIDI VALS
    */


    /*
        YOU ARE HERE
        TODO:
            *get btn by cc value
            *route for lfo btns
            *route for enveloper btns
            * route for mode btns

    */
}

export {AlphaSynth};