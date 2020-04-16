const draw_mds_scatterplot = () => {
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

  const xKey = 'x';
  const yKey = 'y';
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
    .attr('transform', 'translate(0,' + height / 2 + ')')
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y')
    .attr('transform', 'translate(' + width / 2 + ', 0)')
    .call(yAxis);

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