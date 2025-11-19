<template>

    <div
    :class="'slider-container ' +  (horizontal ? 'slider-container--horizontal' : 'slider-container--vertical')"
    @click="showInput"
    >

        <div
        :class="'slider ' + (horizontal ? 'slider--horizontal' : 'slider--vertical')"
        :style="'transform: ' +'translate' + (horizontal ? 'X' : 'Y') + '(' + mappedValue +'px)'"
        >

            <p
            v-if="showValue"
            class="text-caption text-center"
            v-text="input.value"
            ></p>

        </div>

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
        },

        showValue: {
            type: Boolean,
            default: false
        },

        horizontal: {
            type: Boolean,
            default: false
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

                return this.horizontal ? this.input.value.map(0, 127, 0, 176) : this.input.value.map(127, 0, 0, 176) //todo max val = container height - slider height

            }

            return 0

        },
    },

    methods: {
        showInput(){
            console.log(this.input)
        }
    }
}
</script>

<style scoped>

.slider-container   {
    display: inline-block;
    border: solid 2px #b8b8b8;

}

.slider-container--vertical   {
    width: 50px;
    height: 200px;
}

.slider-container--horizontal   {
    width: 200px;
    height: 50px;
}

.slider{
    background-color: #b8b8b8;
    color: white;
}

.slider--vertical{
    width: 100%;
    height: 10%;
}

.slider--horizontal{
    width: 10%;
    height: 100%;
}

</style>