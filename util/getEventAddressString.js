import get from 'lodash/get';

const getEventAddressString = event => {
  const { location } = event;
  let addressString = null;
  if (location) {
    const { venue, locality, region, postal_code: zip } = location;
    const address = get(location, 'address_lines', []);

    addressString = `${[venue, ...address, locality, region]
      .filter(item => item)
      .join(', ')} ${zip || ''}`.trim();
  }
  return addressString;
};

export default getEventAddressString;
