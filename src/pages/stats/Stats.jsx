"use client"

import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import productService from "../../services/productService"
import useUser from "../../hooks/useUser"
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Stats = () => {
  const { user } = useUser()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!user?._id) {
      toast.error("User ID is not found, refresh and try again")
      return
    }

    const fetchPurchaseStats = async () => {
      try {
        const data = await productService.getPurchaseStats(user._id)
        console.log(data)
        setStats(data)
      } catch (error) {
        toast.error("Error fetching purchase stats")
        console.error(error)
      }
    }

    fetchPurchaseStats()
  }, [user])

  if (!stats) {
    return (
     <LoadingSpinner/>
    )
  }

  const purchaseDates = stats.purchases || []
  const purchaseCounts = purchaseDates.reduce((acc, date) => {
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const chartData = {
    labels: Object.keys(purchaseCounts),
    datasets: [
      {
        label: "Purchases",
        data: Object.values(purchaseCounts),
        fill: true,
        backgroundColor: "rgba(26, 34, 80, 0.1)",
        borderColor: "#1a2250",
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: "#1a2250",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  }

  const totalPurchases = purchaseDates.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#1a2250] via-[#2a3570] to-[#1a2250] bg-clip-text text-transparent mb-2">
            Purchase Analytics
          </h2>
          <p className="text-gray-600 text-sm md:text-base">Real-time insights into your business performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a2250]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a2250] to-[#2a3570] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Completed Purchases</h3>
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#1a2250] to-[#2a3570] bg-clip-text text-transparent">
                {stats.totalCompletedPurchases}
              </p>
              <div className="mt-4 text-xs text-green-600 font-medium">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                      clipRule="evenodd"
                    />
                  </svg>
                  All time
                </span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a2250]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a2250] to-[#2a3570] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Users</h3>
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#1a2250] to-[#2a3570] bg-clip-text text-transparent">
                {stats.totalUsersCount}
              </p>
              <div className="mt-4 text-xs text-blue-600 font-medium">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active users
                </span>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200/50 sm:col-span-2 lg:col-span-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#1a2250]/10 to-transparent rounded-bl-full transform translate-x-8 -translate-y-8"></div>
            <div className="relative p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#1a2250] to-[#2a3570] rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Total Products</h3>
              <p className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-[#1a2250] to-[#2a3570] bg-clip-text text-transparent">
                {stats.totalProductsCount}
              </p>
              <div className="mt-4 text-xs text-purple-600 font-medium">
                <span className="inline-flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                    <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3z" />
                  </svg>
                  In catalog
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 mb-8 md:mb-10 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1a2250] mb-1">Purchases Timeline</h3>
              <p className="text-sm text-gray-500">Track your purchase trends over time</p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1a2250]/5 rounded-lg">
              <div className="w-3 h-3 bg-[#1a2250] rounded-full"></div>
              <span className="text-sm font-medium text-[#1a2250]">{totalPurchases} Total</span>
            </div>
          </div>
          <div className="w-full h-72 md:h-80 lg:h-96">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                    position: "top",
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        size: 12,
                        weight: "600",
                      },
                    },
                  },
                  tooltip: {
                    backgroundColor: "#1a2250",
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: {
                      size: 14,
                      weight: "600",
                    },
                    bodyFont: {
                      size: 13,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(26, 34, 80, 0.05)",
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      font: {
                        size: 11,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1a2250] mb-1">Recent Purchases</h3>
              <p className="text-sm text-gray-500">{purchaseDates.length} purchase dates recorded</p>
            </div>
          </div>
          {purchaseDates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {purchaseDates.map((date, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl hover:from-[#1a2250] hover:to-[#2a3570] transition-all duration-300 border border-gray-200 hover:border-[#1a2250] hover:shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1a2250] group-hover:bg-white rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-white transition-colors">
                      {date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>No purchase dates available</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1a2250;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2a3570;
        }
      `}</style>
    </div>
  )
}

export default Stats
