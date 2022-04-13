async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

let response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=30min&apikey=cc8fcc18c7134f759d8da05260f8df7e')
    let data = await response.json()

    const {  GME, MSFT, DIS, BNTX  } = data;

    //const {  GME, MSFT, DIS, BNTX  } = mockData;
    const stocks = [GME, MSFT, DIS, BNTX];

    stocks.forEach(stock => stock.values.reverse())
    
    //Stock Price Over Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock =>({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    //Highest Stock Price Chart
    new Chart(highestPriceChartCanvas.getContext('2d'),{
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: "highest",
                data: stocks.map(stock => getHighestStock(stock.values)),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor:  stocks.map(stock => getColor(stock.meta.symbol))
            }]
        }
    })

    //Average Pie Crap
    new Chart(averagePriceChartCanvas.getContext('2d'),{
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: "average",
                data: stocks.map(stock => getAverageStockPrice(stock.values)),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor:  stocks.map(stock => getColor(stock.meta.symbol))
            }]
        }
    })
}

function getHighestStock(values){
    return values.map(value => value.high).sort((a, b) => parseFloat(b) - parseFloat(a))[0]
}

function getAverageStockPrice(values){
    return values.map(value =>value.high).reduce((a, b) => parseFloat(a) + parseFloat(b))/values.length
}

function getColor(stock){
    if(stock === "GME"){
        return 'rgba(61, 161, 61, 0.7)'
    }
    if(stock === "MSFT"){
        return 'rgba(209, 4, 25, 0.7)'
    }
    if(stock === "DIS"){
        return 'rgba(18, 4, 209, 0.7)'
    }
    if(stock === "BNTX"){
        return 'rgba(166, 43, 158, 0.7)'
    }
}

main()
