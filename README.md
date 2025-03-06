# QvATPC - Terminal Process Controller


## Overview
QvATPC is an open-source, Node.js-powered CLI tool that streamlines managing multiple development services. Run npm run demo to launch predefined terminals for back-end and front-end processes (e.g., Node.js, .NET, Python, Angular), all controlled from a single interface. Built for developers prototyping microservices or full-stack apps, it’s free under MIT and designed for quick, hands-on workflows.



### Key Features
- Configurable Terminals: Define processes in demo_terminals.json (e.g., npm run dev, dotnet run).
- Port Management: Vacates ports on startup/quit with precise, awaitable steps and `netstat` checks.
- Process Control: Start, stop, restart, or list services with real-time status.
- Reliable Timing:  Async process management ensures clean startup, shutdown, and port cleanup.
- Interactive CLI: 
	+ list: Shows all terminals, ports, and output status.
	+ focus [idx]: Targets a terminal for commands.
    + start/stop/restart [idx]: Manages processes by index.
	+ browse [idx/all]: Opens URLs in Chrome.
	+ hide/show [idx]: Toggles output per terminal.
	+ [any command]: Runs PowerShell commands in the focused terminal.
	+ Port Management: Vacates ports on startup/quit via process termination and netstat checks.
	+ Persistence: Ctrl+C detaches processes; relaunch cleans them up. Quit will stop the running processes.
- Colored Output: ANSI-styled logs for clarity, filterable per terminal.


### Use Cases
- Full-Stack Dev: Run Node.js (npm run dev) and .NET (dotnet run) side by side.
- Microservices Testing: Manage multiple demo services in one terminal.
- Framework Demos: Spin up Angular, Vue, or React with a single command.

![screenshot](/qva_tpc.png)


## How It Stands Out
QvATPC blends terminal control with process management in a Node.js-first package. It’s simpler than tmux (no panes) and lighter than PM2 (no daemon), focusing on dev-stage flexibility with port cleanup and browser integration.

### Get Started using the demo
- Clone: git clone https://github.com/QueasovanAlles/qvatpc
- Install: npm install
- Install all demo services : install dependencies in demo folder
- Run: npm run demo (uses demo_terminals.json)
- Predefine your Dev environment using empty_terminals

### Practical example: Using QvATPC for "MyLoRe" project

Directory structure:
```
QvA/                    # projects folder
├── MyLoRe/            # project using services (eg. webserver)
└── QvaTPC/            # clone of this repo (demo content optional)
```

Launch command from projects folder:
```bash
# For MyLoRe project
node ./qvatpc/qva_tpc.js ./MyLoRe/mylore_terminals.json

# Generic format
node ./qvatpc/qva_tpc.js ./a_project/a_project_terminals.json
```

Terminal configuration:
- Use `demo_terminals.json` as reference
- Start new projects with `empty_terminals.json` template

### QvATPC CLI Commands samples :
- list (view status)
- start 1 (launch DotNet)
- browse 2 (open Node in Chrome)
- quit (kill all and exit)

### Current State
QvATPC (v1.0.0, March 2025) by Queaso van Alles is a solid dev tool with a JSON-configurable future. It’s functional for small projects, with room for polish (e.g., error handling, docs). Contributions welcome!

### Extra info
📖 Detailed guide: [ABOUTDEMO.md](ABOUTDEMO.md)  
🎥 Quick demo: [Watch on YouTube](https://youtu.be/oTCihdmS0mU)

