<template>


    <div
    class="container-content"
    >

        <div
        class="container-btns"
        >
            <div
            class="container-controls"
            >
                <v-row>
                    <v-select
                    v-model="selectedChordType"
                    :items="chordTypes"
                    item-title="label"
                    item-value="value"
                    label="Chord Type"
                    density="compact"
                    :disabled="selected === null"
                    ></v-select>
                </v-row>

                <v-row class="mt-2">
                    <v-btn
                    @click="showChord"
                    block
                    :disabled="selected === null || selectedChordType === null"
                    >
                        Show Chord
                    </v-btn>
                </v-row>

                <v-row class="mt-2 mb-1">
                    <v-btn
                    @click="hideChord"
                    block
                    :disabled="selected === null"
                    >
                        Hide Chord
                    </v-btn>
                </v-row>
            </div>

            <div
            class="container-controls mt-5"
            >
                <v-row>

                    <v-btn
                    @click="showMajorScale"
                    block
                    :disabled="selected === null ? true : false"
                    >
                        Major Scale
                    </v-btn>

                </v-row>

                <v-row class="mt-5 mb-1">

                    <v-btn
                    @click="showMinorScale"
                    block
                    :disabled="selected === null ? true : false"
                    >
                        Minor Scale
                    </v-btn>

                </v-row>

                <v-row class="mt-5 mb-1">

                    <v-btn
                    @click="hideScale"
                    block
                    :disabled="selected === null ? true : false"
                    >
                        Hide  Scale
                    </v-btn>

                </v-row>

            </div>

            <div
            class="container-controls mt-5"
            >

                <v-row
                class="justify-center mb-2"
                >

                    <v-btn
                    @click="showMiddleC = !showMiddleC"
                    block
                    >
                        Show Middle C
                    </v-btn>

                </v-row>

                <v-row
                class="justify-center mb-2"
                >

                    <v-btn
                    @click="showOctaves = !showOctaves"
                    block
                    >
                        Show Octaves
                    </v-btn>

                </v-row>

                <v-row
                class="justify-center mb-2"
                >

                    <v-btn
                    @click="showBlackKeys = !showBlackKeys"
                    block
                    >
                        Show Black Keys
                    </v-btn>

                </v-row>

            </div>

            <div
            class="container-controls mt-5"
            >

                <v-row
                class="justify-center mb-2"
                >

                    <v-btn
                    @click="labels === 'notes' ?  labels = '' : labels = 'notes'"
                    block
                    >
                        Show Notes
                    </v-btn>

                </v-row>

                <v-row
                class="justify-center mb-2"
                >

                    <v-btn
                    @click="labels === 'ids' ?  labels = '' : labels = 'ids'"
                    block
                    >
                        Show IDs
                    </v-btn>

                </v-row>

            </div>


        </div>

        <div
        class="container-hardware_interface d-flex justify-center"
        >

            <livid-ohm-rgb
            :hardware_interface="hardware_interface"
            :labels="labels"
            v-model:note-in="noteIn"
            v-model:selected="selected"
            ></livid-ohm-rgb>

        </div>

        <div
        class="container-btns"
        >
            <div
            class="container-controls"
            >

                <v-row >

                    <v-col
                    class="d-flex align-center"
                    >

                        <p>Transpose:</p>

                    </v-col>

                    <v-col
                    class="d-flex align-center"
                    >

                        <p>{{ transposeAmount }}</p>

                    </v-col>

                    <v-col>

                        <v-row>


                            <v-btn
                            class="border-none"
                            @click="transpose(1)"
                            icon
                            >
                                <v-icon>
                                    mdi-arrow-up-bold-circle-outline
                                </v-icon>

                            </v-btn>

                        </v-row>

                        <v-row>

                            <v-btn
                            class="border-none"
                            @click="transpose(0)"
                            icon
                            >
                                <v-icon>
                                    mdi-arrow-down-bold-circle-outline
                                </v-icon>

                            </v-btn>

                        </v-row>

                    </v-col>

                </v-row>

            </div>

            <div
            class="container-controls mt-5 pb-5"
            >

                <div
                class="container-controls mx-4 pa-1"
                >
                    <p class="pa-0 ma-0 text-h5 text-center"
                    v-text="note"
                    ></p>
                </div>

                <div class="mt-4">

                    <p
                    v-for="(note, index) in noteHistory"
                    :key="index"
                    v-text="note"
                    class="pa-0 ma-0 text-h7"
                    ></p>

                </div>

            </div>

        </div>

    </div>

</template>

<script>
import LividOhmRGB from './LividOhmRGB'

