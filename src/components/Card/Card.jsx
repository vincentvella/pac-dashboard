import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-bootstrap';
import Button from "../CustomButton/CustomButton";

export default function Card(props) {
  const {
    fill, hCenter, title, category, content, ctAllIcons, ctTableFullWidth, ctTableUpgrade,
    ctTableResponsive, legend, stats, statsIcon, plain, badge, add, addFunc,
  } = props;
  return (
    <div className={`card ${fill ? 'fullPage' : ''} ${plain ? 'card-plain' : ''}`}>
      <div className={`header${hCenter ? ' text-center' : ''}`}>
        <h4 className="title">
          {title}&nbsp;&nbsp;&nbsp;
          <Badge>{badge}</Badge>&nbsp;&nbsp;&nbsp;
          {add && <Button bsStyle="primary" fill onClick={addFunc}>Add New</Button>}
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
  add: PropTypes.bool,
  addFunc: PropTypes.func,
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
  add: false,
  addFunc: () => {},
};
