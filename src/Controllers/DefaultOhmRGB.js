import {MIDIRouter} from '../Static/MIDIRouter.js';
import {Controller} from './Controller.js';
import { SysExMessage } from '../models/SysExMessage.js';
import { DigitalInput } from '../models/DigitalInput.js';

import { DigitalOutput } from '../models/DigitalOutput.js';

class DefaultOhmRGB extends Controller {
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

            /*
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
            */

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

                //add routes TODO this needs to be passed from somewhere more convenient
                const routes  = {
                    notes: {
                        'noteIn': {
                            notes: ohmRGB.getDigitalNoteInputsMidiValues(),
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
        console.log('now handling note in');
        const midiRouter = event.detail.midiRouter;
        const ohmRGB = midiRouter.hardware_interface;
        const midiInterface = midiRouter.midi_interface;
        const velocityReceived = event.detail.velocity;
        const midiValReceived = event.detail.note;
        const btn = DigitalInput.findDigitalInputByMIDIValue(ohmRGB.digital_inputs_table,  midiValReceived);
        console.log({
            'btn pre3ssed' : btn
        });
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


    handleGridButtonIn(event) {
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
            digitalOutput.r.value = 0;
            digitalOutput.g.value = 0;
            digitalOutput.b.value = 0;

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

       // const btn = DigitalInput.findDigitalInputByMIDIValue(ohmRGB.digital_inputs_table,  midiValReceived);

       // const digitalOutputId = DigitalOutput.findDigitalOutputByDigitalInputId(ohmRGB.digital_outputs_table, btn.id);
       // const digitalOutput = ohmRGB.digital_outputs_table[digitalOutputId];


        //const sysExMessage = ohmRGB.getLEDsSysExMessage();

        //midiInterface.outputDevice.send(sysExMessage.sysExMessage);
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







    /*
        YOU ARE HERE
        TODO:
            *get btn by cc value
            *route for lfo btns
            *route for enveloper btns
            * route for mode btns

    */
}

export {DefaultOhmRGB};