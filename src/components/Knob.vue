<template>

    <div
    class="knob"
    :style=" 'transform: rotate(' + mappedValue + 'deg);'"
    @click="showInput"
    >

        <div
        class="knob-indicator"

        ></div>


    </div>

</template>

<script>
export default {
    props: {
        input : {
            type: Object,
            default() {
                return {
                    value: 0
                }
            }
        }
    },

    created() {
        Number.prototype.map = function (in_min, in_max, out_min, out_max) {
            return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        }
    },
    computed: {
        mappedValue(){
            if(this.input.value != undefined){

                return this.input.value.map(0, 127, -150, 150)

            } else {
                return 0;
            }
            console.log({
                'knob_input' : this.input
            });

        }
    },

    methods: {
        showInput(){
            console.log(this.input)
        }
    }
}
</script>

<style scoped>

.knob   {
    display: inline-block;
    border: solid 2px #b8b8b8;

    width: 50px;
    height: 50px;
    border-radius: 100%;


}

.knob-indicator {
    box-sizing: border-box;
    width: calc(50% + 2px);
    height: 50%;
    border-right: solid 5px #b8b8b8;
}

</style>