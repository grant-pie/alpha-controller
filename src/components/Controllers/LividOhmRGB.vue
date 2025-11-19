<template>

   <div
    class="hardware_interface"
    >

        <div
        class="hardware_interface-column  mr-2"
        >

            <div
            class="mb-4"
            >

                <knob-group
                :rows="3"
                :cols="4"
                :inputs="hardware_interface.getAnalogInputsByGroup('leftKnobs')"
                ></knob-group>

            </div>

            <div
            class="mb-4"
            >

                <slider-group
                :inputs="hardware_interface.getAnalogInputsByGroup('leftFaders')"
                ></slider-group>

            </div>

            <div>

                <button-group
                :rows="1"
                :cols="4"
                :inputs="hardware_interface.getDigitalInputsByGroup('leftFaders')"
                :outputs="hardware_interface.getDigitalOutputsByGroup('leftFaders')"
                ></button-group>

            </div>

        </div>

        <div
        class="hardware_interface-column"
        >

            <div
            class="mb-4 mt-4"
            >

                <button-group
                size="small"
                :rows="8"
                :cols="8"
                :labels="labels"
                :inputs="hardware_interface.getDigitalInputsByGroup('grid')"
                :outputs="hardware_interface.getDigitalOutputsByGroup('grid')"
                :selected.sync="selected"
                v-model:selected="selected"
                v-model:note-in="noteIn"
                ></button-group>

            </div>

            <div
            class="d-flex justify-center input-group"
            >

                <div class="input-container">

                    <btn
                    :input="hardware_interface.getDigitalInputsByGroup('crossfader')[0]"
                    :output="hardware_interface.getDigitalOutputsByGroup('crossfader')[0]"

                    ></btn>

                </div>

                <div class="input-container">

                    <slider
                    :input="hardware_interface.getAnalogInputsByGroup('crossfader')[0]"
                    horizontal
                    ></slider>

                </div>

                <div class="input-container">

                    <btn
                    :input="hardware_interface.getDigitalInputsByGroup('crossfader')[1]"
                    :output="hardware_interface.getDigitalOutputsByGroup('crossfader')[1]"
                    ></btn>

                </div>
            </div>

        </div>

        <div
        class="input-container ml-2"
        >

            <div class="d-flex mb-4">

                <button-group
                :size="'stretch'"
                :rows="3"
                :cols="2"
                :layout="'columns'"
                :inputs="hardware_interface.getDigitalInputsByGroup('function')"
                :outputs="hardware_interface.getDigitalOutputsByGroup('function')"
                ></button-group>

                <div class="input-container mx-auto">

                    <btn
                    class="mx-auto mt-1"
                    :input="hardware_interface.getDigitalInputsByGroup('bpm')[0]"
                    :output="hardware_interface.getDigitalOutputsByGroup('bpm')[0]"
                    ></btn>

                </div>

            </div>

            <div
            class="mb-7 mt-8"
            >

                <knob-group
                :rows="1"
                :cols="4"
                :inputs="hardware_interface.getAnalogInputsByGroup('rightKnobs')"
                ></knob-group>

            </div>

            <div
            class="mb-4"
            >

                <slider-group
                :inputs="hardware_interface.getAnalogInputsByGroup('rightFaders')"
                ></slider-group>

            </div>

            <div
            class="mb-4"
            >

                <button-group
                :rows="1"
                :cols="4"
                :inputs="hardware_interface.getDigitalInputsByGroup('rightFaders')"
                :outputs="hardware_interface.getDigitalOutputsByGroup('rightFaders')"
                ></button-group>

            </div>

        </div>

    </div>


</template>

<script>
import ButtonGroup from '../ButtonGroup.vue'
import KnobGroup from '../KnobGroup.vue'
import SliderGroup from '../SliderGroup.vue'
import Btn from '../Button.vue';
import Slider from '../Slider.vue';

export default {

    data(){
        return {
            noteIn : '',
            selected: null,
            previouslySelectedInput: null,
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

        labels : {
            type: String,
            default: 'none'
        }
    },

     watch : {
        noteIn(){
            this.$emit('update:noteIn', this.noteIn);
        },

        selected(input) {

            if(this.previouslySelectedInput != null){
                this.previouslySelectedInput.selected = false;
            }

            this.previouslySelectedInput = input;

            this.selected.selected = !this.selected.selected;

            this.$emit('update:selected', this.selected);

        }
    },


    methods :{
        showHardwareInterface() {
            console.log({
                'gridInputs' : this.hardware_interface.getDigitalInputsByGroup('grid'),
                'gridOutputs' : this.hardware_interface.getDigitalOutputsByGroup('grid')
            })

        }
    },

    components: {
        'button-group' : ButtonGroup,
        'knob-group' : KnobGroup,
        'slider-group' : SliderGroup,
        'btn' : Btn,
        'slider' : Slider
    }
}


</script>
