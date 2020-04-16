const draw_t3_pca_scatterplot = () => {
  const cellSize = window.innerWidth * 0.25;
  const paddingUnit = 16;
  const marginLeft = 64;
  
  const gKey = 'ARREST_BORO';
  const keys = d3.keys(data[0]).filter(d => d !== gKey);
  const cellAmount = keys.length;

  let colors = d3.scaleOrdinal(d3.schemeCategory10);

  let x = d3.scaleLinear()
    .range([paddingUnit, cellSize - paddingUnit]);

  let y = d3.scaleLinear()
    .range([cellSize - paddingUnit, paddingUnit]);

  let xAxis = g => g
    .call(d3.axisBottom(x).ticks(5))
    .call(g => g.select('.domain').remove());
  let yAxis = g => g
    .call(d3.axisLeft(y).ticks(5))
    .call(g => g.select('.domain').remove());

  const svg = d3.select('#chart')
    .attr('width', cellAmount * cellSize + paddingUnit * 10)
    .attr('height', cellAmount * cellSize + paddingUnit * 4)
  .append('g')
    .attr('transform', `translate(${ marginLeft }, ${ paddingUnit })`);
  
  svg.selectAll('x-axis')
    .data(keys)
    .enter()
  .append('g')
    .attr('class', 'x-axis')
    .attr('transform',(d, i) => `translate(${(cellAmount - i - 1) * cellSize}, ${cellAmount * cellSize})`)
    .each(function(key) {
      x.domain(d3.extent(data, d => d[key])); 
      d3.select(this).call(xAxis);
    });
  
  svg.selectAll('y-axis')
    .data(keys)
    .enter()
  .append('g')
    .attr('class', 'y-axis')
    .attr('transform',(d, i) => `translate(0, ${i * cellSize})`)
    .each(function(key) {
      y.domain(d3.extent(data, d => d[key])); 
      d3.select(this).call(yAxis);
    });

  const cellKeySet = []; 
  keys.forEach(xKey => keys.forEach(yKey => cellKeySet.push({ xKey, yKey })));

  let cells = svg.selectAll('.cell')
    .data(cellKeySet)
    .enter()
  .append('g')
    .attr('class', 'cell')
    .attr('transform', (d, i) => `translate(${ (cellAmount - (i % cellAmount) - 1) * cellSize }, ${ Math.floor(i / cellAmount) * cellSize })`)
    .each(cellDrawer);
  
  function cellDrawer(cellData) {
    let cell = d3.select(this);

    x.domain( d3.extent(data, d => d[cellData.xKey]) );
    y.domain( d3.extent(data, d => d[cellData.yKey]) );

    cell.append('rect')
      .attr('class', 'cell_frame')
      .attr('x', paddingUnit / 2)
      .attr('y', paddingUnit / 2)
      .attr('width', cellSize - paddingUnit)
      .attr('height', cellSize - paddingUnit)
      .attr('fill', 'none')
      .attr('stroke', '#e2e3e5');;
    
    cell.selectAll('.dot')
      .data(data)
      .enter()
    .append('circle')
      .attr('class', `dot`)
      .attr('cx', d => x(d[cellData.xKey]))
      .attr('cy', d => y(d[cellData.yKey]))
      .attr('r', 3.5)
      .style('fill', d => colors(d[gKey]));
  }

  const cellTexts = {
    JURISDICTION_CODE: 'Jurisdiction responsible for arrest.',
    PERP_RACE: 'Perpetrator’s race description.',
    ARREST_DATE: 'Exact date of arrest for the reported event.'
  };

  cells.filter(d => d.xKey === d.yKey)
  .append('text')
    .attr('x', paddingUnit * 2)
    .attr('y', paddingUnit * 2)
    .text(d => d.xKey)
    .attr('fill', '#607e8c')
    .attr('font-size', '12px')
    .attr('font-weight', 'bold');

  cells.filter(d => d.xKey === d.yKey)
  .append('text')
    .attr('x', paddingUnit * 2)
    .attr('y', paddingUnit * 3)
    .text(d => cellTexts[d.xKey])
    .attr('fill', '#607e8c')
    .attr('font-size', '11px');
}