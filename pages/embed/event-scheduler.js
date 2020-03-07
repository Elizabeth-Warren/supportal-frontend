import EventEmbedPage from '../../components/EventSchedulerEmbed/EventEmbedPage';
import Notifications from '../../components/Notifications';
// This is included to support the iframe-resizer library by any parent page.
// See: https://github.com/davidjbradshaw/iframe-resizer
import 'iframe-resizer/js/iframeResizer.contentWindow';

const EventScheduler = () => (
  <div id="content">
    <Notifications className="fixed inset-x-0 mb-4 top-0" />
    <EventEmbedPage />
  </div>
);

export default EventScheduler;
