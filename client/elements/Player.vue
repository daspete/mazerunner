<template>
    <div class="player" :style="PlayerStyles"></div>
</template>

<script>
export default {
    props: {
        x: Number,
        y: Number,
    },

    computed: {
        PlayerStyles(){
            return {
                top: `${ this.y * this.$root.$maze.cellDimension }px`,
                left: `${ this.x * this.$root.$maze.cellDimension }px`,
                width: `${ this.$root.$maze.cellDimension }px`,
                height: `${ this.$root.$maze.cellDimension }px`
            }
        }
    },

    mounted(){
        console.log(this.$root.$maze)
    }
}
</script>

<style lang="scss">
.player {
    border-radius: 50%;
    position: absolute;
    background-color: black;
}
</style>