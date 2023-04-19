// set the dimensions of the SVG canvas
const width = 500;
const height = 500;

// create an SVG canvas
const svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// generate 100 random points within the SVG canvas
const data = d3.range(100).map(() => ({
  x: Math.random() * width,
  y: Math.random() * height
}));

// set up the scales for the scatter plot
const xScale = d3.scaleLinear()
  .domain([0, width])
  .range([0, width]);

const yScale = d3.scaleLinear()
  .domain([0, height])
  .range([0, height]);

// create circles for each point and add them to the SVG canvas
svg.selectAll('circle')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => xScale(d.x))
  .attr('cy', d => yScale(d.y))
  .attr('r', 3)
  .attr('fill', 'blue');

// load the CSV file and parse the data
d3.csv('titanic.csv').then(data => {
  // group the data by age and count the number of passengers in each age group
  const ageCounts = d3.rollup(data, v => v.length, d => d.Age);

  // convert the data to an array of objects
  const ageData = Array.from(ageCounts, ([key, value]) => ({ age: key, count: value }));

  // set the dimensions and margins of the pie chart
  const width = 500;
  const height = 500;
  const margin = 40;

  // set the radius of the pie chart
  const radius = Math.min(width, height) / 2 - margin;

  // set up the SVG canvas for the pie chart
  const pieSvg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  // set up the pie chart layout
  const pie = d3.pie()
    .value(d => d.count);

  // set up the arc generator
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  // create a slice for each age group and add it to the pie chart
  const slices = pieSvg.selectAll('path')
    .data(pie(ageData))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => d3.schemeCategory10[i % 10]);

  // add labels to the slices
  slices.append('text')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => d.data.age);
});
