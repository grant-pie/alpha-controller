var app = new Vue({
    el: '#app',
    data: {
        midiInputDevices: [],
        midiOutputDevices: [],
        selectedMidiInputDevice: {name: 'Select Input Device'},
        selectedMidiOutputDevice: {name: 'Select Output Device'},
        midiRouter:'',
        controller: '',
        debugMode : true
    },
    methods: {
        selectMidiInputDevice: function(midiInputDevice) {
            this.midiRouter.inputDevice = midiInputDevice;
            this.selectedMidiInputDevice = midiInputDevice;
        },
        selectMidiOutputDevice: function(midiOutputDevice) {
            this.midiRouter.outputDevice = midiOutputDevice;
            this.selectedMidiOutputDevice = midiOutputDevice;
            this.init();
        },
        init: function() {
            const midiRouter = this.midiRouter;
            midiRouter.listen(function(message) {
                //create new sysex

            });
        }

    },
    created: function(){
        this.midiRouter = new MIDIRouter();

        //check if browser supports web midi
        //todo single check bit or something
        if (navigator.requestMIDIAccess) {

            console.log('This browser supports WebMIDI!');

            //get midi devices
            let midiAccess = navigator.requestMIDIAccess({'sysex' : 1}).then(this.midiRouter.onMIDISuccess, this.midiRouter.onMIDIFailure);

            const getMidiAccess = () => {
                midiAccess.then((midiAccess) => {
                    this.midiInputDevices = midiAccess.availableMIDIInputDevices;
                    this.midiOutputDevices = midiAccess.availableMIDIOutputDevices;
                });
            };

            getMidiAccess();

        } else {
            console.log('WebMIDI is not supported in this browser.');s
        }
    }
})


$(document).ready(function() {
    const sysExMessage = new SysExMessage('manId', 'pleep', 'prodId','comId');



    console.log(sysExMessage.fullSysExMessage);

});

  /*
 <div class="dropdown mt-4">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButtonMidiThroughputDevices" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      {{ selectedMidiThroughputDevice.name }}
                    </button>

                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <p class="dropdown-item" v-for="throughputDevice in midiThroughputDevices" :key="throughputDevice.id" v-on:click="selectMidiThroughputDevice( throughputDevice)"> {{ throughputDevice.name }}</p>
                    </div>
                </div>

  */