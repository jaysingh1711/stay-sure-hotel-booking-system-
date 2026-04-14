import React, { useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpIcon, ArrowDownIcon, Users, Calendar, UserPlus, DollarSign } from 'lucide-react'
import DashboardCharts from '../components/DashboardCharts'
import RecentActivity from '../components/RecentActivity'
import { useAdminContext } from '@/context/AdminContext'

const DashboardContent = () => {
  const { fetchDashboardStats, dashboardStats, getBookingsPercentage, Percentage } = useAdminContext()

  useEffect(() => {
    fetchDashboardStats()
    getBookingsPercentage()
  }, [])

  const getPercentageData = (percentage) => {
    if (percentage > 0) return { color: 'text-green-500', icon: ArrowUpIcon }
    if (percentage < 0) return { color: 'text-red-500', icon: ArrowDownIcon }
    return { color: 'text-gray-500', icon: null }
  }

  const statsCards = [
    {
      title: 'Total Bookings',
      value: dashboardStats?.totalBookings || 0,
      change: Percentage?.bookings?.percentageChange || 0,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Guests',
      value: dashboardStats?.totalGuests || 0,
      change: Percentage?.guests?.percentageChange || 0,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers || 0,
      change: Percentage?.regularUsers?.percentageChange || 0,
      icon: UserPlus,
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Revenue',
      value: `₹${dashboardStats?.revenue?.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || 0}`,
      change: Percentage?.revenue?.percentageChange || 0,
      icon: DollarSign,
      gradient: 'from-yellow-500 to-yellow-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const { color, icon: ChangeIcon } = getPercentageData(card.change)
          return (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`bg-gradient-to-r ${card.gradient} p-4 text-white`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{card.title}</h3>
                    <card.icon className="w-5 h-5 opacity-75" />
                  </div>
                  <div className="text-2xl font-bold">{card.value}</div>
                </div>
                <div className="px-4 py-2 bg-white">
                  <div className={`flex items-center ${color} text-sm`}>
                    {ChangeIcon && <ChangeIcon className="w-4 h-4 mr-1" />}
                    <span className="font-semibold">{Math.abs(card.change)}%</span>
                    <span className="ml-1 text-gray-500">from last month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <DashboardCharts dashboardStats={dashboardStats} />
      <RecentActivity recentBookings={dashboardStats?.recentBookings} />
    </div>
  )
}

export default DashboardContent