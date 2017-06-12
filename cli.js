const 
fs = require('fs'),
yargs = require('yargs'),
app = require('./app')


const flags = yargs.usage('$0: Usage node app.js')
.options('h', {

	alias: 'help',
	describe: 'displays Help'
})
.options('d', {
	alias: 'difficulty',
	describe: 'set the difficulty of the game    [choices : "easy","hard" ]'  
})
.argv



if(flags.help)
{
	yargs.showHelp()

}
if(flags.difficulty)
{
	app.run(flags)

}