//todo midiBytePos = midiBytePos * 2;

class Controller {
    constructor(state) {
        this.state = state;
        this.digitalOutputsMidiValues = digitalOutputsMidiValues;         // this is related to sysex message
        this.digitalInputsMidiValues = []; //change all -> this is related to sysex message
        this.analogInputsMidiValues = [];  //change all -> this is related to sysex message
        this.digitalInputsTable = this.buildDigitalInputsTable();
        this.analogInputsTable = this.buildAnalogInputsTable();
    };

    setDigitalInputMidiValues(digitalInputMidiValues){
        this.digitalInputsMidiValues = digitalInputMidiValues;
    }

    setAnalogInputMidiValues(analogInputMidiValues){
        this.analogInputsMidiValues = analogInputMidiValues;
    }

    setDigitalOutputstMidiValues(analogInputMidiValues){
        this.analogInputsMidiValues = analogInputMidiValues;
    }

    toSysExMessage(midiMessage, command){
        //todo add commands switch statement
        let sysExMessage = midiMessage.slice();

        //add system specific hex codes to beginning of message
        sysExMessage.splice(0, 0, 0xF0, 0x0, 0x1, 0x61, 0x7, command);

        //close message
        sysExMessage.push(0xF7);

        return sysExMessage
    };


    printSysExMessage(midiMessage, command) {
        const sysExMessage = this.toSysExMessage(midiMessage, command);

        console.log('-----SysEx Message:-----');
        console.log(sysExMessage);
        console.log('------------------------');

    }

    /*
    requestBtnMidiMap(){
        const requestInputMapSysex = [0x0B]

        this.sendSysExMessage(requestInputMapSysex, 0x07);
    };*/

    getDigitalInputsMidiMapRequest(){
        return this.toSysExMessage([0x0B],  0x07);
    }

    /*
    requestKnobMidiMap(){
        const requestInputMapSysex = [0x0A]

        this.sendSysExMessage(requestInputMapSysex, 0x07);
    };*/

    getAnalogInputsMidiMapRequest(){
        return this.toSysExMessage([0x0A],  0x07);
    };


    /*
    buildBtnsTable () {
        //todo split up into seperate functions
        let buttons = [];

        let column = 0;
        let row = 0;

        let ledPosition = 56;
        let startingLedPosition = 56;

        let btnGroup;

        for(let i = 0; i <= 81; i++) {

            buttons.push( new Button(i, false, '', btnGroup, ledPosition, Math.floor(ledPosition / 2), 0, 'midiValue', 0, row, column) );

            column++;

            //grid btns
            //row 1 - 7
            //8 columns
            if(row < 8) {
                btnGroup = 'grid';
                if(column > 7) {
                    column = 0;
                    row++;
                }

                if(column === 0 && row > 0) {

                    if(row % 2 !== 0) {
                        startingLedPosition += 4;
                    } else {
                        startingLedPosition -= 3;
                    }

                    ledPosition = startingLedPosition;

                } else {
                    ledPosition -= 8;
                }
            }

            //crossfader btns
            //row 8
            //2 columns
            if(row === 8) {
                btnGroup = 'crossfader';
                if(column > 1) {
                    column = 0;
                    row++;
                }

                if(column === 0) {
                    ledPosition = 74;
                } else {
                    ledPosition = 75;
                }
            }

            //slider btns
            if(row === 9) {
               
  btnGroup = 'slider';
                if(column > 7) {
                    column = 0;
                    row++;
                }

                if(column < 4) {
                    if(column % 2 === 0) {
                        ledPosition += 3;
                    } else {
                        ledPosition++;
                    }
                } else {
                    ledPosition--;
                }

                if(column === 0) {
                    ledPosition = 66;
                }

                if(column === 4) {
                    ledPosition = 79;
                }

            }

            //funtion btns
            if(row === 10){
                btnGroup = 'function';
                if(column > 5) {
                    column = 0;
                    row++;
                }

                if(column % 2 !== 0) {
                    ledPosition++;
                } else {
                    ledPosition += 3;
                }

                if(column === 0) {
                    ledPosition = 64;
                }
            }


            //bpm
            if(row === 11 ) {
                btnGroup = 'bpm';
                if(column > 0) {
                    column = 0;
                    row++;
                }

                ledPosition = 80;
            }

            if(row > 11 ) {
                btnGroup = 'other';
            }


        }
        buttons = this.assignMidiValPosToBtnsTable(buttons);

        return buttons;
    };*/

