   /*
                led color vars
                convert state checks to ternary
                seperate into multiple functions maybe
            */
            //check currentStep state
            const currentStepState = this.currentSequenceState[this.currentStep];
            const previousStepState = this.currentSequenceState[this.currentStep - 1];
            const previousBrotherStepState = this.currentSequenceState[this.currentStep + 16];
            console.log(previousStepState);
            console.log(previousBrotherStepState);

            //handle leds
            let currentLedVals = this.currentLedValues;

            //convert currentStep to grid btn layout
            let convertedCurrentStep;;
            let activeStepHexCode;

            //handle track 1 & 3
            if(this.currentTrack === 0 || this.currentTrack === 2) {
                convertedCurrentStep = 28 - (this.currentStep * 4);

                if(this.currentTrack === 0) {
                     //switch off last led of previous track
                    currentLedVals[2] = 0x3f;


                    if(currentStepState === 1) {
                        activeStepHexCode =  0x39;
                    } else {
                        activeStepHexCode = 0x38;
                    }

                } else {
                    //switch off last led of previous track
                    currentLedVals[2] = 0x3f;
                    activeStepHexCode = 0xF;

                    if(currentStepState === 1) {
                        activeStepHexCode =  0xF;
                    } else {
                        activeStepHexCode = 0x7;
                    }
                }

            }

            //handle track 2 & 4
            if(this.currentTrack === 1 || this.currentTrack === 3) {
                convertedCurrentStep = 30 - (this.currentStep * 4);

                if(this.currentTrack === 1) {
                    //switch off last led of previous track
                    currentLedVals[0] = 0x3f;

                    if(currentStepState === 1) {
                        activeStepHexCode =  0x39;
                    } else {
                        activeStepHexCode = 0x38;
                    }

                } else {
                    //switch off last led of previous track
                    currentLedVals[0] = 0x3f;

                    if(currentStepState === 1) {
                        activeStepHexCode =  0xF;
                    } else {
                        activeStepHexCode = 0x7;
                    }
                }
            }

            //if current step > 0 reset previous led
            if(this.currentStep > 0 ) {
                //currentLedVals[convertedCurrentStep + 4] = 0x38; -> top on
                // activeStepHexCode = 0x7;                         -> bottom on

                if(previousStepState === 1 || previousBrotherStepState === 1) {
                    currentLedVals[convertedCurrentStep + 4] = 0x3f;
                }

                if(previousStepState === 1 || previousBrotherStepState === 0) {
                    currentLedVals[convertedCurrentStep + 4] = 0x38;
                }

                if(previousStepState === 0 || previousBrotherStepState === 1) {
                    currentLedVals[convertedCurrentStep + 4] = 0x7;
                }

                if(previousStepState === 0 || previousBrotherStepState === 0) {
                    currentLedVals[convertedCurrentStep + 4] = 0x0;
                }

            }



            //set current led
            currentLedVals[convertedCurrentStep] = activeStepHexCode;

            this.currentStep++;

             //increase track if seq is complete
             if(this.currentStep > 7) {
                this.currentStep = 0;
                this.currentTrack++;

                if(this.currentTrack > 3) {
                    this.currentTrack = 0;
                }
            }

            this.sendSysExMessage(currentLedVals);