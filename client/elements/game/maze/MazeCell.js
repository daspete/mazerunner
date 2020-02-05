class MazeCell {
    constructor({ x, y, walkable }){
        this.x = x
        this.y = y
        this.walkable = walkable
    }

    get Walkable(){ return this.walkable }
    set Walkable(value){ this.walkable = value }
}

export default MazeCell