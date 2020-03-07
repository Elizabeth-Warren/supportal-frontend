/* eslint-disable react/jsx-props-no-spreading */

import WideHeadline, {
  WideHeadlineSizes,
} from '@ewarren/persist/lib/components/WideHeadline';
import { Button } from '@ewarren/persist';
import { Form, Formik } from 'formik';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../../contexts/AuthContext';
import AuthPolicies from '../../constants/AuthPolicies';
import FormikField from '../../components/FormikField';
// import PushNotificationToggle from '../../components/PushNotificationToggle';
import RouteGuard from '../../components/RouteGuard';
import WallLayout from '../../components/WallLayout';
import getFormattedPhone from '../../util/getFormattedPhone';
import useErrorMessage from '../../hooks/useErrorMessage';
import { Themes } from '../../constants/formElements';

const UpdateDetails = () => {
  return (
    <RouteGuard authPolicy={AuthPolicies.AUTHENTICATED_ONLY}>
      <WallLayout simple={false} metaTitle="Update Profile">
        <div className="max-w-lg p-4 py-8 md:py-20 mx-auto">
          <div className="mb-8 pb-8 border-liberty border-b-4">
            <WideHeadline as="h1" size={WideHeadlineSizes.MD} className="mb-4">
              Update your information
            </WideHeadline>
            <p>
              Welcome to Switchboard! To get started using Switchboard, please
              let us know your name, location, and contact info. These will not
              be shared with the people you are calling.
            </p>
          </div>
          <UserProfileForm />
        </div>
      </WallLayout>
    </RouteGuard>
  );
};

const UserProfileForm = () => {
  const { profile, updateProfile } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const formData = profile || {};
  const router = useRouter();
  useErrorMessage(!!error, error);

  const handleSubmit = async (values, actions) => {
    setError(null);
    actions.setStatus(null);
    actions.setSubmitting(true);
    try {
      await updateProfile(values);
      router.push('/');
    } catch (err) {
      if (err.response) {
        // There was a validation error. Show field-level errors.
        actions.setStatus(err.response.data);
      } else {
        // Something else funky happened. Show a top-level error notification.
        setError(err.message);
      }
      actions.setSubmitting(false);
    }
  };

  const fields = [
    { label: 'First Name', name: 'first_name' },
    { label: 'Last Name', name: 'last_name' },
    { label: 'Phone Number', type: 'tel', name: 'phone' },
    { label: 'Address', name: 'address' },
    { label: 'City', name: 'city' },
    { label: 'State', name: 'state' },
    { label: 'Zip Code', name: 'zip5', maxLength: '5', pattern: '[0-9]{5}' },
    {
      label: 'Team Name (not required)',
      name: 'self_reported_team_name',
      required: false,
    },
  ];
  return (
    <Formik
      initialValues={{
        ...formData,
        phone: getFormattedPhone(formData.phone, true),
      }}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status }) => (
        <Form data-tracking="form-user-profile">
          {fields.map(item => (
            <FormikField
              className="mb-8"
              theme={Themes.INVERTED}
              key={item.name}
              error={status && status[item.name]}
              {...item}
            />
          ))}
          {/* <PushNotificationToggle className="mb-8" /> */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="hover:text-white"
          >
            Update Details
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateDetails;
