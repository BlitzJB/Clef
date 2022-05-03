from .app import app
from .embed_data import embed_data

from flask import render_template, send_from_directory, redirect, url_for, request

@app.route('/')
def __index():
    return render_template('index.html')

@app.route('/song')
def __song():
    return render_template('player.html')

@app.route('/search')
def __search():    
    return render_template('search.html')

@app.route('/share')
def __share():
    _id = request.args.get('id')
    if 'Discordbot' in request.headers.get('User-Agent') or 'WhatsApp' in request.headers.get('User-Agent'):
        return render_template('graph_embed.html', data=embed_data(_id))
        
    if not _id:
        return redirect(url_for('__index'))

    return redirect(url_for('__song') + f'?id={_id}')
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
