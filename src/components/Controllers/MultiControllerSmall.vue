<template>


    <v-row>

        <v-col
        cols="4"
        >
            <v-row>
                
                <v-col
                cols="6">
                    <div>
                    <!--Show chord-->
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
                    <!--Show chord end-->

                    <!--Show scale-->
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
                    <!--Show scale end-->

                    <!--Display options-->
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
                    <!--Display options end-->

                    <div>

                    </div>
                </div>

                <!--UI display option-->
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
                <!--UI display option end-->
                </v-col>

                <v-col
                cols="6"
                >
                    <!--Chord generator-->
                    <div
                    class="container-controls"
                    >
                        <v-row class="mb-2">
                            <v-col cols="12">
                                <p class="text-center font-weight-bold mb-0">CHORD GENERATOR</p>
                            </v-col>
                        </v-row>

                        <v-row class="mb-3">
                            <v-col cols="6">
                                <v-select
                                v-model="chordType"
                                :items="chordTypeOptions"
                                item-title="label"
                                item-value="value"
                                label="Type"
                                density="compact"
                                hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                v-model="chordVoicing"
                                :items="chordVoicingOptions"
                                item-title="label"
                                item-value="value"
                                label="Voicing"
                                density="compact"
                                hide-details
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row class="mb-3">
                            <v-col cols="12">
                                <v-slider
                                v-model="chordVelocity"
                                label="Velocity"
                                min="1"
                                max="127"
                                step="1"
                                thumb-label
                                density="compact"
                                hide-details
                                ></v-slider>
                            </v-col>
                        </v-row>

                        <v-row class="mb-2">
                            <v-col cols="12">
                                <v-btn
                                @click="toggleChordGenerator"
                                block
                                :color="chordGenActive ? 'primary' : ''"
                                >
                                    <v-icon>{{ chordGenActive ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                                    {{ chordGenActive ? 'CHORD ON' : 'CHORD OFF' }}
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row class="mb-1">
                            <v-col cols="12">
                                <div class="sequencer-status">
                                    <p class="text-caption ma-0">Active Notes: {{ chordActiveNotes }}</p>
                                </div>
                            </v-col>
                        </v-row>

                    </div>
                    <!--Chord generator end-->

                    <!--Arpeggiator-->
                    <div
                    class="container-controls mt-5"
                    >
                        <v-row class="mb-2">
                            <v-col cols="12">
                                <p class="text-center font-weight-bold mb-0">ARPEGGIATOR</p>
                            </v-col>
                        </v-row>

                        <v-row class="mb-3">
                            <v-col cols="6">
                                <v-select
                                v-model="arpMode"
                                :items="arpModeOptions"
                                item-title="label"
                                item-value="value"
                                label="Mode"
                                density="compact"
                                hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="6">
                                <v-select
                                v-model="arpRate"
                                :items="arpRateOptions"
                                item-title="label"
                                item-value="value"
                                label="Rate"
                                density="compact"
                                hide-details
                                ></v-select>
                            </v-col>
                        </v-row>

                        <v-row class="mb-3">
                            <v-col cols="6">
                                <v-text-field
                                v-model.number="arpOctaves"
                                label="Octaves"
                                type="number"
                                min="1"
                                max="4"
                                density="compact"
                                hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                v-model.number="arpGateLength"
                                label="Gate"
                                suffix="%"
                                type="number"
                                min="10"
                                max="100"
                                density="compact"
                                hide-details
                                ></v-text-field>
                            </v-col>
                        </v-row>

                        <v-row class="mb-2">
                            <v-col cols="12">
                                <v-btn
                                @click="toggleArpeggiator"
                                block
                                :color="arpActive ? 'primary' : ''"
                                >
                                    <v-icon>{{ arpActive ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                                    {{ arpActive ? 'ARP ON' : 'ARP OFF' }}
                                </v-btn>
                            </v-col>
                        </v-row>

                        <v-row class="mb-1">
                            <v-col cols="12">
                                <div class="sequencer-status">
                                    <p class="text-caption ma-0">Held Notes: {{ arpHeldNotes }}</p>
                                </div>
                            </v-col>
                        </v-row>

                    </div>
                    <!--Arpeggiator end-->
                </v-col>

            </v-row>
        </v-col>

        <v-col
        cols="4"
        class="d-flex justify-center">
            <livid-ohm-rgb-grid-only
            :hardware_interface="hardware_interface"
            :labels="labels"
            v-model:note-in="noteIn"
            v-model:selected="selected"
            ></livid-ohm-rgb-grid-only>
        </v-col>

        <v-col
        cols="4"
        >

            <v-row>

                <v-col
                cols="6"
                >
                    <!--Sequencer-->
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
                    <!--Sequencer end-->
                </v-col>

                <v-col
                cols="6"
                >
                    <!--Transpose buttons-->
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
                    <!--Transpose buttons end-->

                    <!--Note history-->
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
                    <!--Note history end-->
                </v-col>

            </v-row>

        </v-col>

    </v-row>

</template>

<script>
import LividOhmRGBGridOnly from './LividOhmRGBGridOnly'

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
            ],
            // Arpeggiator data
            arpActive: false,
            arpMode: 'up',
            arpModeOptions: [
                { label: 'Up', value: 'up' },
                { label: 'Down', value: 'down' },
                { label: 'Up/Down', value: 'updown' },
                { label: 'Down/Up', value: 'downup' },
                { label: 'Random', value: 'random' },
                { label: 'As Played', value: 'asplayed' },
            ],
            arpRate: '1/16',
            arpRateOptions: [
                { label: '1/4 Note', value: '1/4' },
                { label: '1/8 Note', value: '1/8' },
                { label: '1/16 Note', value: '1/16' },
                { label: '1/32 Note', value: '1/32' },
                { label: '1/8 Triplet', value: '1/8t' },
                { label: '1/16 Triplet', value: '1/16t' },
            ],
            arpOctaves: 1,
            arpGateLength: 80,
            arpHeldNotes: 0,
            // Chord Generator data
            chordGenActive: false,
            chordType: 'major',
            chordTypeOptions: [
                { label: 'Major', value: 'major' },
                { label: 'Minor', value: 'minor' },
                { label: 'Diminished', value: 'diminished' },
                { label: 'Augmented', value: 'augmented' },
                { label: 'Major 7th', value: 'major7' },
                { label: 'Minor 7th', value: 'minor7' },
                { label: 'Dominant 7th', value: 'dominant7' },
                { label: 'Sus2', value: 'sus2' },
                { label: 'Sus4', value: 'sus4' },
                { label: 'Major 6th', value: 'major6' },
                { label: 'Minor 6th', value: 'minor6' },
                { label: 'Diminished 7th', value: 'dim7' },
                { label: 'Half Diminished', value: 'halfDim7' },
            ],
            chordVoicing: 'root',
            chordVoicingOptions: [
                { label: 'Root Position', value: 'root' },
                { label: '1st Inversion', value: 'first' },
                { label: '2nd Inversion', value: 'second' },
                { label: '3rd Inversion', value: 'third' },
                { label: 'Drop 2', value: 'drop2' },
                { label: 'Drop 3', value: 'drop3' },
            ],
            chordVelocity: 100,
            chordActiveNotes: 0
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

    mounted() {
        window.addEventListener('midiNoteOn', this.handleMidiNote);
    },

    beforeUnmount() {
        window.removeEventListener('midiNoteOn', this.handleMidiNote);
    },
    
    methods: {
        handleMidiNote(event) {
            this.noteIn = event.detail.note;
        },

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
        },

        // Arpeggiator methods
        toggleArpeggiator() {
            this.arpActive = !this.arpActive;
            
            if (this.arpActive) {
                console.log('Arpeggiator ON');
                this.controller.arpeggiator.start({
                    mode: this.arpMode,
                    rate: this.arpRate,
                    octaves: this.arpOctaves,
                    gateLength: this.arpGateLength,
                    tempo: this.tempo
                });
            } else {
                console.log('Arpeggiator OFF');
                this.controller.arpeggiator.stop();
                this.arpHeldNotes = 0;
            }
        },

        updateArpHeldNotes(count) {
            this.arpHeldNotes = count;
        },

        // Chord Generator methods
        toggleChordGenerator() {
            this.chordGenActive = !this.chordGenActive;
            
            if (this.chordGenActive) {
                console.log('Chord Generator ON');
                this.controller.chordGenerator.start({
                    type: this.chordType,
                    voicing: this.chordVoicing,
                    velocity: this.chordVelocity
                });
            } else {
                console.log('Chord Generator OFF');
                this.controller.chordGenerator.stop();
                this.chordActiveNotes = 0;
            }
        },

        updateChordActiveNotes(count) {
            this.chordActiveNotes = count;
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

        noteIn(newVal, oldVal){
            console.log('************ MultiController noteIn watcher triggered ************');
            console.log('oldVal:', oldVal);
            console.log('newVal:', newVal);
            console.log('this.note computed:', this.note);
            console.log('Current noteHistory:', this.noteHistory);
            
            if(newVal !== null && newVal !== undefined && newVal !== ''){
                console.log('Condition passed - updating history');
                this.noteHistory.pop();
                this.noteHistory.unshift(this.note);
                console.log('Updated noteHistory:', this.noteHistory);
            } else {
                console.log('Condition FAILED - not updating');
            }
        },

        arpMode(newMode) {
            if (this.arpActive) {
                this.controller.arpeggiator.setMode(newMode);
            }
        },

        arpRate(newRate) {
            if (this.arpActive) {
                this.controller.arpeggiator.setRate(newRate, this.tempo);
            }
        },

        arpOctaves(newOctaves) {
            if (this.arpActive) {
                this.controller.arpeggiator.setOctaves(newOctaves);
            }
        },

        arpGateLength(newGate) {
            if (this.arpActive) {
                this.controller.arpeggiator.setGateLength(newGate);
            }
        },

        tempo(newTempo) {
            if (this.arpActive) {
                this.controller.arpeggiator.setRate(this.arpRate, newTempo);
            }
        },

        chordType(newType) {
            if (this.chordGenActive) {
                this.controller.chordGenerator.setChordType(newType);
            }
        },

        chordVoicing(newVoicing) {
            if (this.chordGenActive) {
                this.controller.chordGenerator.setVoicing(newVoicing);
            }
        },

        chordVelocity(newVelocity) {
            if (this.chordGenActive) {
                this.controller.chordGenerator.setVelocity(newVelocity);
            }
        }
    },

    components: {
        'livid-ohm-rgb-grid-only' : LividOhmRGBGridOnly
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