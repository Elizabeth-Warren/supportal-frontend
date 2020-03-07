import EventEmbedPage from '../components/EventSchedulerEmbed/EventEmbedPage';
import Layout from '../components/Layout';

const EventScheduler = () => (
  <Layout
    metaTitle="Event Scheduler"
    pageTitle="Event Scheduler"
    pageDescription="Search for events. Sign volunteers up for events."
    simple
  >
    <div className="max-w-content mx-auto bg-white p-4 md:p-8">
      <EventEmbedPage />
    </div>
  </Layout>
);

export default EventScheduler;
