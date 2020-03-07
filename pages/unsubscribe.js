import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import get from 'lodash/get';
import { Button } from '@ewarren/persist';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthPolicies from '../constants/AuthPolicies';
import NotificationsContext from '../contexts/NotificationsContext';
import RouteGuard from '../components/RouteGuard';
import TextInput from '../components/TextInput';
import WallLayout from '../components/WallLayout';
import api from '../services/api';
import useErrorMessage from '../hooks/useErrorMessage';
import { Themes } from '../constants/formElements';

const Unsubscribe = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const { showNotification } = useContext(NotificationsContext);
  const router = useRouter();
  const handleInput = e => {
    setEmail(e.target.value);
  };
  const handleSubmit = async e => {
    e.preventDefault();

    if (isBusy || !email) {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      await api.post('/unsubscribe', { email });
      showNotification({
        message: 'You have been successfully unsubscribed.',
      });
    } catch (err) {
      const message = get(err, 'response.data.message', err.message);
      setError(`${message}.`);
    }
    setIsBusy(false);
  };

  useErrorMessage(!!error, error);
  useEffect(() => {
    const { query } = router;
    if (query.email) {
      setEmail(query.email);
    }
  }, []);

  return (
    <RouteGuard authPolicy={AuthPolicies.ANY}>
      <WallLayout metaTitle="Unsubscribe">
        <div className="max-w-lg p-4 md:p-0 mx-auto my-8 md:my-20">
          <div className="mb-8 pb-8 border-liberty border-b-4">
            <WideHeadline as="h1" size={WideHeadlineSizes.MD} className="mb-4">
              Unsubscribe
            </WideHeadline>
            <p className="mb-4">
              Thanks for using Switchboard to help recruit volunteers.
            </p>
            <p>
              Our grassroots movement is powered by dedicated volunteers like
              you, and we still need you in this fight for big, structural
              change.
            </p>
          </div>
          <div className="mb-8">
            <h2 className="mb-4 font-bold text-lg">
              Still want to unsubscribe from Switchboard related emails?
            </h2>
            <p>
              Note this doesn’t affect your settings for other
              Elizabeth&nbsp;Warren emails.
            </p>
          </div>
          <form onSubmit={handleSubmit} data-tracking="form-unsubscribe">
            <TextInput
              label="Email address"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleInput}
              theme={Themes.INVERTED}
              className="mb-8"
              required
            />
            <Button
              type="submit"
              disabled={isBusy || !email}
              className="hover:text-white"
            >
              Unsubscribe
            </Button>
          </form>
        </div>
      </WallLayout>
    </RouteGuard>
  );
};

export default Unsubscribe;
