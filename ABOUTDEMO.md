#QvATPC tutorial - About demo

The empty templates is a good start for personal setup.
To demonstrate functionality of QvATPC, a number of demo "hello world" projects of supported types are added and linked to the demo terminal setup.
This document explains wich development environment is needed for full test of all supported types. You can also remove demo app's which your current dev environment does not support

## 1. Development Environment Setup

### Node.js LTS
Essential JavaScript runtime environment for modern web development.
QvATPC is running on Node Js

winget install OpenJS.NodeJS.LTS
npm config set loglevel verbose
* set loglevel to verbose to get more crucial info about running processes in the QvATPC combined terminal view

- node -v
v22.14.0
- npm -v
10.9.2


### Angular CLI
Command line interface for creating and managing Angular applications
QvATPC uses Angular CLI for controlling the run of angular projects

npm install -g @angular/cli


### Vue CLI
Standard tooling for Vue.js development
QvATPC uses Vue CLI for controlling the run of Vue projects

npm install -g vue@latest


### Python 
Python 3.11 is the latest stable Python runtime for backend development
QvATPC uses Python cli commands for controlling the run of python projects

winget install Python.Python.3.11


### .NET SDK
Microsoft's development platform for building all types of applications
QvATPC uses dotnet cli commands for controlling the run of .net projects

winget install Microsoft.DotNet.SDK.8.0





## Creating the demo apps - unneeded to repeat : they exist in the git repo

### Angular Demo
Creates a minimal Angular application without Git initialization and using default settings

ng new angular-demo --minimal --defaults --skip-git


### Vue Demo
Initializes a new Vue.js project with standard configuration

vue create vue-demo --default
cd vue-demo && npm -i && npm run build && npm run vite


### Node.js Server Demo
Sets up a basic Node.js project with default package.json

mkdir node-server && cd node-server && npm init -y


### Flask Demo
Creates a Python Flask project with virtual environment

mkdir flask-demo && cd flask-demo && python -m venv venv


### .NET Web API Demo
Generates a new .NET Web API project with standard endpoints

dotnet new webapi -n dotnet-demo
dotnet restore
dotnet build


### React Demo
Bootstraps a new React application with create-react-app

npm create vite@latest react-demo -- --template react 
cd react-demo && npm install
npm run build
