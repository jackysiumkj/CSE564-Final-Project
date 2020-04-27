const relatedRatesColorSet = {
  cu: '#e0245e',
  oi: '#17bf63',
  dj: '#7841ff',
  nd: '#fc74ff',
  sp: '#e2950c',
  ho: '#2378f5',
}
const relatedRatesEnable = {
  cu: true,
  oi: true,
  dj: true,
  nd: true,
  sp: true,
  ho: true,
}
const relatedRatesLabels = {
  cu: 'Currency',
  oi: 'Oil Price',
  dj: 'Dow Jones Close Price',
  nd: 'NASDAQ',
  sp: 'S&P 500',
  ho: 'House Price',
}

let updateRRSPlot = null;

const draw_related_rates = () => {
  let svg = d3.select('#related-rates-svg');
  
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

  let minMaxCu = [_.min(_.map(cuPrices, 'value')), _.max(_.map(cuPrices, 'value'))];
  let minMaxDJ = [_.min(_.map(djPrices, 'value')), _.max(_.map(djPrices, 'value'))];
  let minMaxOi = [_.min(_.map(oiPrices, 'value')), _.max(_.map(oiPrices, 'value'))];
  let minMaxND = [_.min(_.map(ndPrices, 'value')), _.max(_.map(ndPrices, 'value'))];
  let minMaxSP = [_.min(_.map(spPrices, 'value')), _.max(_.map(spPrices, 'value'))];
  let cuY = d3.scaleLinear().domain(minMaxCu).range([height, 48]);
  let oiY = d3.scaleLinear().domain(minMaxOi).range([height, 48]);
  let djY = d3.scaleLinear().domain(minMaxDJ).range([height, 48]);
  let ndY = d3.scaleLinear().domain(minMaxND).range([height, 48]);
  let spY = d3.scaleLinear().domain(minMaxSP).range([height, 48]);
  
  let minMaxHo = [_.min(_.map(hoPrices, 'value')), _.max(_.map(hoPrices, 'value'))];
  let hoY = d3.scaleLinear().domain(minMaxHo).range([height, 48]);

  let cuLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => cuY(d.value))
    .curve(d3.curveMonotoneX);
  let oiLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => oiY(d.value))
    .curve(d3.curveMonotoneX);
  let djLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => djY(d.value))
    .curve(d3.curveMonotoneX);
  let ndLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => ndY(d.value))
    .curve(d3.curveMonotoneX);
  let spLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => spY(d.value))
    .curve(d3.curveMonotoneX);
  let hoLine = d3.line()
    .x(d => x(d.date) + x.bandwidth() / 2)
    .y(d => hoY(d.value))
    .curve(d3.curveMonotoneX);

  let dayXAxis = g => g.call(d3.axisTop(x).tickFormat((d, i) => (i === 0 || /\d{4}-\d{2}-01/.test(d)) ? '|' : d.substring(8)).tickSize(0));
  let dateXAxis = g => g.call(d3.axisTop(x).tickFormat((d, i) => (i === 0 || /\d{4}-\d{2}-01/.test(d)) ? d : '' ).tickSize(0));

  let rrsChartObjects = {
    cu: { dataset: cuPrices, path: cuLine, id: 'cu', y: cuY },
    oi: { dataset: oiPrices, path: oiLine, id: 'oi', y: oiY },
    dj: { dataset: djPrices, path: djLine, id: 'dj', y: djY },
    nd: { dataset: ndPrices, path: ndLine, id: 'nd', y: ndY },
    sp: { dataset: spPrices, path: spLine, id: 'sp', y: spY },
    ho: { dataset: hoPrices, path: hoLine, id: 'ho', y: hoY },
  }

  _.each(rrsChartObjects, obj => {
    svg.append('path')
    .data([obj.dataset])
      .attr('class', `line ${obj.id}_path`)
      .attr('d', obj.path)
      .attr('fill', 'none')
      .attr('stroke', relatedRatesColorSet[obj.id]);

    svg.selectAll(`.dot`)
    .data(obj.dataset)
      .enter()
    .append('circle')
      .attr('class', `${obj.id}_dot`)
      .attr('r', 3.5)
      .attr('cx', d => x(d.date) + x.bandwidth() / 2)
      .attr('cy', d => obj.y(d.value))
      .attr('fill', relatedRatesColorSet[obj.id])
      .attr('cursor', 'pointer')
      .on('mouseover', dotMouseoverHandler(obj.id))
      .on('mouseout', dotMouseoutHandler(obj.id))
      .on('click', dotOnClickHandler(obj.id));
  });

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

  function dotMouseoverHandler(id) {
    return function(data) {
      d3.select(this)
        .transition()
        .duration(100)
        .style('fill', d3.rgb(relatedRatesColorSet[id]).darker(2))
        .attr('stroke', d3.rgb(relatedRatesColorSet[[id]]).darker(2));
  
      d3.select('#tooltip-div')
        .transition()		
        .duration(200)		
        .style('opacity', .9);
      
      d3.select('#tooltip-div')
        .style('left', (d3.event.pageX + 24) + 'px')		
        .style('top', (d3.event.pageY - 24) + 'px');
      
      document.getElementById('tooltip-content').innerHTML = `${ relatedRatesLabels[id] }: ${ data.value }`;
    }
  }

  function dotMouseoutHandler(id) {
    return function(data) {
      d3.select(this)
        .transition()
        .duration(100)
        .style('fill', relatedRatesColorSet[id])
        .attr('stroke', 'none');
      
      d3.select('#tooltip-div')
        .transition()	
        .duration(200)
        .style('opacity', 0);
    }
  }

  function dotOnClickHandler(id) {
    return function(data) {
      displayRatesForDetail(data.date);
      cleanTweetDetail(data.date);
    }
  }

  updateRRSPlot = function (id, isEnabled){
    if (!isEnabled) {
      d3.selectAll(`.${id}_dot`).transition().duration(200).style('opacity', 0).remove();
      d3.selectAll(`.${id}_path`).transition().duration(200).style('opacity', 0).remove();
    } else {
      let obj = rrsChartObjects[id];
      svg.append('path')
      .data([obj.dataset])
        .attr('class', `line ${obj.id}_path`)
        .attr('d', obj.path)
        .attr('fill', 'none')
        .attr('stroke', relatedRatesColorSet[obj.id])
        .style('opacity', 0);
  
      svg.selectAll(`.dot`)
      .data(obj.dataset)
        .enter()
      .append('circle')
        .attr('class', `${obj.id}_dot`)
        .attr('r', 3.5)
        .attr('cx', d => x(d.date) + x.bandwidth() / 2)
        .attr('cy', d => obj.y(d.value))
        .attr('fill', relatedRatesColorSet[obj.id])
        .attr('cursor', 'pointer')
        .style('opacity', 0)
        .on('mouseover', dotMouseoverHandler(obj.id))
        .on('mouseout', dotMouseoutHandler(obj.id))
        .on('click', dotOnClickHandler(obj.id));

      d3.selectAll(`.${id}_dot`).transition().duration(200).style('opacity', 1);
      d3.selectAll(`.${id}_path`).transition().duration(200).style('opacity', 1);
    }
  }
}

