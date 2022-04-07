from .app import app

from flask import render_template, send_from_directory

@app.route('/')
def __index():
    return render_template('index.html')

@app.route('/song')
def __song():
    return render_template('player.html')

@app.route('/search')
def __search():
    return render_template('search.html')


# ------------To serve manifest.json and sw.js placed at-----------------
# --------unconventional locations to improove maintainablity------------

@app.route('/sw.js')
def __sw():
    return send_from_directory('..', 'sw.js')

@app.route('/manifest.json')
def __manifest():
    return send_from_directory('..', 'manifest.json')

@app.route('/keep_alive')
def __alive():
  return 'OK'
