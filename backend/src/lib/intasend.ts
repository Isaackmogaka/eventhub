import IntaSend from 'intasend-node';

const intasend = new IntaSend(
  process.env.INTASEND_PUBLISHABLE_KEY!,
  process.env.INTASEND_SECRET_KEY!,
  true // true = sandbox/test mode, false = live
);

export default intasend;
