import re
import pandas as pd
from textblob import TextBlob
import matplotlib.pyplot as plt
from sklearn import preprocessing
import json
import nltk
from sklearn.manifold import MDS
nltk.download('stopwords')
from nltk.corpus import stopwords
import datetime
from datetime import datetime
from sklearn.preprocessing import LabelEncoder, StandardScaler, scale
from boto import sns
import numpy as np
from sklearn.cluster import KMeans
from scipy.spatial.distance import cdist
from sklearn.decomposition import PCA
from sklearn.preprocessing import scale
from sklearn.cluster import KMeans
'''
Load trump

reviews_train = []
for line in open('realdonaldtrump.csv', 'r'):
    reviews_train.append(line.strip())
'''
trump = pd.read_csv('realdonaldtrump.csv')
trump = pd.DataFrame(trump, columns = ['date','content','retweets','favorites'])
sp = pd.read_csv('S&P.csv')
sp = pd.DataFrame(sp, columns = ['Date', 'Adj Close'])
DowJones = pd.read_csv('DowJones.csv')
DowJones = pd.DataFrame(DowJones, columns = ['Date', 'Adj Close'])
NASDAQ = pd.read_csv('NASDAQ.csv')
NASDAQ = pd.DataFrame(NASDAQ, columns = ['Date', 'Adj Close'])
housing = pd.read_csv('US_Housing_Price.csv')
housing = pd.DataFrame(housing, columns = ['date', 'housing_price'])
currency = pd.read_csv('euro-dollar-exchange-rate-historical-chart.csv')
oil_price = pd.read_csv('oil_price.csv')

# Processing trump with regular expression
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

def get_euclidean(sample):
  
  mds_df_resulst = pd.DataFrame()
  
  sample_matrix = pd.DataFrame(scale(sample))
  euclidean_vec = MDS(n_components=4).fit_transform(sample_matrix)
  euclidean_vec = pd.DataFrame(euclidean_vec)

  mds_df_resulst['x'] = euclidean_vec[0]
  mds_df_resulst['y'] = euclidean_vec[1]

  return mds_df_resulst
def get_correlation(sample):

  mds_df_resulst = pd.DataFrame()

  sample_matrix = pd.DataFrame(scale(sample))
  sample_matrix = sample_matrix.transpose()
  sample_corr_m = sample_matrix.corr()
  
  correlations = MDS(n_components=4, dissimilarity='precomputed').fit_transform(1 - sample_corr_m)
  correlations = pd.DataFrame(correlations)
  
  mds_df_resulst['x'] = correlations[0]
  mds_df_resulst['y'] = correlations[1]
  
  return mds_df_resulst

def best_kmean(data): 
    #print(data.shape())
    data = data.apply(LabelEncoder().fit_transform)
    distortions = []
    K = range(1,14)
    for k in K:
        _kmeans = KMeans(n_clusters=k).fit(data)
        distortions.append(sum(np.min(cdist(data, _kmeans.cluster_centers_, 'euclidean'), axis=1)) / data.shape[0])
        
    plt.figure(figsize=(16,8))
    plt.plot(K, distortions, 'bx-')
    plt.xlabel('k')
    plt.ylabel('Distortion')
    plt.title('The Elbow Method showing the optimal k')
    plt.show()

def best_pca(data):
    data = data.apply(preprocessing.LabelEncoder().fit_transform)
    data = data.astype('float64')
    s_kmeans = KMeans(n_clusters=2).fit(data)
    pca_dataset = PCA().fit(scale(data))

    plt.figure()
    plt.plot(np.cumsum(pca_dataset.explained_variance_ratio_), '-o', label='org')
    plt.xlabel('Components')
    plt.ylabel('Variance')
    plt.title('PCA')
    plt.legend(loc='upper left')
    plt.show()


