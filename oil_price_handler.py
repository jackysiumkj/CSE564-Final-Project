import pandas as pd

def oil_price_handler():
  oil_prices = pd.read_csv('./src/oil_price.csv')
  oil_prices['date'] = pd.to_datetime(oil_prices.date)
  oil_prices['date'] = oil_prices['date'].astype(str)

  return oil_prices