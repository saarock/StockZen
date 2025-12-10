
import { useState, useEffect } from "react"
import productService from "../../services/productService"
import useUser from "../../hooks/useUser"

import { FaCheckCircle, FaTimesCircle, FaCog } from "react-icons/fa" // Import icons
import { toast } from "react-toastify"

const BookedProductComp = () => {
  const [bookedProducts, setBookedProducts] = useState([]) // Holds the booked products
  const [loading, setLoading] = useState(false) // Loading state for UI
  const [error, setError] = useState(null) // Error state
  const [page, setPage] = useState(1) // Current page
  const [limit, setLimit] = useState(10) // Number of products per page
  const [status, setStatus] = useState("pending") // Status filter (pending, completed, etc.)
  const [search, setSearch] = useState("") // Search term for product names
  const { user } = useUser() // Assuming useUser hook provides the logged-in user
  const [totalPages, setTotalPages] = useState(1) // Total pages for pagination
  const [prevStatus, setPreStatus] = useState("")

  useEffect(() => {
    const fetchBookedProducts = async () => {
      setLoading(true)
      setError(null)
      if (status !== prevStatus) {
        setPage(1)
      }

      try {
        const data = await productService.getBookedProduct(
          status !== prevStatus ? 1 : page,
          limit,
          status,
          search,
          user?._id,
        ) // Using user._id here
        setBookedProducts(data.data)
        setTotalPages(data.pagination.totalPages) // Set total pages for pagination
      } catch (err) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
        setPreStatus(status)
      }
    }

    fetchBookedProducts()
  }, [page, limit, status, search, user?._id]) // Fetch data on page change, status, etc.

  const handleChangeStatus = async (productId, newStatus) => {
    try {
      await productService.updateProductStatus(productId, newStatus) // Call API to update the status
      setBookedProducts((prevProducts) =>
        prevProducts.map((product) => (product._id === productId ? { ...product, status: newStatus } : product)),
      )
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      setError(err.message || "Failed to update status")
    }
  }

  const handleGenerateBill = (product) => {
    if (product && product.status === "pending") {
      toast.error("You cannot generate a bill for a pending product.")
      return
    }
    const billContent = `
            <html>
                <head>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f5f5f5;
                            padding: 40px 20px;
                        }
                        .bill-container { 
                            max-width: 800px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .bill-header { 
                            background: linear-gradient(135deg, #1a2250 0%, #2a3570 100%);
                            color: white;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .bill-header h1 {
                            font-size: 32px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            letter-spacing: 1px;
                        }
                        .bill-header p {
                            font-size: 14px;
                            opacity: 0.9;
                            margin-top: 8px;
                        }
                        .bill-body {
                            padding: 40px 30px;
                        }
                        .bill-row {
                            display: flex;
                            justify-content: space-between;
                            padding: 15px 0;
                            border-bottom: 1px solid #e5e7eb;
                        }
                        .bill-row:last-child {
                            border-bottom: none;
                        }
                        .bill-label {
                            color: #6b7280;
                            font-weight: 500;
                            font-size: 14px;
                        }
                        .bill-value {
                            color: #1a2250;
                            font-weight: 600;
                            font-size: 14px;
                        }
                        .bill-total {
                            background: #f9fafb;
                            padding: 20px 30px;
                            margin: 30px 0;
                            border-radius: 8px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                        }
                        .bill-total-label {
                            font-size: 18px;
                            font-weight: 600;
                            color: #1a2250;
                        }
                        .bill-total-value {
                            font-size: 28px;
                            font-weight: bold;
                            color: #1a2250;
                        }
                        .bill-footer { 
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            border-top: 2px solid #e5e7eb;
                        }
                        .bill-footer p {
                            color: #6b7280;
                            font-size: 14px;
                            margin: 5px 0;
                        }
                        .bill-footer .thank-you {
                            color: #1a2250;
                            font-size: 16px;
                            font-weight: 600;
                            margin-top: 15px;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 6px 16px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .status-completed {
                            background: #d1fae5;
                            color: #065f46;
                        }
                        .status-pending {
                            background: #fef3c7;
                            color: #92400e;
                        }
                        .status-cancelled {
                            background: #fee2e2;
                            color: #991b1b;
                        }
                        @media print {
                            body {
                                padding: 0;
                                background: white;
                            }
                            .bill-container {
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-container">
                        <div class="bill-header">
                            <h1>🧾 INVOICE</h1>
                            <p>Food Track - Your Trusted Partner</p>
                        </div>
                        <div class="bill-body">
                            <div class="bill-row">
                                <span class="bill-label">Product Name</span>
                                <span class="bill-value">${product.product.name}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-label">Booked By</span>
                                <span class="bill-value">${product.user?.userName}</span>
                            </div>
                            ${
                              product.payment_gateway
                                ? `
                            <div class="bill-row">
                                <span class="bill-label">Payment Gateway</span>
                                <span class="bill-value">${product.payment_gateway}</span>
                            </div>
                            `
                                : ""
                            }
                            <div class="bill-row">
                                <span class="bill-label">Total Items</span>
                                <span class="bill-value">${product.totalItems || 1}</span>
                            </div>
                            <div class="bill-row">
                                <span class="bill-label">Status</span>
                                <span class="status-badge status-${product.status}">${product.status}</span>
                            </div>
                            <div class="bill-total">
                                <span class="bill-total-label">Total Amount</span>
                                <span class="bill-total-value">Rs. ${product.price}</span>
                            </div>
                        </div>
                        <div class="bill-footer">
                            <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                            <p>Transaction ID: ${product._id}</p>
                            <p class="thank-you">Thank you for booking with us!</p>
                        </div>
                    </div>
                </body>
            </html>
        `

    const printWindow = window.open("", "_blank")
    printWindow.document.write(billContent)
    printWindow.document.close()
    printWindow.print()
  }

  const generateTotalBill = async (userId, status) => {
    try {
      const billData = await productService.generateBill(userId, status)
      console.log(billData)
      handleGenerateFullBill(billData.data)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleGenerateFullBill = (billData) => {
    const { allTheDetails, anotherPrice, userName } = billData

    const itemRows = allTheDetails
      .map(
        (item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>Rs. ${item.perPPrice}</td>
                <td>${item.totalItems}</td>
                <td>Rs. ${item.soTheMultiPrice}</td>
                <td><span class="status-badge status-${item.status}">${item.status}</span></td>
            </tr>
        `,
      )
      .join("")

    const billContent = `
            <html>
                <head>
                    <style>
                        * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                        }
                        body { 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background: #f5f5f5;
                            padding: 40px 20px;
                        }
                        .bill-container { 
                            max-width: 900px;
                            margin: 0 auto;
                            background: white;
                            border-radius: 12px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .bill-header { 
                            background: linear-gradient(135deg, #1a2250 0%, #2a3570 100%);
                            color: white;
                            padding: 40px 30px;
                            text-align: center;
                        }
                        .bill-header h1 {
                            font-size: 36px;
                            font-weight: bold;
                            margin-bottom: 10px;
                            letter-spacing: 1px;
                        }
                        .bill-header h2 {
                            font-size: 22px;
                            font-weight: 500;
                            opacity: 0.95;
                            margin-top: 10px;
                        }
                        .bill-header h3 {
                            font-size: 16px;
                            font-weight: 400;
                            opacity: 0.9;
                            margin-top: 15px;
                        }
                        .bill-body {
                            padding: 40px 30px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        thead {
                            background: #1a2250;
                            color: white;
                        }
                        th {
                            padding: 16px;
                            text-align: center;
                            font-weight: 600;
                            font-size: 14px;
                            letter-spacing: 0.5px;
                            text-transform: uppercase;
                        }
                        td {
                            padding: 16px;
                            text-align: center;
                            border-bottom: 1px solid #e5e7eb;
                            color: #374151;
                            font-size: 14px;
                        }
                        tbody tr:hover {
                            background: #f9fafb;
                        }
                        tbody tr:last-child td {
                            border-bottom: none;
                        }
                        .bill-total {
                            background: #f9fafb;
                            padding: 25px 30px;
                            margin: 30px 0;
                            border-radius: 8px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            border: 2px solid #1a2250;
                        }
                        .bill-total-label {
                            font-size: 20px;
                            font-weight: 700;
                            color: #1a2250;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                        .bill-total-value {
                            font-size: 32px;
                            font-weight: bold;
                            color: #1a2250;
                        }
                        .bill-footer {
                            background: #f9fafb;
                            padding: 30px;
                            text-align: center;
                            border-top: 2px solid #e5e7eb;
                        }
                        .bill-footer p {
                            color: #6b7280;
                            font-size: 14px;
                            margin: 5px 0;
                        }
                        .bill-footer .thank-you {
                            color: #1a2250;
                            font-size: 18px;
                            font-weight: 600;
                            margin-top: 15px;
                        }
                        .status-badge {
                            display: inline-block;
                            padding: 6px 14px;
                            border-radius: 20px;
                            font-size: 11px;
                            font-weight: 600;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                        .status-completed {
                            background: #d1fae5;
                            color: #065f46;
                        }
                        .status-pending {
                            background: #fef3c7;
                            color: #92400e;
                        }
                        .status-cancelled {
                            background: #fee2e2;
                            color: #991b1b;
                        }
                        @media print {
                            body {
                                padding: 0;
                                background: white;
                            }
                            .bill-container {
                                box-shadow: none;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="bill-container">
                        <div class="bill-header">
                            <h1>Food Track</h1>
                            <h2>🧾 Complete Invoice</h2>
                            <h3>Customer: ${userName}</h3>
                        </div>
                        <div class="bill-body">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Per Item Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemRows}
                                </tbody>
                            </table>
                            <div class="bill-total">
                                <span class="bill-total-label">Grand Total</span>
                                <span class="bill-total-value">Rs. ${anotherPrice}</span>
                            </div>
                        </div>
                        <div class="bill-footer">
                            <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
                            <p>Generated on: ${new Date().toLocaleString()}</p>
                            <p class="thank-you">Thank you for your purchase!</p>
                        </div>
                    </div>
                </body>
            </html>
        `

    const printWindow = window.open("", "_blank")
    printWindow.document.write(billContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4 md:p-6">
        {user && user?.role === "admin" ? (
          <input
            type="text"
            placeholder="Search by User Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2250] focus:border-transparent mb-4"
          />
        ) : (
          <input
            type="text"
            placeholder="Search by Product Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2250] focus:border-transparent mb-4"
          />
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              setStatus("pending")
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              status === "pending" ? "bg-[#1a2250] text-white shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => {
              setStatus("completed")
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              status === "completed"
                ? "bg-[#1a2250] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => {
              setStatus("cancelled")
            }}
            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              status === "cancelled"
                ? "bg-[#1a2250] text-white shadow-lg"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Loading and Error Handling */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a2250]"></div>
        </div>
      )}
      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      {/* Displaying Booked Products */}
      <div className="space-y-4">
        {bookedProducts?.length > 0 ? (
          bookedProducts.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1a2250] mb-2">{product.productName}</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Booked by:</span> {product.user?.userName}
                      </p>
                      <p>
                        <span className="font-medium">Total Items:</span> {product.totalItems}
                      </p>
                      <p>
                        <span className="font-medium">Product Name:</span> {product.product?.name}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            product.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : product.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Product Price */}
                  <div className="lg:text-right">
                    <span className="text-2xl font-bold text-[#1a2250]">Rs: {product.price}</span>
                  </div>
                </div>

                {/* Admin Actions */}
                {user?.role === "admin" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
                      <button
                        disabled={status === "pending"}
                        style={{ cursor: status === "pending" ? "no-drop" : "pointer" }}
                        onClick={() => handleChangeStatus(product._id, "pending")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaCog /> Pending
                      </button>
                      <button
                        disabled={status === "completed"}
                        style={{ cursor: status === "completed" ? "no-drop" : "pointer" }}
                        onClick={() => handleChangeStatus(product._id, "completed")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaCheckCircle /> Completed
                      </button>
                      <button
                        disabled={status === "cancelled"}
                        style={{ cursor: status === "cancelled" ? "no-drop" : "pointer" }}
                        onClick={() => handleChangeStatus(product._id, "cancelled")}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaTimesCircle /> Cancelled
                      </button>
                      <button
                        onClick={() => handleGenerateBill(product)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2250] text-white rounded-lg hover:bg-[#233166] transition-colors duration-200"
                      >
                        <FaCheckCircle /> Generate Bill
                      </button>
                      <button
                        onClick={() => generateTotalBill(product.user._id, product.status)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a2250] text-white rounded-lg hover:bg-[#233166] transition-colors duration-200 sm:col-span-2 lg:col-span-1"
                      >
                        <FaCheckCircle /> Generate Total Bill for {product.user?.userName}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">No booked products found</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-6 py-3 bg-[#1a2250] text-white rounded-lg font-medium hover:bg-[#233166] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-white rounded-lg shadow-md font-medium text-[#1a2250]">{page}</span>
        <button
          disabled={page === totalPages || bookedProducts?.length <= 0}
          onClick={() => setPage(page + 1)}
          className="px-6 py-3 bg-[#1a2250] text-white rounded-lg font-medium hover:bg-[#233166] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default BookedProductComp
