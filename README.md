#"# forex"

Front-end routes:
-----------------

### /#/table

 - tabulates currency pair performance over a specified interval
 - darkest green/darkest red squares highlight best/worst performing pairs.
 - green/red outlines highlight best/worst performing currency against a single pair

### /#/readandstore

 - Daily OHLC data is pulled from Sierra Chart files and stored in MongoDB "forex" database, under the "ohlcs" collections
 - Sierra Chart data files are included in (repository root)\sierrachart\data, the data file path is specified in routes\dataFilesPath.js
 - Shows earliest ohlc data date in file (green) and most recent ohlc data date in file (red)
 - Can retrieve most recent data by clicking on each pair

### /#/graph
 - graphs a currency pair over a specified date range

Back-end routes:
----------------

### /getdates/{pair}

 - returns first data date and last data date in database for {pair}

###/getdifference/{pair}/{start date}/{period}
###/getdifference/{pair}/{period}

 - returns percent difference in {pair} from {start_date}/most recent date going back {period} days
 - returns json object with percent difference

###/readfromdb/{pair}/{start_year}/{start_month}/{start_day}/{end_year}/{end_month}/{end_day}

 - data is read from MongoDB and returned as an array of json objects

###/readfromfile/{pair}

 - data is read from c:\sierrachart\data\{pair}.dly file, returns json object with data

###/storeindb/{pair}

 - data is stored in MongoDB database