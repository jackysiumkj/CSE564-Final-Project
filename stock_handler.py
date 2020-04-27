import pandas as pd
from sklearn import preprocessing

def stock_handler():
  sp = pd.read_csv('./src/S&P.csv')
  sp = pd.DataFrame(sp, columns = ['Date', 'Adj Close'])
  dowjones = pd.read_csv('./src/dowjones.csv')
  dowjones = pd.DataFrame(dowjones, columns = ['Date', 'Adj Close'])
  nasdaq = pd.read_csv('./src/nasdaq.csv')
  nasdaq = pd.DataFrame(nasdaq, columns = ['Date', 'Adj Close'])

  x_sp = sp[['Adj Close']].values.astype(float)
  x_dowjones = dowjones[['Adj Close']].values.astype(float)
  x_nasdaq = nasdaq[['Adj Close']].values.astype(float)

  min_max_scaler = preprocessing.MinMaxScaler()

  x_sp_scaled = min_max_scaler.fit_transform(x_sp)
  x_dowjones_scaled = min_max_scaler.fit_transform(x_dowjones)
  x_nasdaq_scaled = min_max_scaler.fit_transform(x_nasdaq)

  # sp['Normalize_Adj_Close'] = pd.DataFrame(x_sp_scaled)
  # dowjones['Normalize_Adj_Close'] = pd.DataFrame(x_dowjones_scaled)
  # nasdaq['Normalize_Adj_Close'] = pd.DataFrame(x_nasdaq_scaled)
    
  return sp, dowjones, nasdaq