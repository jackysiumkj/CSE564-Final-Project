import pandas as pd
from sklearn.preprocessing import LabelEncoder, StandardScaler

def mds_data(trump,sp,DowJones,NASDAQ,currency,oil_price):
    trump['Date'] = pd.to_datetime(trump['date']).dt.strftime('%Y-%m-%d')
    DowJones['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    NASDAQ['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    sp['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    currency['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    oil_price['Date'] = pd.to_datetime(DowJones['Date']).dt.strftime('%Y-%m-%d')
    unique = trump.date.unique() 
    
    trump = trump[['Date','Sentiment','Subjectivity','retweets','favorites']]
    trump = trump.groupby('Date').mean().reset_index()

    
    merge_data = pd.merge(trump, DowJones, how='left', on='Date')
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
    return merge_data,label