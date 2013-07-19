import os

from flask import Flask, jsonify, redirect, render_template, url_for
from redis import from_url


STATIC_URL = os.environ.get('STATIC_URL', '')
REDIS_URL = os.environ['REDIS_URL']

app = Flask(__name__)
redis = from_url(REDIS_URL)


@app.route('/')
def index():
    return render_template('index.html',
                           static_url=STATIC_URL,
                           calls=redis['calls'],
                           signups=redis['signups'])


@app.route('/add/<field>/<int:amount>')
def update(field, amount):
    if field in redis:
        redis.incr(field, amount)
    return redirect(url_for('index'))


@app.route('/counts')
def get_counts():
    return jsonify({k: int(redis[k]) for k in ['calls', 'signups']})


def reset():
    app.logger.info('resetting counters')
    [redis.set(k, 0) for k in ['calls', 'signups']]

# initialize our values if they aren't already
if 'calls' not in redis:
    reset()

if __name__ == '__main__':
    # Bind to PORT if defined, otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
