from flask import Flask, render_template, send_file, jsonify, request
import json

from tweets_handler import tweets_handler
from oil_price_handler import oil_price_handler

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def index():
  return render_template('index.html')

@app.route('/tweets', methods = ['GET'])
def tweets():
  global tweets

  data = tweets.apply(lambda x: x.to_dict(orient='records'))
  return data.to_json()

@app.route('/oil_prices', methods = ['GET'])
def oil_prices():
  global oil_prices

  data = json.dumps(oil_prices.to_dict(orient='records'), indent=2)
  return jsonify(data)

if __name__ == '__main__':  
  tweets = tweets_handler()
  oil_prices = oil_price_handler()

  app.run(debug=True, port=3002)