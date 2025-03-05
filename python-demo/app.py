from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello from QvATPC Python Server!'

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)