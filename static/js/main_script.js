const prepare_data = async () => {
  // d3.select('#_spinner').style('display', 'flex');
  // d3.select('#order-selector').attr('disabled', true);
  // d3.select('#dataset-selector').attr('disabled', true);

  const startDate = moment('2017-08-06');
  const endDate = moment('2020-04-15');
  let date = startDate;

  while (date <= endDate) {
    sharedDates.push(date.format('YYYY-MM-DD'));
    date = date.clone().add(1, 'd');
  };

  sharedWidth = _.size(sharedDates) * 28 + sharedMargin.left + sharedMargin.right;

  const tweetsWrap = document.getElementById('tweets-wrap');
  const relatedRatesWrap = document.getElementById('related-rates-wrap');

  tweetsWrap.addEventListener('scroll', () => { relatedRatesWrap.scrollLeft = tweetsWrap.scrollLeft; }, false);
  relatedRatesWrap.addEventListener('scroll', () => { tweetsWrap.scrollLeft = relatedRatesWrap.scrollLeft; }, false);

  try {
    const tweetsRes = await fetch('/tweets');
    rawTweets = await tweetsRes.json();

    const rrsRes = await fetch('/related_rates');
    rawRRs = JSON.parse(await rrsRes.json());

    const housingRes = await fetch('/housings');
    rawHousePrice = JSON.parse(await housingRes.json());

    const anaRes = await fetch(`/analystic/euclidean`);
    rawAnaData = JSON.parse(await anaRes.json());

    rrsPrices = _.filter(rawRRs, d => _.includes(sharedDates, d.Date));
    hoPrices = _.filter(rawHousePrice, d => _.includes(sharedDates, d.date));

    cuPrices = _.filter(_.map(rrsPrices, d => ({ date: d.Date, value: d.currency_value })), d => d.value !== 'NaN');
    djPrices = _.filter(_.map(rrsPrices, d => ({ date: d.Date, value: d.dowjones_close })), d => d.value !== 'NaN');
    ndPrices = _.filter(_.map(rrsPrices, d => ({ date: d.Date, value: d.nasdaq_close })), d => d.value !== 'NaN');
    oiPrices = _.filter(_.map(rrsPrices, d => ({ date: d.Date, value: d.oil_price })), d => d.value !== 'NaN');
    spPrices = _.filter(_.map(rrsPrices, d => ({ date: d.Date, value: d.sp_close })), d => d.value !== 'NaN');

    draw_tweets();
    draw_related_rates();
    draw_mds();

  
  //   d3.select('#_spinner').style('display', 'none');
  //   d3.select('#order-selector').attr('disabled', null);
  //   d3.select('#dataset-selector').attr('disabled', null);
  } catch (error) {
    console.error(error);
  }
}