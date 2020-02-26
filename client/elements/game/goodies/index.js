import anime from 'animejs/lib/anime.es.js'
import { Math } from 'three'

class Goodie {
    constructor({ index = 0, game = null, bag = 5, model = 'MazeEgg1', position = { x: 1, y: 1 } }){
        this.index = index
        this.game = game
        this.renderer = this.game.renderer
        this.maze = this.game.maze
        this.player = this.game.player

        if(this.index % 2 == 0){
            model = 'MazeEgg2'
        }
        
        this.bag = bag
        this.position = position
        this.model = model

        this.scale = 1

        this.disabled = false
        this.visual = this.renderer.Instantiate(this.model, position)
        this.visual.scale.x = this.scale
        this.visual.scale.y = this.scale
        this.visual.scale.z = this.scale
    }

    Update(){
        if(this.disabled) return 

        let playerPosition = this.player.position

        if(this.position.x == playerPosition.x && this.position.z == playerPosition.y){
            if(!this.disabled) this.Catch()
        }

        let tween = {
            rotation: 0
        }

        anime({
            targets: tween,
            rotation: 90,
            duration: this.player.config.moveTime,
            update: () => {
                if(this.disabled) return
                this.visual.rotateY(Math.degToRad(1))
            }
        })
       
    }

    Catch(){
        this.disabled = true
        this.game.GetPoints({ points: this.bag })

        let tween = {
            y: this.position.y,
            scale: this.scale
        }

        anime({
            targets: tween,
            y: 25,
            scale: 0.01,
            duration: 600,
            easing: 'easeOutElastic',
            update: () => {
                this.visual.position.y = tween.y
                this.visual.scale.x = tween.scale
                this.visual.scale.y = tween.scale
                this.visual.scale.z = tween.scale
            },
            complete: () => {
                this.renderer.scene.remove(this.visual)
            }
        })

    }
}

class Goodies {
    constructor({ game, config }){
        this.game = game
        this.config = config
        this.player = this.game.player
        this.renderer = this.game.renderer
        this.maze = this.game.maze

        this.goodies = []
    }

    Place(){
        console.log('PLACE GOODIES')

        let shuffledWalkables = this.maze.rg
            .shuffle(this.maze.Walkables).filter((cell) => {
                return cell.x != this.player.position.x && cell.y != this.player.position.z
            })
            .slice(0, this.config.count)
        
        for(let i = 0; i < shuffledWalkables.length; i++){
            let cell = shuffledWalkables[i]

            let bag = 1

            if(i > 10){
                bag = 2
            }

            if(i > 20){
                bag = 4
            }

            if(i > 30){
                bag = 8
            }

            if(i > 40){
                bag = 16
            }

            this.goodies.push(new Goodie({
                index: i,
                game: this.game,
                bag: bag,
                position: {
                    x: cell.x,
                    y: 0,
                    z: cell.y
                }
            }))
        }
    }

    Update(){
        for(let i = 0; i < this.goodies.length; i++){
            this.goodies[i].Update()
        }
    }
}

export default Goodies