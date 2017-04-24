'use strict';

var myApp = {};

myApp.dado1H = undefined;
myApp.dado2H = undefined;
myApp.dado1S = undefined;
myApp.chart01 = undefined;
myApp.chart02 = undefined;


myApp.run = function()
{
    myApp.dado1H = [{'funcionario': 1200, 'setor': "GP"},{'funcionario': 120, 'setor': "Executivo"},{'funcionario': 1300, 'setor': "GP"},
{'funcionario': 1100, 'setor': "TI"},{'funcionario': 12034, 'setor': "TI"},{'funcionario': 1203, 'setor': "Comercial"},{'funcionario': 1240, 'setor': "TI"}];

    myApp.dado2H = [{'funcionario': 1200, 'setor': "TI"},{'funcionario': 120, 'setor': "Executivo"},{'funcionario': 1300, 'setor': "GP"},
{'funcionario': 1100, 'setor': "TI"},{'funcionario': 12034, 'setor': "TI"},{'funcionario': 1203, 'setor': "Comercial"},{'funcionario': 1240, 'setor': "TI"}];

    myApp.dado1S = [{'Pais': "Bélgica", 'população': 11, 'PIB':370},{'Pais': "Bulgária", 'população': 7, 'PIB':38},
    {'Pais': "República Checa", 'população': 10.7, 'PIB':370},{'Pais': "Dinamarca", 'população': 5, 'PIB':239}];


    
  /*  myApp.chart01 = new histograma();
    myApp.chart01.run("#chart01", myApp.dado1H);


    myApp.chart02 = new histograma();
    myApp.chart01.run("#chart02", myApp.dado2H);
*/
    myApp.chart01 = new scatterPlot();
    myApp.chart01.run("#chart01", myApp.dado1S);
   
}


window.onload = myApp.run;