if __name__ == "__main__":
    
    x = sp.values #returns a numpy array
    x_sp = sp[['Adj Close']].values.astype(float)
    x_DowJones = DowJones[['Adj Close']].values.astype(float)
    x_NASDAQ = NASDAQ[['Adj Close']].values.astype(float)
    # Create a minimum and maximum processor object
    min_max_scaler = preprocessing.MinMaxScaler()

    # Create an object to transform the trump to fit minmax processor
    x_sp_scaled = min_max_scaler.fit_transform(x_sp)
    x_DowJones_scaled = min_max_scaler.fit_transform(x_DowJones)
    x_NASDAQ_scaled = min_max_scaler.fit_transform(x_NASDAQ)


    # Run the normalizer on the DataFrame
    sp['Normalize_Adj_Close'] = pd.DataFrame(x_sp_scaled)
    DowJones['Normalize_Adj_Close'] = pd.DataFrame(x_DowJones_scaled)
    NASDAQ['Normalize_Adj_Close'] = pd.DataFrame(x_NASDAQ_scaled)
    
    
    stop = stopwords.words('english') 
    #trump =  trump.head(1000)
    trump['date'] = pd.to_datetime(trump['date']).dt.normalize()


    trump["t_content"]  = trump['content'].str.replace('http\S+|www.\S+', '', case=False)
    trump["t_content"] = trump["t_content"].map(lambda x:preprocess_reviews(x) )
    trump["t_content"]  = trump["t_content"].apply(lambda x: ' '.join([item for item in x.split() if item not in stop]))
    trump["Sentiment"] = trump.t_content.map(lambda x:sentiment_analysis(x) )
    trump["Subjectivity"] = trump.t_content.map(lambda x:subjectivity_analysis(x) )


    trump['date'] = pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')
    DowJones['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    NASDAQ['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    sp['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    currency['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    oil_price['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    unique = trump.date.unique() 
    
    trump = trump[['date','Sentiment','Subjectivity','retweets','favorites']]
    trump = trump.groupby('date').mean().reset_index()
    #trump['Date'] = unique
    #trump = trump.apply(lambda x: x.to_json(orient='records')) 

    #print(trump)
    trump.columns = ['Date','Sentiment', 'Subjectivity','retweets','favorites']
    sp.columns = ['Date','sp_close', 'normal_sp_close']
    DowJones.columns = ['Date','dowjones_close', 'normal_dowjones_close']
    NASDAQ.columns = ['Date','nasdaq_close', 'normal_nasdaq_close']
    housing.columns =  ['Date','housing_price']
    merge_data = pd.merge(trump, DowJones, how='left', on='Date')
    NASDAQ.drop(columns=['normal_nasdaq_close'])
    DowJones.drop(columns=['normal_dowjones_close'])
    sp.drop(columns=['normal_sp_close'])
    trump.drop(columns=['Subjectivity','retweets','favorites'])
    
    
    merge_data = pd.merge(merge_data, sp, how='left', on='Date')
    merge_data = pd.merge(merge_data, NASDAQ, how='left', on='Date')
    merge_data = pd.merge(merge_data,currency, how='left', on='Date')
    merge_data = pd.merge(merge_data,oil_price, how='left', on='Date')
    merge_data.fillna(merge_data.mean(),inplace=True)
    merge_data['year'] = pd.DatetimeIndex(merge_data['Date']).year
    label = merge_data.loc[:,['year']].values
    #print(merge_data.shape)
    #best_pca(merge_data)
    #best_kmean(merge_data)
    
    merge_data = merge_data.apply(LabelEncoder().fit_transform)
    merge_data = pd.DataFrame(StandardScaler().fit_transform(merge_data))
    merge_data = merge_data.astype('float64')
    
    #print(merge_data)
    
    mds_plot = get_euclidean(merge_data)
    mds_plot['label'] = label
    print(mds_plot)
    #plt.plot(mds_plot['x'], mds_plot['y'], 'ro')
    #plt.scatter(mds_plot['x'], mds_plot['y'], c=mds_plot['label'])
    
    #plt.show()
    
    