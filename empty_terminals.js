exports.terminals = [
	{   // ATTENTION! 
		// This terminal is focused by default, needed in position with index = 0 and being named 'CMD'
		// all PS commands managing spawn processes are executed in this terminal
		name: 'CMD',
		path: 'C:\\',   		                // any available path eg.  C:\\users\\<you>
		domain: '',								// in this terminal no sub processes using an url is present, do not change that
		port: 0,                        		// in this terminal no sub processes using an url is present, do not change that
		cmd: 'echo QvATPC_terminal',    		// important : this start command will is used for confirmation of functioning!
	    runningConfirmation : 'QvATPC_terminal',// important : this confirmation is based on the cmd!
		output : true,							// important : all PS command are executed in this terminal, stdOut output can be hidden
		running : false,						// the status of this terminal spawn process
		process: null  							// in this terminal no sub processes using an url is present, do not change that, interface terminal requires process
	},
    /* DECLARATION of terminals
	{
		name: '<noSpacesName>',
		path: 'G:\\qva\\mylore\\MyLoRe',
		domain: 'http://192.168.1.2',
		port: 52330,
		cmd: 'node run dev',
		output : true,
		running : false,
		runningConfirmation : 'Server running on https?://[0-9.]+:52330',
		process: null  
	},*/
]


