<template>

    <div
    class="input-group"
    >


            <!--<p
            @click="showProps"
            >Show props</p>-->

        <div
        v-if="layout === 'rows'"
        >
            <div
            v-for="row in rows"
            :key="row"
            >

                <div
                class="input-container"
                v-for="column in cols"
                :key="inputsWithKeys[((row - 1) * cols) + column - 1].id"
                @click="selected = inputsWithKeys[((row - 1) * cols) + column - 1]"
                >


                    <btn
                    :label="labels"
                    :selected="inputsWithKeys[((row - 1) * cols) + column - 1].selected"
                    :size="size"
                    :input="inputsWithKeys[((row - 1) * cols) + column - 1]"
                    :output="outputs[inputsWithKeys[((row - 1) * cols) + column - 1].key]"
                    v-model:note-in="noteIn"
                    ></btn>

                </div>


            </div>

        </div>

        <div
        v-else
        >

            <div
            v-for="column in cols"
            :key="column"
            >

                <div
                class="input-container"
                v-for="row in rows"
                :key="inputsWithKeys[((row - 1) * cols) + column - 1].id"
                >

                    <btn
                        :label="labels"
                        :selected="inputsWithKeys[((row - 1) * cols) + column - 1].selected"
                        :size="size"
                        :input="inputsWithKeys[((row - 1) * cols) + column - 1]"
                        :output="outputs[inputsWithKeys[((row - 1) * cols) + column - 1].key]"
                        v-model:note-in="noteIn"
                    ></btn>

                </div>


            </div>

        </div>

    </div>

</template>

<script>


import Btn from './Button.vue'
export default {
    data(){
        return {
            noteIn : '',
            selected: null
        }
    },

    props: {
        inputs: {
            type: Array,
            default() {
                return {

                }
            }
        },

        outputs: {
            type: Array,
            default() {
                return {

                }
            }
        },

        rows: {
            type: Number,
            default: 1
        },

        cols: {
            type: Number,
            default: 1
        },

        layout:{
            type: String,
            default: 'rows'
        },

        size : {
            type: String,
            default: 'large'
        },

        labels : {
            type: String,
            default: 'none'
        }
    },

    watch : {
        selected(){
 
            this.$emit('update:selected', this.selected);
        }

    },
    /*
        TODO: Remember!!!! there are two different btn componenets that need to be changed once a new prop etc. has been added, this is very annoying and should be fixed.
    */
    computed: {
        inputsWithKeys () {
            let inputsWithKeys = [];

            for(let i = 0; i<= this.inputs.length - 1; i++){
                let input = this.inputs[i];
                input.key = i;

                inputsWithKeys.push(input);

            }

            return inputsWithKeys;
        }
    },

    methods : {
        showProps() {
            console.log({
                'inputs' : this.inputs,
                'outputs' : this.outputs,
                'layout' : this.layout
            });
        },


    },

    components: {
        'btn' : Btn
    }
}
</script>

