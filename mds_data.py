import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def mds_data(trump,sp,dowjones,nasdaq,currency,oil_price):
    trump['Date'] = pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')
    dowjones['Date'] = pd.to_datetime(dowjones['Date']).dt.strftime('%Y-%m-%d')
    nasdaq['Date'] = pd.to_datetime(nasdaq['Date']).dt.strftime('%Y-%m-%d')
    sp['Date'] = pd.to_datetime(sp['Date']).dt.strftime('%Y-%m-%d')
    currency['Date'] = pd.to_datetime(currency['Date']).dt.strftime('%Y-%m-%d')
    oil_price['Date'] = pd.to_datetime(oil_price['Date']).dt.strftime('%Y-%m-%d')
    unique = trump.date.unique() 
    
    trump = trump[['Date', 'Sentiment', 'Subjectivity', 'retweets', 'favorites']]
    trump = trump.groupby('Date').mean().reset_index()

    
    merge_data = pd.merge(trump, dowjones, how='left', on='Date')
    merge_data = pd.merge(merge_data, sp, how='left', on='Date')
    merge_data = pd.merge(merge_data, nasdaq, how='left', on='Date')
    merge_data = pd.merge(merge_data,currency, how='left', on='Date')
    merge_data = pd.merge(merge_data,oil_price, how='left', on='Date')
    merge_data.fillna(merge_data.mean(),inplace=True)
    merge_data['year'] = pd.DatetimeIndex(merge_data['Date']).year
    label = merge_data.loc[:,['year']].values
    
    merge_data = merge_data.apply(LabelEncoder().fit_transform)
    merge_data = pd.DataFrame(StandardScaler().fit_transform(merge_data))
    merge_data = merge_data.astype('float64')
    return merge_data,label