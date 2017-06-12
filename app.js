const 
fs = require('fs'),
prompt = require('prompt')
inquirer = require('inquirer')
chalk = require('chalk')
path = require('path')
yargs = require('yargs')

module.exports.run = (flags) => {

	if(flags.difficulty === 'easy'){
		set_gamedifficulty = 'easy'
	}
	else if(flags.difficulty === 'hard') {
		set_gamedifficulty = 'hard'
	}
	
	const hangman = new Hangman()
	hangman.init(set_gamedifficulty)
}

class Hangman {						

	constructor() {
	}

	init(selection) {

		this.temporary = []
		this.noOfChances = 4
		this.guessedletter = []
		this.arr = []
		

		let filepath = ''

		if(selection == 'easy')
		{
			filepath = 'easy.txt'
		}
		else if(selection == 'hard')
		{
			filepath = 'hard.txt'
		}

		const fullpath = path.resolve(filepath)
		fs.readFile(fullpath, 'utf8', (err, data) => {
			if (err)
				console.log(err)

			this.temporary = data.split('\r\n')	
			this.randomword = this.temporary[Math.floor(Math.random()*this.temporary.length)].toUpperCase();
			this.tempInterface()
		})
	}

	tempInterface() {
		
		console.log('\n\n')
		console.log(chalk.yellow.bold('--------------- M Y S T E R Y   W O R D   G A M E ------------------------'+'\n\n\n'))
		for(let i=0 ; i<this.randomword.length ; i++)
		{
			this.arr[i] = '_'
		}
		console.log('\t\t\t\t' + this.arr.toString().replace(/,/g,' '))

		console.log(chalk.yellow.bold('\n\n\n'+'--------------------------------------------------------------------------'))
		this.displayUserInterface()
	}

	displayUserInterface() {
		
		inquirer.prompt([{
			type: 'list',
			name: 'value',
			message: 'What would you like to do?',
			choices: ["Guess a Letter",
			"Guess a Hint",
			"View Guessed Letters"]

		}]).then((input) => {

			if(input.value == 'Guess a Letter')
			{
				this.guessedWord()
			}
			if(input.value == 'Guess a Hint')
			{
				this.hintExtractor()
			}
			if(input.value == 'View Guessed Letters')
			{
				this.guessedLetters()
			}
		})
	}



	updatedInterface() {

		console.log('\n\n')
		console.log(chalk.yellow.bold('--------------- M Y S T E R Y   W O R D   G A M E ------------------------'+'\n\n\n'))

		console.log('\t\t\t' + this.arr.toString().replace(/,/g,' '))
		console.log(chalk.yellow.bold('\n\n\n\n\n'+'---------------------------------------------------------------------------'+'\n'))
		console.log(chalk.red.bold(' Guesses Remaining : ' + this.noOfChances + '\n'))

		

		if(!this.arr.includes('_'))
		{
			console.log(chalk.green.bold('\n\n'+'You Won!'))
			console.log (chalk.green.bold('\n\n'+'----------------------C O N G R A T U L A T I O N S ------------------------'))
			this.playAgainOrNot()
		} else {
			this.displayUserInterface()
		}		

	}

	guessedWord() {

		inquirer.prompt([{
			type: 'input',
			name: 'answer',
			message: 'Guess a Letter'

		}]).then((input) => {

			

			if(this.guessedletter.includes(input.answer.toUpperCase()))
			{
				console.log(chalk.blue.bold('You already guessed this Letter!! Try another.'))
			}
			else
			{
				this.guessedletter.push(input.answer.toUpperCase())
			}
			
			
			

			for(let j= 0 ; j < this.randomword.length ; j++) {

				if(this.randomword[j] === input.answer.toUpperCase()) {

					this.arr[j] = input.answer.toUpperCase()
				}


			}

			if(!this.randomword.includes(input.answer.toUpperCase())) {

				this.noOfChances--
				
				
				if(this.noOfChances === 0 )
				{
					console.log(chalk.red.bold('\n\n\t\t '+'The correct word was : ' + this.randomword))

					console.log (chalk.red.bold('\n\n'+'-----------------------G A M E   O V E R -------------------------'+'\n\n'))
					process.exit(0)
				}
			}
			
			
			this.updatedInterface()

		})

	}

	hintExtractor() {

		this.alpha = {}

		for(let i= 0 ; i <= this.randomword.length - 1 ; i++)
		{
			if (!this.alpha[this.randomword[i]]) 
			{
				this.alpha[this.randomword[i]] = 1
			}
			else 
			{
				this.alpha[this.randomword[i]]++
			}
		}
		
		for(let k = 0 ; k <= this.arr.length - 1 ; k++) 
		{

			if(this.arr[k].includes('_'))
			{
				if(parseInt(this.alpha[Object.keys(this.alpha)[k]])  <= 1)
				{
					console.log(parseInt(this.alpha[Object.keys(this.alpha)[k]]))

					this.arr[k] = this.randomword[k].toUpperCase()
					this.guessedletter.push(this.randomword[k])
					break
				}
				
			}
		}

		this.updatedInterface()
	}


	guessedLetters() {

		console.log(chalk.blue.bold('-----------------------GUESSED LETTERS--------------------------'+'\n\n'))

		console.log(chalk.blue.bold(this.guessedletter.toString().replace(/,/g,' ')))

		console.log(chalk.blue.bold('\n\n'+'-----------------------------------------------------------------'))

		this.displayUserInterface()
	}

	playAgainOrNot() {


		inquirer.prompt([{
			type: 'confirm',
			name: 'options',
			message: 'Want to play agian?'
			
		}]).then((input) => {
			
			if(input.options) {

				this.temporary = []
				this.noOfChances = 4
				this.guessedletter = []
				this.arr = []
				this.alpha = {}
				
				const hangman1 = new Hangman()
				hangman1.init(set_gamedifficulty)
			} 
			else {
				process.exit()
			}
		})
	}
}

