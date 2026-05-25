export async function isAuthor(req, res, next) {
  if (req.user && req.user?.role !== "AUTHOR") {
    return res.status(403).json({ error: { msg: "User does not have author permissions." } });
  }
  next();
}