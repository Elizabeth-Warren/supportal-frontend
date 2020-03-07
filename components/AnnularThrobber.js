// An "annular throbber" is a ring-shaped loading spinner. Look it up.
// CSS adapted from https://projects.lukehaas.me/css-loaders/
import React from 'react';
import PropTypes from 'prop-types';
import theme from '@ewarren/persist/lib/theme';

const AnnularThrobber = ({ color, background, className }) => (
  <div className={className}>
    <span>Loading&hellip;</span>
    <style jsx>
      {`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        div {
          border-radius: 50%;
          box-shadow: inset 0 0 0 1em;
          color: ${color};
          font-size: 10px;
          height: 10em;
          position: relative;
          transform: translateZ(0);
          width: 10em;
        }

        div::before,
        div::after {
          background: ${background};
          content: '';
          position: absolute;
        }

        div::before {
          animation: spin 2s infinite ease 1.5s;
          border-radius: 10.2em 0 0 10.2em;
          height: 10.2em;
          left: -0.1em;
          top: -0.1em;
          transform-origin: 5.2em 5.1em;
          width: 5.2em;
        }

        div::after {
          animation: spin 2s infinite ease;
          border-radius: 0 10.2em 10.2em 0;
          height: 10.2em;
          left: 5.1em;
          top: -0.1em;
          transform-origin: 0px 5.1em;
          width: 5.2em;
        }

        span {
          opacity: 0;
        }
      `}
    </style>
  </div>
);
AnnularThrobber.propTypes = {
  color: PropTypes.string,
  className: PropTypes.string,
  background: PropTypes.string,
};

AnnularThrobber.defaultProps = {
  color: theme.colors.liberty,
  className: '',
  background: theme.colors.offWhite,
};

export default AnnularThrobber;
