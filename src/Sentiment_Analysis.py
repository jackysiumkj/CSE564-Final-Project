import re
import pandas as pd
from textblob import TextBlob
import matplotlib.pyplot as plt
from sklearn import preprocessing
'''
Load Data

reviews_train = []
for line in open('realdonaldtrump.csv', 'r'):
    reviews_train.append(line.strip())
'''
data = pd.read_csv('realdonaldtrump.csv')
data = pd.DataFrame(data, columns = ['id', 'date','content','retweets','favorites'])
sp = pd.read_csv('S&P.csv')
sp = pd.DataFrame(sp, columns = ['Date', 'Adj Close'])
DowJones = pd.read_csv('DowJones.csv')
DowJones = pd.DataFrame(DowJones, columns = ['Date', 'Adj Close'])
NASDAQ = pd.read_csv('NASDAQ.csv')
NASDAQ = pd.DataFrame(NASDAQ, columns = ['Date', 'Adj Close'])


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
    
    #x = sp.values #returns a numpy array
    x_sp = sp[['Adj Close']].values.astype(float)
    x_DowJones = DowJones[['Adj Close']].values.astype(float)
    x_NASDAQ = NASDAQ[['Adj Close']].values.astype(float)
    # Create a minimum and maximum processor object
    min_max_scaler = preprocessing.MinMaxScaler()

    # Create an object to transform the data to fit minmax processor
    x_sp_scaled = min_max_scaler.fit_transform(x_sp)
    x_DowJones_scaled = min_max_scaler.fit_transform(x_DowJones)
    x_NASDAQ_scaled = min_max_scaler.fit_transform(x_NASDAQ)


    # Run the normalizer on the dataframe
    sp['Normalize_Adj_Close'] = pd.DataFrame(x_sp_scaled)
    DowJones['Normalize_Adj_Close'] = pd.DataFrame(x_DowJones_scaled)
    NASDAQ['Normalize_Adj_Close'] = pd.DataFrame(x_NASDAQ_scaled)
    
    
    
    #data =  data.head(50)
    #data["t_content"] = data.content.map(lambda x:preprocess_reviews(x) )
    #data["Sentiment"] = data.t_content.map(lambda x:sentiment_analysis(x) )
    #data["Subjectivity"] = data.t_content.map(lambda x:subjectivity_analysis(x) )
    #data["date"] = pd.to_datetime(data["date"])
    
    #data["date"] = data.sort_values('date', ascending=True)
    #print(data["date"])
    plt.plot(NASDAQ['Date'], NASDAQ['Normalize_Adj_Close'])
    plt.show()

