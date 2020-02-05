import Vue from 'vue'

const LoadContext = context => {
    context.keys().forEach(key => {
        let component = context(key).default
        let componentName = key.split('/').reverse()[0].replace('.vue', '')

        Vue.component(componentName, component)
    })
}

LoadContext(require.context('~/elements', true, /\.vue$/))