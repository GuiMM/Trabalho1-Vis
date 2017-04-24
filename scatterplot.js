'use strict';

function scatterPlot()
{
    var scope = this;
    var exports = {};
    
    scope.margins = {top: 10, bottom: 30, left: 25, right: 15};
    scope.cw = 350;
    scope.ch = 350;
    
    scope.div      = undefined;
    scope.xScale   = undefined;
    scope.yScale   = undefined;
    scope.cScale   = undefined;
    scope.xAxis    = undefined;
    scope.yAxis    = undefined;
    scope.brush    = undefined;
    
    scope.data     = undefined;
    scope.callback = undefined;

    scope.appendSvg = function(div)
    {
        var node = d3.select(div).append('svg')
            .attr('width', scope.cw + scope.margins.left + scope.margins.right)
            .attr('height', scope.ch + scope.margins.top + scope.margins.bottom);

        return node;
    }

    scope.appendChartGroup = function(svg)
    {
        var chart = svg.append('g')
            .attr('width', scope.cw)
            .attr('height', scope.ch)
            .attr('transform', 'translate('+ scope.margins.left +','+ scope.margins.top +')' );

        return chart;
    }

    scope.createAxes = function(svg)
    {
        scope.xScale = d3.scaleLinear().domain([0,15]).range([0,scope.cw]);
        scope.yScale = d3.scaleLinear().domain([0,500]).range([scope.ch,0]);
        scope.cScale = d3.scaleOrdinal(d3.schemeCategory10);

        var xAxisGroup = svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate('+ scope.margins.left +','+ (scope.ch+scope.margins.top) +')');

        var yAxisGroup = svg.append('g')
            .attr('class', 'yAxis')
            .attr('transform', 'translate('+ scope.margins.left +','+ scope.margins.top +')');

        scope.xAxis = d3.axisBottom(scope.xScale);
        scope.yAxis = d3.axisLeft(scope.yScale);

        xAxisGroup.call(scope.xAxis);
        yAxisGroup.call(scope.yAxis);
    }

    scope.addBrush = function(svg)
    {
        function brushed()
        {
            var select = d3.event.selection;
            scope.callback(scope.div, select);
        };

        scope.brush = d3.brush()
            .on("start brush", brushed);

        svg.append("g")
            .attr("class", "brush")
            .call(scope.brush);   
    }

    scope.appendCircles = function(div)
    {
        var arr = scope.data;
        var mapCorPais = [];
        var aux=0;
        var bool = false;
        console.log("to aqui");
        for (var i = 0; i < arr.length; i++) {
            for (var j = mapCorPais.length - 1; j >= 0; j--) {
                if (arr[i].Pais.localeCompare(mapCorPais[j].Pais)==0) {
                    bool=true;
                    break;
                };
            };
            if (!bool) {
                var c = {'Pais': arr[i].Pais, 'Cor': aux++};
                console.log(c.Pais+""+c.Cor);
                mapCorPais.push(c);
                
            };
            bool=false;
    };


        var circle = div.selectAll('circle')
            .data(arr)
            .enter()
            .append('circle')
            .attr('cx', function(d){ return scope.xScale(d.população); })
            .attr('cy', function(d){ return scope.yScale(d.PIB); })
            .attr('r' , function(d){ return 5;  })
            .style('fill', function(d){ 
                for (var i = 0; i < mapCorPais.length; i++) {
                    if (d.Pais.localeCompare(mapCorPais[i].Pais)==0) return scope.cScale(mapCorPais[i].Cor);
                };  
            });

        return circle;
    }

    //------------- exported API -----------------------------------
  
    exports.run = function(div, data) 
    {
        scope.div = div;
        scope.data = data;

        var svg = scope.appendSvg(div);
        var cht = scope.appendChartGroup(svg); 

        scope.createAxes(svg);    
        scope.appendCircles(cht);
    }
    
    return exports;
};
