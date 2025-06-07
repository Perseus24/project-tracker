'use client'; // For Next.js App Router (if using)

import React from 'react';
import ReactECharts from 'echarts-for-react';

const EchartPieChart = () => {
    const options = {
        color: ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444'],
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: "vertical",
            right: '15%',
            top: 'middle',
        },
        series: [
            {
            center: ['25%', '50%'],
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'center',
                formatter: () => {
                    // sum the values
                    const total = 14;
                    return total.toString();
                },
                fontSize: 24,
                fontWeight: '600',
                color: '#666',
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 3, name: 'In Progress' },
                { value: 1, name: 'Completed' },
                { value: 0, name: 'Need Review' },
                { value: 10, name: 'Backlog' },
            ]
            }
        ]
        };

    return <ReactECharts option={options} style={{ height: '100%' }} />;
};

export default EchartPieChart;
