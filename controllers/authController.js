const User = require('../models/User');

exports.getLoginViaGoogle = (req, res) => {
  res.render("products/googleIdentity");
};

exports.postLoginViaGoogle = async (req, res) => {
  const { identityInput, googleid } = req.body;
  await User.updateOne(
    { googleId: googleid },
    { $set: { identity: identityInput } }
  );
  res.redirect("/");
};

exports.googleAuthCallback = (req, res) => {
  req.flash('success', `Welcome ${req.user.username}`);
  res.redirect('/loginViaGoogle');
};