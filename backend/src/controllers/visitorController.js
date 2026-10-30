import LiveVisitor from '../models/LiveVisitor.js';

const validSession = (value) => typeof value === 'string' && /^[a-zA-Z0-9_-]{16,100}$/.test(value);

export const heartbeat = async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    if (!validSession(sessionId)) {
      return res.status(400).json({ success: false, message: 'Invalid visitor session.' });
    }
    await LiveVisitor.findOneAndUpdate(
      { sessionId },
      { $set: { lastSeen: new Date() } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json({ success: true });
  } catch (error) {
    return res.status(503).json({ success: false, message: 'Visitor status temporarily unavailable.' });
  }
};

export const liveCount = async (_req, res) => {
  try {
    const since = new Date(Date.now() - 90 * 1000);
    const count = await LiveVisitor.countDocuments({ lastSeen: { $gte: since } });
    return res.set('Cache-Control', 'no-store').json({ success: true, liveVisitors: count });
  } catch (error) {
    return res.status(503).json({ success: false, liveVisitors: null });
  }
};
