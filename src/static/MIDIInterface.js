console.log('loaded');

class MIDIInterface {
    constructor(inputDevice, outputDevice, sequencerOutputDevice = null) {
        this.inputDevice = inputDevice;
        this.outputDevice = outputDevice;
        this.sequencerOutputDevice = sequencerOutputDevice || outputDevice;
    };

    onMIDISuccess(midiAccess) {
        let availableMIDIInputDevices =[];
        let availableMIDIOutputDevices =[];

        //get input devices
        for (var input of midiAccess.inputs.values()) {
            availableMIDIInputDevices.push(input);
        }

        //get output and throughput devices
        for (var output of midiAccess.outputs.values()) {
            availableMIDIOutputDevices.push(output);

        }

        return {
            'availableMIDIInputDevices': availableMIDIInputDevices,
            'availableMIDIOutputDevices': availableMIDIOutputDevices,
        }
    };

    onMIDIFailure(midiAccess) {
        console.log('Could not access your MIDI devices.'); //todo display message
    };

    listen(func){
        //start listening

        return this.inputDevice.onmidimessage = func;
    };
  }

  export { MIDIInterface };