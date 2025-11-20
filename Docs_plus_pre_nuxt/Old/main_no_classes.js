var app = new Vue({
    el: '#app',
    data: {
        midiInputDevices: [],
        midiOutputDevices: [],
        selectedInputDevice: {name: 'Select Input Device'}, //todo this can be converted to an if statement
        selectedOutputDevice: {name: 'Select Output Device'},//todo this can be converted to an if statement
        activeStep: 0,
        btnStates: [],
        sequenceInterval: null,
        sequenceState: 'stopped',
        editModeActive:0,
        counter : 0,
        ledVals :  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    methods: {
        onMIDISuccess: function(midiAccess) {
            //get input devices
            for (var input of midiAccess.inputs.values()) {
                this.midiInputDevices.push(input);
            }
            //get output devices
            for (var output of midiAccess.outputs.values()) {
                this.midiOutputDevices.push(output);
            }
        },

        onMIDIFailure: function(midiAccess) {
            console.log('Could not access your MIDI devices.'); //todo display message
        },

        selectInputDevice: function (inputDevice){
            this.selectedInputDevice = inputDevice;

            //start listening
            this.selectedInputDevice.onmidimessage = this.onMidiMessage;
        },

        selectOutputDevice: function (outputDevice){
            this.selectedOutputDevice = outputDevice;

            //initiate starting state
            this.initiate();
        },

        sendMidiMessage(message){
            this.selectedOutputDevice.send(message);
            //console.log(message);
        },

        sendSysExMessage(message){
            let fullMessage = message.slice();
            //add system specific hex codes to beginning of message
            fullMessage.splice(0, 0, 0xF0, 0x0, 0x1, 0x61, 0x7, 0x4);

            //close message
            fullMessage.push([0xF7]);

            //send message
            this.sendMidiMessage(fullMessage);
        },

        getLedSysExMessage(){
            //todo last btns positions
            //message =;
            console.log(this.ledVals)
            return this.ledVals;
        },

        onMidiMessage(message){
            this.handleMidiMessage(message.data);
            console.log(message);
        },
        handleMidiMessage(message){
            //handle grid btns
            //hanlde note on only
            if(message[2] === 64) {
                const btnNumber = this.getBtnByMidiValue(message[1]);
                const btn = this.btnStates[btnNumber];
                console.log(btnNumber);
                if(btn.toggled) {

                    this.btnStates[btnNumber].toggled = 0;
                    this.switchOffBtnLed(btn);

                } else {

                    this.btnStates[btnNumber].toggled = 1;
                    this.switchOnBtnLed(btn)

                }

                //send message
                this.sendSysExMessage( this.getLedSysExMessage() );
            }

        },
        initiate: function() {
            //build btn state
            let column = 0;
            let row = 0;

            let position = 56;
            let startingPosition = 56;

            let midiValue = 0;
            let startingMidiValue = 0;

            for(let i = 0; i <= 81; i++) {

                 this.btnStates.push( {'id': i, 'toggled' : 0, 'position': position, 'midiValue' : midiValue} );

                 column++;

                 if(column > 7) {
                     column = 0;
                     row++

                     startingMidiValue++;
                     midiValue = startingMidiValue
                 } else {
                    midiValue += 8;
                 }

                 if(column === 0 && row > 0) {

                     if(row % 2 !== 0) {
                         startingPosition += 4;
                     } else {
                         startingPosition -= 3;
                     }

                     position = startingPosition;

                 } else {
                     position -= 8;

                 }


            }

            //
            console.log('-----btnStates:-----');
            console.log(this.btnStates);
            console.log('---------------------------------------');
            //create btn position and byte position reference table
            let btnBytePositionTable = [];
            let byteBtn1;
            let byteBtn2;
            for(let i =0; i <= 41; i++) {
                byteBtn1 = i*2;
                byteBtn2 = byteBtn1 + 1;
                btnBytePositionTable.push(i + ':' + byteBtn1+ ',' + byteBtn2);
            }
            console.log('-----btn position reference table:-----');
            console.log(btnBytePositionTable);
            console.log('---------------------------------------');

            console.log('test:' + 3 / 2);

            //this.switchOnBtnLed(this.btnStates[this.counter].position);
            this.sendSysExMessage( this.getLedSysExMessage() );

            //const test =  [0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F];
            //this.sendSysExMessage([0x1]);
            //this.sendSysExMessage( test );

        },

        increaseStep: function() {
            const activeStep = this.activeStep;

            const btn = this.btnStates[activeStep];
            const btnToggled = this.btnStates[activeStep].toggle;

            const previousBtn =  this.btnStates[activeStep - 1];
            const previousBtnToggled =  this.btnStates[activeStep - 1].toggle;

            const lastBtn = this.btnStates[31];
            const lastBtnToggled =  this.btnStates[31].toggle;

            //handle active step
            if(btnToggled) {

                this.switchOffBtnLed(btn);


            } else {
                this.switchOnBtnLed(btn);
            }

            if(this.activeStep  > 0) {
                previousBtn =  this.btnStates[activeStep - 1];
                //revert previous step in sequence to previous led
                //revert last step in sequence to previous led
                if(previousBtnToggled) {

                    this.switchOffBtnLed(previousBtn);


                } else {
                    this.switchOnBtnLed(previousBtn);
                }
            } else {

                if(lastBtnToggled) {

                    this.switchOffBtnLed(lastBtn);


                } else {
                    this.switchOnBtnLed(lastBtn);
                }
            }


            this.sendSysExMessage(this.getLedSysExMessage());

            this.activeStep++;

            if(this.activeStep > 31) {
                this.activeStep =0;
            }
        },
        getBtnByPosition(position){

            const hasPosition = (element) => element.position === position;
            console.log(this.counter++);
            return this.btnStates.findIndex(hasPosition)
        },
        switchOnBtnLed: function(btn) {
            const btnPosition = btn.position;
            console.log(btn)
            //console.log(btn.position);
            //value to add 7 for first btn, 56 for second
            const ledValByte = btnPosition % 2 === 0 ? 7 : 56;

            //get position of byte to change
            const bytePosition = Math.floor(btnPosition / 2);

            //get current value of byte
            const currentVal = this.ledVals[bytePosition];

            //calc new val
            const newVal = currentVal + ledValByte;

            //set new val
            this.ledVals[bytePosition] = newVal;
        },
        switchOffBtnLed: function(btn) {
            const btnPosition = btn.position;
            //value to add 7 for first btn, 56 for second
            const ledValByte = btnPosition % 2 === 0 ? 7 : 56;

            //get position of byte to change
            const bytePosition = Math.floor(btnPosition / 2);

            //get current value of byte
            const currentVal = this.ledVals[bytePosition];

            //calc new val
            const newVal = currentVal - ledValByte;

            //set new val
            this.ledVals[bytePosition] = newVal;


        },
        getBtnByMidiValue(midiValue){

            const hasMidiVal = (element) => element.midiValue === midiValue;

            return this.btnStates.findIndex(hasMidiVal)
        }
    },

    created: function () {
        const app = this;
        //check if browser supports web midi
        if (navigator.requestMIDIAccess) {
            console.log('This browser supports WebMIDI!');
            //check midi devices
            navigator.requestMIDIAccess({'sysex' : 1}).then(app.onMIDISuccess, app.onMIDIFailure);


        } else {
            console.log('WebMIDI is not supported in this browser.');s
        }


      },
  })



//notes:
/*
  ****classes****
  1) Midi Router
  2) Controller
    -digital
    -analog
  3)
YOU ARE HERE:
Handle input

  */

  //led message with positions

  /*
  byte - btnNumber
  0 - 0, 1
  1 - 2, 3
  2 - 4, 5
  3 - 6, 7
  4 - 8, 9,
  5 - 10, 11
  6 - 12, 13
  7 - 14, 15
  8 - 16, 17
  9 - 18, 19
  10 - 20, 21
  11 - 22, 23
  12 - 24, 25
  13 - 25, 26
  14 - 27, 28
  15 - 29, 30
  16 - 31, 32
  17 - 33, 34
  18
  19
  20
  21
  22
  23
  24
  25
  26
  27
  28
  29
  30
  31
  32
  33
  34
  35
  36
  37
  38
  39
  40
  41
  42
  */

  //turn on all
  /*
0xF0, 0x0, 0x1, 0x61, 0x7, 0x4, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0x7F, 0xF7
  */