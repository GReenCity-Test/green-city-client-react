import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import UbsService from '../../../services/ubs/UbsService';
import UbsUserOrdersList from './UbsUserOrdersList';
import { getPublicAssetPath } from '../../../constants/imagePaths';
import './UbsUserOrders.scss';

// Info icon for mobile view
const infoIcon = getPublicAssetPath('img/icon/info.svg');

/**
 * UBS User Orders component
 * Displays a list of user orders with tabs for current orders and order history
 */
const UbsUserOrders = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State
  const [currentOrders, setCurrentOrders] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);
  const [bonuses, setBonuses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [activeCouriers, setActiveCouriers] = useState(true); // TODO: Implement check for active couriers
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
    loadBonuses();
  }, []);

  /**
   * Load user orders from the API
   */
  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await UbsService.getUserOrders(page);

      // Separate current and closed orders
      const current = [];
      const closed = [];

      ordersData.page.forEach(order => {
        // Check if order is closed or canceled
        const isClosed = order.orderStatus === 'DONE' ||
                         order.orderStatusEng === 'DONE' ||
                         order.orderStatus === 'CANCELED' ||
                         order.orderStatusEng === 'CANCELED';

        if (isClosed) {
          closed.push(order);
        } else {
          current.push(order);
        }
      });

      setCurrentOrders(prev => [...prev, ...current]);
      setClosedOrders(prev => [...prev, ...closed]);
      setHasMore(page < ordersData.totalPages - 1);
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(t('user-orders.error.load-orders'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load user bonuses from the API
   */
  const loadBonuses = async () => {
    try {
      const bonusesData = await UbsService.getUserBonuses();
      // Calculate total bonuses
      const total = bonusesData.reduce((sum, bonus) => sum + bonus.amount, 0);
      setBonuses(total);
    } catch (err) {
      console.error('Error loading bonuses:', err);
      // Non-critical error, don't show to user
    }
  };

  /**
   * Handle infinite scroll
   */
  const onScroll = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
      loadOrders();
    }
  };

  /**
   * Redirect to create new order page
   */
  const redirectToOrder = () => {
    navigate('/ubs-user/orders/create');
  };

  return (
    <div className="wrapper">
      <div className="main-header">
        <h1 className="main-header-title">{t('user-orders.order-title')}</h1>
        {activeCouriers && (
          <button className="ubs-primary-global-button s-btn" onClick={redirectToOrder}>
            {t('user-orders.btn.new-order')}
          </button>
        )}
      </div>

      {loading && !currentOrders.length && !closedOrders.length ? (
        <div className="loading-spinner">
          <p>{t('common.loading')}</p>
        </div>
      ) : (
        <div>
          {(currentOrders.length || closedOrders.length) ? (
            <div className="cards" onScroll={onScroll}>
              <div className="tabs">
                <button
                  className={`tab ${selectedTab === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedTab(0)}
                >
                  {t('user-orders.current-orders')}
                </button>
                <button
                  className={`tab ${selectedTab === 1 ? 'active' : ''}`}
                  onClick={() => setSelectedTab(1)}
                >
                  {t('user-orders.order-history')}
                </button>
              </div>

              <div className="mobile-title">
                <img src={infoIcon} alt="info" />
                <div>{t('user-orders.info-title')}</div>
              </div>

              {selectedTab === 0 ? (
                <UbsUserOrdersList orders={currentOrders} bonuses={bonuses} />
              ) : (
                <UbsUserOrdersList orders={closedOrders} bonuses={bonuses} />
              )}

              {loading && (currentOrders.length || closedOrders.length) && (
                <div className="loading-more">
                  <p>{t('common.loading-more')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="if-empty">
              <span>{t('user-orders.no-orders')}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadOrders}>{t('common.retry')}</button>
        </div>
      )}
    </div>
  );
};

export default UbsUserOrders;
