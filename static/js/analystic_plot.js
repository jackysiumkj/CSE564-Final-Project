const draw_analystic = () => {
  const margin = {
    top: 32, 
    right: 16, 
    bottom: 48, 
    left: 64
  };

  const xKey = 'x';
  const yKey = 'y';
  const gKey = 'label';
  const keys = [];
  rawMdsData.forEach(d => {
    if (!keys.includes(d[gKey])) keys.push(d[gKey]);
  });
  
  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let svg = d3.select('#dataset-svg');

  const width = _.toNumber(svg.style('width').replace('px', ''));
  const chartHeight = (_.toNumber(svg.style('width').replace('px', '')) * 3) / 4;
  const height = chartHeight - margin.top - margin.bottom;

  svg = svg.attr('height', chartHeight)
  .append('g')
    .attr('transform', 'translate(0,' + margin.top + ')');
  
  let x = d3.scaleLinear()
    .domain([d3.min(rawMdsData, d => d[xKey]), d3.max(rawMdsData, d => d[xKey])])
    .range([0, width]);
  let xValues = d => x(d[xKey]);

  let y = d3.scaleLinear()
    .domain([d3.min(rawMdsData, d => d[yKey]), d3.max(rawMdsData, d => d[yKey])])
    .range([height + 32, 32]);
  let yValues = d => y(d[yKey]);

  svg.selectAll(`.dot`)
    .data(rawMdsData)
    .enter()
  .append('circle')
    .attr('class', `dot`)
    .attr('r', 3.5)
    .attr('cx', xValues)
    .attr('cy', yValues)
    .attr('fill', d => colors(d[gKey]));

  let xAxis = g => g.call(d3.axisBottom(x));
  let yAxis = g => g.call(d3.axisLeft(y));

  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + (height / 2 + 32) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y')
    .attr('transform', 'translate(' + width / 2 + ', 0)')
    .call(yAxis);
  
  const legend = svg.append('g')
    .attr('text-anchor', 'start')
    .selectAll('g')
    .data(keys)
    .enter()
  .append('g')
    .attr('transform', (d, i) => `translate(${width - 48}, ${i * 16})`);

  legend.append('rect')
    .attr('width', 14)
    .attr('height', 14)
    .attr('fill', d => colors(d));

  legend.append('text')
    .attr('x', 18)
    .attr('y', 7)
    .attr('dy', '0.32em')
    .style('font-size', '11px')
    .text(d => d);
}

async function handleAnaysticSelectorChange(value) {
  d3.select('#dataset-svg').selectAll('*').remove();

  if ('mda_e' === value) {
    const mdsRes = await fetch(`/mds_data/euclidean`);
    rawMdsData = JSON.parse(await mdsRes.json());
  }
  if ('mda_c' === value) {
    const mdsRes = await fetch(`/mds_data/correlation`);
    rawMdsData = JSON.parse(await mdsRes.json());
  }
  if ('pca' === value) {
    // const mdsRes = await fetch(`/mds_data/pca`);
    // rawMdsData = JSON.parse(await mdsRes.json());
    
  }

  draw_analystic();
}