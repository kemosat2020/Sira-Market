

import React from 'react';
import { useTranslation } from '../../i18n/index.tsx';

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  format: 'number' | 'currency';
  currency: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, format, currency }) => {
  const { t, locale } = useTranslation();
  if (!data.values || data.values.length === 0) {
    return <p className="text-center text-gray-500 py-10">{t('dashboard.reports.no_data')}</p>;
  }

  const maxValue = Math.max(...data.values, 1);
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'];

  const formatValue = (value: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', currencyDisplay: 'symbol' }).format(value);
    }
    return value.toLocaleString('en-US');
  };

  return (
    <div className="space-y-4 h-full flex flex-col justify-around">
      {data.labels.map((label, index) => {
        const value = data.values[index];
        const widthPercentage = (value / maxValue) * 100;
        const color = colors[index % colors.length];

        return (
          <div key={label} className="flex items-center group">
            <div className="w-1/4 text-sm text-gray-600 font-medium truncate pe-2 text-start">{label}</div>
            <div className="w-3/4">
                <div className="flex items-center">
                    <div className="flex-grow bg-gray-200 rounded-full h-6">
                        <div
                        className={`${color} h-6 rounded-full transition-all duration-500 ease-out flex items-center justify-end px-2`}
                        style={{ width: `${widthPercentage}%` }}
                        >
                         <span className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatValue(value)}
                        </span>
                        </div>
                    </div>
                     <span className="text-xs font-semibold text-gray-700 ms-3 w-16 text-end">{formatValue(value)}</span>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;