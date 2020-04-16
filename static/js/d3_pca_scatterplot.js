const colors = {
  org: '#5f7e8c', 
  rnd: '#dec993', 
  str: '#dea293'
}

const draw_pca_scatterplot = () => {
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

  let x = d3.scaleLinear()
    .domain([1, data.length])
    .range([16, width - 16]);
  let xValues = (d, i) => x(i + 1);

  let y = d3.scaleLinear()
    .domain([0, 1])
    .range([height, 0]);
  let yValues = d => y(d);

  let xAxis = g => g.call(d3.axisBottom(x));
  let yAxis = g => g.call(d3.axisLeft(y));

  let lines = d3.line()
    .x((d, i) => x(i + 1))
    .y(d => y(d));

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
    .text('Components');

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
    .text('Variance Rate');

  menuObj.pca.forEach(datatype => {
    if (!Array.isArray(data)) return;
    let _data = data.map(d => d[datatype]);

    svg.selectAll(`.${datatype}_dot`)
      .data(_data)
      .enter()
    .append('circle')
      .attr('class', `${datatype}_dot`)
      .attr('r', 3.5)
      .attr('cx', xValues)
      .attr('cy', yValues)
      .attr('fill', colors[datatype]);
      
    svg.append('path')
      .data([_data])
      .attr('class', `${datatype}_line`)
      .attr('d', lines)
      .attr('fill', 'none')
      .attr('stroke', colors[datatype]);
  });
}