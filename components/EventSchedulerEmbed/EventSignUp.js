/* eslint-disable react/jsx-props-no-spreading */
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { Button } from '@ewarren/persist';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import FormikField from '../FormikField';
import NotificationsContext from '../../contexts/NotificationsContext';
import NotificationTypes from '../../constants/NotificationTypes';
import api from '../../services/api';
import getFormattedPhone from '../../util/getFormattedPhone';
import getHeapUserId from '../../util/getHeapUserId';
import validateShiftObject from '../../util/validateShiftObject';

const EventSignUp = ({ className, onSubmit, shifts }) => {
  const { showNotification } = useContext(NotificationsContext);
  const [error, setError] = useState(null);
  const { query } = useRouter();
  const fields = [
    {
      label: 'First Name',
      name: 'given_name',
      className: 'w-full sm:w-auto flex-grow',
    },
    {
      label: 'Last Name',
      name: 'family_name',
      className: 'w-full sm:w-auto flex-grow',
    },
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      className: 'w-full',
      required: false,
    },
    {
      label: 'Phone Number',
      type: 'tel',
      name: 'phone',
      className: 'w-full sm:w-auto flex-grow',
      required: false,
    },
    {
      label: 'Zip Code',
      name: 'zip5',
      maxLength: '5',
      pattern: '[0-9]{5}',
      className: 'w-full sm:w-auto flex-grow',
      required: false,
    },
  ];

  const initialValues = fields.reduce((obj, { name }) => {
    let value;
    switch (name) {
      case 'given_name':
        value = query.first_name || '';
        break;
      case 'family_name':
        value = query.last_name || '';
        break;
      case 'zip5':
        value = query.zip || '';
        break;
      default:
        value = query[name] || '';
        break;
    }
    return { ...obj, [name]: value };
  }, {});

  const handleSubmit = async (values, actions) => {
    if (!(values.phone || values.email || values.zip5)) {
      setError('An email, zip, or phone number is required.');
      return;
    }
    setError(null);
    actions.setStatus(null);
    actions.setSubmitting(true);
    try {
      await Promise.all(
        Object.entries(shifts).map(([eventId, timeslots]) =>
          api.post('/shifter/event_signups', {
            ...values,
            phone: values.phone
              ? `+1${getFormattedPhone(values.phone, true)}`
              : '',
            ma_event_id: parseInt(eventId, 10),
            ma_timeslot_ids: timeslots,
            source: query.source || 'embedded-shifter',
            heap_id: getHeapUserId(),
          })
        )
      );
      showNotification({
        message: (
          <>
            <b>{values.given_name}</b> is signed up!
          </>
        ),
        type: NotificationTypes.DEFAULT,
        dismissAfter: 3000,
      });
      onSubmit();
    } catch (err) {
      if (err.response && err.response.data) {
        if (!err.response.data.code) {
          // This is the old API response shape.
          actions.setStatus(err.response.data);
        } else if (err.response.data.code === 'VALIDATION') {
          // There was a validation error. Show field-level errors.
          actions.setStatus(err.response.data.detail);
        } else {
          // Some other error happened. Just use the error message passed from
          // the API as a top-level notification.
          let message = get(
            err,
            'response.data.detail',
            'An error occured. Please try again later.'
          );
          if (typeof message === 'object') {
            message = Object.values(message).join(' ');
          }
          setError(message);
        }
      } else {
        // Something else funky happened. Show a top-level error notification.
        setError(err.message);
      }
    } finally {
      actions.setSubmitting(false);
    }
  };

  const isFormValid = values =>
    !!(
      values.given_name &&
      values.family_name &&
      (values.email || values.phone || values.zip5)
    );

  return (
    <div className={className}>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, status, values }) => (
          <Form>
            <div className="flex flex-wrap -mx-2">
              {fields.map(item => (
                <FormikField
                  {...item}
                  className={[item.className || '', 'mb-4 mx-2'].join(' ')}
                  key={item.name}
                  error={status && status[item.name]}
                />
              ))}
            </div>
            {error && <div className="mt-4 text-brightRed">{error}</div>}
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid(values)}
              className="block mx-auto mt-8"
            >
              {isSubmitting ? 'Loading…' : 'Submit'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

EventSignUp.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  shifts: validateShiftObject,
};

EventSignUp.defaultProps = {
  className: '',
  onSubmit: () => {},
  shifts: null,
};

export default EventSignUp;
