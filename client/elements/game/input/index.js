class Input {
    constructor(){
        this.currentMove = null
        this.nextMove = null
    }

    Start(){
        addEventListener('keydown', (e) => {
            this.OnKey(e.key, e.code)  
        })
    }

    OnKey(key, code){
        let nextMove = null

        if(key == 'a' || key == 'ArrowLeft') nextMove = 'left'
        if(key == 'd' || key == 'ArrowRight') nextMove = 'right'

        if(key == 'w' || key == 'ArrowUp') nextMove = 'up'
        if(key == 's' || key == 'ArrowDown') nextMove = 'down'

        if(nextMove) this.SetNextMove(nextMove)
    }

    SetNextMove(nextMove){
        this.nextMove = nextMove
        if(this.currentMove == null) this.currentMove = nextMove
    }

}

export default Input