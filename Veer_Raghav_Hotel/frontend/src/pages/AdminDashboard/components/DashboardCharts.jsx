import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardCharts = () => {
  const monthlyData = [
    { month: 'Jan', bookings: 65, revenue: 12400, occupancy: 72 },
    { month: 'Feb', bookings: 75, revenue: 15000, occupancy: 78 },
    { month: 'Mar', bookings: 85, revenue: 18000, occupancy: 82 },
    { month: 'Apr', bookings: 70, revenue: 14000, occupancy: 75 },
    { month: 'May', bookings: 95, revenue: 21000, occupancy: 88 },
    { month: 'Jun', bookings: 100, revenue: 23000, occupancy: 92 }
  ];

  const roomTypeData = [
    { type: 'Standard', bookings: 120, color: '#60a5fa' },
    { type: 'Deluxe', bookings: 80, color: '#4ade80' },
    { type: 'Suite', bookings: 40, color: '#f472b6' },
    { type: 'Family', bookings: 60, color: '#fb923c' }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Trend */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <AreaChart 
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#6b7280' }}
                  tickFormatter={value => `₹${value.toLocaleString()}`} // currency symbol
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  name="Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Room Type Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Bookings by Room Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <BarChart
                  data={roomTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="type" 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="bookings" 
                    name="Bookings"
                    radius={[4, 4, 0, 0]}
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Occupancy Rate */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Occupancy Rate Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer>
                <LineChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280' }}
                    tickLine={{ stroke: '#6b7280' }}
                    domain={[0, 100]}
                    tickFormatter={value => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={{ fill: '#22c55e', strokeWidth: 2 }}
                    name="Occupancy Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardCharts;