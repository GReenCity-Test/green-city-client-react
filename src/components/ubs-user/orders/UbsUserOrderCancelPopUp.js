import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UbsService from '../../../services/ubs/UbsService';
import './UbsUserOrders.scss';

/**
 * UBS User Order Cancel Pop-up component
 * Modal dialog for canceling orders
 */
const UbsUserOrderCancelPopUp = ({ show, onHide, orderId, orders }) => {
  const { t } = useTranslation();
  const [cancelReason, setCancelReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Handle reason input change
   */
  const handleReasonChange = (e) => {
    setCancelReason(e.target.value);
  };

  /**
   * Process order cancellation
   */
  const processCancellation = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Call cancel API
      await UbsService.cancelOrder(orderId, cancelReason);

      // Close modal on success
      onHide(true);
    } catch (err) {
      console.error('Cancellation error:', err);
      setError(t('user-orders.cancel.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Get order by ID
   */
  const getOrderById = (id) => {
    return orders.find(order => order.id === id);
  };

  // Get current order
  const currentOrder = getOrderById(orderId);

  return (
    <Modal show={show} onHide={() => onHide(false)} centered className="cancel-modal">
      <Modal.Header closeButton>
        <Modal.Title>{t('user-orders.cancel.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="cancel-details">
          <p className="cancel-warning">{t('user-orders.cancel.warning')}</p>

          <div className="order-info">
            <div className="order-info-row">
              <span>{t('user-orders.order-number')}:</span>
              <span className="order-info-value">{orderId}</span>
            </div>
            {currentOrder && (
              <div className="order-info-row">
                <span>{t('user-orders.payment-amount')}:</span>
                <span className="order-info-value">{currentOrder.orderFullPrice} UAH</span>
              </div>
            )}
          </div>

          <Form.Group className="mb-3">
            <Form.Label>{t('user-orders.cancel.reason')}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={handleReasonChange}
              placeholder={t('user-orders.cancel.reason-placeholder')}
              disabled={isProcessing}
            />
          </Form.Group>

          {error && (
            <div className="cancel-error">
              {error}
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onHide(false)}
          disabled={isProcessing}
        >
          {t('user-orders.cancel.back')}
        </Button>
        <Button
          variant="danger"
          onClick={processCancellation}
          disabled={isProcessing}
          className="ubs-danger-button"
        >
          {isProcessing ? t('user-orders.cancel.processing') : t('user-orders.cancel.confirm')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UbsUserOrderCancelPopUp;
