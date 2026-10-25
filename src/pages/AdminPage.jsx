import { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  Loader2,
  X,
  ChevronDown,
} from 'lucide-react';
import { BRAND } from '../data/brand';
import { CATEGORIES } from '../data/seedProducts';
import {
  fetchProducts,
  seedProductsToFirestore,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../services/productService';
import {
  fetchAllOrders,
  updateOrderStatus,
} from '../services/orderService';
import { formatINR, formatDateTime } from '../utils/formatters';
import { useToast } from '../context/ToastContext';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('All');

  // Product modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    mrp: '',
    stock: 25,
    rating: 4.8,
    sku: '',
    description: '',
    image: '',
    specs: '',
  });

  const { addToast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        fetchProducts(),
        fetchAllOrders(),
      ]);
      setProducts(prods);
      setOrders(ords);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Seeding button handler
  const handleSeedProducts = async () => {
    setIsSeeding(true);
    try {
      const count = await seedProductsToFirestore();
      addToast({
        type: 'success',
        title: 'Catalog Seeded',
        message: `Successfully seeded ${count} products across 6 categories into Firestore!`,
      });
      await loadData();
    } catch (err) {
      console.error('Seeding error:', err);
      addToast({
        type: 'error',
        title: 'Seeding Failed',
        message: err.message || 'Could not seed products to Firestore.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  // Open Add modal
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      category: 'Electronics',
      price: '',
      mrp: '',
      stock: 25,
      rating: 4.8,
      sku: `NX-${Math.floor(1000 + Math.random() * 9000)}`,
      description: '',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
      specs: '1-Year Warranty, Premium Build Quality',
    });
    setIsProductModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      mrp: prod.mrp || '',
      stock: prod.stock,
      rating: prod.rating || 4.8,
      sku: prod.sku || '',
      description: prod.description || '',
      image: prod.image,
      specs: Array.isArray(prod.specs) ? prod.specs.join(', ') : prod.specs || '',
    });
    setIsProductModalOpen(true);
  };

  // Save product (Add or Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and price are required.',
      });
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      price: Number(productForm.price),
      mrp: productForm.mrp ? Number(productForm.mrp) : Number(productForm.price) * 1.15,
      stock: Number(productForm.stock) || 10,
      rating: Number(productForm.rating) || 4.8,
      sku: productForm.sku.trim(),
      description: productForm.description.trim(),
      image: productForm.image.trim(),
      specs: productForm.specs
        ? productForm.specs.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        addToast({
          type: 'success',
          title: 'Product Updated',
          message: `${payload.name} was successfully updated.`,
        });
      } else {
        await createProduct(payload);
        addToast({
          type: 'success',
          title: 'Product Created',
          message: `${payload.name} was successfully registered in the catalog.`,
        });
      }
      setIsProductModalOpen(false);
      await loadData();
    } catch (err) {
      console.error('Error saving product:', err);
      addToast({
        type: 'error',
        title: 'Save Failed',
        message: 'Could not save product to Firestore.',
      });
    }
  };

  // Delete product
  const handleDeleteProduct = async (prodId, prodName) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}" from the catalog?`)) {
      return;
    }
    try {
      await deleteProduct(prodId);
      addToast({
        type: 'info',
        title: 'Product Deleted',
        message: `${prodName} was removed from the catalog.`,
      });
      await loadData();
    } catch (err) {
      console.error('Error deleting product:', err);
      addToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Could not delete product.',
      });
    }
  };

  // Update order status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      addToast({
        type: 'success',
        title: 'Status Updated',
        message: `Order status set to "${newStatus}".`,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error('Error updating status:', err);
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: 'Could not update order status.',
      });
    }
  };

  // Computations for overview stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const uniqueUsersCount = new Set(orders.map((o) => o.customerEmail || o.userId)).size || 1;
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  // Filtered products list for product table
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'All' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner & Control Center Header */}
      <div className="bg-[#111A2C] border border-[#223049] rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
              MERCHANT COMMAND CENTER
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Realtime Firestore Sync Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1.5">
            {BRAND.name} Operations & Inventory Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage product collections, monitor GMV metrics, seed catalog inventories, and update customer order fulfillment statuses.
          </p>
        </div>

        {/* Action Buttons: Seed Products + Add New Product */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeedProducts}
            disabled={isSeeding}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            title="Inserts 40 realistic products into Firestore"
          >
            {isSeeding ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Seeding 40 Products...</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                <span>Seed 40 Products to Firestore</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-[#223049] gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`py-3 px-4 rounded-t-xl transition-all ${
            activeTab === 'overview'
              ? 'bg-[#111A2C] border-t border-x border-[#223049] text-blue-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dashboard Overview & GMV
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`py-3 px-4 rounded-t-xl transition-all ${
            activeTab === 'products'
              ? 'bg-[#111A2C] border-t border-x border-[#223049] text-blue-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inventory & Catalog ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 rounded-t-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-[#111A2C] border-t border-x border-[#223049] text-blue-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Order Fulfillment ({orders.length})
        </button>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-slate-400">Loading catalog inventory & order ledger...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#111A2C] border border-[#223049] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Gross GMV / Revenue
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {formatINR(totalRevenue)}
              </p>
              <p className="text-[11px] text-emerald-400 font-medium">
                {orders.length > 0
                  ? `From ${orders.length} settled transaction${orders.length > 1 ? 's' : ''}`
                  : 'No orders recorded yet'}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111A2C] border border-[#223049] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total Orders Logged
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {totalOrdersCount}
              </p>
              <p className="text-[11px] text-blue-400 font-medium">
                Across Pan-India delivery zones
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111A2C] border border-[#223049] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Registered Users
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {uniqueUsersCount}
              </p>
              <p className="text-[11px] text-blue-400 font-medium">
                Customer & admin profiles
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#111A2C] border border-[#223049] space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Active SKU Inventory
              </span>
              <p className="text-2xl font-black text-white tracking-tight">
                {products.length} Products
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                6 Multi-category collections
              </p>
            </div>
          </div>

          {/* Revenue Chart Visual & Category Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-[#223049]">
                <div>
                  <h3 className="font-bold text-white text-sm">Revenue & Fulfillment Trajectory</h3>
                  <p className="text-[11px] text-slate-400">Monthly progression across verified transactions</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Live Settlement Rate
                </span>
              </div>

              {/* Simulated visual bar chart */}
              <div className="h-44 flex items-end gap-3 pt-6 px-2">
                {[
                  { month: 'Jan', val: 40 },
                  { month: 'Feb', val: 65 },
                  { month: 'Mar', val: 50 },
                  { month: 'Apr', val: 80 },
                  { month: 'May', val: 75 },
                  { month: 'Jun', val: 95 },
                  { month: 'Jul', val: 90 },
                ].map((bar) => (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      style={{ height: `${bar.val}%` }}
                      className="w-full bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-md transition-all hover:brightness-125"
                    ></div>
                    <span className="text-[10px] text-slate-400 font-mono">{bar.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Split */}
            <div className="lg:col-span-4 bg-[#111A2C] border border-[#223049] rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-sm pb-3 border-b border-[#223049]">
                Category Distribution
              </h3>
              <div className="space-y-3 text-xs">
                {CATEGORIES.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>{cat}</span>
                        <span className="font-mono text-slate-400">{count} SKUs ({pct}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#0B1220] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full bg-blue-500 rounded-full"
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-[#111A2C] border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-amber-400 text-sm font-bold">
                <AlertCircle className="w-5 h-5" />
                <span>Critical Low Stock Threshold Alerts ({lowStockProducts.length} Items &lt; 15 units)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {lowStockProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#0B1220] border border-[#223049] flex items-center justify-between">
                    <div className="truncate mr-2">
                      <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.category}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 shrink-0">
                      {p.stock} Left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PRODUCTS INVENTORY */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111A2C] border border-[#223049] p-4 rounded-xl">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Filter by product name or SKU..."
                className="w-full pl-9 pr-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add SKU</span>
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#223049] text-slate-400 text-[10px] uppercase font-semibold bg-[#0B1220]">
                    <th className="py-3 px-4">Item & SKU</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#223049]/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#152238] transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-[#0E1626] border border-[#223049] shrink-0"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <p className="font-semibold text-slate-200 truncate">{p.name}</p>
                            <p className="text-[10px] font-mono text-slate-400">SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium whitespace-nowrap">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                        {formatINR(p.price)}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock <= 10
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 text-amber-400 font-semibold whitespace-nowrap">
                        ★ {p.rating}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-slate-300 hover:text-white hover:border-slate-400 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-[#0B1220] border border-[#223049] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#223049] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Customer Orders & Consignment Flow</h3>
                <p className="text-[11px] text-slate-400">Update fulfillment status to notify customers in real-time</p>
              </div>
              <span className="text-xs font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/30">
                {orders.length} Total Consignments
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#223049] text-slate-400 text-[10px] uppercase font-semibold bg-[#0B1220]">
                    <th className="py-3 px-4">Order ID & Date</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Items Summary</th>
                    <th className="py-3 px-4">Settlement Amount</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Update Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#223049]/60">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#152238] transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-400 block">
                          {o.trackingNumber || `#NX-${o.id.slice(0, 6)}`}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateTime(o.createdAt)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-200">{o.customerName}</p>
                        <p className="text-[10px] text-slate-400">{o.customerEmail}</p>
                        <p className="text-[10px] text-slate-500">{o.customerPhone}</p>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                        {o.items?.map((item) => `${item.name} (x${item.quantity})`).join(', ')}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {formatINR(o.total)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                        {o.paymentMethod}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            className={`appearance-none px-3 py-1.5 pr-7 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border ${
                              o.status === 'Delivered'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : o.status === 'Shipped'
                                ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                                : o.status === 'Packed'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}
                          >
                            <option value="Placed">● Placed</option>
                            <option value="Packed">● Packed</option>
                            <option value="Shipped">● Shipped</option>
                            <option value="Delivered">● Delivered</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )}

  {/* ADD / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111A2C] border border-[#223049] rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#223049] mb-5">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Product SKU' : 'Register New Product in Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Price (₹ INR) *</label>
                  <input
                    type="number"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="29990"
                    className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">MRP (₹ INR)</label>
                  <input
                    type="number"
                    value={productForm.mrp}
                    onChange={(e) => setProductForm({ ...productForm, mrp: e.target.value })}
                    placeholder="34990"
                    className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Image URL (Unsplash)</label>
                <input
                  type="url"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Specifications (comma separated)</label>
                <input
                  type="text"
                  value={productForm.specs}
                  onChange={(e) => setProductForm({ ...productForm, specs: e.target.value })}
                  placeholder="Active Noise Cancelling, 30hr Battery, Bluetooth 5.3"
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B1220] border border-[#223049] rounded-xl text-slate-100"
                />
              </div>

              <div className="pt-4 border-t border-[#223049] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
