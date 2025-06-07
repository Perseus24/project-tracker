'use client'; // For Next.js App Router (if using)

import React from 'react';
import ReactECharts from 'echarts-for-react';

const EchartBarChart = () => {
    const options = {
        color: ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444'],
        grid: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 0,
            containLabel: true
        },
        xAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: true
            },
            type: 'category',
            data: ['In Progress', 'Completed', 'Need Review', 'Backlog']
        },
        yAxis: {
            type: 'value',
            splitNumber: 2,
            splitLine: {
                show: true, 
                lineStyle: {
                type: 'dashed', 
                color: '#f0f0f0',
                width: 1 
                }
            }
        },
        series: [
            {
                data: [3,1,0,10],
                type: 'bar',
                barWidth: 50,
                colorBy: 'data',
                itemStyle: {
                    borderRadius: 5,
                }
            }
        ]
        
    };

    return <ReactECharts option={options} style={{ height: '100%' }}/>;
};

export default EchartBarChart;
