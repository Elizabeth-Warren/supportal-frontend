import formatDistanceStrict from 'date-fns/formatDistanceStrict';
import addDays from 'date-fns/addDays';
import differenceInDays from 'date-fns/differenceInDays';

/**
 * The backend will not provide an expiry date until the assigned lead expires.
 * The frontend must infer the expiry based on the date of creation.
 * @param {string} createdAt Created at time from lead object.
 * @param {string} length Describes the length of the date.
 * @returns {string} String of length of time till expiry.
 */
const getTimeLeftToContact = (createdAt, length = 'short') => {
  const createdAtDate = new Date(createdAt);
  const expiryDate = addDays(createdAtDate, 7);
  const now = new Date();
  const daysUntilExpiry = differenceInDays(expiryDate, now);

  if (!daysUntilExpiry) {
    return { short: 'Today', long: 'Assignment expires today' }[length];
  }

  if (daysUntilExpiry < 0) {
    return {
      short: 'Expired',
      long: `Assignment expired ${formatDistanceStrict(
        new Date(),
        expiryDate
      )} ago`,
    }[length];
  }

  return {
    short: formatDistanceStrict(new Date(), expiryDate),
    long: `${formatDistanceStrict(
      new Date(),
      expiryDate
    )} left to contact lead`,
  }[length];
};

export default getTimeLeftToContact;
