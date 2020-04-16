const draw_ttpca_scatterplot = () => {
  const margin = {
    top: 16, 
    right: 16, 
    bottom: 48, 
    left: 64
  };

  const chartWidth = window.innerWidth * 0.9;
  const chartHeight = 600;

  const width = chartWidth - margin.right - margin.left;
  const height = chartHeight - margin.top - margin.bottom;

  const xKey = 'pc1';
  const yKey = 'pc2';
  const gKey = 'ARREST_BORO';
  const keys = [];
  data.forEach(d => {
    if (!keys.includes(d[gKey])) keys.push(d[gKey]);
  });

  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let x = d3.scaleLinear()
    .domain([d3.min(data, d => d[xKey]) - 0.1, d3.max(data, d => d[xKey]) + 0.1])
    .range([16, width - 16]);
  let xValues = d => x(d[xKey]);

  let y = d3.scaleLinear()
    .domain([d3.min(data, d => d[yKey]) - 0.1, d3.max(data, d => d[yKey]) + 0.1])
    .range([height, 0]);
  let yValues = d => y(d[yKey]);

  let xAxis = g => g.call(d3.axisBottom(x));
  let yAxis = g => g.call(d3.axisLeft(y));

  const svg = d3.select('#chart')
    .attr('width', chartWidth)
    .attr('height', chartHeight)
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
    .text('Principal Component 1');

  svg.append('g')
    .attr('class', 'y')
    .call(yAxis)
  .append('text')
    .attr('x', 8)
    .attr('y', 16)
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold')
    .attr('text-anchor', 'end')
    .attr('transform', 'rotate(-90)')
    .text('Principal Component 2');

  svg.selectAll(`.dot`)
    .data(data)
    .enter()
  .append('circle')
    .attr('class', `dot`)
    .attr('r', 3.5)
    .attr('cx', xValues)
    .attr('cy', yValues)
    .attr('fill', d => colors(d[gKey]));

  const legend = svg.append('g')
    .attr('text-anchor', 'end')
    .selectAll('g')
    .data(keys)
    .enter()
  .append('g')
    .attr('transform', (d, i) => `translate(${width}, ${i * 20})`);

  legend.append('rect')
    .attr('width', 16)
    .attr('height', 16)
    .attr('fill', (d, i) => colors(i));

  legend.append('text')
    .attr('x', -8)
    .attr('y', 8)
    .attr('dy', '0.32em')
    .text(d => labels[d]);
}