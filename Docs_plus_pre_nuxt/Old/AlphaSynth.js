class AlphaSynth extends Controller {
    constructor(midiRouter, state, ledVals) {
        super(midiRouter, state, ledVals);
        this.activeLFO = 'unset'; //todo fix
        this.activeEnv = 'unset';
        this.activeMode = 'unset';

    }

    init(){
        const lfoSwitchFirstBtn = 66;

        for(let i =0; i <= 3; i++){
            this.buttons[ lfoSwitchFirstBtn + i ].func = this.setActiveLFO;
        }

        return 'init';
    }

    setActiveLFO(lfoId){


        //switch off old led
        let buttonId = this.activeLFO + 66;
        if(this.activeLFO != lfoId){

            if(this.activeLFO != 'unset'){
                this.removeColourFromLed(this.buttons[ buttonId ], 'green');
            }

            //switch on new led
            buttonId = lfoId + 66;
            this.addColourToLed(this.buttons[  buttonId ], 'green');

            //update midi msgs
            this.sendSysExMessage(this.ledVals, 0x04);


        }

        if(lfoId === 0){

            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 20 + i, this.knobs[1 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(lfoId === 1){

            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 24 + i, this.knobs[1 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(lfoId === 2){

            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 28 + i, this.knobs[1 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(lfoId === 3){

            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 75 + i, this.knobs[1 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        this.activeLFO = lfoId;

    }

    setActiveEnv(envId){


        //switch off old led
        let buttonId = this.activeEnv + 70;
        if(this.activeEnv != envId){

            if(this.activeEnv != 'unset'){
                this.removeColourFromLed(this.buttons[ buttonId ], 'green');
            }

            //switch on new led
            buttonId = envId + 70;
            this.addColourToLed(this.buttons[  buttonId ], 'green');

            //update midi msgs
            this.sendSysExMessage(this.ledVals, 0x04);


        }

        if(envId === 0){
            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 106 + i, this.knobs[21 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(envId === 1){
            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 110 + i, this.knobs[21 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(envId === 2){
            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 114 + i, this.knobs[21 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }

        if(envId === 3){
            for(let i=0; i <= 3; i++) {
                this.assignMidiMessageToKnob(1, 99 + i, this.knobs[21 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }


        this.activeEnv = envId;

    }

    setActiveMode(modeId){
        //switch off old led
        let buttonId = this.activeMode + 64;
        if(this.activeMode != modeId){

            if(this.activeMode != 'unset'){
                this.removeColourFromLed(this.buttons[ buttonId ], 'blue');
            }

            //switch on new led
            buttonId = modeId + 64;
            this.addColourToLed(this.buttons[  buttonId ], 'blue');

            //update midi msgs
            this.sendSysExMessage(this.ledVals, 0x04);

        }

        if(modeId === 0){
            //osc 1
            for(let i=0; i <= 11; i++) {
                this.assignMidiMessageToKnob(1, 32 + i, this.knobs[9 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        } else {
            //osc 1
            for(let i=0; i <= 11; i++) {
                this.assignMidiMessageToKnob(1, 44 + i, this.knobs[9 + i]);
            }
            this.sendSysExMessage(this.knobMidiVals, 0x0A)
        }
        //const controller = this;
        //setTimeout(, 100);



        this.activeMode = modeId;

    }
}