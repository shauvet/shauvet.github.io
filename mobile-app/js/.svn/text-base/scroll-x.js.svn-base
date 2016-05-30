/** 图表插件 **/
// Step:3 conifg ECharts's path, link to echarts.js from current page.
// Step:3 为模块加载器配置echarts的路径，从当前页面链接到echarts.js，定义所需图表路径
require.config({
	paths: {
		echarts: './js'
	}
});

// Step:4 require echarts and use it in the callback.
// Step:4 动态加载echarts然后在回调函数中开始使用，注意保持按需加载结构定义图表路径
require(
	[
		'echarts',
		'echarts/chart/bar',
		'echarts/chart/funnel',
		'echarts/chart/pie'
	],
	function(ec) {
		//--- 折柱 ---
		var myChart = ec.init(document.getElementById('mainBar'));
		myChart.setOption({
			title: {},
			animation: false,
			legend: {
				data: ['合同额', '订单额']
			},
			calculable: true,
			xAxis: [{
				type: 'value',
				boundaryGap: [0, 0.5]
			}],
			yAxis: [{
				type: 'category',
				data: ['销售经理', '业务员2', '业务员1', '自己']
			}],
			series: [{
				name: '合同额',
				type: 'bar',
				data: [100000, 212524, 131513, 363438]
			}, {
				name: '订单额',
				type: 'bar',
				data: [262928, 236393, 252824, 393534]
			}]
		});

		var chartFunnel = ec.init(document.getElementById('mainFunnel'));
		chartFunnel.setOption({
			animation: false,
			legend: {
				data: ['储存客户', '目标客户', '潜在客户', '商机客户', '成交客户']
			},
			calculable: true,
			series: [{
				name: '漏斗图',
				type: 'funnel',
				width: '75%',
				height: '200',
				data: [{
					value: 60,
					name: '储存客户'
				}, {
					value: 40,
					name: '目标客户'
				}, {
					value: 20,
					name: '潜在客户'
				}, {
					value: 80,
					name: '商机客户'
				}, {
					value: 100,
					name: '成交客户'
				}]
			}, ]
		});

		var labelTop = {
			normal: {
				label: {
					show: true,
					position: 'center',
					formatter: '{b}',
					textStyle: {
						baseline: 'bottom'
					}
				},
				labelLine: {
					show: false
				}
			}
		};
		var labelFromatter = {
			normal: {

				label: {
					formatter: function(params) {
						return 100 - params.value + '%'
					},
					textStyle: {

						baseline: 'top'
					}
				}
			},
		}
		var labelBottom = {
			normal: {
				color: '#fff',
				label: {
					show: true,
					position: 'center'
				},
				labelLine: {
					show: false
				}
			},

		};
		var radius = [60, 65];

		option = {
			animation: false,
			legend: {
				data: []
			},
			series: [{
				type: 'pie',
				center: ['14%', '30%'],
				radius: radius,
				x: '0%', // for funnel
				itemStyle: {
					normal: {
						color: '#36c97c',
						label: {
							formatter: function(params) {
								return 100 - params.value + '%'
							},
							textStyle: {
								fontSize: '24',
								baseline: 'top',
								color: '#36c97c'
							}
						}
					},
				},

				data: [{
					name: 'other',
					value: 70,
					itemStyle: labelBottom
				}, {
					name: '新增客户',
					value: 30,
					itemStyle: labelTop
				}]
			}, {
				type: 'pie',
				center: ['38%', '30%'],
				radius: radius,
				x: '30%', // for funnel
				itemStyle: {
					normal: {
						color: '#fe6555  ',
						label: {
							formatter: function(params) {
								return 100 - params.value + '%'
							},
							textStyle: {
								fontSize: '24',
								baseline: 'top',
								color: '#fe6555  '
							}
						}
					},
				},
				data: [{
					name: 'other',
					value: 60,
					itemStyle: labelBottom
				}, {
					name: '联系次数',
					value: 40,
					itemStyle: labelTop
				}]
			}, {
				type: 'pie',
				center: ['62%', '30%'],
				radius: radius,
				x: '50%', // for funnel
				itemStyle: {
					normal: {
						color: '#fa8b22',
						label: {
							formatter: function(params) {
								return 100 - params.value + '%'
							},
							textStyle: {
								fontSize: '24',
								baseline: 'top',
								color: '#fa8b22'
							}
						}
					},
				},
				data: [{
					name: 'other',
					value: 50,
					itemStyle: labelBottom
				}, {
					name: '合同额',
					value: 50,
					itemStyle: labelTop
				}]
			}, {
				type: 'pie',
				center: ['86%', '30%'],
				radius: radius,
				x: '75%', // for funnel
				itemStyle: {
					normal: {
						color: '#9a59b5',
						label: {
							formatter: function(params) {
								return 100 - params.value + '%'
							},
							textStyle: {
								fontSize: '24',
								baseline: 'top',
								color: '#9a59b5'
							}
						}
					},
				},
				data: [{
					name: 'other',
					value: 10,
					itemStyle: labelBottom
				}, {
					name: '回款额',
					value: 90,
					itemStyle: labelTop
				}]
			}]
		};

		var chartPie = ec.init(document.getElementById('chartsPie'));

		chartPie.setOption(option);
	}
);