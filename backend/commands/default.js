import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import route from './route.js'
import chalk from 'chalk'

yargs(hideBin(process.argv))
.scriptName('shaka')
.command('route:list', 'Display all routes', () => {}, async(argv) => {
    await route.routeList()
})
.wrap(null)
.strict()
.demandCommand(1)
.version('v1.0.0')
.parse()
