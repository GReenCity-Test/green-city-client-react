import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import UbsService from '../../../services/ubs/UbsService';
import './UbsUserOrders.scss';

/**
 * UBS User Order Payment Pop-up component
 * Modal dialog for processing order payments
 */
const UbsUserOrderPaymentPopUp = ({ show, onHide, orderId, price, bonuses }) => {
  const { t } = useTranslation();
  const [paymentAmount, setPaymentAmount] = useState(price);
  const [bonusesToUse, setBonusesToUse] = useState(0);
  const [maxBonuses, setMaxBonuses] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Calculate maximum bonuses that can be used
  useEffect(() => {
    // Maximum bonuses is the smaller of available bonuses and 90% of the price
    const maxAllowedBonuses = Math.min(bonuses, price * 0.9);
    setMaxBonuses(Math.floor(maxAllowedBonuses));
  }, [bonuses, price]);

  // Update payment amount when bonuses change
  useEffect(() => {
    setPaymentAmount(price - bonusesToUse);
  }, [bonusesToUse, price]);

  /**
   * Handle bonus input change
   */
  const handleBonusChange = (e) => {
    const value = parseInt(e.target.value) || 0;

    // Ensure bonuses don't exceed maximum
    if (value > maxBonuses) {
      setBonusesToUse(maxBonuses);
    } else if (value < 0) {
      setBonusesToUse(0);
    } else {
      setBonusesToUse(value);
    }
  };

  /**
   * Process payment
   */
  const processPayment = async () => {
    try {
      setIsProcessing(true);
      setError(null);

      // Call payment API
      await UbsService.payForOrder(orderId, bonusesToUse);

      // Close modal on success
      onHide(true);
    } catch (err) {
      console.error('Payment error:', err);
      setError(t('user-orders.payment.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return `${amount} UAH`;
  };

  return (
    <Modal show={show} onHide={() => onHide(false)} centered className="payment-modal">
      <Modal.Header closeButton>
        <Modal.Title>{t('user-orders.payment.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="payment-details">
          <div className="payment-row">
            <span>{t('user-orders.payment.order-sum')}</span>
            <span className="payment-value">{formatCurrency(price)}</span>
          </div>

          {bonuses > 0 && (
            <div className="payment-row">
              <span>{t('user-orders.payment.available-bonuses')}</span>
              <span className="payment-value">{bonuses}</span>
            </div>
          )}

          {bonuses > 0 && (
            <Form.Group className="mb-3">
              <Form.Label>{t('user-orders.payment.use-bonuses')}</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max={maxBonuses}
                value={bonusesToUse}
                onChange={handleBonusChange}
                disabled={isProcessing}
              />
              <Form.Text className="text-muted">
                {t('user-orders.payment.max-bonuses', { maxBonuses })}
              </Form.Text>
            </Form.Group>
          )}

          <div className="payment-row total">
            <span>{t('user-orders.payment.amount-to-pay')}</span>
            <span className="payment-value">{formatCurrency(paymentAmount)}</span>
          </div>

          {error && (
            <div className="payment-error">
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
          {t('user-orders.payment.cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={processPayment}
          disabled={isProcessing}
          className="ubs-primary-global-button"
        >
          {isProcessing ? t('user-orders.payment.processing') : t('user-orders.payment.pay')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UbsUserOrderPaymentPopUp;
