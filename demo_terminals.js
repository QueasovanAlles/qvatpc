const terminals = [
	{   // ATTENTION! 
		// This terminal is focused by default, needed in position with index = 0 and being named 'CMD'
		// all PS commands managing spawn processes are executed in this terminal
		name: 'CMD',
		path: 'C:\\',   						// eg.  C:\\users\\<you>
		domain: '',								// in this terminal no sub processes using an url is present, do not change that
		port: 0,                        		// in this terminal no sub processes using an url is present, do not change that
		cmd: 'echo QvATPC_terminal',    		// important : this start command will is used for confirmation of functioning!
	    runningConfirmation : 'QvATPC_terminal',// important : this confirmation is based on the cmd!
		output : true,							// important : all PS command are executed in this terminal, stdOut output can be hidden
		running : false,						// the status of this terminal spawn process
		process: null  							// in this terminal no sub processes using an url is present, do not change that, interface terminal requires process
	},
    {
        name: 'DotNet',
        path: './dotnet-demo',
        domain: 'http://localhost',
        port: 5256,
        cmd: 'dotnet run',
        output: true,
        running: false,
        runningConfirmation: 'Now listening on: http://localhost:5256',
        process: null
    },
    {
        name: 'Node',
        path: './node-server-demo',
        domain: 'http://localhost',
        port: 3000,
        cmd: 'npm run dev',
        output: true,
        running: false,
        runningConfirmation: 'Server running at http://localhost:3000',
        process: null
    },
	{
        name: 'Python',
        path: './python-demo',
        domain: 'http://localhost',
        port: 5000,
        cmd: 'python app.py',
        output: true,
        running: false,
        runningConfirmation: 'Running on http://localhost:5000',
        process: null
    },
	{
        name: 'Angular',
        path: './angular-demo',
        domain: 'http://localhost',
        port: 4200,
        cmd: 'ng serve --port 4200',
        output: true,
        running: false,
        runningConfirmation: 'listening on localhost:4200',
        process: null
    },
    {
        name: 'Vue',
        path: './vue-demo',
        domain: 'http://localhost',
        port: 5173,
        cmd: 'npm run dev',
        output: true,
        running: false,
        runningConfirmation: 'ready in',
        process: null
    },
    {
        name: 'React',
        path: './react-demo',
        domain: 'http://localhost',
        port: 5174,
        cmd: 'npm run dev',
        output: true,
        running: false,
        runningConfirmation: 'ready in',
        process: null
    }
];

module.exports = { terminals };

