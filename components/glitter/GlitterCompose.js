import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import Link from 'next/link';
import get from 'lodash/get';
import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CSVUploadButton from '../CSVUploadButton';
import GlitterContext from '../../contexts/GlitterContext';
import Layout from '../Layout';
import RichTextInput from '../RichTextInput';
import SelectInput from '../SelectInput';
import SendEmailConfirmationModal from './SendEmailConfirmationModal';
import TextInput from '../TextInput';
import pluralize from '../../util/pluralize';

const senders = [
  'info@elizabethwarren.com',
  'this@elizabethwarren.com',
  'is@elizabethwarren.com',
  'a@elizabethwarren.com',
  'test@elizabethwarren.com',
];

const GlitterCompose = () => {
  const Router = useRouter();
  const { emailId } = Router.query;
  const { getEmail, updateEmail } = useContext(GlitterContext);
  const [formState, setFormState] = useState({
    sender: 'info@elizabethwarren.com',
    subject: '',
    message: '',
    textMessage: '',
  });
  const [rte, setRte] = useState(null);
  const [hasEditedPlainText, setHasEditedPlainText] = useState(false);
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false);
  const [isShowingPlainTextEditor, setIsShowingPlainTextEditor] = useState(
    false
  );
  const [recipients, setRecipients] = useState([]);
  const [templateVariables, setTemplateVariables] = useState([]);
  const [recipientSourceName, setRecipientSourceName] = useState(null);

  const handleChange = (e, editor) => {
    const { name, value } = e.target;
    const newState = {
      ...formState,
      [name]: value,
    };
    if (name === 'textMessage' && formState.textMessage !== value) {
      setHasEditedPlainText(true);
    }
    if (name === 'message' && editor) {
      setRte(editor);
      if (!hasEditedPlainText) {
        newState.textMessage = editor.getContent({ format: 'text' });
      }
    }
    setFormState(newState);
  };

  const handleCSV = (results, csv) => {
    const data = results ? results.data : [];
    let newRecipients = [];
    let newTemplateVariables = [];
    if (data.length >= 2) {
      newRecipients = data.slice(1);
      [newTemplateVariables] = data;
    }
    setRecipients(newRecipients);
    setTemplateVariables(newTemplateVariables);
    setRecipientSourceName(get(csv, 'name', null));
  };

  const copyToPlainText = () => {
    if (!rte) return;
    setFormState({
      ...formState,
      textMessage: rte.getContent({ format: 'text' }),
    });
    setHasEditedPlainText(false);
  };

  const addVariable = variableName => {
    const variable = `{{ ${variableName} }}`;
    if (rte) {
      rte.execCommand('mceInsertContent', false, variable);
    } else {
      setFormState({ ...formState, message: formState.message + variable });
    }
  };

  useEffect(() => {
    if (emailId === 'new') return;
    const email = getEmail(emailId);
    if (!email) {
      Router.replace('/glitter/compose/[emailId]', '/glitter/compose/new');
      return;
    }
    const { sender, subject, message } = email;
    setFormState({ ...formState, sender, subject, message });
  }, [emailId]);

  useEffect(() => {
    if (emailId === 'new') return;
    updateEmail(emailId, formState);
  }, [formState]);

  const recipientCount = recipients.length;

  return (
    <Layout
      metaTitle="Glitter"
      pageTitle="Glitter"
      pageDescription="Don't throw shade. Throw glitter."
    >
      <div className="bg-white max-w-section m-auto mb-8 p-8 relative">
        <CSVUploadButton
          className="mb-4 mr-4"
          id="compose-recipient-csv"
          label="Upload recipients"
          onParse={handleCSV}
        />
        {recipientSourceName && (
          <div className="font-bold mb-4">
            Found {recipientCount} {pluralize('recipient', recipientCount)} in{' '}
            &ldquo;{recipientSourceName}&rdquo;.
          </div>
        )}
        <SelectInput
          label="Sender"
          name="sender"
          value={formState.sender}
          options={senders}
          onChange={handleChange}
          id="compose-sender"
          className="mb-4"
          required
        />
        <TextInput
          label="Subject"
          name="subject"
          value={formState.subject}
          id="compose-subject"
          onChange={handleChange}
          className="mb-4"
          required
        />
        <RichTextInput
          label={
            <>
              Message{' '}
              <button
                type="button"
                className="underline"
                onClick={() =>
                  setIsShowingPlainTextEditor(!isShowingPlainTextEditor)
                }
              >
                Edit plain text version
              </button>
            </>
          }
          value={formState.message}
          name="message"
          onChange={handleChange}
          id="compose-message"
          className="mb-2"
          required
        />
        <div className="border-2 border-navy mb-4 min-h-12 p-2">
          {!templateVariables.length && (
            <span className="italic text-sm">No available variables yet</span>
          )}
          {templateVariables.map(item => (
            <button
              key={item}
              type="button"
              className="bg-lightLiberty hover:bg-liberty my-1 mx-1 rounded-full px-4 py-1 text-sm"
              onClick={() => addVariable(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {isShowingPlainTextEditor && (
          <TextInput
            label={
              <>
                Plain Text Message{' '}
                <button
                  type="button"
                  className="underline"
                  onClick={copyToPlainText}
                >
                  Copy content
                </button>
              </>
            }
            value={formState.textMessage}
            type="textarea"
            name="textMessage"
            onChange={handleChange}
            id="compose-text-message"
            className="mb-4"
            inputClassName="min-h-48"
            required
          />
        )}
      </div>
      <div className="flex max-w-section mx-auto px-8 xl:px-0">
        <Link href="/glitter" passHref>
          <Button as="a" level={ButtonLevels.INVERTED} className="mr-auto">
            Back
          </Button>
        </Link>
        <Button type="button" level={ButtonLevels.SECONDARY} className="ml-4">
          Send test
        </Button>
        <Button
          type="button"
          className="ml-4"
          onClick={() => setIsShowingConfirmation(true)}
        >
          Send email
        </Button>
      </div>
      {isShowingConfirmation && (
        <SendEmailConfirmationModal
          onCancel={() => setIsShowingConfirmation(false)}
          onConfirm={() => setIsShowingConfirmation(false)}
        />
      )}
    </Layout>
  );
};

export default GlitterCompose;
