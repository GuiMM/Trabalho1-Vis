'use strict';

function timeSeries()
{
    var scope = this;
    var exports = {};
    
    scope.margins = [];
    scope.cw = undefined;
    scope.ch = undefined;
    
    scope.div      = undefined;
    scope.xScale   = undefined;
    scope.yScale   = undefined;
    scope.zScale   = undefined;
    scope.auxScale = undefined;
    scope.xAxis    = undefined;
    scope.yAxis    = undefined;
    scope.labelY   = undefined;
    scope.labelX   = undefined;
    scope.brush    = undefined;
    
    scope.data     = undefined;
    scope.cities   = undefined;
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
        scope.xScale = d3.scaleTime().range([0, scope.cw]),
        scope.yScale = d3.scaleLinear().range([scope.ch, 0]),
        scope.zScale = d3.scaleOrdinal(d3.schemeCategory10);
        scope.auxScale = d3.scaleOrdinal(d3.schemeCategory10);

        scope.xScale.domain(d3.extent(scope.data, function(d) { return d.date; }));

        scope.yScale.domain([
            0,
            d3.max(scope.cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
        ]);

        scope.zScale.domain(scope.cities.map(function(c) { return c.id; }));

        svg.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate("+scope.margins.left +","+ scope.ch + ")")
          .call(d3.axisBottom(scope.xScale));

        svg.append("g")
          .attr("class", "axis axis--y")
          .attr("transform", "translate("+scope.margins.left +",0)")
          .call(d3.axisLeft(scope.yScale));
          
          //.text("Temperature, ºF");
       
    }

    scope.appendLine = function (div) 
    {

        var line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return scope.xScale(d.date); })
        .y(function(d) { return scope.yScale(d.temperature); });

        var city = div.selectAll(".city")
          .data(scope.cities)
          .enter().append("g")
          .attr("class", "city");

        city.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .style("stroke", function(d) { return scope.zScale(d.id); });

        city.append("text")
          .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
          .attr("transform", function(d) { return "translate(" + scope.xScale(d.value.date) + "," + scope.yScale(d.value.temperature) + ")"; })
          .attr("x", 3)
          .attr("dy", "0.35em")
          .style("font", "10px sans-serif")
          .text(function(d) { return d.id; });
    }

    

    
    scope.appendLegenda = function(svg){
        var legend = svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(scope.cities)
            .enter().append("g")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

         legend.append("rect")
            .attr("x", scope.cw - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", scope.auxScale);

         legend.append("text")
            .attr("x", scope.cw - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function(d) { return d.id; });

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
            .text(scope.labelY)

        var labelX = svg.append('g')
            .attr('class', 'xAxis')
            .attr('transform', 'translate('+ scope.margins.left +','+ (scope.ch+scope.margins.top+scope.margins.bottom) +')')
            .append('text') // x-axis Label
            .attr('class','label')
            .attr("x", scope.cw/2 )
            .style("text-anchor", "middle")
            .text(scope.labelX);
       
    }

    //------------- exported API -----------------------------------
  
    exports.run = function(div, data,cw,ch,labelX,labelY,margins) 
    {
        scope.div = div;
        scope.data = data;
        scope.ch=ch;
        scope.cw=cw;
        scope.labelX=labelX;
        scope.labelY=labelY
        scope.margins =margins;

        scope.cities = data.columns.slice(1).map(function(id) {
            return {
              id: id,
              values: data.map(function(d) {
                return {date: d.date, temperature: d[id]};
              })
            };
        });

        var svg = scope.appendSvg(div);
        var cht = scope.appendChartGroup(svg); 

        scope.createAxes(svg);
        scope.appendLine(cht);
        scope.appendLegenda(cht);
        scope.createLabel(svg);

    }
    
    return exports;
};
