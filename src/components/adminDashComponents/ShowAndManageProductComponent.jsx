
import { useEffect, useState } from "react"
import productService from "../../services/productService"
import { useDispatch } from "react-redux"
import useUser from "../../hooks/useUser"
import { toast } from "react-toastify"
import { addToCart } from "../../features/product/productSlice"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner"
import { categoryOptions } from "../../constant"
import Product from "../Product/Product.jsx"

import { Search, Filter, Package } from "lucide-react"

const ShowAndManageProductComponent = ({ adminWant = "1", refresh }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("2")
  const [availabilityFilter, setAvailabilityFilter] = useState("2")
  const [totalItem, setTotalItem] = useState(1)
  const productsPerPage = 7
  const { user } = useUser()
  const dispatch = useDispatch()

  // 0 => false
  // 1 => true
  // 2 => all

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts(
          currentPage,
          productsPerPage,
          searchQuery,
          categoryFilter,
          availabilityFilter,
          adminWant,
        )

        setProducts(data.data.products)
        setTotalPages(data.data.totalPages)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [currentPage, searchQuery, categoryFilter, availabilityFilter, adminWant, refresh])

  const handelPaginationWorks = async () => {
    const data = await productService.getProducts(
      currentPage,
      productsPerPage,
      searchQuery,
      categoryFilter,
      availabilityFilter,
      adminWant,
    )
    setProducts(data.data.products)
    setTotalPages(data.data.totalPages)
    setLoading(false)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setLoading(true)
      await productService.deleteProduct(productId)
      handelPaginationWorks()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAvailability = async (productId) => {
    try {
      setLoading(true)

      await productService.toggleProductAvailability(productId)
      handelPaginationWorks()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (productDetails) => {
    try {
      setLoading(true)
      await productService.editProduct(productDetails)
      handelPaginationWorks()
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const addToCartBtn = (event, userId, productId, name, price, imageUrl) => {
    event.preventDefault()
    toast.success("Product added to cart successfully!")
    const product = {
      userId,
      productId,
      totalItem,
      totalPrice: price * totalItem,
      imageUrl,
      productName: name,
    }

    dispatch(addToCart(product))
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#101540]/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#101540]/5 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-gradient-to-br from-[#101540] to-[#1a2250] rounded-xl shadow-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-[#101540]">Product Management</h1>
            </div>
            <p className="text-gray-600 ml-[60px]">Manage and organize your products</p>
          </div>

          <div className="mb-8 space-y-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Search bar */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#101540] transition-colors" />
              <input
                type="text"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#101540] focus:ring-4 focus:ring-[rgba(16,21,64,0.05)] text-gray-900 placeholder-gray-400 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                placeholder="Search products by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1 group">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-2">
                  <Filter className="w-4 h-4" />
                  Category
                </label>
                <select
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#101540] focus:ring-4 focus:ring-[rgba(16,21,64,0.05)] text-gray-900 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="2">All Categories</option>
                  {categoryOptions?.length > 0
                    ? categoryOptions.map((ca) => (
                        <option key={ca.value} value={ca.value}>
                          {ca.label}
                        </option>
                      ))
                    : null}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="flex-1 group">
                <label className="flex items-center gap-2 text-sm font-semibold text-[#101540] mb-2">
                  <Package className="w-4 h-4" />
                  Availability
                </label>
                <select
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-[#101540] focus:ring-4 focus:ring-[rgba(16,21,64,0.05)] text-gray-900 bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="2">All</option>
                  <option value="1">Available</option>
                  <option value="0">Out of Stock</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className="hidden lg:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-[#101540] to-[#1a2250]">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Availability
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map((product, index) => (
                      <Product
                        key={product._id}
                        product={product}
                        handleDeleteProduct={handleDeleteProduct}
                        handleToggleAvailability={handleToggleAvailability}
                        user={user}
                        handleFormSubmit={handleFormSubmit}
                        addToCart={addToCartBtn}
                        setTotalItem={setTotalItem}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="inline-block p-6 bg-[rgba(16,21,64,0.05)] rounded-full mb-4">
                  <Package className="w-12 h-12 text-[#101540]" />
                </div>
                <p className="text-xl font-semibold text-gray-700 mb-2">No products available</p>
                <p className="text-gray-500">Try adjusting your filters or add new products</p>
              </div>
            )}
          </div>

          <div className="lg:hidden space-y-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {products.length > 0 ? (
              products.map((product, index) => (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-5 border border-gray-100 transition-all duration-300 hover:scale-[1.02] animate-fade-in-up"
                  style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                >
                  <Product
                    product={product}
                    handleDeleteProduct={handleDeleteProduct}
                    handleToggleAvailability={handleToggleAvailability}
                    user={user}
                    handleFormSubmit={handleFormSubmit}
                    addToCart={addToCartBtn}
                    setTotalItem={setTotalItem}
                  />
                </div>
              ))
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-16 text-center border border-gray-100">
                <div className="inline-block p-6 bg-[rgba(16,21,64,0.05)] rounded-full mb-4">
                  <Package className="w-12 h-12 text-[#101540]" />
                </div>
                <p className="text-xl font-semibold text-gray-700 mb-2">No products available</p>
                <p className="text-gray-500">Try adjusting your filters or add new products</p>
              </div>
            )}
          </div>

          <div
            className="mt-8 flex items-center justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="group px-6 py-3 bg-white text-[#101540] rounded-xl font-semibold hover:bg-[#101540] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#101540] transition-all duration-300 shadow-md hover:shadow-lg border-2 border-[#101540] hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </span>
            </button>

            <div className="px-6 py-3 bg-gradient-to-r from-[#101540] to-[#1a2250] text-white rounded-xl font-bold shadow-lg border-2 border-[#101540]">
              <span className="flex items-center gap-2">
                <span className="text-sm opacity-80">Page</span>
                <span className="text-lg">{currentPage}</span>
                <span className="text-sm opacity-80">of</span>
                <span className="text-lg">{totalPages}</span>
              </span>
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="group px-6 py-3 bg-white text-[#101540] rounded-xl font-semibold hover:bg-[#101540] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#101540] transition-all duration-300 shadow-md hover:shadow-lg border-2 border-[#101540] hover:scale-105 active:scale-95"
            >
              <span className="flex items-center gap-2">
                Next
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowAndManageProductComponent
