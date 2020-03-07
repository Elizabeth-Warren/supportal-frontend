import Button, { ButtonLevels } from '@ewarren/persist/lib/components/Button';
import Link from 'next/link';
import format from 'date-fns/format';
import { useContext } from 'react';
import GlitterContext from '../../contexts/GlitterContext';
import Layout from '../Layout';

const GlitterPage = () => {
  const { emails, cloneEmail, deleteEmail } = useContext(GlitterContext);

  return (
    <Layout
      metaTitle="Glitter"
      pageTitle="Glitter"
      pageDescription="Don't throw shade. Throw glitter."
    >
      <div className="max-w-section mx-auto mb-8 mt-16 md:-mt-12 px-8 xl:px-0">
        <Link
          href="/glitter/compose/[emailId]"
          as="/glitter/compose/new"
          passHref
        >
          <Button
            as="a"
            className="inline-flex items-center mr-2 overflow-hidden"
            level={ButtonLevels.INVERTED}
          >
            <span className="text-3xl mr-2" style={{ lineHeight: 0 }}>
              +
            </span>
            Create an email
          </Button>
        </Link>
      </div>
      <div className="bg-white max-w-section m-auto p-8 relative">
        <table className="w-full table-fixed">
          <thead className="border-b-3 border-b-navy">
            <tr>
              <th className="font-normal pb-2 text-base text-left">Subject</th>
              <th className="font-normal pb-2 text-base text-left">
                Created at
              </th>
              <th className="font-normal pb-2 text-base text-left">Status</th>
              <th>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map(item => (
              <tr key={item.id} className="text-sm">
                <td className="pr-1 py-4 md:py-2">{item.subject}</td>
                <td className="pr-1 py-4 md:py-2">
                  {format(item.createdAt, 'MM/dd/yyyy')}
                </td>
                <td className="pr-1 py-4 md:py-2">{item.status}</td>
                <td className="py-4 md:py-2 text-right">
                  <ul className="flex flex-wrap justify-end">
                    {item.status !== 'sent' && (
                      <li>
                        <Link
                          href="/glitter/compose/[emailId]"
                          as={`/glitter/compose/${item.id}`}
                        >
                          <a className="underline">Edit</a>
                        </Link>
                      </li>
                    )}
                    <li className="ml-2">
                      <button
                        className="underline"
                        type="button"
                        onClick={() => cloneEmail(item)}
                      >
                        Clone
                      </button>
                    </li>
                    <li className="ml-2">
                      <button
                        className="underline"
                        type="button"
                        onClick={() => deleteEmail(item)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default GlitterPage;
