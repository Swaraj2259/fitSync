// server/src/middleware/validate.js
exports.requireMetric = (req, res, next) => {
  const { metric, challengeId } = req.body;
  if (!challengeId) return res.status(400).json({ message: 'challengeId is required' });
  if (typeof metric !== 'number' || metric <= 0) return res.status(400).json({ message: 'metric must be a positive number' });
  next();
};