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
        this.cells = []

        for(let y = 0; y < this.config.height; y++){
            for(let x = 0; x < this.config.width; x++){
                this.cells.push(new MazeCell({ x, y, walkable: false }))
            }
        }

        const cell = this.GetCell(startX, startY)
        cell.Walkable = true

        this.DigMaze(startX, startY)

        let bridges = 16
        const cells = this.rg.shuffle([...this.Walkables])

        for(let i = 0; i < bridges; i++){
            let _cell = cells.find((__cell) => {
                let topNeighbor = this.GetCell(__cell.x, __cell.y - 1)
                let bottomNeighbor = this.GetCell(__cell.x, __cell.y + 1)
                let leftNeighbor = this.GetCell(__cell.x - 1, __cell.y)
                let rightNeighbor = this.GetCell(__cell.x + 1, __cell.y)

                let neighbors = 0
                if(topNeighbor && topNeighbor.Walkable) neighbors++
                if(bottomNeighbor && bottomNeighbor.Walkable) neighbors++
                if(leftNeighbor && leftNeighbor.Walkable) neighbors++
                if(rightNeighbor && rightNeighbor.Walkable) neighbors++

                if(neighbors == 1) return true

                return false
            })

            if(!_cell){
                i = bridges
                break
            }

            
            let direction = this.rg.shuffle(['top', 'left', 'right', 'bottom'])
            
            let cell = null
            let run = 0

            while(!cell && run < 4){
                let x = _cell.x
                let y = _cell.y

                if(direction[run] == 'top') cell = this.GetCell(x, y - 1)
                if(direction[run] == 'bottom') cell = this.GetCell(x, y + 1)
                if(direction[run] == 'top') cell = this.GetCell(x - 1, y)
                if(direction[run] == 'top') cell = this.GetCell(x + 1, y)

                run++
            }

            if(!(cell && cell.Walkable)){
                if(cell) cell.Walkable = true
            }
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
        // if(x < 1 || y < 1 || x > this.config.width - 1 || y > this.config.height - 1) return false
        return this.cells.find((cell) => {
            return cell.x == x && cell.y == y
        })
    }


}

export default Maze