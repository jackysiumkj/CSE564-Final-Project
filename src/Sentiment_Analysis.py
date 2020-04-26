import re
import pandas as pd
from textblob import TextBlob
import matplotlib.pyplot as plt
from sklearn import preprocessing
import json
import nltk
nltk.download('stopwords')
from nltk.corpus import stopwords
import datetime
from datetime import datetime
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

if __name__ == "__main__":
    
    #x = sp.values #returns a numpy array
    #x_sp = sp[['Adj Close']].values.astype(float)
    #x_DowJones = DowJones[['Adj Close']].values.astype(float)
    #x_NASDAQ = NASDAQ[['Adj Close']].values.astype(float)
    # Create a minimum and maximum processor object
    #min_max_scaler = preprocessing.MinMaxScaler()

    # Create an object to transform the trump to fit minmax processor
    #x_sp_scaled = min_max_scaler.fit_transform(x_sp)
    #x_DowJones_scaled = min_max_scaler.fit_transform(x_DowJones)
    #x_NASDAQ_scaled = min_max_scaler.fit_transform(x_NASDAQ)


    # Run the normalizer on the DataFrame
    #sp['Normalize_Adj_Close'] = pd.DataFrame(x_sp_scaled)
    #DowJones['Normalize_Adj_Close'] = pd.DataFrame(x_DowJones_scaled)
    #NASDAQ['Normalize_Adj_Close'] = pd.DataFrame(x_NASDAQ_scaled)
    
    
    stop = stopwords.words('english') 
    #trump =  trump.head(50)
    #trump['date'] = pd.to_datetime(trump['date']).dt.normalize()


    trump["t_content"]  = trump['content'].str.replace('http\S+|www.\S+', '', case=False)
    trump["t_content"] = trump["t_content"].map(lambda x:preprocess_reviews(x) )
    trump["t_content"]  = trump["t_content"].apply(lambda x: ' '.join([item for item in x.split() if item not in stop]))
    trump["Sentiment"] = trump.t_content.map(lambda x:sentiment_analysis(x) )
    trump["Subjectivity"] = trump.t_content.map(lambda x:subjectivity_analysis(x) )


    trump['date'] = pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')

    #trump['date'] = pd.to_datetime(trump['date']).dt.date
    trump = trump.groupby('date') 
    trump = trump.apply(lambda x: x.to_json(orient='records'))
    
    #trump = json.dumps(trump.to_dict(orient='records'), indent=2)
   
     
    
    
    #trump["date"] = trump.sort_values('date', ascending=True)
    #print(trump["date"])
    #plt.plot(NASDAQ['Date'], NASDAQ['Normalize_Adj_Close'])
    #plt.show()

