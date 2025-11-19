<template>



    <div
    >
        <!--<div>

            <p
            @click="showProps"
            >Show props</p>

        </div>-->


        <div
        class="input_group"
        v-for="row in rows"
        :key="row"
        >

            <span
            class="input-container"
            v-for="column in cols"
            :key="inputs[((row - 1) * cols) + column - 1].id"
            >

                <knob

                :input="inputs[((row - 1) * cols) + column - 1]"
                ></knob>

            </span>

        </div>


    </div>

</template>

<script>
import Knob from './Knob.vue'

export default {
    props : {
        inputs: {
            type: Array,
            default() {
                return []
            }
        },

        rows: {
            type: Number,
            default: 0
        },

        cols: {
            type: Number,
            default: 0
        },
    },

    methods: {
       showProps() {
            console.log({
                'inputs' : this.inputs,

            });
        }
    }
}
</script>