let color = null;
let tweetColorBy = 'retweets';

const colorSet = {
  retweets: '#17bf63',
  favorites: '#e0245e',
  Sentiment: '#ff8bdf',
}

const draw_tweets = () => {
  let groupedTweets = _.values(rawTweets);

  let svg = d3.select('#tweets-svg');
  
  let horiMargin = sharedMargin.left + sharedMargin.right;
  let width = sharedWidth - horiMargin;
  const height = _.toNumber(svg.style('height').replace('px', '')) - sharedMargin.top - sharedMargin.bottom;

  svg = svg
    .attr('width', sharedWidth)
  .append('g')
    .attr('transform', 'translate(' + sharedMargin.left + ',' + sharedMargin.top + ')');

  let max = _.chain(groupedTweets).map(tweets => _.map(tweets, tweetColorBy)).flatten().max().value();
  let min = _.chain(groupedTweets).map(tweets => _.map(tweets, tweetColorBy)).flatten().min().value();
  color = d3.scaleLinear()
    .domain([min, max])
    .range([secondaryColor, colorSet[tweetColorBy]]);
  
  let x = d3.scaleBand()
    .domain(sharedDates)
    .rangeRound([0, width])
    .paddingInner(.2);

  let y = d3.scaleLinear()
    .domain([0, _.max(_.map(groupedTweets, tweets => _.size(tweets)))])
    .range([height, 0]);

  let yAxis = g => g.call(d3.axisLeft(y));

  let stackBars = svg.selectAll('g.tweet')
    .data(groupedTweets)
    .enter()
  .append('g')
    .attr('class', 'g');
 
  stackBars.selectAll('rect')
    .data(d => d)
    .enter()
  .append('rect')
    .attr('cursor', 'pointer')
    .attr('x', (d, i) => x(d.date))
    .attr('y', (d, i) => y(i + 1) + 0.5)
    .attr('width', x.bandwidth())
    .attr('height', (d, i) => y(i) - y(i + 1) - 1)
    .style('fill', tweet => color(tweet[tweetColorBy]))
    .attr('id', (d, i) => `rect_${d.date}_${i}`)
    .on('mouseover', blockMouseoverHandler)
    .on('mouseout', blockMouseoutHandler)
    .on('click', blockOnClickHandler);
    
  svg.append('g')
    .attr('class', 'y')
    .style('opacity','0')
    .call(yAxis)
  .append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'start')
    .text('Number of Tweets');
    
  svg.selectAll('.y')
    .transition()
    .duration(500)
    .delay(500)
    .style('opacity','1');

  function blockMouseoverHandler(tweet) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('fill', d3.rgb(color(tweet[tweetColorBy])).darker(2))
      .attr('stroke', d3.rgb(color(tweet[tweetColorBy])).darker(2));

    d3.select('#tooltip-div')
      .transition()		
      .duration(200)		
      .style('opacity', .9);
    
    d3.select('#tooltip-div')
      .style('left', (d3.event.pageX + 24) + 'px')		
      .style('top', (d3.event.pageY - 24) + 'px');
    
    document.getElementById('tooltip-content').innerHTML = tweet.content;
  }

  function blockMouseoutHandler(tweet) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('fill', color(tweet[tweetColorBy]))
      .attr('stroke', 'none');
    
    d3.select('#tooltip-div')
      .transition()	
      .duration(200)
      .style('opacity', 0);
  }

  function blockOnClickHandler(tweet) {
    document.getElementById('tweet-date').innerHTML = tweet.date;
    document.getElementById('tweet-content').innerHTML = tweet.content;
    document.getElementById('tweet-retweets').innerHTML = tweet.retweets;
    document.getElementById('tweet-favorites').innerHTML = tweet.favorites;
    document.getElementById('tweet-sentiment').innerHTML = tweet.Sentiment;
    document.getElementById('tweet-subjectivity').innerHTML = tweet.Subjectivity;

    document.getElementById('tweet-link').href = tweet.link;
    document.getElementById('tweet-link').target = '_blank';

    displayRatesForDetail(tweet.date);
  }
}

function cleanTweetDetail(date) {
  document.getElementById('tweet-date').innerHTML = date;
  document.getElementById('tweet-content').innerHTML = '';
  document.getElementById('tweet-retweets').innerHTML = '';
  document.getElementById('tweet-favorites').innerHTML = '';
  document.getElementById('tweet-sentiment').innerHTML = '';
  document.getElementById('tweet-subjectivity').innerHTML = '';

  document.getElementById('tweet-link').href = '#';
  document.getElementById('tweet-link').removeAttribute('target');
}

function handleTweetColorOnChange(value) {
  const groupedTweets = _.values(rawTweets);
  tweetColorBy = value;
  
  let max = _.chain(groupedTweets).map(tweets => _.map(tweets, tweetColorBy)).flatten().max().value();
  let min = _.chain(groupedTweets).map(tweets => _.map(tweets, tweetColorBy)).flatten().min().value();
  color = d3.scaleLinear()
    .domain([min, max])
    .range([secondaryColor, colorSet[tweetColorBy]]);

  _.each(groupedTweets, tweets => {
    _.each(tweets, (tweet, index) => {
      d3.select(`#rect_${tweet.date}_${index}`).style('fill', color(tweet[tweetColorBy]));
    });
  });
}