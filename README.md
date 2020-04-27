# CSE564-Final-Project

## API usage
#### tweets with sentiment()
- Route: /
- Type: JSON
- JSON example:
```
2015-01-01:
[{
"date": "2015-01-01",
"content": "Hear Donald Trump discuss big gov spending
"retweets": 6,
"favorites": 6,
"t_content": "hear donald trump discuss big gov spending (After Processing)
"Sentiment": -0.31, (Sentiment Score)
"Subjectivity": 0.1 (Subjectivity Score)
},
{
"date": "2015-01-01",
"content": "Hear Donald Trump discuss big gov spending
"retweets": 6,
"favorites": 6,
"t_content": "hear donald trump discuss big gov spending (After Processing)
"Sentiment": -0.31, (Sentiment Score)
"Subjectivity": 0.1 (Subjectivity Score)
}
]
```
#### stock()
- Route: /stock
- Type: JSON
- JSON example:
```
{   
"Date": "2019-09-09"
"Adj Close": 26835.509766,
"Normalize_Adj_Close": 0.8731173624527795 
}
```
#### oil_price()
- Route: /oil_price
- Type: JSON
- JSON example:
```
{  
"date": "2020-04-21",
"value": 9.12
}
```

#### currency()
- Route: /currency
- Type: JSON
- JSON example:  
```
} 
"date": "2020-04-21",
"value": 1.0855
}
```
#### housing 
- Route: /housing
- Type: JSON
- JSON example:  
```
{
"date": "2020-01-31",
"housing_price": 154547.0
}
```


## Datasets
#### realdonaldtrump.csv
- Name: tweets from trump
- Date: 2015-01-01 ~ 2020-04-14
- Column: id, link, content, date, retweets, favorites, mentions, hashtags
- Period: Daily

#### S&P.csv
- Name: S&P500 
- Date: 2015-01-01 ~ 2020-04-14
- Column: Date, Open, High, Low, Close, Adj Close, Volume
- Period: Daily

#### DowJones.csv
- Name: Dow Jones Industrial Average
- Date: 2015-01-01 ~ 2020-04-14
- Column: Date, Open, High, Low, Close, Adj Close, Volume
- Period: Daily

#### NASDAQ.csv
- Name: Nasdaq Composite
- Date: 2015-01-01 ~ 2020-04-14
- Column: Date, Open, High, Low, Close, Adj Close, Volume
- Period: Daily

#### oil_price.csv
- Name: Brent Crude Oil Prices - 10 Year Daily 
- Date: 2015-01-01 ~ 2020-04-14
- Column: date, value
- Period: Daily
- refer: https://www.macrotrends.net/2480/brent-crude-oil-prices-10-year-daily-chart

#### US_Housing_Price
- Name: Brent Crude Oil Prices - 10 Year Daily 
- Date: 2015-01-01 ~ 2020-03-31
- Column: date,housing_price
- Period: Monthly

#### euro-dollar-exchange-rate-historical-chart.csv
- Name: Brent Crude Oil Prices - 10 Year Daily 
- Date: 2015-01-01 ~ 2020-04-24
- Column: date,value
- Period: Monthly

