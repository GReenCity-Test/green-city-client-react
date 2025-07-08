import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './UbsUserOrders.scss';

/**
 * UBS User Order Details component
 * Displays detailed information about a user order
 */
const UbsUserOrderDetails = ({ order }) => {
  const { t } = useTranslation();
  const [certificatesAmount, setCertificatesAmount] = useState(0);

  // Calculate certificates amount on component mount
  useEffect(() => {
    if (order.certificate && order.certificate.length) {
      const totalPoints = order.certificate.reduce((acc, item) => acc + item.points, 0);
      setCertificatesAmount(totalPoints);
    }
  }, [order.certificate]);

  /**
   * Check if order is paid
   */
  const isPaid = (order) => {
    return order.paymentStatusEng === 'Paid';
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount) => {
    return `${amount} UAH`;
  };

  return (
    <div className="full_card">
      <div className="header_details">{t('user-orders.details.title')}</div>
      <table className="table_of_details" aria-label="orderDetailsTable">
        <thead>
          <tr className="header_table">
            <th scope="row">{t('user-orders.details.services')}</th>
            <th scope="row">{t('user-orders.details.volume')}</th>
            <th scope="row">{t('user-orders.details.cost')}</th>
            <th scope="row">{t('user-orders.details.bags-amount')}</th>
            <th scope="row">{t('user-orders.details.sum')}</th>
          </tr>
        </thead>
        <tbody>
          {order.bags.map((bag, index) => (
            <tr key={index} className="data_table">
              <td>{bag.serviceEng}</td>
              <td>{bag.capacity} {t('user-orders.details.litr')}</td>
              <td>{bag.fullPrice} {t('user-orders.details.currency')}</td>
              <td>{bag.count} {t('user-orders.details.pieces')}</td>
              <td>{formatCurrency(bag.totalPrice)}</td>
            </tr>
          ))}
          <tr>
            <td></td>
          </tr>
          <tr className="sum_of_order">
            <td colSpan="4">{t('user-orders.details.order-sum')}</td>
            <td>{formatCurrency(order.orderFullPrice)}</td>
          </tr>
          {order.certificate && order.certificate.length > 0 && (
            <tr className="optional_row">
              <td colSpan="4">{t('user-orders.details.certificate')}</td>
              <td>-{formatCurrency(certificatesAmount)}</td>
            </tr>
          )}
          {order.bonuses !== 0 && (
            <tr className="optional_row">
              <td colSpan="4">{t('user-orders.details.bonuses')}</td>
              <td>-{formatCurrency(order.bonuses)}</td>
            </tr>
          )}
          {(isPaid(order) || order.paidAmount > 0) && (
            <tr className="optional_row">
              <td colSpan="4">{t('user-orders.details.paid-amount')}</td>
              <td>-{formatCurrency(order.paidAmount)}</td>
            </tr>
          )}
          <tr className="sum_to_pay">
            <td colSpan="4">{t('user-orders.details.amount-due')}</td>
            <td>{formatCurrency(order.amountBeforePayment)}</td>
          </tr>
          {order.refundedMoney > 0 && (
            <tr className="optional_row additional_info">
              <td colSpan="4">{t('user-orders.details.refunded-money')}</td>
              <td>{formatCurrency(order.refundedMoney)}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="bonuses_container">
        {order.refundedBonuses > 0 && (
          <span className="text-danger refund-bonuses">
            {t('order-details.bonuses-value', { bonusesValue: order.refundedBonuses })}
          </span>
        )}
      </div>

      <div className="recipient">
        {order.additionalOrders && order.additionalOrders.length > 0 && (
          <div>
            <h6 className="bold_text">{t('user-orders.details.delivery')}</h6>
            <p className="additional_orders_bold_text">
              {t('user-orders.details.order-number')}
              <span>{order.additionalOrders.join(', ')}</span>
            </p>
          </div>
        )}
        {order.orderComment && order.orderComment !== '' && (
          <div>
            <h6 className="bold_text">{t('user-orders.details.comment-order')}</h6>
            <p>{order.orderComment}</p>
          </div>
        )}
      </div>

      <div className="order_details">
        <ol className="recipient">
          <h6 className="bold_text">{t('user-orders.details.recipient')}</h6>
          <li>
            <span>{order.sender.senderName} {order.sender.senderSurname}</span>
          </li>
          <li>{order.sender.senderPhone}</li>
          <li>{order.sender.senderEmail}</li>
        </ol>
        <ol className="recipient">
          <h6 className="bold_text">{t('user-orders.details.export-address')}</h6>
          <li>{order.address.addressCityEng}</li>
          <li>
            <span>{order.address.addressStreetEng}, </span>
            <span>{order.address.houseNumber},</span><br />
            <span>{t('user-orders.details.block-number')} {order.address.houseCorpus || '-'}</span><br />
            <span>{t('user-orders.details.entrance')} {order.address.entranceNumber || '-'}</span><br />
            <span>
              {t('user-orders.details.district')} {order.address.addressDistinctEng || '-'}
            </span>
          </li>
        </ol>
        {order.address.addressComment && order.address.addressComment !== '' && (
          <ol className="recipient">
            <h6 className="bold_text">{t('user-orders.details.comment-address')}</h6>
            <li>{order.address.addressComment}</li>
          </ol>
        )}
      </div>
    </div>
  );
};

export default UbsUserOrderDetails;
