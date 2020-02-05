import chance from 'chance'

import Sleep from '../utils/Sleep'
import MazeCell from './MazeCell'

class Maze {
    constructor(config = { width: 40, height: 50, cell: { dimension: 20 }, seed: 'DasPeTe' }){
        this.config = config

        this.cells = []
        this.walkables = []

        this.rg = new chance(this.config.seed)
    }

    get Walkables(){ return this.cells.filter((cell) => { return cell.Walkable == true }) }
    get NonWalkables(){ return this.cells.filter((cell) => { return cell.Walkable == false }) }

    GenerateMaze(startX, startY){
        // initialize maze field
        this.cells = []

        for(let y = 0; y < this.config.height; y++){
            for(let x = 0; x < this.config.width; x++){
                this.cells.push(new MazeCell({ x, y, walkable: false }))
            }
        }

        const cell = this.GetCell(startX, startY)
        cell.Walkable = true

        this.DigMaze(startX, startY)

        const nonWalkables = this.rg.shuffle(this.NonWalkables.filter((cell) => { return cell.x > 0 && cell.x < this.config.width - 1 && cell.y > 0 && cell.y < this.config.height - 1 }))
        for(let i = 0; i < 30; i++){
            nonWalkables[i].Walkable = true
        }
    }

    DigMaze(x, y){
        const directions = this.rg.shuffle([1, 2, 3, 4])
        
        for(let i = 0; i < directions.length; i++){
            switch(directions[i]){
                case 1:
                    if(y - 2 <= 0) continue

                    if(!this.GetCell(x, y - 2).Walkable){
                        this.GetCell(x, y - 2).Walkable = true
                        this.GetCell(x, y - 1).Walkable = true

                        this.DigMaze(x, y - 2)
                    }
                    break
                case 2:
                    if(x - 2 <= 0) continue

                    if(!this.GetCell(x - 2, y).Walkable){
                        this.GetCell(x - 2, y).Walkable = true
                        this.GetCell(x - 1, y).Walkable = true

                        this.DigMaze(x - 2, y)
                    }
                    break
                case 3:
                    if(x + 2 > this.config.width - 1) continue

                    if(!this.GetCell(x + 2, y).Walkable){
                        this.GetCell(x + 2, y).Walkable = true
                        this.GetCell(x + 1, y).Walkable = true

                        this.DigMaze(x + 2, y)
                    }
                    break
                case 4:
                    if(y + 2 > this.config.height - 1) continue

                    if(!this.GetCell(x, y + 2).Walkable){
                        this.GetCell(x, y + 2).Walkable = true
                        this.GetCell(x, y + 1).Walkable = true

                        this.DigMaze(x, y + 2)
                    }
                break
            }
        }
    }

    GetCell(x, y){
        return this.cells.find((cell) => {
            return cell.x == x && cell.y == y
        })
    }


}

export default Maze