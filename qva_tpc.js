const { spawn } = require('child_process');
const util = require('util');
const sleep = util.promisify(setTimeout);
const readline = require('readline');

async function startTerminals() {

	/**
	 * Default Chrome browser executable path on Windows systems
	 * Used for launching browser instances to view web applications
	 * Override this path if using a different browser or Chrome installation location
	 */	
	const browserPath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';


	/**
	 * ANSI color codes for terminal output styling
	 * Enhances CLI readability by color-coding different types of information:
	 * - title: Cyan for main headers and application title
	 * - command: Yellow highlights executable commands
	 * - param: Green indicates configurable parameters
	 * - description: White presents general descriptive text
	 * - success: Green confirms successful operations
	 * - error: Red signals errors and failures
	 * - warning: Yellow draws attention to warnings
	 * - info: Blue displays informational messages
	 * - highlight: Magenta emphasizes important elements
	 * - reset: Returns to default terminal color
	 * 
	 * Usage: console.log(`${colors.success}Operation completed${colors.reset}`);
	 */
    const colors = {
		title: '\x1b[36m',      
		command: '\x1b[33m',    
		param: '\x1b[32m',      
		description: '\x1b[37m',
		success: '\x1b[32m',    
		error: '\x1b[31m',      
		warning: '\x1b[33m',    
		info: '\x1b[34m',       
		highlight: '\x1b[35m',  
		reset: '\x1b[0m'        
	};


    /**
	 * Dynamic terminal configuration loader
	 * - Accepts config filename as command line argument
	 * - Falls back to 'empty.js' if no argument provided
	 * - Imports terminal definitions from specified config
	 * 
	 * Example: "empty": "node qva_tpc.js empty_terminals",
    "demo": "node qva_tpc.js demo_terminals", myconfig.js
	 */
    const configFile = process.argv[2] || 'empty.js';
    let terminals = require(`./${configFile}`).terminals;



	console.log(`${colors.title}
	   ██████  ██    ██  █████  ████████ ██████   ██████ 
	  ██    ██ ██    ██ ██   ██    ██    ██   ██ ██      
	  ██    ██ ██    ██ ███████    ██    ██████  ██      
	  ██ ▄▄ ██  ██  ██  ██   ██    ██    ██      ██      
	   ██████    ████   ██   ██    ██    ██       ██████ 
		  ▀▀                                             
	${colors.reset}`);
	console.log(`${colors.highlight} QvA Terminal Process Controller is ready. Type "help" for commands`);
    console.log(`${colors.highlight} MIT licence 2025, https://github.com/QueasovanAlles\n\n${colors.reset}`);
	
	const filterPhrases = [
		'Copyright (C) Microsoft Corporation. All rights reserved.',
		'Install the latest PowerShell for new features and improvements!',

	]

    let lastStdOut = new Date().getTime();
    let lastPrintList = new Date().getTime();  


    /**
	 * Terminal Process Manager
	 * Initializes and configures a PowerShell terminal instance with:
	 * - Bidirectional pipe communication
	 * - Output filtering system
	 * - Auto-detection of application startup
	 * - Custom output handling per terminal type
	 * - Directory navigation
	 * - Command execution with port substitution
	 * 
	 * @param {Object} terminal Configuration object containing:
	 *   - name: Terminal identifier
	 *   - path: Working directory
	 *   - cmd: Command to execute
	 *   - port: Port number for the application
	 *   - runningConfirmation: Regex pattern to detect successful startup
	 *   - output: Boolean to control output logging
	 * 
	 * Usage:
	 * startTerminal({
	 *   name: 'API',
	 *   path: './api',
	 *   cmd: 'npm start --port PORT',
	 *   port: 3000
	 * });
	 */
	function startTerminal(terminal) {
        terminal.process = spawn('powershell.exe', [], {
			stdio: ['pipe', 'pipe', 'pipe'],
			shell: true,
			windowsHide: true,
		});
 
		const handleOutput = (stream) => (data) => {
				const output = data.toString();

				// Skip output if it contains any filtered phrase
				if (filterPhrases.some(phrase => output.includes(phrase))) {
					return;
				}

				lastStdOut = new Date().getTime();
		
				setTimeout(() => {
					if (new Date().getTime() - lastStdOut > 2000 && new Date().getTime() - lastPrintList > 2000 ) {
						if (startShowHelpList === false) {
							startShowHelpList = true;
							printHelp();
							printList();	
						}
						lastPrintList = new Date().getTime();
					}					
				}, 1000);

				if (!terminal.running) {
					const regex = new RegExp(terminal.runningConfirmation);
					const match = output.match(regex);
					if (match) {
						terminal.running = true;
						console.log(`${colors.success}${terminal.name} confirmed running${colors.reset}`);
					}
				}

				if (terminal.output && output.length > 0) {
					if (terminal.name==='CMD')
						console.log(`${colors.highlight}${terminal.name} ${colors.reset}Output: ${output}`);
					else
						console.log(`${colors.warning}${terminal.name} ${colors.reset}Output: ${output}`);
				} 
			};

		terminal.process.stdout.on('data', handleOutput('stdout'));
		terminal.process.stderr.on('data', handleOutput('stderr'));
		
	    terminal.process.stdin.write(`cd ${terminal.path}\n`);
		terminal.process.stdin.write(`${terminal.cmd.replace('PORT', terminal.port)}\n`);
    }

    startTerminal(terminals[0]); 

    let focusedProcess = 'CMD';
	let focusedTerminal = terminals[0];	
	let startShowHelpList = false;

	/**
	 * Port Cleanup Orchestrator
	 * Systematically frees up ports by terminating existing processes:
	 * - Executes in sequential order to prevent race conditions
	 * - 500ms delay between process terminations
	 * - Verifies port availability after each termination
	 * - Returns Promise that resolves when all ports are cleared
	 * 
	 * Process:
	 * 1. Identifies each non-CMD terminal
	 * 2. Stops associated process
	 * 3. Verifies port status via netstat
	 * 4. Continues to next port after confirmation
	 * 
	 * Usage:
	 * await vacatePorts();  // Ensures clean slate before starting new processes
	 */
	function vacatePorts() {
		return new Promise((resolve) => {
			terminals.forEach((tab, tabId) => {
				if (tab.name !== 'CMD') {
					console.log(`${colors.highlight} vacate port : ${tab.name} ${tabId}/${terminals.length-1}`);
					setTimeout(() => { stop(tab.name); }, tabId * 500);
					setTimeout(() => {
						let cmd = `netstat -ano | findstr : ${tab.port}`;
						terminals[0].process?.stdin.write(`${cmd}` + '\n');
						if (tabId === terminals.length - 1) resolve();
					}, (tabId + terminals.length) * 500 + tabId * 100);
				}
			});
		});
	}

	await vacatePorts();


	/**
	 * Terminal Initialization Sequence
	 * Launches all configured terminals except CMD (index 0):
	 * - Maintains ordered startup sequence
	 * - Skips primary CMD terminal
	 * - Applies startTerminal configuration to each instance
	 * 
	 * The CMD terminal remains available for system commands while
	 * other terminals handle specific application components
	 */
	terminals.forEach((terminal, terminalIdx) => {
		if (terminalIdx !== 0)
			startTerminal(terminal);
	});


    /**
	 * Terminal Output Formatting System
	 * Core component of the 'help' and 'list' display commands
	 * 
	 * formatColumn():
	 * - Aligns text in columns using tab characters
	 * - Creates consistent spacing for command documentation
	 * - Supports dynamic width adjustment
	 * 
	 * printHelp():
	 * - Displays comprehensive command reference
	 * - Color-coded sections for commands, parameters, and descriptions
	 * - Shows command syntax and effects
	 * 
	 * printList():
	 * - Shows real-time status of all terminal instances
	 * - Displays port numbers, running state, and output settings
	 * - Highlights currently focused terminal
	 * 
	 * The help and list commands provide essential navigation through
	 * the terminal management interface, making the system more
	 * user-friendly and efficient.
	 */
	function formatColumn(text, desiredWidth = 14) {
		const tabSize = 4;
		const textLength = text.length;
		const neededTabs = Math.ceil((desiredWidth - textLength) / tabSize);
		return text + '\t'.repeat(neededTabs);
	}

	function printHelp() {
		console.log(
			`${colors.title}HELP${colors.reset} - Available commands\n${colors.reset}` +
			`${colors.command}${formatColumn('list')}${colors.description}Show list of defined processes with their status\n` +
			`${colors.command}${formatColumn('focus [idx]')}${colors.description}Set focus for commands on a sub-process terminal\n` +
			`${colors.command}${formatColumn('browse (idx)')}${colors.description}Open url in browser using domain and port\n` +			
			`${colors.command}${formatColumn('stop (idx)')}${colors.description}Stop process occupying the port, set terminal available for commands\n` +
			`${colors.command}${formatColumn('start (idx)')}${colors.description}Start process in existing terminal, occupy port with running process\n` +
			`${colors.command}${formatColumn('restart (idx)')}${colors.description}Restart process : stop, followed by start\n` +
			`${colors.command}${formatColumn('hide (idx)')}${colors.description}Disable stdout logging for specific process\n` +
			`${colors.command}${formatColumn('show (idx)')}${colors.description}Enable stdout logging for specific process\n` +                    
			`${colors.param}${formatColumn('[any command]')}${colors.description}Execute as PowerShell command in focused terminal\n${colors.reset}` + 
			`${colors.command}${formatColumn('quit')}${colors.warning}Kill all processes and the terminals in which runnning, then quit this Terminal Process Controller\n`
		);
	}

	function printList() {
		const processList = terminals.map((tab, idx) => {
			const isFocused = tab === focusedTerminal;
			return `${colors.param}[${idx}]${colors.reset} ${formatColumn(tab.name + ':' + tab.port, 20)}${colors.title}Terminal${colors.reset} :${formatColumn(tab.process ? 'YES':'NO', 6)}${colors.title}Running${colors.reset} : ${formatColumn(tab.running ? 'YES' : 'NO', 6)}${colors.title}Output${colors.reset} : ${formatColumn(tab.output ? 'ON' : 'OFF', 6)}${isFocused ? `${colors.warning} *FOCUSED*${colors.reset}` : ''}`;
		});
		console.log(`${colors.title}LIST${colors.reset} - Configured terminals\n`, processList.join('\n'));
	}

	function start(terminalName) {

		const terminal = terminals.find(t => t.name === terminalName);
		if (!terminal.process)
			terminal.process = spawn('powershell.exe', [], {
				stdio: ['pipe', 'pipe', 'pipe'],
				shell: true,
				windowsHide: true
			});
 
		const handleOutput = (stream) => (data) => {
				const output = data.toString();

				// Skip output if it contains any filtered phrase
				if (filterPhrases.some(phrase => output.includes(phrase))) {
					return;
				}

				lastStdOut = new Date().getTime();
				setTimeout(() => {
					if (new Date().getTime() - lastStdOut > 1000 && new Date().getTime() - lastPrintList > 1000 ) {
						//printHelp();
						//printList();					
						lastPrintList = new Date().getTime();
					}					
				}, 1000);

				if (!terminal.running) {
					const regex = new RegExp(terminal.runningConfirmation);
					const match = output.match(regex);
					if (match) {
						terminal.running = true;
						console.log(`${colors.success}${terminal.name} confirmed running${colors.reset}`);
					}
				}

				if (terminal.output && output.length > 0) {
					if (terminal.name==='CMD')
						console.log(`${colors.highlight}${terminal.name} ${colors.reset}Output: ${output}`);
					else
						console.log(`${colors.warning}${terminal.name} ${colors.reset}Output: ${output}`);
				} 
			};

		terminal.process.stdout.on('data', handleOutput('stdout'));
		terminal.process.stderr.on('data', handleOutput('stderr'));
		
	    terminal.process.stdin.write(`cd ${terminal.path}\n`);
		terminal.process.stdin.write(`${terminal.cmd.replace('PORT', terminal.port)}\n`);
	}

    function stop(terminalName) {
		const terminal = terminals.find(t => t.name === terminalName);
		if (terminal) {
			const port = terminal.port;
			const commands = [
				`$connection = Get-NetTCPConnection -LocalPort ${port}`,
				`$processId = $connection.OwningProcess`,
				`Stop-Process -Id $processId -Force`,
			];
			terminal.running = false;
			commands.forEach((cmd, cmdIdx) => {
				setTimeout(() => {terminals[0].process?.stdin.write(`${cmd}` + '\n');},cmdIdx*500);
			});
		}
	}

	function restart(terminalName) {
		stop(terminalName);
		setTimeout(() => start(terminalName), 3000);
	}

    const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on('line', (input) => {
		const [command, ...args] = input.trim().split(' ');

		let terminalArg = null;
		try {
			terminalArg = terminals[parseInt(args[0])];
		} catch(e) {}

		if (!terminalArg && focusedTerminal && focusedTerminal.name !== 'CMD') 
			terminalArg = focusedTerminal;

		switch(command) {
			case 'start':
                if (terminalArg) {
					console.log(`${colors.warning} Trying to start child process ${terminalArg.name} on port ${terminalArg.port}${colors.reset}`);
					start(terminalArg.name);
				} else console.log(`${colors.error} Invalid terminal index`);
				break;
			case 'stop':
                if (terminalArg) {
					console.log(`${colors.warning} Trying to kill process for ${terminalArg.name} on port ${terminalArg.port}${colors.reset}`);
					stop(terminalArg.name);
				} else console.log(`${colors.error} Invalid terminal index${colors.reset}`);
				break;
			case 'restart':
                if (terminalArg) {
					console.log(`${colors.warning} Trying to restart child process ${terminalArg.name} on port ${terminalArg.port}${colors.reset}`);
					restart(terminalArg.name);
				} else console.log(`${colors.error} Invalid terminal index${colors.reset}`);
				break;
			case 'list':
				printList();
				break;
			case 'focus':
				if (terminalArg) {
					focusedTerminal = terminalArg;
					console.log(`Now controlling: ${focusedTerminal.name}`);
				} else console.log(`${colors.error} Invalid terminal index`);
				break;
			case 'hide':
				if (terminalArg) {
					terminalArg.output = false;
					console.log(`Hidden output for ${terminalArg.name}`);
				} else console.log(`${colors.error} Invalid terminal index`);
				break;
			case 'show':
				if (terminalArg) {
					terminalArg.output = true;
					console.log(`${colors.highlight}Showing output for ${terminalArg.name}`);
				} else console.log(`${colors.error} Invalid terminal index`);
				break;
			case 'browse':
				if (terminalArg && !(args.length > 0 && args[0]==='all')) {
					if (terminals[0].process) {
						const url = `"${terminalArg.domain}:${terminalArg.port}"`;
						const cmd = `Start-Process "${browserPath}" -ArgumentList ${url}`;
						terminals[0].process.stdin.write(cmd + '\n');
					}
				} else if (args.length > 0 && args[0]==='all') {
					if (terminals[0].process) {
						terminals.forEach((t, tIdx)=>{
							if (tIdx !== 0) {
								const url = `"${t.domain}:${t.port}"`;
								const cmd = `Start-Process "${browserPath}" -ArgumentList ${url}`;
								terminals[0].process.stdin.write(cmd + '\n');
							}
						});
					}
				} else console.log(`${colors.error} Invalid terminal index`);
				break;
			case 'quit' :
				terminals.forEach((tab, tabId) => {
					if (tab.name !== 'CMD') {
						console.log(`${colors.highlight} QUITING APP : ${tab.name} ${tabId}/${terminals.length-1}`);
						setTimeout(()=>{stop(tab.name);},tabId*1000);
					}	
				});
				setTimeout(()=>{
					terminals.forEach((tab, tabId) => {
						if (tabId !== 0) {
							let cmd =  `netstat -ano | findstr : ${tab.port}`;
							terminals[0].process?.stdin.write(`${cmd}` + '\n');
						}
					});
					setTimeout(()=>{console.log(`${colors.command} QUITED!${colors.reset}`);process.exit(0);},1000);
				},10000);
				
				break;

			case 'help':
				printHelp();
				break;
			default:
				if (focusedTerminal && focusedTerminal.process) {
					focusedTerminal.process.stdin.write(input + '\n');
				} else {
					console.log(`${colors.highlight} No focussed terminal available for command! "help" for more info`);
				}
				break;
		}
	});

    printHelp();
    printList();

}

startTerminals();