    buildKnobsTable() {
        let knobsTable = [];

        let column = 0;
        let numberOfColumns = 0;
        let row = 0;

        let midiBytePosition;
        let group;
        for(let i = 0; i <= 24; i++){

            //crossfader
            if(row == 0 && column === 0)    {
                group = 'crossfader';
                numberOfColumns = 1;
                midiBytePosition = 24
            }

            //faders
            if(row === 1)    {
                group = 'fader';
                if(column < 4 && column % 2 !== 0){
                    midiBytePosition--;
                }

                if(column >= 4 &&  column <= 5 && column % 2 !== 0){
                    midiBytePosition+=2;
                }

                if(column >= 6 && column % 2 !== 0){
                    midiBytePosition-=2;
                }

                if(column === 0 ){
                    numberOfColumns = 8;
                    midiBytePosition = 23
                }

                if(column === 2 ){
                    midiBytePosition = 15
                }

                if(column === 4 ){
                    midiBytePosition = 5
                }

                if(column === 6 ){
                    midiBytePosition = 6
                }
            }


            //left knobs
            if(row === 2)    {
                group = 'knobsLeft';
                if(column % 2 !== 0){
                    midiBytePosition--;
                }

                if(column === 0 ){
                    numberOfColumns = 12;
                    midiBytePosition = 17
                }

                if(column === 2 ){
                    midiBytePosition = 9;
                }

                if(column === 4 ){
                    midiBytePosition = 19
                }

                if(column === 6 ){
                    midiBytePosition = 11
                }

                if(column === 8 ){
                    midiBytePosition = 21;
                }

                if(column === 10 ){
                    midiBytePosition = 13;
                }
            }

            //right knobs
            if(row === 3)    {
                group = 'knobsRight';
                if(column === 1){
                    midiBytePosition -= 2;
                }

                if(column === 3){
                    midiBytePosition += 2;
                }

                if(column === 0 ){
                    numberOfColumns = 4;
                    midiBytePosition = 3
                }

                if(column === 2 ){
                    midiBytePosition = 0;
                }


            }

            knobsTable.push(
                {
                    id: i,
                    bytePosition: midiBytePosition * 2,
                    isCC: 1,
                    midiValue: 'none',
                    group: group,
                    row: row,
                    column: column
                }
            );

            if(column + 1 === numberOfColumns){
                row++;
                column = 0;
            } else {
                column++;
            }
        }

        return knobsTable
    };

    assignMidiValPosToBtnsTable(buttons) {

        let column = 0;
        let row = 0;

        let midiValuePos = 0;
        let startingMidiValuePos = 0;

        let btnPair1MidiPos = 65;
        let btnPair2MidiPos = 73;

        let btnSPair1MidiPos = 69;
        let btnSPair2MidiPos = 77;

        for(let i = 0; i <= 81; i++) {

            buttons[i].midiBytePosition = midiValuePos * 2;

            column++;

            //grid btns
            if(row < 8) {
                if(column > 7) {
                    column = 0;
                    row++

                    startingMidiValuePos++;
                    midiValuePos = startingMidiValuePos
                } else {
                    midiValuePos += 8;
                }
            }


            //crossfader btns
            //row 8
            if(row === 8) {

                if(column > 1) {
                    column = 0;
                    row++;
                }

                midiValuePos++;

                if(column === 0) {
                    midiValuePos = 64;
                } else {
                    midiValuePos = 72;
                }

            }

            //slider btns
            if(row > 8) {

                if(column > 7) {
                    column = 0;
                    row++;
                }

                if(column % 2 === 0) {
                    midiValuePos = btnPair1MidiPos;
                    btnPair1MidiPos++;
                } else {
                    midiValuePos = btnPair2MidiPos;
                    btnPair2MidiPos++;
                }


            }


            //function btns
            if(row === 10) {

                if(column > 5) {
                    column = 0;
                    row++;
                }

                if(column % 2 === 0) {

                    midiValuePos = btnSPair1MidiPos;
                    btnSPair1MidiPos++;
                } else {
                    midiValuePos = btnSPair2MidiPos;
                    btnSPair2MidiPos++;
                }

            }

            //bpm btns
            if(row === 11) {

                if(column > 0) {
                    column = 0;
                    row++;
                }
                midiValuePos = 87;


            }

            //non used btn

            if(row > 11) {
                midiValuePos = 89;
            }
        }

        return buttons;
    }

