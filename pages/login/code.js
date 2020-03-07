import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import { Button } from '@ewarren/persist';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../../contexts/AuthContext';
import AuthPolicies from '../../constants/AuthPolicies';
import ErrorMessages from '../../constants/ErrorMessages';
import RouteGuard from '../../components/RouteGuard';
import TextInput from '../../components/TextInput';
import WallLayout from '../../components/WallLayout';
import { Themes } from '../../constants/formElements';

const LoginCode = () => {
  const Auth = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);
  const [isShowingResend, setIsShowingResend] = useState(false);
  const router = { useRouter };

  useEffect(() => {
    try {
      const param = Auth.getPublicChallengeParameters();
      setEmail(param.email);
    } catch (err) {
      router.push('/login');
    }
  }, []);

  const handleInput = e => {
    setCode(e.target.value);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (isBusy || !code) {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      await Auth.answerCustomChallenge(code);
    } catch (err) {
      let message = '';
      switch (err.message) {
        case ErrorMessages.INVALID_SESSION:
          message =
            'Sorry! The login code has expired. Please try logging in again.';
          break;
        case ErrorMessages.INCORRECT_CODE:
          message = "That's not the right code.";
          break;
        default:
          message = err.message;
          break;
      }
      setError(message);
    } finally {
      setIsBusy(false);
    }
  };

  // If the user is still on this page after a minute, show a prompt to resend
  // the code.
  useEffect(() => {
    const showResend = () => setIsShowingResend(true);
    setTimeout(showResend, 60000);
    return clearTimeout(showResend);
  }, []);

  // Handle a request to resend the code.
  const handleResend = async e => {
    if (isSendingCode || hasSentCode) return;
    e.preventDefault();
    setIsSendingCode(true);
    await Auth.signIn(email);
    setHasSentCode(true);
    setIsSendingCode(false);
  };

  // When a user clicks "Resend it", the copy will change to "Sending" and then
  // finally "Sent". After 10 seconds, we reset "Sent" back to "Resend it".
  useEffect(() => {
    const resetResendCta = () => setHasSentCode(false);
    if (hasSentCode) {
      setTimeout(resetResendCta, 10000);
    }
    return clearTimeout(resetResendCta);
  }, [hasSentCode]);

  let resendCta = 'Resend it.';
  if (isSendingCode) {
    resendCta = 'Sending…';
  } else if (hasSentCode) {
    resendCta = 'Sent!';
  }

  return (
    <RouteGuard authPolicy={AuthPolicies.ANONYMOUS_ONLY}>
      {email && (
        <WallLayout metaTitle="Sign In">
          <div className="max-w-lg p-4 md:p-0 mx-auto my-8 md:my-20">
            <div className="mb-8 pb-8 border-liberty border-b-4">
              <WideHeadline
                as="h1"
                size={WideHeadlineSizes.MD}
                className="mb-4"
              >
                Complete Sign-In
              </WideHeadline>
              <p>
                Please enter the secret sign-in code that was sent to {email} to
                complete sign-in. Hurry, your code expires after a few minutes!
              </p>
              {isShowingResend && (
                <p className="mt-4">
                  Haven’t gotten the code yet?{' '}
                  <button
                    className="underline"
                    type="button"
                    onClick={handleResend}
                  >
                    {resendCta}
                  </button>
                </p>
              )}
            </div>
            <form onSubmit={handleSubmit} data-tracking="form-login-code">
              <TextInput
                label="Sign-in code"
                id="code"
                name="code"
                type="text"
                value={code}
                onChange={handleInput}
                error={error}
                theme={Themes.INVERTED}
                className="mb-8"
                pattern="[0-9]*"
                required
              />
              <Button
                type="submit"
                disabled={isBusy || !code}
                className="hover:text-white"
              >
                Continue
              </Button>
            </form>
          </div>
        </WallLayout>
      )}
    </RouteGuard>
  );
};

export default LoginCode;
