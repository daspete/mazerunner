export default {
    maze: {
        width: 80,
        height: 60,
        
        seed: 'DasPeTe',

        start: {
            x: 1,
            y: 1
        },

        bridges: 20
    },

    player: {
        moveTime: 270,

        camera: {
            position: {
                x: -20,
                y: 50,
                z: 70
            }
        }
    },

    

    goodies: {
        count: 100,
        types: [
            {
                bag: 10,
                model: '',
                possibility: 10
            },
            {
                bag: 20,
                model: '',
                possibility: 7
            },
            {
                bag: 40,
                model: '',
                possibility: 4
            },
            {
                bag: 80,
                model: '',
                possibility: 1
            }
        ]
    }
    
}