    assignMidiValsToBtnsTable(midiVals){
        //todo two seperate functions
        for(let i = 0; i <= this.buttons.length - 1; i++) {
            this.buttons[i].midiValue = midiVals[this.buttons[i].midiBytePosition];
            this.buttons[i].isCC = midiVals[(this.buttons[i].midiBytePosition) + 1]; //this might have broken everything
        }

        return this.buttons;
    }

    assignMidiValsToKnobsTable(midiVals){
        //todo two seperate functions
        for(let i = 0; i <= this.knobs.length - 1; i++) {
            this.knobs[i].midiValue = midiVals[this.knobs[i].bytePosition];
            this.knobs[i].isCC = midiVals[(this.knobs[i].bytePosition) + 1];
        }

        return this.knobs;
    }

    setMidiToDefault(){
        this.midiVals = [];
        for(let i = 0; i <= 87 ; i++) {
            if(i <= this.buttons.length -1) {
                this.midiVals.push(this.buttons[i].midiBytePosition / 2);
                this.midiVals.push(0);
            } else {
                this.midiVals.push(87);
                this.midiVals.push(0);
            }
        }

        this.sendSysExMessage(this.midiVals, 0x0B);

        return this.buttons;
    }

    setKnobMidiToDefault(){
        //todo fix last btn wrong val assignment

        this.midiVals = [];
        for(let i = 0; i <= 87 ; i++) {
            if(i <= this.buttons.length -1) {
                this.midiVals.push(this.buttons[i].midiBytePosition);
                this.midiVals.push(0);
            } else {
                this.midiVals.push(87);
                this.midiVals.push(0);
            }
        }

        this.sendSysExMessage(this.midiVals, 0x0B);

        return this.buttons;
    }

    assignMidiMessageToButton(isCC, message, btn){
        const btnMidiBytePos = btn.midiBytePosition;
        this.midiVals[btnMidiBytePos] = message;
        this.midiVals[btnMidiBytePos + 1] = isCC;
        this.buttons[btn.id].midiValue = message;


        let sysExMessage = [];

        for(let i =0; i <= this.midiVals.length -1; i++) {


            if(i === btnMidiBytePos + 1){
                if(isCC){
                    sysExMessage.push(1);
                } else {
                    sysExMessage.push(0);
                }
            } else {
                sysExMessage.push(this.midiVals[i]);
            }

        }

        this.sendSysExMessage(sysExMessage, 0x0B);

        return this.midiVals;

    }


    assignMidiMessageToKnob(isCC, message, knob){

        const knobMidiBytePos = knob.bytePosition;
        this.knobMidiVals[knobMidiBytePos] = message;
        this.knobMidiVals[knobMidiBytePos + 1] = isCC;
        this.knobs[knob.id].midiValue = message;


        let sysExMessage = [];

        for(let i =0; i <= this.knobMidiVals.length -1; i++) {


            if(i === knobMidiBytePos + 1){
                if(isCC){
                    sysExMessage.push(0);
                } else {
                    sysExMessage.push(0);
                }
            } else {
                sysExMessage.push(this.knobMidiVals[i]);
            }

        }

        this.knobMidiVals = sysExMessage;

        return this.midiVals;

    }

