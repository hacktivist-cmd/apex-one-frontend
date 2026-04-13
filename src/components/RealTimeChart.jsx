import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const RealTimeChart = ({ symbol = 'BTCUSDT', height = 400 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clean up previous chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: '#0A0A0A' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2B2B2B' },
        horzLines: { color: '#2B2B2B' },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#2B2B2B' },
      timeScale: { borderColor: '#2B2B2B' },
    });

    chartRef.current = chart;

    // Add line series
    const lineSeries = chart.addLineSeries({
      color: '#D4AF37',
      lineWidth: 2,
      crosshairMarkerVisible: true,
    });

    // Fetch historical data
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1h&limit=100`);
        const data = await res.json();
        const chartData = data.map(k => ({ time: k[0] / 1000, value: parseFloat(k[4]) }));
        lineSeries.setData(chartData);
      } catch (err) {
        console.error('Failed to fetch chart data', err);
      }
    };
    fetchData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [symbol, height]);

  return <div ref={chartContainerRef} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px` }} />;
};

export default RealTimeChart;
