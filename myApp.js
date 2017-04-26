'use strict';

var myApp = {};

myApp.dadoH = undefined;
myApp.dadoS = undefined;
myApp.chart01 = undefined;
myApp.chart02 = undefined;
myApp.chart03 = undefined;


myApp.run = function()
{
   

    d3.csv("histogramaData2.csv", function(d, i, columns) {
        Object.keys(d).forEach(function(key){
            if (!isNaN(+d[key])) d[key] = +d[key]
        })
        return d;
    }, function(error, data) {
    if (error) throw error;

        myApp.dadoH=data;        
        myApp.chart01 = new histograma();
        var margins = {top: 10, bottom: 30, left: 100, right: 15};
        var ch = 350;
        var cw = 450;

        myApp.chart01.run("#chart01", myApp.dadoH,cw,ch,"Empresas","funcionarios",margins);    
    });

    myApp.dadoS = [{'Pais': "Bélgica", 'população': 11, 'PIB':370},{'Pais': "Bulgária", 'população': 7, 'PIB':38},
    {'Pais': "República Checa", 'população': 10.7, 'PIB':370},{'Pais': "Dinamarca", 'população': 5, 'PIB':239}];


    myApp.chart01 = new scatterPlot();
    myApp.chart01.run("#chart02", myApp.dadoS);


    //agora eh timeseries
    d3.tsv("timeSeriesData.tsv", type, function(error, data) {
      if (error) throw error;
      
        myApp.chart03 = new timeSeries();
        var ch = 350;
        var cw = 650;

        var margins = {top: 10, bottom: 30, left: 35, right: 15};
        myApp.chart03.run("#chart03", data,cw,ch,"tempo","Temperature, ºF",margins);

    });
    var parseTime = d3.timeParse("%Y%m%d");
    function type(d, _, columns) {
            d.date = parseTime(d.date);
            for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
            return d;
    }
}


window.onload = myApp.run;