import React, { useState } from 'react';
import { css } from '@emotion/react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import mouseWheelZoom from 'highcharts/modules/mouse-wheel-zoom';
import HighchartsReact from 'highcharts-react-official';
import Button from '@/components/Button';
import { COLOR } from '@/constants/color';
import { FONT_SIZE, FONT_WEIGHT } from '@/constants/font';

mouseWheelZoom(Highcharts);
HighchartsMore(Highcharts);

type ChartTypes = 'line' | 'area';

interface ChartDataProps {
  chartData: {
    data1: [number, number][];
    data2: [number, number][];
  };
  name: string[];
  unit: string[];
  type?: ChartTypes[];
}

const Chart: React.FC<ChartDataProps> = ({
  chartData,
  name,
  type = 'line',
  unit,
}) => {
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const dateFilter = ['1개월', '3개월', '6개월', '1년', '전체'];

  const getFilteredData = (
    data: [number, number][],
    selectedPeriod: string
  ): [number, number][] => {
    if (selectedPeriod === '전체') return data;

    const today = new Date();
    const filterDate = new Date();

    switch (selectedPeriod) {
      case '1개월':
        filterDate.setMonth(today.getMonth() - 1);
        break;
      case '3개월':
        filterDate.setMonth(today.getMonth() - 3);
        break;
      case '6개월':
        filterDate.setMonth(today.getMonth() - 6);
        break;
      case '1년':
        filterDate.setFullYear(today.getFullYear() - 1);
        break;
    }

    return data.filter(([dateStr]) => new Date(dateStr) >= filterDate);
  };

  const filteredData = {
    data1: getFilteredData(chartData.data1, selectedFilter),
    data2: getFilteredData(chartData.data2, selectedFilter),
  };

  const options = {
    title: {
      text: '',
    },
    accessibility: {
      enabled: false,
    },
    chart: {
      type: 'line',
      width: null,
      spacingTop: 40,
      zoomType: 'x',
      panning: true,
      panKey: 'shift',
      zooming: {
        mouseWheel: {
          enabled: true,
        },
      },
      style: {
        fontFamily: 'Pretendard, sans-serif',
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 1400,
          },
          chartOptions: {
            chart: {
              height: 500,
            },
          },
        },
      ],
    },
    tooltip: {
      style: {
        fontSize: `${FONT_SIZE.TEXT_MD}`,
      },
      formatter(this: Highcharts.TooltipFormatterContextObject) {
        const date = new Date(this.x as number);
        // getMonth()는 0부터 11까지 반환하므로, 1월~12월로 맞추기 위해 +1
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        return `
        <table style="margin: 0; padding: 16px; z-index:10000;">
          <tr>
            <td style="padding-bottom: 4px;">
              ${formattedDate}
            </td>
          </tr>
          <tr>
            <td style="white-space: nowrap; text-align: left;">
              <span style="color: ${COLOR.BLACK}; font-weight: ${FONT_WEIGHT.BOLD};">${this.series.name}</span>: 
              <span style="color: ${COLOR.BLACK}; font-weight: ${FONT_WEIGHT.BOLD};">${this.y?.toLocaleString()}${(this.series as any).userOptions.tooltip.valueSuffix}</span>
            </td>
          </tr>
        </table>`;
      },
      useHTML: true,
      backgroundColor: `${COLOR.WHITE}`,
      borderWidth: 1,
      borderColor: `${COLOR.GRAY300}`,
      borderRadius: 8,
    },
    plotOptions: {
      series: {
        animation: {
          duration: 500,
        },
      },
    },
    legend: {
      align: 'left',
      verticalAlign: 'top',
      itemStyle: {
        fontWeight: `${FONT_WEIGHT.REGULAR}`,
        fontSize: `${FONT_SIZE.TEXT_MD}`,
      },
      margin: 48,
    },
    xAxis: {
      type: 'datetime',
      title: {
        text: '',
      },
      dateTimeLabelFormats: {
        year: '%Y-%m',
        month: '%Y-%m',
        week: '%Y-%m',
        day: '%Y-%m',
      },
      labels: {
        style: {
          fontSize: '12px',
        },
      },
      tickInterval: 2 * 365 * 24 * 3600 * 1000,
    },
    yAxis: [
      {
        pointOnColumn: true,
        labels: {
          style: {
            color: `${COLOR.POINT400}`,
            fontSize: `${FONT_SIZE.TEXT_MD}`,
          },
        },
        title: {
          text: '',
        },
      },
      {
        pointOnColumn: true,
        opposite: true,
        labels: {
          style: {
            color: `${COLOR.PRIMARY}`,
            fontSize: `${FONT_SIZE.TEXT_MD}`,
          },
        },
        title: {
          text: '',
        },
      },
    ],
    series: [
      {
        name: name[0],
        type: type[0],
        data: filteredData.data1,
        yAxis: 0,
        color:
          type === 'line'
            ? `${COLOR.POINT400}`
            : {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 1,
                  y2: 1,
                },
                stops: [
                  [0, `${COLOR.POINT}`],
                  [1, `${COLOR.WHITE}`],
                ],
              },
        lineColor: type === 'line' ? '' : `${COLOR.POINT400}`,
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: unit[0],
        },
        plotOptions: {
          series: {
            findNearestPointBy: 'xy',
            stickyTracking: true,
          },
        },
      },
      {
        name: name[1],
        type: type[1],
        data: filteredData.data2,
        yAxis: 1,
        color:
          type === 'line'
            ? `${COLOR.PRIMARY}`
            : {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 1,
                  y2: 1,
                },
                stops: [
                  [0, `${COLOR.PRIMARY}`],
                  [1, `${COLOR.WHITE}`],
                ],
              },
        lineColor: type === 'line' ? '' : `${COLOR.PRIMARY}`,
        marker: {
          enabled: false,
        },
        tooltip: {
          valueSuffix: unit[1],
        },
      },
    ],
  };

  return (
    <div css={chartWrapperStyle}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        containerProps={{ style: { width: '90%', height: 'auto' } }}
      />
      <section css={buttonWrapperStyle}>
        {dateFilter.map((filter) => (
          <Button
            label={filter}
            key={filter}
            size='sm'
            shape={selectedFilter === filter ? 'round' : 'none'}
            handleClick={() => setSelectedFilter(filter)}
          />
        ))}
      </section>
    </div>
  );
};

const chartWrapperStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  min-width: 100%;
  width: 100%;
`;

const buttonWrapperStyle = css`
  display: flex;
  gap: 8px;

  button {
    width: 80px;
  }
`;

export default Chart;
