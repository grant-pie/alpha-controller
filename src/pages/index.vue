<template>

    <v-app data-app>

        <v-container
        fluid
        >


            <v-row>

                <v-row
                class="mt-4 justify-end pr-2"
                >

                    <v-col
                    cols="2"
                    >
                        <v-select
                        dense
                        v-model="selectedMidiInputDevice"
                        :items="midiInputDevicesTitles"
                        item-text="name"
                        label="MIDI Input Devices"
                        return-object
                        ></v-select>

                    </v-col>

                    <v-col
                    cols="2"
                    >

                        <v-select
                        dense
                        v-model="selectedMidiOutputDevice"
                        :items="midiOutputDevicesTitles"
                        item-text="name"
                        label="MIDI Output (Controller)"
                        return-object
                        ></v-select>

                    </v-col>

                    <v-col
                    cols="2"
                    >

                        <v-select
                        dense
                        v-model="selectedSequencerOutputDevice"
                        :items="midiOutputDevicesTitles"
                        item-text="name"
                        label="MIDI Output (Sequencer)"
                        return-object
                        hint="Use virtual loopback or synth"
                        persistent-hint
                        ></v-select>

                    </v-col>

                </v-row>


            </v-row>

            <v-row
            class="justify-center"
            >

                <multi-controller
                v-if="hardwareInterface != null"
                :hardware_interface="hardwareInterface"
                :controller ="controller"
                ></multi-controller>

            </v-row>

        </v-container>


    </v-app>

</template>


<script>
import {OhmRGB} from '../models/OhmRGB.js'

//import {DefaultOhmRGB} from '../controllers/DefaultOhmRGB.js'
import {MultiController} from '../controllers/MultiController.js'
//import {AlphaSynth} from '../controllers/AlphaSynth.js'

import {MIDIInterface} from '../Static/MIDIInterface.js'

//import LividOhmRGB from '../components/Controllers/LividOhmRGB.vue'
import MultiControllerVue from '../components/Controllers/MultiController.vue'

export default {

    data() {
        return {
            test: {},
            midiInputDevices: [],
            midiInputDevicesTitles: [],
            midiOutputDevices: [],
            midiOutputDevicesTitles: [],
            midiInterface: '',
            controller: null,
            hardwareInterface: null,
            selectedMidiInputDevice: null,
            selectedMidiOutputDevice: null,
            selectedSequencerOutputDevice: null,
            debugMode : true,

        }
    },

    watch: {
        selectedMidiInputDevice(inputDevice) {
            console.log({
                'selectedMidiInputDevice' : inputDevice
            });
            
            //find device by name
            this.midiInterface.inputDevice = this.midiInputDevices.find( device => device.name === inputDevice );
            
            console.log({
                'midiInterface.inputDevice' : this.midiInterface.inputDevice
            });

        },
        selectedMidiOutputDevice(outputDevice) {
            console.log({
                'selectedMidiOutputDevice' : outputDevice
            });

            this.midiInterface.outputDevice = this.midiOutputDevices.find( device => device.name === outputDevice );

            console.log({
                'midiInterface.outputDevice' : this.midiInterface.outputDevice
            }); 
            
            // Only init if both main output and sequencer output are selected
            if (this.selectedSequencerOutputDevice) {
                this.init();
            }
        },
        
        selectedSequencerOutputDevice(outputDevice) {
            console.log({
                'selectedSequencerOutputDevice' : outputDevice
            });

            this.midiInterface.sequencerOutputDevice = this.midiOutputDevices.find( device => device.name === outputDevice );

            console.log({
                'midiInterface.sequencerOutputDevice' : this.midiInterface.sequencerOutputDevice
            }); 
            
            // Only init if both main output and sequencer output are selected
            if (this.selectedMidiOutputDevice) {
                this.init();
            }
        },
    },

    methods: {
        init: function() {


            this.hardwareInterface = new OhmRGB();
            //TODO: controller presets
            this.controller = new MultiController(this.hardwareInterface, this.midiInterface);

            console.log({
                'init-complete' : {
                    'hardwareInterface' : this.hardwareInterface,
                    'controller' : this.controller,
                    'midiInterface': {
                        'input': this.midiInterface.inputDevice?.name,
                        'output': this.midiInterface.outputDevice?.name,
                        'sequencerOutput': this.midiInterface.sequencerOutputDevice?.name
                    }
                }
            });
        }

    },
    created: function(){
        //check if browser supports web midi
        //todo single check bit or something
        this.midiInterface = new MIDIInterface();
        if (navigator.requestMIDIAccess) {

            console.log('This browser supports WebMIDI!');

            //get midi devices
            let midiAccess = navigator.requestMIDIAccess({'sysex' : 1}).then( this.midiInterface.onMIDISuccess,  this.midiInterface.onMIDIFailure);

            const getMidiAccess = () => {
                midiAccess.then((midiAccess) => {
                    this.midiInputDevices = midiAccess.availableMIDIInputDevices;

                    this.midiInputDevices.forEach( (device) => {
                        this.midiInputDevicesTitles.push(device.name);
                    });

                    this.midiOutputDevices = midiAccess.availableMIDIOutputDevices;

                    this.midiOutputDevices.forEach( (device) => {
                        this.midiOutputDevicesTitles.push(device.name);
                    });

                    console.log({
                        'inputDevices:' : this.midiInputDevices,
                        'inputDevicesTitles:' : this.midiInputDevicesTitles,
                        'outputDevices:' : this.midiOutputDevices,
                        'outputDevicesTitles:' : this.midiOutputDevicesTitles,
                    });


                    //**auto select devices for testing

                    //console.log('Auto select input device = ' + this.midiInputDevices[0].name);

                    //this.selectedMidiInputDevice = this.midiInputDevices[0];

                    //console.log('Auto select output device = ' + this.midiOutputDevices[0].name);

                    // this.selectedMidiOutputDevice = this.midiOutputDevices[0];



                });
            };

            getMidiAccess();


        } else {
            console.log('WebMIDI is not supported in this browser.');
        }
    },
    components: {
        'multi-controller' : MultiControllerVue
    }
}

</script>

<style>
    /* TODO: Global styles move to style sheet */


</style>