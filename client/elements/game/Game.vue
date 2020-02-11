<template>
    <div class="container">
        <div style="color: white">{{ points }}</div>
        <div class="game" ref="game"></div>
        <div class="input">
            <button class="input__button input__button--left" @click="SetDirection('left')">left</button>
            <button class="input__button input__button--up" @click="SetDirection('up')">up</button>
            <button class="input__button input__button--down" @click="SetDirection('down')">down</button>
            <button class="input__button input__button--right" @click="SetDirection('right')">right</button>
        </div>    
    </div>
    
</template>

<script>
import gameConfig from './config/game'

import Maze from './maze'
import Renderer from './renderer'
import Player from './player'
import Goodies from './goodies'

export default {
    maze: null,
    renderer: null,
    player: null,

    data(){
        return {
            points: 0
        }
    },

    async mounted(){

        this.maze = new Maze(gameConfig.maze)
        this.maze.GenerateMaze()

        this.renderer = new Renderer({ width: 1280, height: 720, container: this.$refs.game, game: this})
        await this.renderer.CreateMaze(this.maze)

        this.player = new Player({
            game: this,
            config: gameConfig.player,
            maze: this.maze,
            renderer: this.renderer,
            position: { x: 1, y: 1 },
        })

        this.goodies = new Goodies({
            game: this,
            config: gameConfig.goodies
        })

        
        this.goodies.Place()
        this.renderer.Start()
        this.player.Start()
    },

    methods: {
        SetDirection(direction){
            if(!this.player) return
            if(!this.player.input) return
            this.player.input.SetNextMove(direction)
        },

        GetPoints({ points }){
            this.points += points
        }
    }
}
</script>

<style lang="scss">
.container {
    width: 1280px;
    height: 720px;
    margin: 0 auto;
    position: relative;
}

.input {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background-color: rgba(white, 0.5);
    box-shadow: 1px 2px 16px rgba(black, 0.16);
    width: 200px;
    height: 200px;
    border-radius: 100px;

    &__button {
        position: absolute;
        width: 60px;
        height: 60px;
        background-color: rgba(white, 0.5);
        border-radius: 30px;

        &--up {
            top: 10px;
            left: 50%;
            margin-left: -30px;
        }

        &--down {
            bottom: 10px;
            left: 50%;
            margin-left: -30px;
        }

        &--left {
            top: 50%;
            margin-top: -30px;
            left: 10px;
        }

        &--right {
            top: 50%;
            margin-top: -30px;
            right: 10px;
        }
    }
}

body {
    background-color: black;
}
</style>