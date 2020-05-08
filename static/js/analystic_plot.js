const draw_mds = () => {
  const margin = {
    top: 32, 
    right: 8, 
    bottom: 48, 
    left: 8
  };

  const xKey = 'x';
  const yKey = 'y';
  const gKey = 'label';
  const keys = [];
  rawAnaData.forEach(d => {
    if (!keys.includes(d[gKey])) keys.push(d[gKey]);
  });
  
  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let svg = d3.select('#dataset-svg');

  const width = _.toNumber(svg.style('width').replace('px', '')) - margin.left - margin.right;
  const chartHeight = (_.toNumber(svg.style('width').replace('px', '')) * 3) / 4;
  const height = chartHeight - margin.top - margin.bottom;

  svg = svg.attr('height', chartHeight)
  .append('g')
    .attr('transform', 'translate(0,' + margin.top + ')');
  
  let x = d3.scaleLinear()
    .domain([d3.min(rawAnaData, d => d[xKey]), d3.max(rawAnaData, d => d[xKey])])
    .range([16, width]);
  let xValues = d => x(d[xKey]);

  let y = d3.scaleLinear()
    .domain([d3.min(rawAnaData, d => d[yKey]), d3.max(rawAnaData, d => d[yKey])])
    .range([height + 32, 32]);
  let yValues = d => y(d[yKey]);

  svg.selectAll(`.dot`)
    .data(rawAnaData)
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

function draw_pca() {
  const margin = {
    top: 32, 
    right: 8, 
    bottom: 48, 
    left: 12
  };
  
  let svg = d3.select('#dataset-svg');

  const width = _.toNumber(svg.style('width').replace('px', '')) - margin.left - margin.right;
  const chartHeight = (_.toNumber(svg.style('width').replace('px', '')) * 3) / 4;
  const height = chartHeight - margin.top - margin.bottom;

  let x = d3.scaleLinear()
    .domain([1, rawAnaData.length])
    .range([16, width - 16]);
  let xValues = (d, i) => x(i + 1);

  let y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
  let yValues = d => y(d.org);

  let xAxis = g => g.call(d3.axisBottom(x));
  let yAxis = g => g.call(d3.axisLeft(y));

  let lines = d3.line()
    .x((d, i) => x(i + 1))
    .y(d => y(d.org));

  svg = svg.attr('height', chartHeight)
  .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  
  svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
  .append('text')
    .attr('x', width / 2)
    .attr('y', 32)
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'middle')
    .text('Components');

  svg.append('g')
    .attr('class', 'y')
    .attr('transform', 'translate(' + margin.left + ', 0)')
    .call(yAxis)
  .append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .text('Variance Rate');

  svg.selectAll('.pca_dot')
  .data(rawAnaData)
    .enter()
  .append('circle')
    .attr('r', 3.5)
    .attr('cx', xValues)
    .attr('cy', yValues)
    .attr('fill', '#0f78a0');
    
  svg.append('path')
    .data([rawAnaData])
    .attr('d', lines)
    .attr('fill', 'none')
    .attr('stroke', '#0f78a0');
}

async function handleAnaysticSelectorChange(value) {
  d3.select('#dataset-svg').selectAll('*').remove();

  if ('mda_e' === value) {
    const anaRes = await fetch(`/analystic/euclidean`);
    rawAnaData = JSON.parse(await anaRes.json());
    draw_mds();
  }
  if ('mda_c' === value) {
    const anaRes = await fetch(`/analystic/correlation`);
    rawAnaData = JSON.parse(await anaRes.json());
    draw_mds();
  }
  if ('pca' === value) {
    const anaRes = await fetch(`/analystic/pca`);
    rawAnaData = JSON.parse(await anaRes.json());
    draw_pca();
  }

}