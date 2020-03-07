import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import Papa from 'papaparse';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

const CSVUploadButton = ({ className, id, label, onParse }) => {
  const [file, setFile] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);

  const clearFile = () => {
    setFile(null);
    onParse(null, null);
  };

  useEffect(() => {
    if (file) {
      setIsParsing(true);
      Papa.parse(file, {
        complete: (results, csv) => {
          // See https://www.papaparse.com/docs#results for results shape
          onParse(results, csv);
          setIsParsing(false);
        },
        skipEmptyLines: true,
      });
    }
  }, [file]);

  return (
    <div className={`${className} flex items-center`}>
      <label htmlFor={id}>
        <input
          id={id}
          type="file"
          className="sr-only"
          onChange={e => setFile(e.target.files[0] || null)}
          accept=".csv"
          disabled={isParsing}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
        <Button
          as="div"
          className={`${hasFocus ? 'focused ' : ''}inline-block mr-4`}
          level={ButtonLevels.SECONDARY}
        >
          {label}
        </Button>
      </label>
      {file && (
        <button className="underline" type="button" onClick={clearFile}>
          Clear file
        </button>
      )}
    </div>
  );
};

CSVUploadButton.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  onParse: PropTypes.func,
};

CSVUploadButton.defaultProps = {
  className: '',
  onParse: () => {},
};

export default CSVUploadButton;
