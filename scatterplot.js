'use strict';

function scatterPlot()
{
    var scope = this;
    var exports = {};
    
    scope.margins = {top: 10, bottom: 30, left: 35, right: 15};
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
    scope.mapCorPais = [];
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
        scope.cScale = d3.scaleOrdinal(d3.schemeCategory20);
        scope.zScale = d3.scaleOrdinal(d3.schemeCategory20);

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
        var s = d3.event.selection,
           x0 = s[0][0],
           y0 = s[0][1],
           x1 = s[1][0],
           y1 = s[1][1];
        
        svg.selectAll('circle')
            .style("fill", function (d) 
            {
                if (!(scope.xScale(d.cx) >= x0 && scope.xScale(d.cx) <= x1 && 
                    scope.yScale(d.cy) >= y0 && scope.yScale(d.cy) <= y1))
                { return "rgb(150,150,190)"; }
            });        
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
        var aux=0;
        var bool = false;
        
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < scope.mapCorPais.length; j++) {
                if (arr[i].Pais.localeCompare(scope.mapCorPais[j].Pais)==0) {
                    bool=true;
                    break;
                };
            };
            if (!bool) {
                var c = {'Pais': arr[i].Pais, 'Cor': aux++};
                scope.mapCorPais.push(c);
                
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
                for (var i = 0; i < scope.mapCorPais.length; i++) {
                    if (d.Pais.localeCompare(scope.mapCorPais[i].Pais)==0) return scope.cScale(scope.mapCorPais[i].Cor);
                };  
            });

        return circle;
    }
    scope.appendLegenda = function(svg){

        console.log("to aqui");

        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(
                function(d){
                    var aux = []; 
                    for (var i = 0; i < scope.data.length; i++) {
                    aux.push(scope.data[i].Pais);
                    }; 
                    return aux;
            }).enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

         legend.append("rect")
            .attr("x", scope.cw - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", scope.zScale)

         legend.append("text")
            .attr("x", scope.cw - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d; });

    }

    scope.createLabel = function(svg)
    {
        var labelY = svg.append('g')
        .attr('class', 'yAxis')
        .append('text') // y-axis Label
        .attr('class','label')
        .attr('transform','translate('+ scope.margins.left +','+ scope.margins.top +')' + 'rotate(-90)')
        .attr('x',0)
        .attr('y',5)
        .attr('dy','.71em')
        .style('text-anchor','end')
        .text('PIB(em Milhões)')

        var labelX = svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate('+ scope.margins.left +','+ (scope.ch+scope.margins.top+scope.margins.bottom) +')')
        .append('text') // x-axis Label
        .attr('class','label')
        .attr("x", scope.cw/2 )
        .style("text-anchor", "middle")
        .text("População(em Milhões)");
    }

    //------------- exported API -----------------------------------
  
    exports.run = function(div, data) 
    {
        scope.div = div;
        scope.data = data;

        var svg = scope.appendSvg(div);
        var cht = scope.appendChartGroup(svg); 

        scope.createAxes(svg); 
        scope.createLabel(svg);   
        scope.appendCircles(cht);
        scope.appendLegenda(cht);
        

    }
    
    return exports;
};
