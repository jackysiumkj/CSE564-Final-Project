let menuObj = {
  data: 'pca',
  pca: ['org'],
  mds: 'euclidean', // correlation
  dataset: 'str',
};
const pca_datatypes = ['org', 'rnd', 'str'];

const handleDataOnChange = value => {
  d3.select('#pca_menu').style('display', value === 'pca' ? 'flex' : 'none');
  d3.select('#mds_menu').style('display', value === 'mds' ? 'flex' : 'none');
  d3.select('#dataset_select_box').style('display', value !== 'pca' ? 'flex' : 'none');
  
  menuObj.data = value;
  prepare_data();
}

const handleDataSetOnChange = value => {
  menuObj.dataset = value;

  prepare_data();
}

const prepare_data = async () => {
  d3.select('#chart').selectAll('*').remove();
  d3.select('#_spinner').style('display', 'flex');
  d3.select('#order-selector').attr('disabled', true);
  d3.select('#dataset-selector').attr('disabled', true);

  try {
    if (menuObj.data === 'pca') {
      const res = await fetch('/pca_data');
      data = JSON.parse(await res.json());
      draw_pca_scatterplot();
    } else if (menuObj.data === 'top_two_pca') {
      const res = await fetch(`/top_two_pca_data/${menuObj.dataset}`);
      data = JSON.parse(await res.json());
      draw_ttpca_scatterplot();
    } else if (menuObj.data === 'mds') {
      const res = await fetch(`/mds_data/${menuObj.mds}/${menuObj.dataset}`);
      data = JSON.parse(await res.json());
      draw_mds_scatterplot();
    } else {
      const res = await fetch(`/three_highest_pca_data/${menuObj.dataset}`);
      data = JSON.parse(await res.json());
      draw_t3_pca_scatterplot();
    }

    d3.select('#_spinner').style('display', 'none');
    d3.select('#order-selector').attr('disabled', null);
    d3.select('#dataset-selector').attr('disabled', null);
  } catch (error) {
    console.error(error);
  }
}

const handlePCADataOnClick = data_type => {
  if (!menuObj.pca.includes(data_type)) menuObj.pca.push(data_type);
  else menuObj.pca = menuObj.pca.filter(dt => dt !== data_type);
  d3.select('#chart').selectAll('*').remove();

  renderButtons();
  if (menuObj.data === 'pca') draw_pca_scatterplot();
}

const renderButtons = () => {
  pca_datatypes.forEach(value => {
    d3.select(`#${value}_btn`)
      .attr('class', `btn ${menuObj.pca.includes(value) ? 'btn-primary' : 'btn-outline-primary'} ${'str' !== value ? 'mr-3' : ''}`);
  });
}

const handleMDSDataOnClick = data_type => {
  menuObj.mds = data_type;
  d3.select(`#euclidean_btn`)
    .attr('class', `btn ${'euclidean' === data_type ? 'btn-primary' : 'btn-outline-primary'} mr-3`);
  d3.select(`#correlation_btn`)
    .attr('class', `btn ${'correlation' === data_type ? 'btn-primary' : 'btn-outline-primary'}`);
  
  prepare_data();
}