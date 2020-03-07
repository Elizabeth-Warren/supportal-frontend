/**
 * Formats phone number for display and input purposes.
 * @param {string} phoneNumberString unformatted number with country code.
 * @returns {string}
 */
const formatPhoneNumber = (phoneNumberString = '', raw) => {
  // Removes non digits
  const cleaned = phoneNumberString.replace(/\D/g, '');
  // Splits out phone number into required sections
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match && raw) {
    return [match[2], match[3], match[4]].join('');
  }

  if (match) {
    return ['(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return '';
};

export default formatPhoneNumber;