    // todo this must be in led
    addColourToLed (btn, colour) {
        //[  bgr2 bgr1  ]
        const btnPosition = btn.ledPosition;
        let bitsToAdd;
        if(colour === 'white'){
            //7 for first tbn in set 56 for second
            bitsToAdd = btnPosition % 2 === 0 ? 7 : 56;
        }

        if(colour === 'red'){

            bitsToAdd = btnPosition % 2 === 0 ? 1 : 8;
        }

        if(colour === 'green'){

            bitsToAdd = btnPosition % 2 === 0 ? 2 : 16;
        }

        if(colour === 'blue'){

            bitsToAdd = btnPosition % 2 === 0 ? 4 : 32;
        }

        //get position of byte to change
        const bytePosition = btn.ledBytePosition;

        //get current value of byte
        const currentVal = this.ledVals[bytePosition];

        //calc new val
        const newVal = currentVal + bitsToAdd;

        //set new val
        this.ledVals[bytePosition] = newVal;
    };

    switchOffBtnLed(btn) {
        const btnPosition = btn.ledPosition;

        //value to add 7 for first btn, 56 for second
        const ledValByte = btnPosition % 2 === 0 ? 7 : 56;

        //get position of byte to change
        const bytePosition = btn.ledBytePosition;

        //get current value of byte
        const currentVal = this.ledVals[bytePosition];

        //calc new val
        const newVal = currentVal - ledValByte;

        //set new val
        this.ledVals[bytePosition] = newVal;
    };


    removeColourFromLed (btn, colour) {
        //[  bgr2 bgr1  ]
        const btnPosition = btn.ledPosition;
        let bitsToRemove;
        if(colour === 'white'){
            //7 for first tbn in set 56 for second
            bitsToRemove = btnPosition % 2 === 0 ? 7 : 56;
        }

        if(colour === 'red'){

            bitsToRemove = btnPosition % 2 === 0 ? 1 : 8;
        }

        if(colour === 'green'){

            bitsToRemove = btnPosition % 2 === 0 ? 2 : 16;
        }

        if(colour === 'blue'){

            bitsToRemove = btnPosition % 2 === 0 ? 4 : 32;
        }

        //get position of byte to change
        const bytePosition = btn.ledBytePosition;

        //get current value of byte
        const currentVal = this.ledVals[bytePosition];

        //calc new val
        const newVal = currentVal - bitsToRemove;

        //set new val
        this.ledVals[bytePosition] = newVal;
    };

    ///end led functions

    printButtonStates(){
        console.log('-----btnStates:-----');
        console.log(this.btnStates);
        console.log('---------------------------------------');
    };

    printButtons(){
        console.log('-----btnStates:-----');
        console.log(this.buttons);
        console.log('---------------------------------------');
    };

    printButtonGroup(group){
        const btnGroup = [];

        for (let i = 0; i <= this.buttons.length -1; i++) {
            if(this.buttons[i].group === group) {
                btnGroup.push(this.buttons[i]);
            }
        }
        console.log('-----btnStates For Group: ' + group + '-----');
        console.log(btnGroup);
        console.log('---------------------------------------');
    };


    printButtonsMidiBytePositions(){
        console.log('-----btnStates Midi Byte Positions:-----');
        let btnsWithMidiBytePositions = [];
        for(let i =0; i <= this.buttons.length - 1; i++) {
            btnsWithMidiBytePositions.push(this.buttons[i].midiBytePosition + ' | col=' + this.buttons[i].column+ ' | row=' + this.buttons[i].row);
        }
        console.log(btnsWithMidiBytePositions);
        console.log('---------------------------------------');
    };

    printButtonRefTable() {
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
    };

    getKnobByMidiValue(knobArray, midiValue){

        const hasMidiVal = (knob) => knob.midiValue === midiValue;

        return knobArray.findIndex(hasMidiVal)

    }
/*
controller
-ohmRGB

view
-alphaSynth

*/


}

