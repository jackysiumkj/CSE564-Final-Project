const prepare_data = async () => {
  // draw_related_rates();
  // draw_dataset();
  // draw_tweets();

  // d3.select('#_spinner').style('display', 'flex');
  // d3.select('#order-selector').attr('disabled', true);
  // d3.select('#dataset-selector').attr('disabled', true);

  const tweetsWrap = document.getElementById('tweets-wrap');
  const relatedRatesWrap = document.getElementById('related-rates-wrap');

  tweetsWrap.addEventListener('scroll', () => { relatedRatesWrap.scrollLeft = tweetsWrap.scrollLeft; }, false);
  relatedRatesWrap.addEventListener('scroll', () => { tweetsWrap.scrollLeft = relatedRatesWrap.scrollLeft; }, false);

  try {
    const tweetsRes = await fetch('/tweets');
    rawTweets = await tweetsRes.json();

    const oilPriceRes = await fetch('/oil_prices');
    rawOilPrices = JSON.parse(await oilPriceRes.json());

    draw_tweets();
    draw_related_rates();

  
  //   d3.select('#_spinner').style('display', 'none');
  //   d3.select('#order-selector').attr('disabled', null);
  //   d3.select('#dataset-selector').attr('disabled', null);
  } catch (error) {
    console.error(error);
  }
}