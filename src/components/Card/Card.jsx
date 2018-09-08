import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';

export default function Card(props) {
  const {
    fill,
    hCenter,
    title,
    category,
    content,
    ctAllIcons,
    ctTableFullWidth,
    ctTableUpgrade,
    ctTableResponsive,
    legend,
    stats,
    statsIcon,
    plain,
    badge,
  } = props;
  return (
    <div className={`card ${fill ? 'fullPage' : ''} ${plain ? 'card-plain' : ''}`}>
      <div className={`header${hCenter ? ' text-center' : ''}`}>
        <h4 className="title">
          {title}&nbsp;&nbsp;&nbsp;
          <Badge>{badge}</Badge>
        </h4>
        <p className="category">{category}</p>
      </div>
      {content && <hr />}
      <div className={`content${ctAllIcons ? ' all-icons' : ''}${ctTableFullWidth ? ' table-full-width' : ''}${ctTableResponsive ? ' table-responsive' : ''}${ctTableUpgrade ? ' table-upgrade' : ''}`}>
        {content}
        <div className="footer">
          {legend}
          {stats != null ? <hr /> : ''}
          <div className="stats">
            <i className={statsIcon} />
            {' '}
            {stats}
          </div>
        </div>
      </div>
    </div>
  );
}

Card.propTypes = {
  fill: PropTypes.bool,
  hCenter: PropTypes.string,
  title: PropTypes.string,
  category: PropTypes.string,
  content: PropTypes.shape({}),
  ctAllIcons: PropTypes.string,
  ctTableFullWidth: PropTypes.string,
  ctTableUpgrade: PropTypes.string,
  ctTableResponsive: PropTypes.string,
  legend: PropTypes.string,
  stats: PropTypes.string,
  statsIcon: PropTypes.string,
  plain: PropTypes.string,
  badge: PropTypes.number,
};

Card.defaultProps = {
  fill: false,
  hCenter: '',
  title: '',
  category: '',
  content: null,
  ctAllIcons: '',
  ctTableFullWidth: '',
  ctTableUpgrade: '',
  ctTableResponsive: '',
  legend: '',
  stats: '',
  statsIcon: '',
  plain: '',
  badge: null,
};
