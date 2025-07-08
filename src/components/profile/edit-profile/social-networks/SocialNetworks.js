import React from 'react';
import './SocialNetworks.scss';

const SocialNetworks = ({ socialNetworks, onChange, errors }) => {
  const networks = [
    {
      id: 'facebook',
      label: 'Facebook',
      placeholder: 'https://facebook.com/username',
      icon: 'facebook'
    },
    {
      id: 'instagram',
      label: 'Instagram',
      placeholder: 'https://instagram.com/username',
      icon: 'instagram'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/username',
      icon: 'linkedin'
    },
    {
      id: 'twitter',
      label: 'Twitter',
      placeholder: 'https://twitter.com/username',
      icon: 'twitter'
    }
  ];

  return (
    <div className="social-networks">
      {networks.map(network => (
        <div key={network.id} className="social-network-item">
          <label htmlFor={network.id}>{network.label}</label>
          <div className="input-wrapper">
            <span className={`icon icon-${network.icon}`}></span>
            <input
              type="text"
              id={network.id}
              value={socialNetworks[network.id]}
              onChange={(e) => onChange(network.id, e.target.value)}
              placeholder={network.placeholder}
              className={errors[network.id] ? 'invalid' : ''}
            />
          </div>
          {errors[network.id] && <span className="error-text">{errors[network.id]}</span>}
        </div>
      ))}
    </div>
  );
};

export default SocialNetworks;
