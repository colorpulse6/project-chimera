// Public endpoint of our newsletter Worker. Subscriber data and keys stay private.
// Owner signup, received confirmation, explicit opt-in and unsubscribe verified.
export const newsletter: { formAction?: string } = {
  formAction: 'https://chimera-newsletter.colorpulse.workers.dev/subscribe',
};
