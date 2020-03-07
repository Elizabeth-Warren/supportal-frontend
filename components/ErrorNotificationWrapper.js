import PropTypes from 'prop-types';
import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import serializeObject from '../util/serializeObject';

const ErrorNotificationWrapper = ({ children }) => {
  const { profile } = useContext(AuthContext);
  const contactParams = { subject: 'tech' };
  if (profile && profile.first_name) {
    contactParams.firstName = profile.first_name;
  }
  if (profile && profile.last_name) {
    contactParams.lastName = profile.last_name;
  }
  const contactUrl = `https://www.elizabethwarren.com/contact-us?${serializeObject(
    contactParams
  )}`;

  return (
    <>
      {children} If this problem continues, please{' '}
      <a
        href={contactUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline"
      >
        file a bug report
      </a>
      .
    </>
  );
};

ErrorNotificationWrapper.propTypes = {
  children: PropTypes.node,
};

ErrorNotificationWrapper.defaultProps = {
  children: 'Something went wrong. Please try again later.',
};

export default ErrorNotificationWrapper;
