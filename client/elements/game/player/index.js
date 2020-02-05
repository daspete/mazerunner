import anime from 'animejs/lib/anime.es.js'

import Input from '../input'


class Player {
    constructor({ maze, renderer, position, game }){
        this.maze = maze
        this.renderer = renderer
        this.position = position
        this.game = game

        this.moveTime = 240
        this.lastMove = new Date().getTime()

        this.visual = this.renderer.Instantiate('player', { x: this.position.x, y: this.position.y })
        this.SetCameraPosition()
        this.input = new Input()

        this.animation = null
    }

    Start(){
        this.input.Start()
    }

    Update(){
        this.Move()




        // console.log(nextCell)
        // console.log(direction)
        // this.renderer.camera.lookAt(this.position.x * 10, 0, this.position.y * 10)
    }

    SetCameraPosition(){
        this.renderer.camera.position.y = 50
        this.renderer.camera.position.x = this.visual.position.x - 30
        this.renderer.camera.position.z = this.visual.position.z + 50
        this.renderer.camera.lookAt(this.visual.position.x, 0, this.visual.position.z)
    }

    GetCell(x, y){
        let nextCell = this.maze.GetCell(this.position.x + x, this.position.y + y)
        return nextCell?.Walkable
    }

    IsMovable(move){
        switch(move){
            case 'up': return !!this.GetCell(0, -1)
            case 'down': return !!this.GetCell(0, 1)
            case 'left': return !!this.GetCell(-1, 0)
            case 'right': return !!this.GetCell(1, 0)
        }

        return false
    }

    Move(){
        if(new Date().getTime() - this.lastMove <= this.moveTime) return
        
        let direction = { x: 0, y: 0 }


        let currentMove = this.input.currentMove
        let nextMove = this.input.nextMove

        
        let move = null

        if(this.IsMovable(nextMove)){
            this.input.currentMove = currentMove = nextMove
            move = currentMove
        }

        if(this.IsMovable(currentMove)){
            this.input.currentMove = currentMove
            move = currentMove
        }

        switch(move){
            case 'up': direction.y = -1; break
            case 'down': direction.y = 1; break
            case 'left': direction.x = -1; break
            case 'right': direction.x = 1; break
            default: direction = { x: 0, y: 0 }
        }

        this.position.x += direction.x
        this.position.y += direction.y

        let position = {
            x: this.visual.position.x,
            z: this.visual.position.z
        }

        let jumpPosition = {
            y: 0
        }

        if(direction.x != 0 || direction.y != 0){
            anime({
                targets: jumpPosition,
                y: 2,
                direction: 'alternate',
                easing: 'easeOutBounce',
                duration: this.moveTime * 0.5 - 50,
                update: () => {
                    this.visual.position.y = jumpPosition.y

                    let scale = jumpPosition.y * 0.5 + 1

                    this.visual.scale.y = 1 + (scale * 0.1)
                }  
            })
        }

        anime({
            targets: position,
            x: this.position.x * this.renderer.scale,
            z: this.position.y * this.renderer.scale,
            duration: this.moveTime - 50,
            easing: 'easeInOutSine',
            update: () => {
                this.visual.position.x = position.x
                this.visual.position.z = position.z
                this.SetCameraPosition()
            }
        })

        this.lastMove = new Date().getTime()
    }


}

export default Player