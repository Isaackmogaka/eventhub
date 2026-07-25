import IntaSend from 'intasend-node';

const intasend = new IntaSend(
  process.env.INTASEND_PUBLISHABLE_KEY!,
  process.env.INTASEND_SECRET_KEY!,
  false // false = sandbox/test mode, true = live
);

export default intasend;
