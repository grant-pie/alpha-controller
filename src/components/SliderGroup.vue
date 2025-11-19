<template>



    <div
    class="input-group"
    >
        <!--<div>

            <p
            @click="showProps"
            >Show props</p>

        </div>-->

        <div
        class="input-container"
        v-for="input in inputs"
        :key="input.id"
        >
            <slider

            :input="input"
            ></slider>

        </div>




    </div>

</template>

<script>
import Slider from './Slider.vue'

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
    },

    components: {
        'slider' : Slider
    }
}
</script>