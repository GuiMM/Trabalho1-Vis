'use strict';

function histograma()
{
    var scope = this;
    var exports = {};
    
    scope.margins = {top: 10, bottom: 30, left: 25, right: 15};
    scope.cw = 350;
    scope.ch = 350;
    
    scope.div      = undefined;
    scope.xScale   = undefined;
    scope.yScale   = undefined;
    scope.xAxis    = undefined;
    scope.yAxis    = undefined;
    
    scope.data     = [];

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

    scope.appendRects = function(div)
    {       //contando quantidade de funcionarios por setor
    var gp=0;
    var ti=0;
    var exe=0;
    var com = 0;
    for (var i = 0; i < scope.data.length; i++) {
        if (scope.data[i].setor.localeCompare('TI')==0) ti++;
        if (scope.data[i].setor.localeCompare("GP")==0) gp++;
        if (scope.data[i].setor.localeCompare("Comercial")==0) com++;
        if (scope.data[i].setor.localeCompare("Executivo")==0) exe++;
       
    };

    // montando o array de dados com os setores e a quantidade de funcionarios por setor.
        var dados = [];
        var c = {'setor': "TI", 'cont': ti};
        dados.push(c);
        c = {'setor': "GP", 'cont': gp};
        dados.push(c);
        c = {'setor': "Comercial", 'cont': com};
        dados.push(c);
        c = {'setor': "Executivo", 'cont': exe};
        dados.push(c);


    var rects = div.selectAll('rect')
        .data(dados)
        .enter()
        .append('rect')
        .attr('x', function(d){ return scope.xScale(d.setor)-5;  })
        .attr('y', function(d){  return scope.yScale(d.cont); })
        .attr('width', 10)
        .attr('height', function(d){ return scope.ch-scope.yScale(d.cont); } )
        .style('stroke', 'gray')
        .style('fill', 'blue' );  


    return rects;
    }

    scope.createAxes = function(svg)
    {   

        var auxScale = d3.scaleLinear().domain([0,6]).range([0,scope.cw]);
        scope.xScale = d3.scaleOrdinal([auxScale(1),auxScale(2),auxScale(3),auxScale(4), auxScale(5)]).domain(["TI", "Executivo", "GP", "Comercial","outros"]);
        scope.yScale = d3.scaleLinear().domain([0,5]).range([scope.ch,0]);

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

    scope.createLabelHistogram = function(svg)
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
        .text('funcionarios')

    var labelX = svg.append('g')
        .attr('class', 'xAxis')
        .attr('transform', 'translate('+ scope.margins.left +','+ (scope.ch+scope.margins.top+scope.margins.bottom) +')')
        .append('text') // x-axis Label
        .attr('class','label')
        .attr("x", scope.cw/2 )
        .style("text-anchor", "middle")
        .text("setores");
}

    exports.run = function(div, data) 
    {
        scope.div = div;
        scope.data = data;
        

        var svg = scope.appendSvg(div);
        var cht = scope.appendChartGroup(svg); 

        scope.createAxes(svg); 
        scope.createLabelHistogram(svg);   
        scope.appendRects(cht);
       
    }
    
    return exports;
    
};