function displayRatesForDetail(date) {
  const rrs = _.find(rrsPrices, { Date: date });
  const houseData = _.find(hoPrices, hoPrice => hoPrice.date.substring(0, 7) === date.substring(0, 7));

  console.log(_.toNumber(rrs.currency_value));

  document.getElementById('detail-oi-price').innerHTML = !rrs ? '' : rrs.oil_price;
  document.getElementById('detail-cu-price').innerHTML = !rrs ? '' : _.toNumber(rrs.currency_value).toFixed(2);
  document.getElementById('detail-ho-price').innerHTML = !houseData ? '' : _.toNumber(houseData.value).toFixed(2);
  document.getElementById('detail-sp-price').innerHTML = !rrs ? '' : _.toNumber(rrs.sp_close).toFixed(2);
  document.getElementById('detail-dj-price').innerHTML = !rrs ? '' : _.toNumber(rrs.dowjones_close).toFixed(2);
  document.getElementById('detail-nd-price').innerHTML = !rrs ? '' : _.toNumber(rrs.nasdaq_close).toFixed(2);
}

function handleRRLegendOnClick(value) {
  relatedRatesEnable[value] = !relatedRatesEnable[value];

  let isEnabled = relatedRatesEnable[value];
  document.getElementById(`${value}_legend`).style.opacity = isEnabled ? 1 : 0.5;
  updateRRSPlot(value, isEnabled);
}