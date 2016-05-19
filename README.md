"# forex" 

-Daily OHLC data is pulled from Sierra Chart files and stored in MongoDB


/readfromdb/{pair}/{start_year}/{start_month}/{start_day}/{end_year}/{end_month}/{end_day}
-data is read from MongoDB and returned as an array of json objects

/#/graph
-graphs a currency pair over a specified date range

/#/table
-tabulates currency pair performance over a specified interval