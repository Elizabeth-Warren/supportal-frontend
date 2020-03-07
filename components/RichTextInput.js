/* eslint-disable react/jsx-props-no-spreading */
// We're intentionally disabling props spreading here to allow for a catch-all
// of input-related attributes.
import PropTypes from 'prop-types';
import { Editor } from '@tinymce/tinymce-react';

// TODO(jjandoc): To make this input behave more similarly like other input
// components, I'd like the onChange handler to be attached to the underlying
// textarea so that rich text editor inputs emit a standard input/change event.
const RichTextInput = ({
  className,
  error,
  id,
  label,
  name,
  onChange,
  value,
  ...other
}) => {
  const handleChange = (val, editor) => {
    onChange(
      {
        target: {
          name,
          value: val,
          type: 'rte',
        },
      },
      editor
    );
  };

  return (
    <label className={[className, 'block'].join(' ')} htmlFor={id}>
      {(label || error) && (
        <div className="flex mb-2 flex-wrap items-baseline">
          {label && <div className="mr-4 text-base">{label}</div>}
          {error && <div className="text-brightRed text-sm">{error}</div>}
        </div>
      )}
      <Editor
        id={id}
        onEditorChange={handleChange}
        textareaName={name}
        value={value}
        init={{
          plugins: ['code', 'lists'],
          menubar: false,
          toolbar:
            'undo redo | formatselect | bold italic backcolor | ' +
            'alignleft aligncenter alignright alignjustify | ' +
            'bullist numlist outdent indent | removeformat | code | help',
        }}
        {...other}
      />
    </label>
  );
};

RichTextInput.propTypes = {
  className: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  id: PropTypes.string.isRequired,
  label: PropTypes.node,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

RichTextInput.defaultProps = {
  className: '',
  error: null,
  label: null,
  name: '',
  onChange: () => {},
  value: '',
};

export default RichTextInput;
