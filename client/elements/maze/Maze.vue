<template>
    <div class="maze">
        {{ playerDirection }}
        <div class="maze__loader" v-if="!mazeReady">Maze is generating...</div>
        <div class="maze__field" :style="MazeFieldStyles" v-else>
            <MazeCell v-for="cell in cells" v-bind="{ ...cell, dimension: cellDimension }" :key="`mazecell-${ cell.y }-${ cell.x }`" />
            <Player :x="playerX" :y="playerY" />
        </div>
    </div>
</template>

<script>
import Chance from 'chance'

const sleep = async (time) => {
    return new Promise((resolve) => {
        setTimeout(() => { resolve() }, time)
    })
}

export default {
    props: {
        width: Number,
        height: Number,
        cellDimension: Number,
        seed: String,
    },

    data(){
        return {
            mazeReady: false,
            cells: [],
            walkables: [],
            rg: null,
            startX: 1,
            startY: 1,
            playerX: 1,
            playerY: 1,
            playerDirection: {
                x: 0,
                y: 0
            },
            lastMove: null,
            moveTime: 300
        }
    },

    computed: {
        MazeFieldStyles(){
            return {
                width: `${ this.width * this.cellDimension }px`,
                height: `${ this.height * this.cellDimension }px`
            }
        }  
    },

    async mounted(){
        this.$root.$maze = this
        this.lastMove = new Date().getTime()

        this.InitRandomGenerator()
        this.InitMaze()
        this.GenerateMaze()
        this.GetWalkableFields()

        this.mazeReady = true

        window.addEventListener('keypress', this.OnKeyDown)
        window.addEventListener('keyup', this.OnKeyUp)

        this.StartGame()
    },

    destroyed(){
        window.removeEventListener('keypress', this.OnKeyDown)
        window.removeEventListener('keyup', this.OnKeyUp)
    },

    methods: {
        async StartGame(){
            this.Update()
        },

        Update(){
            this.MovePlayer()

            requestAnimationFrame(() => { this.Update() })
        },

        InitRandomGenerator(){
            this.rg = new Chance(this.seed)
        },

        InitMaze(){
            this.digs = []

            for(let y = 0; y < this.height; y++){
                for(let x = 0; x < this.width; x++){
                    this.cells.push({ x, y, isWalkable: false, visible: true })
                }
            }
        },

        GenerateMaze(){
            let cell = this.GetCell(this.startX, this.startY)
            cell.isWalkable = true

            this.DigMaze(this.startX, this.startY)
        },

        DigMaze(x, y){
            let directions = [1, 2, 3, 4]
            directions = this.rg.shuffle(directions)
            
            for(let i = 0; i < directions.length; i++){
                switch(directions[i]){
                    case 1:
                        if(y - 2 <= 0) continue

                        if(!this.GetCell(x, y - 2).isWalkable){
                            this.GetCell(x, y - 2).isWalkable = true
                            this.GetCell(x, y - 1).isWalkable = true

                            this.DigMaze(x, y - 2)
                        }
                        break
                    case 2:
                        if(x - 2 <= 0) continue

                        if(!this.GetCell(x - 2, y).isWalkable){
                            this.GetCell(x - 2, y).isWalkable = true
                            this.GetCell(x - 1, y).isWalkable = true

                            this.DigMaze(x - 2, y)
                        }
                        break
                    case 3:
                        if(x + 2 > this.width - 1) continue

                        if(!this.GetCell(x + 2, y).isWalkable){
                            this.GetCell(x + 2, y).isWalkable = true
                            this.GetCell(x + 1, y).isWalkable = true

                            this.DigMaze(x + 2, y)
                        }
                        break
                    case 4:
                        if(y + 2 > this.height - 1) continue

                        if(!this.GetCell(x, y + 2).isWalkable){
                            this.GetCell(x, y + 2).isWalkable = true
                            this.GetCell(x, y + 1).isWalkable = true

                            this.DigMaze(x, y + 2)
                        }
                    break
                }
            }
        },

        GetWalkableFields(){
            this.walkables = this.cells.filter((cell) => {
                return cell.isWalkable == true
            })
        },


        GetCell(x, y){
            return this.cells.find((cell) => {
                return cell.x == x && cell.y == y
            })
        },

        OnKeyUp(e){
            switch(e.key){
                case 'a':
                case 'd':
                case 'ArrowLeft':
                case 'ArrowRight':
                    this.playerDirection.x = 0
                    break
                
                case 's':
                case 'w':
                case 'ArrowUp':
                case 'ArrowDown':
                    this.playerDirection.y = 0
                    break
            }
        },

        OnKeyDown(e){
            switch(e.key){
                case 'ArrowLeft':
                case 'a':
                    this.playerDirection.x = -1
                    break

                case 'ArrowRight':
                case 'd':
                    this.playerDirection.x = 1
                    break
                
                case 'ArrowUp':
                case 'w':
                    this.playerDirection.y = -1
                    break
                
                case 'ArrowDown':
                case 's':
                    this.playerDirection.y = 1
                    break
            }

            
        },

        MovePlayer(){
            let currentTime = new Date().getTime()

            if(currentTime - this.lastMove < this.moveTime) return

            if(this.playerDirection.x < 0 && this.playerX - 1 >= 0){
                if(this.GetCell(this.playerX - 1, this.playerY).isWalkable){
                    this.playerX--
                }
            }

            if(this.playerDirection.x > 0 && this.playerX + 1 < this.width - 1){
                if(this.GetCell(this.playerX + 1, this.playerY).isWalkable){
                    this.playerX++
                }
            }


            if(this.playerDirection.y < 0 && this.playerY - 1 >= 0){
                if(this.GetCell(this.playerX, this.playerY - 1).isWalkable){
                    this.playerY--
                }
            }

            if(this.playerDirection.y > 0 && this.playerY + 1 < this.height - 1){
                if(this.GetCell(this.playerX, this.playerY + 1).isWalkable){
                    this.playerY++
                }
            }

            this.lastMove = new Date().getTime()
        }
    }
}
</script>

<style lang="scss">
.maze {
    position: relative;

    &__field {
        margin: 0 auto;
        position: relative;
        box-shadow: 0 10px 30px rgba(black, 0.15);
    }
}
</style>