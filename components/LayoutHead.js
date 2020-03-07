import Head from 'next/head';
import PropTypes from 'prop-types';

const LayoutHead = ({ children, title }) => {
  const metaTitle = title ? `${title} | Elizabeth Warren` : 'Elizabeth Warren';

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        {children}
      </Head>
    </>
  );
};

LayoutHead.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
};

LayoutHead.defaultProps = {
  children: null,
  title: null,
};

export default LayoutHead;
