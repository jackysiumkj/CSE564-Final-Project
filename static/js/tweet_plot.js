const draw_tweets = () => {

  let dates = _.keys(rawTweets);
  let groupedTweets = _.values(rawTweets);

  // d3.select('#tweets-svg').selectAll('*').remove();
  const margin = {
    top: 4, 
    right: 32, 
    bottom: 4, 
    left: 32
  };
  
  let svg = d3.select('#tweets-svg');
  
  let horiMargin = margin.left + margin.right;
  let width = _.toNumber(svg.style('width').replace('px', '')) - horiMargin;
  if (width < _.size(dates) * 28 + horiMargin) width = _.size(dates) * 28;
  const height = _.toNumber(svg.style('height').replace('px', '')) - margin.top - margin.bottom;

  sharedWidth = width + horiMargin;

  svg = svg
    .attr('width', width + horiMargin)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  let x = d3.scaleBand()
    .domain(dates)
    .rangeRound([0, width])
    .paddingInner(.2);

  let y = d3.scaleLinear()
    .domain([0, _.max(_.map(groupedTweets, tweets => _.size(tweets)))])
    .range([height, 0]);

  // let xAxis = g => g.call(d3.axisBottom(x));
  let yAxis = g => g.call(d3.axisLeft(y));

  let stackBars = svg.selectAll('g.tweet')
    .data(groupedTweets)
    .enter()
  .append('g')
    .attr('class', 'g');
    // .attr('transform', function(d) { return "translate(" + x0(d.State) + ",0)"; });
 
  stackBars.selectAll('rect')
    .data(d => d)
    .enter()
  .append('rect')
    .attr('cursor', 'pointer')
    .attr('x', (d, i) => x(d.date))
    .attr('y', (d, i) => y(i + 1) + 0.5)
    .attr('width', x.bandwidth())
    .attr('height', (d, i) => y(i) - y(i + 1) - 1)
    .style('fill', '#00acee')
    .attr('data-toggle', 'popover')
    .attr('title', 'hover')
    .attr('trigger', 'hover')
    .attr('content', 'content')
    .on('mouseover', blockMouseoverHandler)
    .on('mouseout', blockMouseoutHandler)
    .on('click', blockOnClickHandler);
    
  // svg.append('g')
  //   .selectAll('g.tweet')
  //   .data(groupedTweets)
  //   .enter()
  // .append('g')
  //   .attr('class', 'bars')
  //   // .attr('cursor', disableOnClick ? 'auto' : 'pointer')
  //   // .attr('x', (d, i) => x(dates[i]))
  //   // .attr('y', d => y(_.size(d)))
  //   .attr('fill', '#00acee')
  //   // .attr('width', x.bandwidth())
  //   // .attr('height', d => height - y(_.size(d)))
  //   .selectAll('g')
  // .data(d => d)
  //   .enter()
  // .append('rect')
  //   .attr('x', function(d) { return x(d.x); })
  //   .attr('y', function(d) { return y(d.y0 + d.y); })
  //   .attr('height', function(d) { return y(d.y0) - y(d.y0 + d.y); })
  //   .attr('width', x.rangeBand());
  //   // .on('mouseover', mouseoverBarHandler)
  //   // .on('mouseout', mouseoutBarHandler)
  //   // .on('click', disableOnClick ? null : barOnClickHandler);

  // svg.append('g')
  //   .attr('class', 'x-axis')
  //   .attr('transform', 'translate(0,' + height + ')')
  //   .call(xAxis)
  // .selectAll('text')
  //   .attr('y', 8)
  //   .attr('x', -8)
  //   .attr('dy', '.35em')
  //   .attr('transform', 'rotate(-60)')
  //   .attr('text-anchor', 'end');

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
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
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
      .style('fill', '#0180b1')
      .attr('stroke', '#0180b1');

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
      .style('fill', '#00acee')
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

    console.log(tweet);
  }
}