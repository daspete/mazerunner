import chance from 'chance'

import Sleep from '../utils/Sleep'
import MazeCell from './MazeCell'

class Maze {
    constructor(config = { width: 40, height: 50, seed: 'DasPeTe' }){
        this.config = config

        this.cells = []
        this.bridges = []

        this.rg = new chance(this.config.seed)
    }

    get Walkables(){ return this.cells.filter((cell) => { return cell.Walkable == true }) }
    get NonWalkables(){ return this.cells.filter((cell) => { return cell.Walkable == false }) }

    GenerateMaze(){
        const startX = this.config.start.x
        const startY = this.config.start.y

        this.cells = []

        for(let y = 0; y < this.config.height; y++){
            for(let x = 0; x < this.config.width; x++){
                this.cells.push(new MazeCell({ x, y, walkable: false }))
            }
        }

        const cell = this.GetCell(startX, startY)
        cell.Walkable = true

        this.DigMaze(startX, startY)

        const cells = this.rg.shuffle([...this.Walkables])

        this.bridges = []

        for(let i = 0; i < this.config.bridges; i++){
            // get the next cell which has just one neighbor to build a bridge
            let nextBridgableCell = cells.find((__cell) => {
                // get all neighbors
                let topNeighbor = this.GetCell(__cell.x, __cell.y - 1)
                let bottomNeighbor = this.GetCell(__cell.x, __cell.y + 1)
                let leftNeighbor = this.GetCell(__cell.x - 1, __cell.y)
                let rightNeighbor = this.GetCell(__cell.x + 1, __cell.y)

                // count the walkable neighbors
                let neighbors = 0
                if(topNeighbor && topNeighbor.Walkable) neighbors++
                if(bottomNeighbor && bottomNeighbor.Walkable) neighbors++
                if(leftNeighbor && leftNeighbor.Walkable) neighbors++
                if(rightNeighbor && rightNeighbor.Walkable) neighbors++

                // only get cell, when it has just one neighbor
                if(neighbors == 1) return true

                return false
            })

            if(!nextBridgableCell){
                i = this.config.bridges
                break
            }

            
            let direction = this.rg.shuffle(['top', 'left', 'right', 'bottom'])
            
            let bridge = null
            let run = 0

            while(!bridge && run < 4){
                let x = nextBridgableCell.x
                let y = nextBridgableCell.y

                if(direction[run] == 'top') bridge = this.GetCell(x, y - 1)
                if(direction[run] == 'bottom') bridge = this.GetCell(x, y + 1)
                if(direction[run] == 'left') bridge = this.GetCell(x - 1, y)
                if(direction[run] == 'right') bridge = this.GetCell(x + 1, y)

                run++
            }

            if(!(bridge && bridge.Walkable)){
                if(bridge){
                    bridge.Walkable = true
                    this.bridges.push(bridge)
                }
            }
        }
    }

    DigMaze(x, y){
        const directions = this.rg.shuffle([1, 2, 3, 4])
        
        for(let i = 0; i < directions.length; i++){
            switch(directions[i]){
                // up
                case 1:
                    if(y - 2 <= 0) continue

                    if(!this.GetCell(x, y - 2).Walkable){
                        this.GetCell(x, y - 2).Walkable = true
                        this.GetCell(x, y - 1).Walkable = true

                        this.DigMaze(x, y - 2)
                    }
                break

                // down
                case 4:
                    if(y + 2 > this.config.height - 1) continue

                    if(!this.GetCell(x, y + 2).Walkable){
                        this.GetCell(x, y + 2).Walkable = true
                        this.GetCell(x, y + 1).Walkable = true

                        this.DigMaze(x, y + 2)
                    }
                break
                
                // left
                case 2:
                    if(x - 2 <= 0) continue

                    if(!this.GetCell(x - 2, y).Walkable){
                        this.GetCell(x - 2, y).Walkable = true
                        this.GetCell(x - 1, y).Walkable = true

                        this.DigMaze(x - 2, y)
                    }
                break
                
                //right
                case 3:
                    if(x + 2 > this.config.width - 1) continue

                    if(!this.GetCell(x + 2, y).Walkable){
                        this.GetCell(x + 2, y).Walkable = true
                        this.GetCell(x + 1, y).Walkable = true

                        this.DigMaze(x + 2, y)
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