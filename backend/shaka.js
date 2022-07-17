import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import route from './commands/route.js'
import make from './commands/make.js'
import chalk from 'chalk'

yargs(hideBin(process.argv))
.scriptName('shaka')
.command('route:list', 'Display all routes', () => {}, async(argv) => {
    await route.routeList()
})

.command({
    command: "make:controller",
    describe: "Create a controller and its route",
    builder: {
        n: {
            alias: 'name',
            describe: "Controller's name",
            type: 'string',
            requiresArg:true,
            demandOption: true
        },
        v: {
            alias: 'v',
            describe: "Controller's route version",
            type: 'number',
            requiresArg:true,
            demandOption: true
        }
    },
    handler: async(argv) => {
        await make.controller(argv.name, argv.v)
    }
})
.help()
.wrap(null)
.strict()
.demandCommand(1)
.version('v1.0.0')
.parse()
