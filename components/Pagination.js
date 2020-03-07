import Chevron, {
  ChevronDirections,
} from '@ewarren/persist/lib/components/Chevron';
import PropTypes from 'prop-types';
import paginate from '../util/paginate';

const Pagination = ({
  currentPage,
  maxPages,
  showPrevious,
  showNext,
  pageSize,
  totalItems,
  onClick,
}) => {
  const { pages, totalPages } = paginate({
    totalItems,
    currentPage,
    pageSize,
    maxPages,
  });

  return (
    <nav className="flex flex-wrap sm:flex-no-wrap items-baseline justify-between">
      {showPrevious && (
        <button
          className={[
            'mr-4 order-1 whitespace-no-wrap',
            currentPage === 1 ? 'cursor-auto opacity-75' : '',
          ].join(' ')}
          disabled={currentPage === 1}
          onClick={() => {
            onClick(currentPage - 1);
          }}
          type="button"
        >
          <Chevron direction={ChevronDirections.LEFT} className="mr-2" />
          Back
        </button>
      )}
      <ul className="flex mt-2 sm:mt-0 order-last overflow-x-auto sm:order-2 w-full sm:w-auto">
        {pages.map((num, i) => (
          <li
            key={num}
            className={() => {
              if (i === 0) return 'ml-0';
              if (i === pages.length - 1) return 'mr-0';
              return 'mx-1';
            }}
          >
            <button
              className={[
                'hover:bg-liberty flex h-5 items-center justify-center px-1',
                currentPage === num ? 'bg-liberty font-bold' : 'bg-transparent',
              ].join(' ')}
              onClick={() => {
                onClick(num);
              }}
              type="button"
              disabled={currentPage === num}
            >
              <span className="leading-none">{num}</span>
            </button>
          </li>
        ))}
      </ul>
      {showNext && (
        <button
          className={[
            'ml-4 order-3 whitespace-no-wrap',
            currentPage === totalPages ? 'cursor-auto opacity-75' : '',
          ].join(' ')}
          disabled={currentPage === totalPages}
          onClick={() => {
            onClick(currentPage + 1);
          }}
          type="button"
        >
          Next
          <Chevron direction={ChevronDirections.RIGHT} className="ml-2" />
        </button>
      )}
      <style jsx>{`
        button {
          transition: all 200ms ease-in-out;
        }
        li button {
          min-width: 1.25rem;
        }
      `}</style>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  maxPages: PropTypes.number,
  onClick: PropTypes.func,
  pageSize: PropTypes.number,
  showNext: PropTypes.bool,
  showPrevious: PropTypes.bool,
  totalItems: PropTypes.number.isRequired,
};

Pagination.defaultProps = {
  currentPage: 1,
  maxPages: 10,
  onClick: () => {},
  pageSize: 1,
  showNext: true,
  showPrevious: true,
};

export default Pagination;
