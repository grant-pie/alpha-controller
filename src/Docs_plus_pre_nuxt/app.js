const Vue = require('vue');


const app = new Vue({
    el: '#app',

});

/*

        <script src="MIDIInterface.js" async defer></script>
        <script src="MIDIRouter.js" async defer></script>
        <script src="Models/SysExMessage.js" async defer></script>
        <script src="Models/HardwareInterface.js" async defer></script>
        <script src="Models/OhmRGB.js" async defer></script>
        <script src="Models/DigitalInput.js" async defer></script>
        <script src="Models/DigitalOutput.js" async defer></script>
        <script src="Models/AnalogInput.js" async defer></script>
        <script src="Controllers/Controller.js" async defer></script>
        <script src="Controllers/AlphaSynth.js" async defer></script>


*/
/*
var app = new Vue({
    el: '#app',
    data: {
        midiInputDevices: [],
        midiOutputDevices: [],
        midiInterface: '',
        selectedMidiInputDevice: {name: 'Select Input Device'},
        selectedMidiOutputDevice: {name: 'Select Output Device'},
        debugMode : true
    },
    methods: {
        selectMidiInputDevice: function(midiInputDevice) {
            this.midiInterface.inputDevice = midiInputDevice;
            this.selectedMidiInputDevice = midiInputDevice;
        },
        selectMidiOutputDevice: function(midiOutputDevice) {
            this.midiInterface.outputDevice = midiOutputDevice;
            this.selectedMidiOutputDevice = midiOutputDevice;
            this.init();
        },
        init: function() {
            const ohmRGB = new OhmRGB();
            const midiInterface = this.midiInterface;
            const alphaSynth = new AlphaSynth(ohmRGB, midiInterface);
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
                    this.midiOutputDevices = midiAccess.availableMIDIOutputDevices;

                    //auto select devices for testing
                    //console.log('Auto select input device = ' + this.midiInputDevices[0].name);

                   // this.selectMidiInputDevice( this.midiInputDevices[0]);

                    //console.log('Auto select output device = ' + this.midiOutputDevices[0].name);

                    //this.selectMidiOutputDevice( this.midiOutputDevices[0]);
                });
            };

            getMidiAccess();


        } else {
            console.log('WebMIDI is not supported in this browser.');
        }
    },
    components: {
        'livid-ohm-rgb' : LividOhmRGB
    }
})*/


//test sysex

 /*

            const testData = [];

            for(let i = 0; i <= 41; i++) {
                i === 20 ? testData.push(7) : testData.push(0x0);
            }
            console.log({
                name: 'testData',
                val: testData
            });

            const test = [240, 0, 1, 97, 7, 4, 17, 52, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0 ,0, 0 ,0 ,0, 0 ,0 ,0, 0 ,0 ,247];
            console.log({
                name: 'test',
                val: test
            });


            const data = ohmRGB.getLEDsSysExMessage();

            const testSysExMessage = new SysExMessage([0xF0, 0x00], [0x01, 0x61, 0x07], [0x04], data, [0xF7]);

              midiInterface.outputDevice.send(testSysExMessage.sysExMessage);
             */

            //
            //0xF0, 0x0, 0x1, 0x61, 0x7, 0x4, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0xF7
            //F0 00 01 61 07 0A (25)*[LL HH] F7
            //console.log('MIDI Router is now ' + midiRouter.state);

            //console.log('Sysex Array');
            //console.log(hardwareInterface.LEDsSysExMessage);
            //console.log('*********************');