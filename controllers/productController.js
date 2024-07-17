const stripe = require('stripe')(process.env.STRIPE_API);

exports.getHomePage = (req, res) => {
  res.render("products/homePage");
};

exports.createCheckoutSession = async (req, res) => {
  const { IDD } = req.params;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 1000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: `http://localhost:3000/products/${IDD}/cart`,
  });

  res.redirect(303, session.url);
};