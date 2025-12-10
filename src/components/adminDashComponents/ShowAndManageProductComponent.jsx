import { useEffect, useState } from "react"
import productService from "../../services/productService"
import { useDispatch } from "react-redux"
import useUser from "../../hooks/useUser"
import { toast } from "react-toastify"
import { addToCart } from "../../features/product/productSlice.js"
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx"
import { categoryOptions } from "../../constant.js"
import Product from "../Product/Product.jsx"

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

      await productService.toggleProductAvailability(productId) // Assumes a service method exists
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
      await productService.editProduct(productDetails) // Assumes a service method exists
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
    <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8" >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Search bar and filter options */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
              <div className="flex-1">
                <label className="block text-sm font-medium text-white mb-2">Availability</label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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

          {/* Product Table - Desktop */}
          <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
            {products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#1a2250] text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Availability</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
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
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg">No products available.</p>
              </div>
            )}
          </div>

          {/* Product Cards - Mobile/Tablet */}
          <div className="lg:hidden space-y-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-lg p-4">
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
              <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
                <p className="text-lg">No products available.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white text-[#1a2250] rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-white font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white text-[#1a2250] rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShowAndManageProductComponent
