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
    oil_price['date'] = pd.to_datetime(oil_price.date)
    oil_price['date'] = oil_price['date'].astype(str)

    currency = pd.read_csv('euro-dollar-exchange-rate-historical-chart.csv')
    currency['date'] = pd.to_datetime(currency.date)
    currency['date'] = currency['date'].astype(str) 

    housing = pd.read_csv('US_Housing_Price.csv')
    housing['date'] = pd.to_datetime(housing.date)
    housing['date'] = housing['date'].astype(str) 

    # Processing Sentiment Score 
    stop = stopwords.words('english')   
    #trump =  trump.head(50)
    trump["t_content"]  = trump['content'].str.replace('http\S+|www.\S+', '', case=False)
    trump["t_content"] = trump["t_content"].map(lambda x:preprocess_reviews(x) )
    trump["t_content"]  = trump["t_content"].apply(lambda x: ' '.join([item for item in x.split() if item not in stop]))
    trump["Sentiment"] = trump.t_content.map(lambda x:sentiment_analysis(x) )
    trump["Subjectivity"] = trump.t_content.map(lambda x:subjectivity_analysis(x) )   
    trump['date']  =pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')
    trump = trump.groupby('date') 
    
    
    # Processing stock data
    x_sp = sp[['Adj Close']].values.astype(float)
    x_dowjones = dowjones[['Adj Close']].values.astype(float)
    x_nasdaq = nasdaq[['Adj Close']].values.astype(float)
    
    # Create a minimum and maximum processor object
    min_max_scaler = preprocessing.MinMaxScaler()

    # Create an object to transform the data to fit minmax processor
    x_sp_scaled = min_max_scaler.fit_transform(x_sp)
    x_dowjones_scaled = min_max_scaler.fit_transform(x_dowjones)
    x_nasdaq_scaled = min_max_scaler.fit_transform(x_nasdaq)

    # Run the normalizer on the dataframe
    sp['Normalize_Adj_Close'] = pd.DataFrame(x_sp_scaled)
    dowjones['Normalize_Adj_Close'] = pd.DataFrame(x_dowjones_scaled)
    nasdaq['Normalize_Adj_Close'] = pd.DataFrame(x_nasdaq_scaled)

    app.run(debug=True)