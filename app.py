import os
import json

from flask import Flask, jsonify, redirect, render_template_string, url_for
from redis import from_url

from strings import INDEX

app = Flask(__name__)

redis_url = os.environ['REDISTOGO_URL']
redis = from_url(redis_url)

STATIC_URL = os.environ.get('STATIC_URL', '')

# initialize keys if they don't exist
if 'calls' not in redis:
    reset()

@app.route('/')
def index():
    return render_template_string(INDEX, static_url=STATIC_URL,
        calls=redis['calls'], signups=redis['signups'])

@app.route('/add/<field>/<int:amount>')
def update(field, amount):
    if field in redis:
        redis.incr(field, amount)
    return redirect(url_for('index'))

@app.route('/counts')
def get_counts():
    redis.incr('requests')
    return jsonify({k: int(redis[k]) for k in ['calls', 'signups']})

@app.route('/resetdb')
def reset():
    [redis.set(k, 0) for k in ['calls', 'signups', 'requests']]
    return redirect(url_for('index'))

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
