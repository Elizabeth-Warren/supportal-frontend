import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import { Button } from '@ewarren/persist';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../../contexts/AuthContext';
import AuthPolicies from '../../constants/AuthPolicies';
import RouteGuard from '../../components/RouteGuard';
import TextInput from '../../components/TextInput';
import WallLayout from '../../components/WallLayout';
import useErrorMessage from '../../hooks/useErrorMessage';
import { Themes } from '../../constants/formElements';

const Login = () => {
  const Auth = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
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
      await Auth.signIn(email);
      router.push('/login/code');
    } catch (err) {
      setError(err.message);
      setIsBusy(false);
    }
  };
  useErrorMessage(!!error, error);

  return (
    <RouteGuard authPolicy={AuthPolicies.ANONYMOUS_ONLY}>
      <WallLayout metaTitle="Sign In">
        <div className="max-w-lg p-4 md:p-0 mx-auto my-8 md:my-20">
          <div className="mb-8 pb-8 border-liberty border-b-4">
            <WideHeadline as="h1" size={WideHeadlineSizes.MD} className="mb-4">
              Please Sign In
            </WideHeadline>
            <p>
              Enter your e-mail address and we&apos;ll send you a one-time
              secret sign-in code.
            </p>
          </div>
          <form onSubmit={handleSubmit} data-tracking="form-login-email">
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
              Send sign-in code
            </Button>
          </form>
        </div>
      </WallLayout>
    </RouteGuard>
  );
};

export default Login;
