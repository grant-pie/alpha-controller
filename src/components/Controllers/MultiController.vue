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
                    <v-select
                    v-model="selectedScaleType"
                    :items="scaleTypes"
                    item-title="label"
                    item-value="value"
                    label="Scale Type"
                    density="compact"
                    :disabled="selected === null"
                    ></v-select>
                </v-row>

                <v-row class="mt-2">
                    <v-btn
                    @click="showScale"
                    block
                    :disabled="selected === null || selectedScaleType === null"
                    >
                        Show Scale
                    </v-btn>
                </v-row>

                <v-row class="mt-2 mb-1">
                    <v-btn
                    @click="hideScale"
                    block
                    :disabled="selected === null"
                    >
                        Hide Scale
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

            <div
            class="container-controls mt-5"
            >
                <v-row class="mb-2">
                    <v-col cols="12">
                        <p class="text-center font-weight-bold mb-0">SEQUENCER</p>
                    </v-col>
                </v-row>

                <v-row class="mb-3">
                    <v-col cols="6">
                        <v-text-field
                        v-model.number="tempo"
                        label="Tempo"
                        suffix="BPM"
                        type="number"
                        density="compact"
                        hide-details
                        @change="updateTempo"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-select
                        v-model="quantizeGrid"
                        :items="quantizeOptions"
                        item-title="label"
                        item-value="value"
                        label="Quantize"
                        density="compact"
                        hide-details
                        ></v-select>
                    </v-col>
                </v-row>

                <v-row class="mb-2">
                    <v-col cols="4" class="pa-1">
                        <v-btn
                        @click="startRecording"
                        block
                        :color="isRecording ? 'red' : ''"
                        :disabled="isPlaying"
                        size="small"
                        >
                            <v-icon size="small">mdi-record</v-icon>
                            REC
                        </v-btn>
                    </v-col>
                    <v-col cols="4" class="pa-1">
                        <v-btn
                        @click="startPlayback"
                        block
                        :color="isPlaying ? 'green' : ''"
                        :disabled="isRecording"
                        size="small"
                        >
                            <v-icon size="small">mdi-play</v-icon>
                            PLAY
                        </v-btn>
                    </v-col>
                    <v-col cols="4" class="pa-1">
                        <v-btn
                        @click="stopSequencer"
                        block
                        size="small"
                        >
                            <v-icon size="small">mdi-stop</v-icon>
                            STOP
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row class="mb-2">
                    <v-col cols="6" class="pa-1">
                        <v-btn
                        @click="loopEnabled = !loopEnabled"
                        block
                        :color="loopEnabled ? 'primary' : ''"
                        size="small"
                        >
                            <v-icon size="small">mdi-repeat</v-icon>
                            LOOP
                        </v-btn>
                    </v-col>
                    <v-col cols="6" class="pa-1">
                        <v-btn
                        @click="clearRecording"
                        block
                        size="small"
                        >
                            <v-icon size="small">mdi-delete</v-icon>
                            CLEAR
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row class="mb-1">
                    <v-col cols="12">
                        <div class="sequencer-status">
                            <p class="text-caption ma-0">Status: {{ sequencerStatus }}</p>
                            <p class="text-caption ma-0">Events: {{ recordedEventsCount }}</p>
                        </div>
                    </v-col>
                </v-row>

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
            showScaleActive: false,
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
            ],
            selectedScaleType: null,
            scaleTypes: [
                { label: 'Major (Ionian)', value: 'major' },
                { label: 'Minor (Aeolian)', value: 'minor' },
                { label: 'Dorian', value: 'dorian' },
                { label: 'Phrygian', value: 'phrygian' },
                { label: 'Lydian', value: 'lydian' },
                { label: 'Mixolydian', value: 'mixolydian' },
                { label: 'Locrian', value: 'locrian' },
                { label: 'Harmonic Minor', value: 'harmonicMinor' },
                { label: 'Melodic Minor', value: 'melodicMinor' },
                { label: 'Pentatonic Major', value: 'pentatonicMajor' },
                { label: 'Pentatonic Minor', value: 'pentatonicMinor' },
                { label: 'Blues', value: 'blues' },
            ],
            // Sequencer data
            tempo: 120,
            loopLength: 4,
            isRecording: false,
            isPlaying: false,
            loopEnabled: true,
            recordedEventsCount: 0,
            quantizeGrid: '1/16',
            quantizeOptions: [
                { label: 'Off', value: 'off' },
                { label: '1/4 Note', value: '1/4' },
                { label: '1/8 Note', value: '1/8' },
                { label: '1/16 Note', value: '1/16' },
                { label: '1/32 Note', value: '1/32' },
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

        sequencerStatus() {
            if (this.isRecording) return 'Recording...';
            if (this.isPlaying) return 'Playing';
            return 'Stopped';
        }
    },

    watch: {
        showMiddleC(){

            if(this.showMiddleC){

                if(this.showScaleActive || this.showChordActive){
                    this.hideScale();
                    this.hideChord();
                }

                return this.controller.showMiddleC();
            }

            return this.controller.hideMiddleC();
        },

        showOctaves(){
            if(this.showOctaves){
                if(this.showScaleActive || this.showChordActive){
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
                if(this.showScaleActive || this.showChordActive){
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

            if(this.showScaleActive){
                this.hideScale();
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

            if(this.showScaleActive){
                this.showScale();
            }

            if(this.showChordActive){
                this.showChord();
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

            if(this.showScaleActive){
                this.hideScale();
            }

            this.showChordActive = true;
            this.controller.showChord(this.selected, this.selectedChordType);
        },

        hideChord(){
            this.showChordActive = false;
            this.controller.hideChord();
        },

        showScale(){
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

            if(this.showChordActive){
                this.hideChord();
            }

            this.showScaleActive = true;
            this.controller.showScaleByType(this.selected, this.selectedScaleType);
        },

        hideScale(){
            this.showScaleActive = false;
            this.controller.hideScales();
        },

        // Sequencer methods
        updateTempo() {
            console.log('Update tempo to:', this.tempo);
            this.controller.sequencer.setTempo(this.tempo);
        },

        startRecording() {
            console.log('Start recording');
            this.isRecording = true;
            this.isPlaying = false;
            this.controller.sequencer.startRecording();
        },

        startPlayback() {
            console.log('Start playback');
            this.isPlaying = true;
            this.isRecording = false;
            this.controller.sequencer.startPlayback(this.loopEnabled);
        },

        stopSequencer() {
            console.log('Stop sequencer');
            
            // If we were recording, apply quantization before stopping
            if (this.isRecording && this.quantizeGrid !== 'off') {
                console.log('Applying quantization:', this.quantizeGrid);
                this.controller.sequencer.quantizeRecording(this.quantizeGrid, this.tempo);
            }
            
            this.isRecording = false;
            this.isPlaying = false;
            
            if (this.controller.sequencer.isRecording) {
                this.controller.sequencer.stopRecording();
            }
            
            if (this.controller.sequencer.isPlaying) {
                this.controller.sequencer.stopPlayback();
            }
            
            this.updateEventCount();
        },

        clearRecording() {
            console.log('Clear recording');
            this.stopSequencer();
            this.controller.sequencer.clearRecording();
            this.recordedEventsCount = 0;
        },

        updateEventCount() {
            this.recordedEventsCount = this.controller.sequencer.recordedEvents.length;
        }
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

    .sequencer-status {
        background-color: rgba(184, 184, 184, 0.1);
        padding: 8px;
        border-radius: 4px;
        text-align: center;
    }
</style>