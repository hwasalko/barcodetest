	
	// 바 차트생성
	function makeBarChart1( div_id, pWidth, pHeight ){
		
		// Size 초기화
		var margin = {top: 20, right: 30, bottom: 60, left: 30};
		var width = pWidth - margin.left - margin.right;
		var height = pHeight - margin.top - margin.bottom;
		
		
		
		// 기본 svg 객체
		var svg = d3.select("#" + div_id).append("svg")
							.attr("width", width + margin.left + margin.right)
							.attr("height", height + margin.top + margin.bottom)
							.append("g")
								.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
		// 레전드(범례) 박스 객체
		var legendBox = svg.append("g")
								.attr("class", "legend-box")
								.attr("transform", "translate(0, " + (margin.top + height + 7) + ")" )
								.append("rect")
									.attr("width", width)
									.attr("height", 25)
									.attr("fill", "none")
									.attr("stroke", "gray")
									.attr("stroke-width", "0.03em");
		
		
		// 축(axis) 
		var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);
		var x1 = d3.scaleBand().padding(0.02).paddingOuter(0.3);
		var x2 = d3.scaleBand().rangeRound([0, width]);	//라인차트용 
		
		var y0 = d3.scaleLinear().range([height, 0]);			// left
		var y1 = d3.scaleLinear().range([height, 0]);			// right
		
		var xAxis = d3.axisBottom(x0).ticks();
		var xAxis2 = d3.axisBottom(x2).ticks();
		var yAxis = d3.axisLeft(y0).ticks();		// left
		var yAxis2 = d3.axisRight(y1).ticks().tickFormat(function(d) { return d + "%"; });	// right
		
		// 색상 팔레트
		var barColors = d3.scaleOrdinal().range(["steelblue", "darkslategray", "yellowgreen"]);
		var lineColors = ["darkturquoise", "gold" ];
		
		// 마우스오버 시 툴팁
		var tooltip = d3.select("body").append("div")	
						    .attr("class", "tooltip")				
						    .style("opacity", 0);
				
		
		
		
		
		// 데이터 조회 (bar차트)
		d3.json(	
					"./data/chart1/groupbar.json",
					function(error, data) {
						
							//**************************** ① 초기화 ***************************************************************
						
							if (error) throw error;
							
							// 숫자데이터 casting(숫자타입으로 변환)
							data.forEach(function( d, i ){
								var columns = d3.keys( d );
								for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
								return d;							
							});
							
							  
							//키항목 추출
							var keys = d3.keys( data[data.length-1] ) ;
							
							// 정의역(범위) 설정
							x0.domain(data.map(function(d) { return d.Year; }));			// bar chart x축
							x1.domain(keys.slice(1)).rangeRound([0, x0.bandwidth()]);		// bar chart 그룹bar 내 단위 bar
							
							// 정의역(범위) 설정 y축
							var min = d3.min(data, function(d) { return d3.min(keys.slice(1), function(key) { return d[key]; }); });
							if(min > 0) min=0;
							var max = d3.max(data, function(d) { return d3.max(keys.slice(1), function(key) { return d[key]; }); });
							if(max < 0) max=0;
							y0.domain([min, max]).nice();		// bar chart y축 left
							
								
								
							// x축 생성	
							svg.append("g")
								.attr("class", "xAxis")
								.attr("transform", "translate(0," + height + ")")
								.call(xAxis);
							
							// x축 생성 --> zero line 
							if(min < 0 ){
								svg.append("g")
								.attr("class", "xAxis-zero")
						        .attr("transform", "translate(0," + y0(0) + ")")
						        .call(xAxis.tickFormat("").tickSize(0));	
							}
							
							// y축(left) 생성
							svg.append("g")
								.attr("class", "yAxis-left")
								.call(yAxis);
							
							
							
							
							//**************************** ② 막대차트 ***************************************************************
							
							// bar 차트 생성
							var barChartGruop = svg.append("g")
														.attr("class", "barchart");
							
							var barChartUnitGroup = barChartGruop.selectAll("g")
																.data(data)
																.enter().append("g")
																    .attr("class", function(d,i){ return "barGroup-" + (i+1); } )  
																    .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; });
								    
							var barChartUnit = barChartUnitGroup.selectAll("rect")
														.data(function(d) { return keys.slice(1).map(function(key) { return {key: key, value: d[key], year : d.Year}; }); })
													    .enter().append("rect")
													      .attr("x", function(d) { return x1(d.key); })
													      .attr("y", function(d) { return y0(d.value); })
													      //.attr("width", x1.bandwidth())
													      .attr("width", 0)
													      .attr("height", 0)
													      .style("fill-opacity",0)
													      .attr("fill", function(d) { return barColors(d.key); })
													      .on("mouseover", function(d) {
													    	  //강조효과
													    	  d3.select(this)
													    	  	.style("fill-opacity",0.7)
													    	  	.attr("stroke", d3.select(this).attr("fill") )
							            						.attr("stroke-width", 2);
													    	  
													    	  // tooltip용 div 생성
													            tooltip.transition()		
													                .duration(200)		
													                .style("border-color", barColors(d.key) )
													                .style("opacity", .9);
													    	  
													            tooltip.html("<b>" + d.key + "</b><br>" + d.year + "<br>" + d3.format(",")(d.value) )	
													                .style("left", (d3.event.pageX - 10) + "px")		
													                .style("top", (d3.event.pageY - 20) + "px");
														   })					
													      .on("mouseout", function(d) {
													    		//강조효과 해제
													    	  	d3.select(this)
														    	  	.style("fill-opacity",0.9)
														    	  	.attr("stroke-width", 0);	
													    	  
													    	  d3.select(this.parentNode).selectAll("circle").remove();	// Circle 제거
													    	  		
													    			// tooltip용 div 제거
													    	  		tooltip.transition()		
														                .duration(500)		
														                .style("opacity", 0);
													      })
													      .transition()		// 시간차로 차트 생성 효과 
															  .duration(500)
															  .attr("width", x1.bandwidth())
															  .attr("height", function(d) { return  Math.abs( y0(d.value) - y0(0) );  } )	// negative 차트를 고려한 height 설정
															  .style("fill-opacity",0.9);
													      
							
							
									
									


							
							
							
							
							//**************************** ③ 막대차트 레전드(범례) ***************************************************************
							
							// bar 차트 범례(legend)
							var legend_unit_size = x1.bandwidth() * 0.4;	// 단위 사이즈           
							      
							var legend = svg.append("g")
								  .attr("transform", "translate( 0 , " + (height + margin.bottom/2 + margin.top/2 - 7 )   + ")" )
								  .attr("font-family", "sans-serif")
							      .attr("font-size", 10)
							      .attr("text-anchor", "end")
							      .attr("class", "barchart-legend")
							    .selectAll("g")
								    .data(keys.slice(1))
								    .enter().append("g")
							      		.attr("transform", function(d, i) { return  "translate(" + i * (legend_unit_size*2 + d.length*10) + ", 0)"; });  
							      
							  legend.append("rect")
							      .attr("x", legend_unit_size)
							      .attr("width", legend_unit_size)
							      .attr("height", legend_unit_size)
							      .attr("fill", barColors);
							
							  legend.append("text")
							      .attr("x", margin.left + legend_unit_size*3 )
							      .attr("y", 9)
							      .attr("dy", "0.1em")
							      .text(function(d) { return d; });
											  
					}
		);	//end bar 차트
		
		
		
		
		
		// 데이터 조회 (line차트)
		d3.json(	
					"./data/chart1/groupbar_line.json",
					function(error, data) {
							//**************************** ① 초기화 ***************************************************************
						
							if (error) throw error;
							  
							// 숫자데이터 casting(숫자타입으로 변환)
							data.forEach(function( d, i ){
								var columns = d3.keys( d );
								for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
								return d;							
							});
							
													
							//키항목 추출
							var keys = d3.keys( data[data.length-1] ) ;
							var title = keys.slice(0);
							
							// 정의역(범위) 설정
							var min = d3.min(data, function(d) { return d3.min(keys.slice(1), function(key) { return d[key]; }); });
							if(min > 0) min=0;
							var max = d3.max(data, function(d) { return d3.max(keys.slice(1), function(key) { return d[key]; }); });
							
							y1.domain([min, max]).nice();		// bar chart y축 right
							
							// y축(left) 생성
							svg.append("g")
								.attr("class", "yAxis-right")
								.attr("transform", "translate(" + width + ",0) ")
								.call(yAxis2);
							
							
							
							//**************************** ② 라인차트 ***************************************************************
							
							// 라인 차트 설정
							var drawLine = d3.line()
										.x(function(d) { return x0(d.key); })
										.y(function(d) { return y1(d.value); });
							
							
							// line 차트 생성
							var lineGroup = svg.append("g")
													.attr("class", "linechart")
													.attr("transform", function(d) { return "translate(" + x0.bandwidth()/2 + ",0)"; });						
													
							data.forEach( function(d,i){
								
								lineGroup
										.append("path")
											.datum( keys.slice(1).map( function(key) {return {key: key, value: d[key]}; } ) )
							            	.attr('d',drawLine)
							            	.attr("fill", "none")
							            	.attr("stroke", lineColors[i] )
							            	.attr("stroke-width",0)
							            	.attr("stroke-opacity",0)
							            	.attr("class","line")
							            	.on("mouseover", function(d) {
							            		d3.select(this)	
							      					.attr("stroke-width",5)
							      					.attr("stroke-opacity",0.7);
							            	})
							            	.on("mouseout", function(d) {
							            		d3.select(this)	
							      					.attr("stroke-width",2)
							      					.attr("stroke-opacity",1);
							            	})
							            	.transition()		// 시간차로 차트 생성 효과
										    	.duration(1000)
											    	.attr("stroke-width",2)
											    	.attr("stroke-opacity",1);
							});
							
							
							
							
							// line 차트 각 포인트(circle) 생성
							data.forEach( function(d,i){
								
									var subData = keys.slice(1).map( function(key) {return {key: key, value: d[key]}; } );
									
									for(k=0 ; k < subData.length ; k++){
										lineGroup.append("path")
											.datum( subData )
											.attr("d", d3.symbol().type(d3.symbolCircle).size(200) )
											.attr("id", subData[k].key)						// 툴팁 화면에서 값을 활용하기위해 id 활용
										    .attr("class", subData[k].value  )			// 툴팁 화면에서 값을 활용하기위해 class 활용
											.attr("fill", lineColors[i] )
											.attr("opacity", 0 )
							            	.attr("stroke", lineColors[i] )
							            	.attr("stroke-width",1)
							            	.attr("transform", "translate(" + x0(subData[k].key) +   ",0)" )
							            	.on("mouseover", function(d) {
											    		//크기 확대
									      				d3.select(this).transition()
									      					.duration(200)	
									      					.attr("stroke", "red" )
									      					.attr("d", d3.symbol().type(d3.symbolCircle).size(100) );
									      				
									      				// tooltip용 div 생성
											            tooltip.transition()		
											                .duration(200)		
											                .style("border-color", d3.select(this).attr("fill") )
											                .style("opacity", .9);
											    	    tooltip.html("<b>" + data[i].category + "</b><br>" + d3.select(this).attr("id") + "<br>" + d3.select(this).attr("class") + "%" )	
											                .style("left", (d3.event.pageX - 0) + "px")		
											                .style("top", (d3.event.pageY - 50) + "px");
											})			
											.on("mouseout", function(d) {
														////크기 축소		
														d3.select(this).transition()
									      					.duration(200)	
									      					.attr("stroke", d3.select(this).attr("fill") )
									      					.attr("d", d3.symbol().type(d3.symbolCircle).size(50) );		
												
														// tooltip용 div 제거
										    	  		tooltip.transition()		
											                .duration(500)		
											                .style("opacity", 0);
										    })
							            	.transition()		// 시간차로 차트 생성 효과
									    		.duration(1000)
											    	.attr("opacity",1)
											    	.attr("d", d3.symbol().type(d3.symbolCircle).size(50) )
											    	.attr("transform", "translate(" + x0(subData[k].key) + "," + y1(subData[k].value) + ")" );
									} // end for(k)
								
							});
							
							
							
							
							
						
							
							
							
							//**************************** ③ 라인차트 레전드(범례) ***************************************************************
							var legend_unit_size = 20;	// 단위 사이즈           
						      
							var legendGroup = svg.append("g")
								  .attr("transform", "translate( 0 , " + (height + margin.bottom/2 + margin.top/2 -7)   + ")" )
								  .attr("font-family", "sans-serif")
							      .attr("font-size", 10)
							      .attr("text-anchor", "end")
							      .attr("class", "linechart-legend");
							
							
							
							data.forEach( function(d,i){
								
									var transX = (i * (legend_unit_size*3 + data.length*9) ) + 220;	// 기존 bar 레전드에 겹치지 않도록 x위치 조정값 계산
									
									var legend = legendGroup.append("g")
										.attr("transform", "translate(" + transX  + ", 7)" );
									
									legend.append("line")
										    .attr("x1", 0)
										    .attr("y1", 0)
										    .attr("x2", legend_unit_size)
										    .attr("y2", 0)
										    .attr("stroke-width", "2" )
										    .attr("stroke", lineColors[i] );
									
									legend.append("path")
											.attr("d", d3.symbol().type(d3.symbolCircle).size(30) )
											.attr("fill", lineColors[i] )
											.attr("stroke", lineColors[i] )
							            	.attr("stroke-width",1)
							            	.attr("transform", "translate(" + legend_unit_size/2 +   ",0)" );
									
									
									 legend.append("text")
								      .attr("x", legend_unit_size + 45 )
								      .attr("y", 0)
								      .attr("dy", "0.3em")
								      .text( data[i][title[0]] );
									 
							});
								
							
					}
		);
		
	}