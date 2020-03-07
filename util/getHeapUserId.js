import Cookies from 'js-cookie';

const getHeapUserId = () => {
  const cookieId = `_hp2_id.${process.env.HEAP_ID}`;
  const cookie = Cookies.get(cookieId);
  return cookie ? cookie.userId : null;
};

export default getHeapUserId;
