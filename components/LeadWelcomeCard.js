import PropTypes from 'prop-types';

const LeadWelcomeCard = ({ title, message }) => (
  <div className="bg-liberty text-center p-6 md:p-12">
    <h2 className="mb-4 font-bold text-2xl">{title}</h2>
    <p>{message}</p>
  </div>
);

LeadWelcomeCard.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default LeadWelcomeCard;
