from flask import *
from pandas import DataFrame
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
from IPython.core.display import display
from sklearn.model_selection import train_test_split
from sklearn.decomposition import PCA
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn import decomposition, preprocessing
from sklearn.preprocessing.data import StandardScaler, scale
from sklearn.manifold.mds import MDS
from textblob import TextBlob
import re
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
from mds_handler import get_euclidean, get_correlation
from mds_data import mds_data
from sklearn.cluster import KMeans
app = Flask(__name__)

@app.route("/", methods = ['POST', 'GET'])
def index():
    global trump
    data = trump.apply(lambda x: x.to_json(orient='records'))
    
    return data.to_json()

@app.route('/stock', methods = ['POST', 'GET'])
def stock():
    global sp,nasdaq, dowjones
    if request.method == 'POST':
        if request.form['data'] == 'sp':
            data = json.dumps(sp.to_dict(orient='records'), indent=2)
            
        if request.form['data'] == 'nasdaq':
            data = json.dumps(nasdaq.to_dict(orient='records'), indent=2)
            
        if request.form['data'] == 'dowjones':
            data = json.dumps(dowjones.to_dict(orient='records'), indent=2)
        return jsonify( {request.form['data']: data})
    
    data = {
        "sp":json.dumps(sp.to_dict(orient='records'), indent=2),
        "nasdaq":json.dumps(nasdaq.to_dict(orient='records'), indent=2),
        "dowjones":json.dumps(dowjones.to_dict(orient='records'), indent=2)
    }
    
    return jsonify(data)
  
@app.route('/oil_price', methods = ['POST', 'GET'])
def oil_price():
    global oil_price
    data = json.dumps(oil_price.to_dict(orient='records'), indent=2)
    
    return jsonify(data)
@app.route('/currency', methods = ['POST', 'GET'])
def currency():
    global currency
    data = json.dumps(currency.to_dict(orient='records'), indent=2)
    
    return jsonify(data)

@app.route('/housing', methods = ['POST', 'GET'])
def housing():
    global housing
    data = json.dumps(housing.to_dict(orient='records'), indent=2)
    
    return jsonify(data)

@app.route('/merge', methods = ['POST', 'GET'])
def merge_data():
    global merge_data
    data = json.dumps(merge_data.to_dict(orient='records'), indent=2)
    return data

@app.route('/mds_data/<mds_type>', methods = ['GET'])
def getMdsData(mds_type):
    global mds_data,label 
    
    if mds_type == '' or mds_type == 'euclidean':
        res_data = get_euclidean(mds_data)
    elif mds_type == 'correlation':
        res_data = get_correlation(mds_data)
    
    res_data['label'] = label
    res_data = res_data.to_dict('records')
    res_data = json.dumps(res_data, indent=2)

    return jsonify(res_data)
@app.route('/pca_data', methods = ['GET'])
def getPcaData():
    global mds_data
    pca_data = pd.DataFrame()  
    pca_data['org'] = np.cumsum(best_pca(mds_data).explained_variance_ratio_)
    pca_data = pca_data.to_dict('records')
    pca_data = json.dumps(pca_data, indent=2)

    return jsonify(pca_data)

def best_pca(data):
    data = data.apply(preprocessing.LabelEncoder().fit_transform)
    data = data.astype('float64')
    s_kmeans = KMeans(n_clusters=5).fit(data)
    pca_dataset = PCA().fit(scale(data))
    return pca_dataset

# Processing data with regular expression
REPLACE_NO_SPACE = re.compile("[.;:!\'?,\"()\[\]]")
REPLACE_WITH_SPACE = re.compile("(<br\s*/><br\s*/>)|(\-)|(\/)")

def preprocess_reviews(reviews):
    reviews = REPLACE_NO_SPACE.sub("", reviews.lower())
    reviews = REPLACE_WITH_SPACE.sub(" ", reviews)    
    return reviews
    
def sentiment_analysis(text):
    analysis = TextBlob(text)
    Sentiment = analysis.sentiment[0]
    return Sentiment

def subjectivity_analysis(text):
    analysis = TextBlob(text)
    Subjectivity = analysis.sentiment[1]
    return Subjectivity 

if __name__ == "__main__":
    # Load data
    trump = pd.read_csv('realdonaldtrump.csv')
    trump = pd.DataFrame(trump, columns = ['date','content','retweets','favorites'])
    sp = pd.read_csv('S&P.csv')
    sp = pd.DataFrame(sp, columns = ['Date', 'Adj Close'])
    dowjones = pd.read_csv('dowjones.csv')
    dowjones = pd.DataFrame(dowjones, columns = ['Date', 'Adj Close'])
    nasdaq = pd.read_csv('nasdaq.csv')
    nasdaq = pd.DataFrame(nasdaq, columns = ['Date', 'Adj Close'])
    oil_price = pd.read_csv('oil_price.csv')
    housing = pd.read_csv('US_Housing_Price.csv')
    currency = pd.read_csv('euro-dollar-exchange-rate-historical-chart.csv')
    
    # Processing Sentiment Score 
    stop = stopwords.words('english')   
    #trump =  trump.head(50)
    trump["t_content"]  = trump['content'].str.replace('http\S+|www.\S+', '', case=False)
    trump["t_content"] = trump["t_content"].map(lambda x:preprocess_reviews(x) )
    trump["t_content"]  = trump["t_content"].apply(lambda x: ' '.join([item for item in x.split() if item not in stop]))
    trump["Sentiment"] = trump.t_content.map(lambda x:sentiment_analysis(x) )
    trump["Subjectivity"] = trump.t_content.map(lambda x:subjectivity_analysis(x) )  
    # Uniform Date format
    dowjones['Date'] = pd.to_datetime(dowjones['Date']).dt.strftime('%Y-%m-%d')
    nasdaq['Date'] = pd.to_datetime(nasdaq['Date']).dt.strftime('%Y-%m-%d')
    sp['Date'] = pd.to_datetime(sp['Date']).dt.strftime('%Y-%m-%d')
    currency['Date'] = pd.to_datetime(currency['Date']).dt.strftime('%Y-%m-%d')
    oil_price['Date'] = pd.to_datetime(oil_price['Date']).dt.strftime('%Y-%m-%d')
    trump['date'] = pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')
    # Merge data
    sp.columns = ['Date','sp_close']
    dowjones.columns = ['Date','dowjones_close']
    nasdaq.columns = ['Date','nasdaq_close']
    housing.columns =  ['Date','housing_price']
    merge_data = pd.merge(sp, dowjones, how='outer', on='Date')
    merge_data = pd.merge(merge_data, nasdaq, how='outer', on='Date')
    merge_data = pd.merge(merge_data,currency, how='left', on='Date')
    merge_data = pd.merge(merge_data,oil_price, how='left', on='Date')
    # Missing data
    merge_data.fillna(0)

    # Preprocessing data for mds/corr
    mds_data,label = mds_data(trump,sp,dowjones,nasdaq,currency,oil_price)
    

    trump = trump.groupby('date') 
    
    app.run(debug=True)