const relatedRatesColorSet = {
  oilPrice: '#17bf63',
  housePrice: '#e0245e',
  dollarPrice: '#ff8bdf',
}
const relatedRatesEnable = {
  oilPrice: true,
  housePrice: true,
  dollarPrice: true,
}

const draw_related_rates = () => {

//   let dates = _.keys(rawTweets);
//   let groupedTweets = _.values(rawTweets);

//   // d3.select('#tweets-svg').selectAll('*').remove();
//   const margin = {
//     top: 4, 
//     right: 32, 
//     bottom: 4, 
//     left: 32
//   };
  
  let svg = d3.select('#related-rates-svg');
  let oilPrices = _.filter(rawOilPrices, oil => _.includes(sharedDates, oil.date));
  
  let horiMargin = sharedMargin.left + sharedMargin.right;
  let width = sharedWidth - horiMargin;
  const height = _.toNumber(svg.style('height').replace('px', '')) - sharedMargin.top - (sharedMargin.bottom + 16);

  svg = svg
    .attr('width', sharedWidth)
  .append('g')
    .attr('transform', 'translate(' + sharedMargin.left + ',' + (sharedMargin.top - 8) + ')');

  let x = d3.scaleBand()
    .domain(sharedDates)
    .rangeRound([0, width])
    .paddingInner(.2);

  console.log(oilPrices);

  let max = _.max(_.map(oilPrices, 'value')) + 5;
  let min = _.min(_.map(oilPrices, 'value')) - 5;

  let oilPriceY = d3.scaleLinear()
    .domain([min < 0 ? 0 : min, max])
    .range([height, 48]);

  let oilPriclines = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => oilPriceY(d.value))
    .curve(d3.curveMonotoneX);

  let dayXAxis = g => g.call(d3.axisTop(x).tickFormat((d, i) => (i === 0 || /\d{4}-\d{2}-01/.test(d)) ? '|' : d.substring(8)).tickSize(0));
  let dateXAxis = g => g.call(d3.axisTop(x).tickFormat((d, i) => (i === 0 || /\d{4}-\d{2}-01/.test(d)) ? d : '' ).tickSize(0));
  let yAxis = g => g.call(d3.axisLeft(oilPriceY));

  svg.append('path')
  .data([oilPrices])
    .attr('id', 'oil_path')
    .attr('class', `line`)
    .attr('d', oilPriclines)
    .attr('fill', 'none')
    .attr('stroke', relatedRatesColorSet.oilPrice);

  svg.selectAll(`.dot`)
  .data(oilPrices)
    .enter()
  .append('circle')
    .attr('class', `dot`)
    .attr('r', 3.5)
    .attr('cx', d => x(d.date) + x.bandwidth() / 2)
    .attr('cy', d => oilPriceY(d.value))
    .attr('fill', relatedRatesColorSet.oilPrice)
    .attr('cursor', 'pointer')
    .on('mouseover', dotMouseoverHandler)
    .on('mouseout', dotMouseoutHandler)
    .on('click', dotOnClickHandler);

  svg.append('g')
    .call(dayXAxis)
    .call(g => g.select('.domain').remove())
  .selectAll('text')
    .attr('y', 16)
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle');
  
  svg.append('g')
    .call(dateXAxis)
    .call(g => g.select('.domain').remove())
  .selectAll('text')
    .attr('y', 32)
    .attr('dy', '.35em')
    .attr('text-anchor', 'middle');

  svg.append('g')
    .attr('class', 'y')
    .style('opacity','0')
    .call(yAxis)
  .append('text')
    .attr('x', 8)
    .attr('y', 72)
    .attr('class', '#607e8c')
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'start')
    .text('Oil Price');
    
  svg.selectAll('.y')
    .transition()
    .duration(500)
    .delay(500)
    .style('opacity','1');

  function dotMouseoverHandler(data) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('fill', d3.rgb(relatedRatesColorSet.oilPrice).darker(2))
      .attr('stroke', d3.rgb(relatedRatesColorSet.oilPrice).darker(2));

    d3.select('#tooltip-div')
      .transition()		
      .duration(200)		
      .style('opacity', .9);
    
    d3.select('#tooltip-div')
      .style('left', (d3.event.pageX + 24) + 'px')		
      .style('top', (d3.event.pageY - 24) + 'px');
    
    document.getElementById('tooltip-content').innerHTML = `${data.value} USD / Gal`;
  }

  function dotMouseoutHandler(data) {
    d3.select(this)
      .transition()
      .duration(100)
      .style('fill', relatedRatesColorSet.oilPrice)
      .attr('stroke', 'none');
    
    d3.select('#tooltip-div')
      .transition()	
      .duration(200)
      .style('opacity', 0);
  }

  function dotOnClickHandler(data) {
    displayRatesForDetail(data.date);
    cleanTweetDetail(data.date);
  }
}

function displayRatesForDetail(date) {

  // function getXY(len) {
  //   var point = oilPath.getPointAtLength(len);
  //   return [point.x, point.y];
  // }
  // let curlen = 0;
  // while (getXY(curlen)[0] < 5) { curlen += 0.01; }
  // console.log(getXY(curlen));

  // let indexOfRates = _.findIndex(rawOilPrices, { date: tweet.date });
  // if (indexOfRates === -1) return;
  // let relatedRates = rawOilPrices[indexOfRates];
  // if (relatedRates.value) document.getElementById('detail-oil-price').innerHTML = `${relatedRates.value} USD / Gal`;
  // else {
    
  // }
}

function handleRRLegendOnClick(value) {
  relatedRatesEnable[value] = !relatedRatesEnable[value];

  let isEnabled = relatedRatesEnable[value];
  document.getElementById(`${value}_legend`).style.opacity = isEnabled ? 1 : 0.5;
}