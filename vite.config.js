import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import BodyParser from 'body-parser'
import Url from 'url'

/*
* a vite plugin, configuring the dev server using middleware to handle api request for json data
* */
const serverApiPlugin = () => ({
    name: 'server-api',
    configureServer(server) {
        server.middlewares.use('/api', BodyParser.json())
        server.middlewares.use('/api',(req, res, next) => {
            res.end(`from vite plugin... query: ${Url.parse(req.url).query}, req.body: ${req.body}`)
            req.read()
            //next()

        })
    }
})

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), serverApiPlugin()],
})

