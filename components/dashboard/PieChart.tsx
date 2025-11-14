import React from 'react';

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6366F1', '#EC4899', '#F97316', '#14B8A6'];

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const total = data.values.reduce((acc, value) => acc + value, 0);
  if (total === 0) {
    return <p className="text-center text-gray-500 py-10">لا توجد بيانات لعرضها.</p>;
  }

  let cumulativePercentage = 0;
  const gradientParts = data.values.map((value, index) => {
    const percentage = (value / total) * 100;
    const start = cumulativePercentage;
    cumulativePercentage += percentage;
    const end = cumulativePercentage;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  });

  const conicGradient = `conic-gradient(${gradientParts.join(', ')})`;

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8 p-4">
      <div 
        className="w-40 h-40 md:w-48 md:h-48 rounded-full flex-shrink-0"
        style={{ background: conicGradient }}
        role="img"
        aria-label="Pie chart showing category distribution"
      ></div>
      <div className="w-full md:w-auto">
        <ul className="space-y-2 columns-2">
          {data.labels.map((label, index) => (
            <li key={label} className="flex items-center text-sm py-1">
              <span 
                className="w-3 h-3 rounded-full me-2 flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></span>
              <span className="font-medium text-gray-700 truncate" title={label}>{label}:</span>
              <span className="ms-auto ps-2 text-gray-500 font-mono">
                {((data.values[index] / total) * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PieChart;
