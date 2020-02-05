import { Nuxt, Builder } from 'nuxt'

import ExpressService from 'manablox-service-express'
import GraphQLService from 'manablox-service-graphql'

import Router from 'manablox-service-express/router'

import serverConfig from '~~/config/server'
import clientConfig from '~~/config/client'
import graphqlConfig from '~~/config/graphql'

// initialize express server
const server = new ExpressService(serverConfig)

// create router
const routes = []
const routeFiles = require.context('./routes', true, /\.js$/)
routeFiles.keys().map((key) => { routes.push({ name: key, route: routeFiles(key).default }) })


// create graphql schemas
let graphs = []
const graphFiles = require.context('./graphs', true, /index\.js$/)
graphFiles.keys().map((key) => { graphs.push({ name: key.split('/').reverse()[1], module: graphFiles(key).default }) })
graphs = graphs.filter((graph) => { return graph.module.autoload == true })

//create nuxt instance
const nuxt = new Nuxt(clientConfig)
const builder = new Builder(nuxt)



// async server start
const StartServer = async () => {
    // add api routes
    const router = new Router(server)
    router.AddRoutes(routes)

    // add graphql service
    const graphql = new GraphQLService({ ...graphqlConfig, server, graphs })
    
    // start express and apollo server
    server.Start()
    graphql.Start()

    // add client renderer
    await builder.build()
    server.Use(nuxt.render)
}

StartServer()