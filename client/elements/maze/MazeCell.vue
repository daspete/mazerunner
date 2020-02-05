<template>
    <div :class="CellClasses" :style="CellStyles"></div>
</template>

<script>
export default {
    props: {
        x: Number,
        y: Number,
        isWalkable: Boolean,
        visible: Boolean,
        dimension: Number
    },

    computed: {
        CellStyles(){
            return {
                top: `${ this.y * this.dimension }px`,
                left: `${ this.x * this.dimension }px`,
                width: `${ this.dimension }px`,
                height: `${ this.dimension }px`
            }
        },

        CellClasses(){
            let classes = ['maze__cell']
            if(this.isWalkable && this.visible) classes.push('maze__cell--walkable')
            if(this.isWalkable && !this.visible) classes.push('maze__cell--not-walkable')
            if(!this.isWalkable) classes.push('maze__cell--not-walkable')
            

            return classes
        }
    }
}
</script>

<style lang="scss">
.maze {
    &__cell {
        font-size: 6px;
        position: absolute;
        box-shadow: inset 2px 2px 5px rgba(black, 0.15);

        &--walkable {
            background-color: green;
        }

        &--not-walkable {
            background-color: brown;
        }
    }
}
</style>