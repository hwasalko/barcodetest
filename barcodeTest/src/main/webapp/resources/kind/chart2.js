
	// 바 차트생성
	function makeBarChart2( div_id, pWidth, pHeight ){
		
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
								.attr("transform", "translate(" + (width/2 - 110) + ", " + (margin.top + height + 7) + ")" )
								.append("rect")
									.attr("width", 220)
									.attr("height", 25)
									.attr("fill", "none")
									.attr("stroke", "gray")
									.attr("stroke-width", "0.03em");
		
		
		// 축(axis) 
		var x = d3.scaleBand().rangeRound([0, width]);	
		var y = d3.scaleLinear().rangeRound([height, 0]);			 
		
		var xAxis = d3.axisBottom(x).ticks();
		var yAxis = d3.axisLeft(y).ticks().tickFormat(function(d) { return d + "%"; });	// right
		
		// 색상 팔레트
		var lineColors = ["steelblue", "darkslategray" ];
		
		// 마우스오버 시 툴팁
		var tooltip = d3.select("body").append("div")	
					    .attr("class", "tooltip")				
					    .style("opacity", 0);
				
		
		
		// 데이터 조회 (line차트)
		d3.json(	
					"./data/chart2/lineData.json",
					function(error, data) {
							//**************************** ① 초기화 ***************************************************************
						
							if (error) throw error;
							  
							// 숫자데이터 casting(숫자타입으로 변환)
							data.forEach(function( d, i ){
								var columns = d3.keys( d );
								for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
								return d;							
							});
							
													
							//키항목명 추출
							var keys = d3.keys( data[data.length-1] ) ;
							var title = keys.slice(0);
							
							
							// 정의역(범위) 설정 x축
							var xData = [];
							keys.forEach(function(key, index){
								if( index > 0) xData.push(key);		// x축 도메인 생성
							});
							x.domain(xData);
							
							
							// 정의역(범위) 설정 y축
							var min = d3.min(data, function(d) { return d3.min(keys.slice(1), function(key) { return d[key]; }); });
							if(min > 0) min=0;
							var max = d3.max(data, function(d) { return d3.max(keys.slice(1), function(key) { return d[key]; }); });
							if(max < 0) max=0;							
							y.domain([min, max]).nice();		// bar chart y축 right

							
							
							// x축 생성	
							svg.append("g")
								.attr("class", "xAxis")
								.attr("transform", "translate(0," + height + ")")
								.call(xAxis);
							
													
							// y축(left) 생성
							svg.append("g")
								.attr("class", "yAxis")
								.attr("transform", "translate(0,0) ")
								.call(yAxis);
							
							
							
							
							
							
							
							//**************************** ② 라인차트 ***************************************************************
							
							// 라인 차트 설정
							var drawLine = d3.line()
										.x(function(d) { return x(d.key); })
										.y(function(d) { return y(d.value); });
							
							
							// line 차트 생성
							var lineGroup = svg.append("g")
													.attr("class", "linechart")
													.attr("transform", function(d) { return "translate(" + x.bandwidth()/2 + ",0)"; });						
													
							data.forEach( function(d,i){
								lineGroup
										.append("path")
											.datum( keys.slice(1).map( function(key) {return {key: key, value: d[key]}; } ) )
											.attr('d',drawLine)
											.attr("fill", "none")
							            	.attr("stroke", lineColors[i] )
							            	.attr("stroke-width",0)
							            	.attr("stroke-opacity",0)
							            	.attr("class", d[keys[0]] )
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
							            	.attr("transform", "translate(" + x(subData[k].key) +   ",0)" )
							            	.on("mouseover", function(d) {
											    		//크기 확대
									      				d3.select(this).transition()
									      					.duration(200)	
									      					.attr("stroke", "red" )
									      					.attr("d", d3.symbol().type(d3.symbolCircle).size(100) );
									      				
									      				// tooltip용 div 생성
											            tooltip.html("<b>" + data[i].category + "</b><br>" + d3.select(this).attr("id") + "<br>" + d3.select(this).attr("class") + "%" )	
											                .style("left", (d3.event.pageX - 0) + "px")		
											                .style("top", (d3.event.pageY - 50) + "px");
									      				
									      				tooltip.transition()		
											                .duration(200)		
											                .style("border-color", d3.select(this).attr("fill") )
											                .style("opacity", .9);
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
											    	.attr("transform", "translate(" + x(subData[k].key) + "," + y(subData[k].value) + ")" );
									} // end for(k)
								
							});
							
							
							
						
							
							
							//**************************** ③ 라인차트 레전드(범례) ***************************************************************
							var legend_unit_size = 20;	// 단위 사이즈           
						      
							var legendGroup = svg.append("g")
								  .attr("transform", "translate( " + (width/2 - 100) + " , " + (height + margin.bottom/2 + margin.top/2 -7)   + ")" )
								  .attr("font-family", "sans-serif")
							      .attr("font-size", 10)
							      .attr("text-anchor", "end")
							      .attr("class", "linechart-legend");
							
							
							
							data.forEach( function(d,i){
								
									var transX = (i * (legend_unit_size*4 + data.length*10) ) ;	// 기존 bar 레전드에 겹치지 않도록 x위치 조정값 계산
									
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
											.attr("x", (i * 10 ) + 85 )
											.attr("y", 0)
											.attr("dy", "0.3em")
											.text( data[i][title[0]] );
									 
							});
							
							
							
							
							
					}
		);
		
		
		
		
	}
		
		