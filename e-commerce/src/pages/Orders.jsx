import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/store';
import { Package, Calendar, DollarSign, Eye } from 'lucide-react';

const Orders = () => {
  const { orders } = useStore();
  
  console.log('Orders page - orders:', orders);

  try {
    const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
            <Link
              to="/products"
              className="btn-primary inline-flex items-center"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">Track your order history and status</p>
        </div>

        <div className="space-y-6">
          {(orders || []).map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-gray-400" />
                      <span className="font-semibold text-gray-900">Order #{order.id}</span>
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status || 'processing')}`}>
                      {(order.status || 'processing').charAt(0).toUpperCase() + (order.status || 'processing').slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(order.date || new Date()).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>${(order.totals?.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4">
                  {(order.items || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name || 'Product'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name || 'Product'}
                        </h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-900">
                            ${item.price || 0}
                          </span>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <span className="text-sm text-gray-600">
                        {(order.items?.length || 0)} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        Total: ${(order.totals?.total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex space-x-3">
                      <Link
                        to={`/order/${order.id}`}
                        className="btn-secondary flex items-center space-x-2"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="btn-primary">
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  } catch (error) {
    console.error('Error in Orders component:', error);
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
            <p className="text-gray-600 mb-8">Something went wrong while loading your orders.</p>
            <Link to="/" className="btn-primary">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default Orders; 