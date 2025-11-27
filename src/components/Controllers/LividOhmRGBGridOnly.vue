<template>

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

</template>

<script>
import ButtonGroup from '../ButtonGroup.vue'

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
    }
}


</script>
