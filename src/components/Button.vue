<template>
    <!-- :style="selected ? 'border-color: blue;' : 'border-color: blue;'"-->

    <div
    :class="'btn ' + computedSize"
    :style="selected ? 'border-color: blue;' : 'border-color: #b8b8b8;'"
    @click="showProps"
    >

        <div
        class="led d-flex justify-center align-center"
        :style="!output.r.value && !output.g.value && !output.b.value ? '' : 'background-color:rgb(' + (output.r.value ? '255' : '0') + ', ' +  (output.g.value ? '255' : '0') +', ' +  (output.b.value ? '255' : '0') + ')' "
        >

            <div
            class="test pa-0 ma-0 text-caption"

            v-text="computedLabel"
            ></div>

        </div>


    </div>

</template>

<script>
//

export default{



    props: {
        input : {
            type: Object,
            default: {
                selected: false
            }
        },

        output : {
            type: Object,
            default: null
        },

        size : {
            type: String,
            default: 'large'
        },

        label : {
            type: String,
            default: 'none'
        },

        selected:{
            type: Boolean,
            default: false
        }
    },

    watch: {
        output: {
            deep: true,
            handler(newVal, oldVal) {
                if(this.input.group === 'grid'){
                    // Check if LED just turned on (was off, now on)
                    const wasOff = !oldVal || (!oldVal.r.value && !oldVal.g.value && !oldVal.b.value);
                    const isOn = newVal.r.value || newVal.g.value || newVal.b.value;
                    
                    if(wasOff && isOn){
                        this.$emit('update:noteIn', this.input.MIDI_value);
                    }
                }
            }
        },
    },

    computed : {
        computedSize() {
            if(this.size === 'small'){
                return 'btn--small'
            }

            if(this.size === 'stretch'){
                return 'btn--stretch'
            }

            return 'btn--large'
        },

        note() {
            const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',];
            const octave = Math. trunc(this.input.MIDI_value / 12) - 1;
            const note = notes[this.input.MIDI_value - 12 * (octave + 1)];
            return note + ' ' + octave;
        },

        computedLabel() {
            if(this.label === 'ids'){
                return this.input.id;
            }

            if(this.label === 'notes'){
                return this.note;
            }

            return '';
        }

    },

    methods: {
        showProps() {


            console.log({
                'input' : this.input,
                'output' : this.output,
                'size' : this.size,
                'note' : this.note,
                'selected': this.selected
            });

        },

    },




}
</script>

<style scoped>

    .btn    {
        display: inline-block;
        border: solid 2px #b8b8b8;
        border-radius: 15%;
        box-sizing: border-box;
    }

    .btn--small{
        width: 40px;
        height: 40px;
    }

    .btn--large{
        width: 50px;
        height: 50px;
    }

    .btn--stretch{
        width: 40px;
        height: 25px;
    }

    .led {

        width: 100%;
        height: 100%;

    }

    .led--b{
        background-color: blue;
    }

    .led--g{
        background-color: green;
    }

    .led--r{
        background-color: red;
    }
</style>