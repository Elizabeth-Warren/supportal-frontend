import PropTypes from 'prop-types';
import Chevron, {
  ChevronDirections,
} from '@ewarren/persist/lib/components/Chevron';
import { useState } from 'react';
import ExpandTransition from './ExpandTransition';

const Accordion = ({
  children,
  className,
  id,
  indicatorClassName,
  initiallyOpen,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const controlClasses = [
    isOpen ? 'bg-lightLiberty' : 'bg-white',
    'hover:bg-liberty',
    'flex',
    'items-center',
    'justify-between',
    'px-6',
    'md:px-12',
    'py-3',
    'text-left',
    'w-full',
  ];
  const controlId = `${id}-control`;
  return (
    <div className={className}>
      <h3>
        <button
          className={controlClasses.join(' ')}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          id={controlId}
        >
          {title}
          <Chevron
            className={`${indicatorClassName} flex-shrink-0 ml-2`}
            direction={isOpen ? ChevronDirections.UP : ChevronDirections.DOWN}
            style={{
              marginTop: '6px',
            }}
          />
        </button>
      </h3>
      <ExpandTransition in={isOpen}>
        <div
          aria-labelledby={controlId}
          aria-hidden={!isOpen}
          id={id}
          role="region"
          className={isOpen ? '' : 'hidden'}
        >
          {children}
        </div>
      </ExpandTransition>
    </div>
  );
};

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  indicatorClassName: PropTypes.string,
  initiallyOpen: PropTypes.bool,
  title: PropTypes.node.isRequired,
};

Accordion.defaultProps = {
  className: '',
  indicatorClassName: '',
  initiallyOpen: false,
};

export default Accordion;
