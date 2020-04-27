import pandas as pd
import re
from nltk.corpus import stopwords
from textblob import TextBlob

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

def tweets_handler():
  tweets = pd.read_csv('./src/realdonaldtrump.csv')
  tweets = pd.DataFrame(tweets, columns = ['date', 'content', 'retweets', 'favorites'])
  
  tweets = tweets.tail(10000)

  stop = stopwords.words('english')
  tweets["t_content"] = tweets['content'].str.replace('http\S+|www.\S+', '', case=False)
  tweets["t_content"] = tweets["t_content"].map(lambda x:preprocess_reviews(x) )
  tweets["t_content"] = tweets["t_content"].apply(lambda x: ' '.join([item for item in x.split() if item not in stop]))
  tweets["Sentiment"] = tweets.t_content.map(lambda x:sentiment_analysis(x) )
  tweets["Subjectivity"] = tweets.t_content.map(lambda x:subjectivity_analysis(x) )   
  tweets['date'] = pd.to_datetime(tweets['date']).dt.strftime('%Y-%m-%d')

  return tweets