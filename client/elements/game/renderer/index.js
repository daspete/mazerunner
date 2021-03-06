import { 
    WebGLRenderer,
    Mesh,
    Scene,
    OrthographicCamera,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    DirectionalLight,
    Color,
    Vector3
} from 'three'

import { GLTFLoader } from '../utils/GLTFLoader'
import { DRACOLoader } from '../utils/DRACOLoader'

class Renderer {
    constructor(config = { width: 1280, height: 720 }){
        this.config = config
        this.maze = null
        this.game = config.game

        this.aspectRatio = this.config.width / this.config.height
        let frustumSize = 20
        this.scale = 10

        // this.camera = new OrthographicCamera(
        //     this.config.width / -frustumSize,
        //     this.config.width / frustumSize,
        //     this.config.height / frustumSize,
        //     this.config.height / -frustumSize, 
        //     -1000, 2000
        // )
        // this.camera.position.z = 20
        // this.camera.position.y = 10

        // this.camera.lookAt(10, 0, 10)

        
        this.camera = new PerspectiveCamera(45, this.config.width / this.config.height, 1, 1000)
        this.camera.position.y = 20
        this.camera.lookAt(10, 0, 10)


        this.scene = new Scene()
        this.scene.background = new Color(0xff9900)
        this.scene.add(this.camera)


        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.config.width, this.config.height)
        this.config.container.appendChild(this.renderer.domElement)

        this.loader = new GLTFLoader()
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/libs/draco/')
        this.loader.setDRACOLoader(this.dracoLoader)

        this.light = new DirectionalLight(0xffffff, 1.2)
        this.light.position.y = 50
        this.light.position.x = -50
        this.light.position.z = 30
        
        this.light.lookAt(new Vector3(0,0,0))
        this.scene.add(this.light)

        this.models = {}
        this.modelFiles = [
            'MazeGround',
            'MazeEgg1',
            'MazeEgg2',

            'walkablegreen',
            'nonwalkablebrown',
            'player',
            'Rabbit',
            'Egg'
        ]

        this.LoadModels()

        console.log(this)
    }

    async LoadModels(){
        for(let i = 0; i < this.modelFiles.length; i++){
            let modelFilename = this.modelFiles[i]

            let model = await this.LoadModel(modelFilename)
            this.models[modelFilename] = model
        }
    }

    async LoadModel(name){
        return new Promise((resolve, reject) => {
            this.loader.load(`/models/${ name }.gltf`, (model) => {
                resolve(model.scene.clone())
            })
        })
    }

    GetModel(name){
        return this.models[name].clone()
    }

    async CreateMaze(maze){
        this.maze = maze

        await this.LoadModels()

        for(let i = 0; i < this.maze.Walkables.length; i++){
            let tile = this.Instantiate('MazeGround', {
                x: this.maze.Walkables[i].x,
                y: -2,
                z: this.maze.Walkables[i].y
            })

            tile.scale.x = 0.5
            tile.scale.z = 0.5
        }
    }

    Instantiate(modelName, position){
        let model = this.GetModel(modelName)

        model.position.x = position.x * this.scale
        model.position.y = position.y
        model.position.z = position.z * this.scale

        this.scene.add(model)

        return model
    }


    Start(){
        this.Update()
    }

    Update(){
        requestAnimationFrame(() => { this.Update() })

        // let currentTile = this.maze.Walkables[0]

        // this.camera.updateProjectionMatrix();
        // this.camera.lookAt(new Vector3(currentTile.x * 10, 0, currentTile.y * 10))
        
        if(this.game.player) this.game.player.Update()


        this.renderer.render(this.scene, this.camera)
       
    }
}

export default Renderer