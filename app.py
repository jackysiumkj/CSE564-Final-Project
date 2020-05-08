from flask import Flask, render_template, send_file, jsonify, request
import json
import pandas as pd
import numpy as np

from tweets_handler import tweets_handler
from stock_handler import stock_handler
from mds_handler import get_euclidean, get_correlation
from mds_data import mds_data
from pca_handler import pca_handler

app = Flask(__name__)

@app.route('/', methods = ['GET'])
def index():
  return render_template('index.html')

@app.route('/tweets', methods = ['GET'])
def tweets():
  global tweets

  data = tweets.groupby('date') 
  data = data.apply(lambda x: x.to_dict(orient='records'))
  return data.to_json()

@app.route('/related_rates', methods = ['GET'])
def get_rrs():
  global merged_data

  data = json.dumps(merged_data.to_dict(orient='records'), indent=2)
  return jsonify(data)

@app.route('/housings', methods = ['GET'])
def get_housing():
  global housing
  
  data = json.dumps(housing.to_dict(orient='records'), indent=2)
  return jsonify(data)

@app.route('/analystic/<_type>', methods = ['GET'])
def getMdsData(_type):
  global label, mds_euc_data, mds_cor_data, pca_data
  
  if _type == '' or _type == 'euclidean':
    res_data = mds_euc_data
    res_data['label'] = label
  elif _type == 'correlation':
    res_data = mds_cor_data
    res_data['label'] = label
  elif _type == 'pca':
    res_data = pca_data
  
  res_data = res_data.to_dict('records')
  res_data = json.dumps(res_data, indent=2)

  return jsonify(res_data)

if __name__ == '__main__':  
  tweets = tweets_handler()
  sp, dowjones, nasdaq = stock_handler()

  oil_price = pd.read_csv('./src/oil_price.csv')
  housing = pd.read_csv('./src/US_Housing_Price.csv')
  currency = pd.read_csv('./src/euro-dollar-exchange-rate-historical-chart.csv')

  sp.columns = ['Date','sp_close']
  dowjones.columns = ['Date','dowjones_close']
  nasdaq.columns = ['Date','nasdaq_close']
  housing.columns =  ['date','value']
  merged_data = pd.merge(sp, dowjones, how='outer', on='Date')
  merged_data = pd.merge(merged_data, nasdaq, how='outer', on='Date')
  merged_data = pd.merge(merged_data, currency, how='left', on='Date')
  merged_data = pd.merge(merged_data, oil_price, how='left', on='Date')

  merged_data['Date'] = pd.to_datetime(merged_data.Date)
  merged_data['Date'] = merged_data['Date'].astype(str)

  housing['date'] = pd.to_datetime(housing.date)
  housing['date'] = housing['date'].astype(str)

  merged_data.fillna('NaN', inplace=True)

  mds_data, label = mds_data(tweets, sp, dowjones, nasdaq, currency, oil_price)
  mds_euc_data = get_euclidean(mds_data)
  mds_cor_data = get_correlation(mds_data)

  pca_data = pd.DataFrame()  
  pca_data['org'] = np.cumsum(pca_handler(mds_data).explained_variance_ratio_)

  app.run(debug=True, port=3002)