export default {
    data() {
        return {
            showMiddleC: false,
            labels: 'none',
            showOctaves : false,
            showBlackKeys : false,
            showMajorScaleActive: false,
            showMinorScaleActive: false,
            showChordActive: false,
            scaleRoot: null,
            transposeAmount: 0,
            selected: null,
            noteIn: null,
            noteHistory : ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10',  '11',  '12' ],
            selectedChordType: null,
            chordTypes: [
                { label: 'Major', value: 'major' },
                { label: 'Minor', value: 'minor' },
                { label: 'Diminished', value: 'diminished' },
                { label: 'Augmented', value: 'augmented' },
                { label: 'Major 7th', value: 'major7' },
                { label: 'Minor 7th', value: 'minor7' },
                { label: 'Dominant 7th', value: 'dominant7' },
                { label: 'Sus2', value: 'sus2' },
                { label: 'Sus4', value: 'sus4' },
            ]
        }
    },

    props: {
        hardware_interface: {
            type: Object,
            default() {
                return {
                    digital_inputs_table : [],
                    digital_outputs_table : []
                }
            }
        },

        controller: {
            type: Object,
            default() {
                return {

                }
            }
        }
    },

    computed: {
        note() {
            const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',];
            const octave = Math. trunc(this.noteIn / 12) - 1;
            const note = notes[this.noteIn - 12 * (octave + 1)];
            return note + ' ' + octave;
        },
    },

    watch: {
        showMiddleC(){

            if(this.showMiddleC){

                if(this.showMajorScaleActive || this.showMinorScaleActive || this.showChordActive){
                    this.hideScale();
                    this.hideChord();
                }

                return this.controller.showMiddleC();
            }

            return this.controller.hideMiddleC();
        },

        showOctaves(){
            if(this.showOctaves){
                if(this.showMajorScaleActive || this.showMinorScaleActive || this.showChordActive){
                    this.hideScale();
                    this.hideChord();
                }

                this.controller.showOctaves();
            } else {
                 this.controller.hideOctaves();
            }
        },

        showBlackKeys(){

            if(this.showBlackKeys){
                if(this.showMajorScaleActive || this.showMinorScaleActive || this.showChordActive){
                    this.hideScale();
                    this.hideChord();
                }

                this.controller.showBlackKeys();
            } else {
                 this.controller.hideBlackKeys();
            }
        },

        noteIn(){
            console.log('*******************updating note history*****************');
            if(this.noteIn != ''){
                this.noteHistory.pop();
                this.noteHistory.unshift(this.note);
            }
        },
    },

    methods: {
        transpose(direction){
            let refreshNotes = false;

            if(this.showMajorScaleActive || this.showMinorScaleActive){
                this.hideScales
            }

            if(this.showChordActive){
                this.hideChord();
            }

            if(this.showMiddleC){

                this.controller.hideMiddleC();

            }

            if(direction){

                if(this.transposeAmount < 2){
                    this.transposeAmount++;

                    this.controller.transpose(1);

                    if(this.showNotes){

                        refreshNotes = true;
                        this.showNotes = false;

                    }

                    if(refreshNotes){

                        setTimeout(() => this.showNotes = true, 10);
                    }
                }

            } else {

                if(this.transposeAmount > -3){
                    this.transposeAmount--;

                    this.controller.transpose(0);

                    if(this.showNotes){

                        refreshNotes = true;
                        this.showNotes = false;

                    }

                    if(refreshNotes){

                        setTimeout(() => this.showNotes = true, 10);
                    }
                }
            }

            if(this.showMiddleC){

                this.controller.showMiddleC();

            }

            if(this.showMajorScaleActive){
                this.showMajorScale()
            }

            if(this.showMinorScaleActive){
                this.showMinorScale()
            }

            if(this.showChordActive){
                this.showChord()
            }


        },

        showChord(){
            // Turn off other visualizations
            if(this.showMiddleC){
                this.showMiddleC = false;
            }

            if(this.showOctaves){
               this.showOctaves = false;
            }

            if(this.showBlackKeys){
               this.showBlackKeys = false;
            }

            if(this.showMajorScaleActive || this.showMinorScaleActive){
                this.hideScale();
            }

            this.showChordActive = true;
            this.controller.showChord(this.selected, this.selectedChordType);
        },

        hideChord(){
            this.showChordActive = false;
            this.controller.hideChord();
        },

        showMajorScale(){
            //TODO: Alot of confusing switching on and off needs fix
            if(this.showMiddleC){
                this.showMiddleC = false;
            }

            if(this.showOctaves){
               this.showOctaves = false;
            }

            if(this.showBlackKeys){
               this.showBlackKeys = false;
            }

            if(this.showChordActive){
                this.hideChord();
            }

            this.showMajorScaleActive = true;
            this.controller.showMajorScale(this.selected);

        },

        showMinorScale(){
            if(this.showMiddleC){
                this.showMiddleC = false;
            }

            if(this.showOctaves){
               this.showOctaves = false;
            }

            if(this.showBlackKeys){
               this.showBlackKeys = false;
            }

            if(this.showChordActive){
                this.hideChord();
            }

            this.showMinorScaleActive = true;
            this.controller.showMinorScale(this.selected);
        },

        hideScale(){
            this.showMajorScaleActive = false;
            this.showMinorScaleActive = false;
            this.controller.hideScales();
        },
    },

    components: {
        'livid-ohm-rgb' : LividOhmRGB
    }
}
</script>

<style>

   .border{
        border: solid thin white;
    }

    .input-container{

        display: inline-block;
        padding: 5px 5px 5px 5px;
    }

    .test_row{
        width: 100vw;
    }

    .hardware_interface{
        display: inline-block;
        border: solid 2px #b8b8b8;
        border-radius: 10px;
        padding: 2px 2px 0 5px;
    }

    .hardware_interface-column{
        float:left;
    }
    .container-content{
        width: 100vw;
    }

    .container-btns{
        width: 15%;
        float: left;

    }

    .container-controls{
        border: solid 2px #b8b8b8;
        padding: 24px 24px 12px 24px;
        border-radius: 10px;
    }

    .container-hardware_interface{
        width: 70%;
        float: left;

    }
    .width-full{
        width: 100%;
    }

    .v-btn{
        background-color: transparent !important;
        border: solid 2px #b8b8b8;
    }

    .border-none{
        border: none !important;
    }
</style>