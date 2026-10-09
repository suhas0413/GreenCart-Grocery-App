import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../lib/api';
import './Contact.css';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsSubmitting(true);

    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          topic: formData.get('topic'),
          message: formData.get('message'),
        }),
      });
      form.reset();
      toast.success('Your message has been recorded.');
    } catch (error) {
      toast.error(error instanceof TypeError ? 'Unable to reach the server. Try again shortly.' : error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-page">
      <section className="contact-intro">
        <p className="contact-eyebrow">GREEN CART / WE’RE LISTENING</p>
        <h1>A note goes a long way.</h1>
        <p>Questions about an order, a product, or something we could do better? Send us a message.</p>
        <div className="contact-topics" aria-label="What you can contact us about">
          <span>Orders</span>
          <span>Products</span>
          <span>Feedback</span>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-heading">
          <span className="contact-step">01</span>
          <div>
            <h2>Send a message</h2>
            <p>All fields are required.</p>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-field-row">
            <label>
              Your name
              <input autoComplete="name" maxLength="100" name="name" placeholder="Name" required />
            </label>
            <label>
              Email address
              <input autoComplete="email" maxLength="254" name="email" placeholder="you@example.com" required type="email" />
            </label>
          </div>
          <label>
            What can we help with?
            <select defaultValue="" name="topic" required>
              <option disabled value="">Choose a topic</option>
              <option value="order">An order</option>
              <option value="product">A product</option>
              <option value="delivery">Delivery</option>
              <option value="feedback">Feedback</option>
              <option value="other">Something else</option>
            </select>
          </label>
          <label>
            Your message
            <textarea maxLength="2000" minLength="10" name="message" placeholder="Tell us a little more..." required rows="5" />
          </label>
          <div className="contact-submit-row">
            <p>Your message is stored securely with your request details.</p>
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Sending...' : 'Send message'}
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Contact;