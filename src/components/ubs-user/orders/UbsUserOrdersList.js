import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UbsUserOrderDetails from './UbsUserOrderDetails';
import UbsUserOrderPaymentPopUp from './UbsUserOrderPaymentPopUp';
import UbsUserOrderCancelPopUp from './UbsUserOrderCancelPopUp';
import './UbsUserOrders.scss';

/**
 * UBS User Orders List component
 * Displays a list of user orders in an accordion
 */
const UbsUserOrdersList = ({ orders, bonuses }) => {
  const { t } = useTranslation();
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderPrice, setSelectedOrderPrice] = useState(0);

  // Order status enums
  const OrderStatusEn = {
    DONE: 'Done',
    CANCELED: 'Canceled',
    CONFIRMED: 'Confirmed',
    FORMED: 'Formed',
    ADJUSTMENT: 'Adjustment',
    BROUGHT_IT_HIMSELF: 'Brought by himself',
    NOT_TAKEN_OUT: 'Not taken out'
  };

  // Payment status enums
  const PaymentStatusEn = {
    PAID: 'Paid',
    UNPAID: 'Unpaid',
    HALFPAID: 'Half paid'
  };

  /**
   * Check if order is unpaid
   */
  const isOrderUnpaid = (order) => {
    return order.paymentStatusEng === PaymentStatusEn.UNPAID;
  };

  /**
   * Check if order is half paid
   */
  const isOrderHalfPaid = (order) => {
    return order.paymentStatusEng === PaymentStatusEn.HALFPAID;
  };

  /**
   * Check if order is canceled
   */
  const isOrderCanceled = (order) => {
    return order.orderStatusEng === OrderStatusEn.CANCELED;
  };

  /**
   * Check if order is done or canceled
   */
  const isOrderDoneOrCancel = (order) => {
    const isOrderDone = order.orderStatusEng === OrderStatusEn.DONE;
    const isOrderCancelled = order.orderStatusEng === OrderStatusEn.CANCELED;
    return isOrderDone || isOrderCancelled;
  };

  /**
   * Check if order price is greater than zero
   */
  const isOrderPriceGreaterThenZero = (order) => {
    return order.orderFullPrice > 0;
  };

  /**
   * Check if order payment is accessible
   */
  const isOrderPaymentAccess = (order) => {
    return (
      isOrderPriceGreaterThenZero(order) &&
      (isOrderUnpaid(order) || isOrderHalfPaid(order)) &&
      !isOrderCanceled(order)
    );
  };

  /**
   * Check if order can be canceled
   */
  const canOrderBeCancel = (order) => {
    return (
      order.paymentStatusEng !== PaymentStatusEn.HALFPAID &&
      order.orderStatusEng !== OrderStatusEn.ADJUSTMENT &&
      order.orderStatusEng !== OrderStatusEn.BROUGHT_IT_HIMSELF &&
      order.orderStatusEng !== OrderStatusEn.NOT_TAKEN_OUT &&
      order.orderStatusEng !== OrderStatusEn.CANCELED &&
      order.orderStatusEng !== OrderStatusEn.DONE
    );
  };

  /**
   * Toggle order expansion
   */
  const toggleOrderExpansion = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  /**
   * Open order payment dialog
   */
  const openOrderPaymentDialog = (order) => {
    setSelectedOrderId(order.id);
    setSelectedOrderPrice(order.amountBeforePayment);
    setShowPaymentModal(true);
  };

  /**
   * Handle payment modal close
   */
  const handlePaymentModalClose = (success) => {
    setShowPaymentModal(false);
    if (success) {
      // Refresh orders after successful payment
      // This would typically be handled by the parent component
      // or through a context/redux update
      console.log('Payment successful for order:', selectedOrderId);
    }
  };

  /**
   * Open order cancel dialog
   */
  const openOrderCancelDialog = (order) => {
    setSelectedOrderId(order.id);
    setShowCancelModal(true);
  };

  /**
   * Handle cancel modal close
   */
  const handleCancelModalClose = (success) => {
    setShowCancelModal(false);
    if (success) {
      // Refresh orders after successful cancellation
      // This would typically be handled by the parent component
      // or through a context/redux update
      console.log('Cancellation successful for order:', selectedOrderId);
    }
  };

  /**
   * Format date to locale string
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return `${amount} UAH`;
  };

  return (
    <div className="orders-list">
      {/* Payment Modal */}
      <UbsUserOrderPaymentPopUp
        show={showPaymentModal}
        onHide={handlePaymentModalClose}
        orderId={selectedOrderId}
        price={selectedOrderPrice}
        bonuses={bonuses}
      />

      {/* Cancel Modal */}
      <UbsUserOrderCancelPopUp
        show={showCancelModal}
        onHide={handleCancelModalClose}
        orderId={selectedOrderId}
        orders={orders}
      />

      {orders.length > 0 && (
        <div className="header_list">
          <div className="header header_list-num">{t('user-orders.order-number')}</div>
          <div className="header header_list-date">{t('user-orders.order-date')}</div>
          <div className="header header_list-paymentDate">{t('add-payment.payment-date')}</div>
          <div className="header header_list-status">{t('user-orders.order-status')}</div>
          <div className="header header_list-paymentStatus">{t('user-orders.order-payment-status')}</div>
          <div className="header header_list-paymentAmount">{t('user-orders.payment-amount')}</div>
          {!isOrderDoneOrCancel(orders[0]) && (
            <div className="header header_list-paymentAmountDue">{t('user-orders.amount-due')}</div>
          )}
          <div className="empty-div"></div>
        </div>
      )}

      <div className="accordion">
        {orders.map((order) => (
          <div key={order.id} className="expansion-panel">
            <div className="expansion-panel-header" onClick={() => toggleOrderExpansion(order.id)}>
              <div className="mat-content-wrapper">
                <div className="mobile_list">
                  <div className="mobile mobile_list-num">{t('user-orders.order-number')}</div>
                  <div className="order_list-num table-data">{order.id}</div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-date">{t('user-orders.order-date')}</div>
                  <div className="order_list-date table-data">{formatDate(order.dateForm)}</div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-paymentDate">{t('user-orders.payment-date')}</div>
                  <div className="order_list-paymentDate table-data">{formatDate(order.datePaid)}</div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-status">{t('user-orders.order-status')}</div>
                  <div className="order_list-status table-data">
                    {order.orderStatusEng}
                  </div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-paymentStatus">{t('user-orders.order-payment-status')}</div>
                  <div className="order_list-paymentStatus table-data">
                    {order.paymentStatusEng}
                  </div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-paymentAmount">{t('user-orders.payment-amount')}</div>
                  <div className="order_list-paymentAmount table-data">
                    {formatCurrency(order.orderFullPrice)}
                  </div>
                </div>
                <div className="mobile_list">
                  <div className="mobile mobile_list-amountDue">{t('user-orders.amount-due')}</div>
                  {!isOrderDoneOrCancel(order) && (
                    <div className="order_list-paymentAmountDue table-data">
                      {formatCurrency(order.amountBeforePayment)}
                    </div>
                  )}
                </div>
              </div>

              {isOrderPaymentAccess(order) && (
                <div className="btns-group">
                  {canOrderBeCancel(order) && (
                    <div className="btn-box">
                      <button
                        className="ubs-secondary-global-button s-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderCancelDialog(order);
                        }}
                      >
                        {t('user-orders.btn.cancel')}
                      </button>
                    </div>
                  )}
                  {!isOrderCanceled(order) && (
                    <div className="btn-box">
                      <button
                        className="ubs-primary-global-button s-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openOrderPaymentDialog(order);
                        }}
                      >
                        {t('user-orders.btn.pay')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {expandedOrderId === order.id && (
              <div className="expansion-panel-content">
                <UbsUserOrderDetails order={order} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UbsUserOrdersList;
