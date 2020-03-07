import PropTypes from 'prop-types';
import orderBy from 'lodash/orderBy';
import { useMemo, useState } from 'react';
import GlitterContext from '../../contexts/GlitterContext';

const GlitterProvider = ({ children }) => {
  const [emails, setEmails] = useState([
    {
      id: 1,
      status: 'sent',
      createdAt: new Date('2020-02-14'),
      subject: 'My fun email',
      sender: 'info@elizabethwarren.com',
      message: 'Hello world',
    },
    {
      id: 2,
      status: 'draft',
      createdAt: new Date('2020-02-16'),
      subject: 'Hey!',
      sender: 'info@elizabethwarren.com',
      message: 'Hey world',
    },
    {
      id: 3,
      status: 'draft',
      createdAt: new Date('2020-02-12'),
      subject: 'This is critical',
      sender: 'info@elizabethwarren.com',
      message: 'Hello world, critically',
    },
  ]);

  const sortedEmails = useMemo(() => {
    return orderBy(emails, ['createdAt', 'subject'], ['desc', 'asc']);
  });

  const cloneEmail = email => {
    const createdAt = new Date();
    const newEmail = {
      ...email,
      id: createdAt.getTime(),
      status: 'new',
      createdAt,
    };
    setEmails([...emails, newEmail]);
  };

  const deleteEmail = email => {
    setEmails(emails.filter(item => item !== email));
  };

  const getEmail = id => emails.find(email => email.id === parseInt(id, 10));

  const updateEmail = (id, fields) => {
    const existingEmail = getEmail(id);
    if (!existingEmail) return;
    const updatedEmail = { ...existingEmail, ...fields };
    const newEmails = emails.map(email =>
      email === existingEmail ? updatedEmail : email
    );
    setEmails(newEmails);
  };

  return (
    <GlitterContext.Provider
      value={{
        emails: sortedEmails,
        cloneEmail,
        deleteEmail,
        getEmail,
        updateEmail,
      }}
    >
      {children}
    </GlitterContext.Provider>
  );
};

GlitterProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlitterProvider;
