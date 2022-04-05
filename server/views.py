from .app import app

from flask import render_template, request, send_from_directory

@app.route('/')
def __index():
    return render_template('index.html')

@app.route('/song')
def __song():
    return render_template('song.html')

@app.route('/sw.js')
def __sw():
    return send_from_directory('..', 'sw.js')

@app.route('/manifest.json')
def __manifest():
    return send_from_directory('..', 'manifest.json')