export const handlePayment = async (plan) => {
  // Here you would integrate with a payment processor like Stripe
  // For now, we'll just simulate a payment
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        planId: plan.id,
        transactionId: `TR${Date.now()}`,
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });
    }, 2000);
  });
}; 