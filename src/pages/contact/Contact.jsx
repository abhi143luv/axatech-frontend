import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api';
import { toast } from '../../utils/toast';
import { PageMeta } from '../../components/common';
import { ContactHero, ContactSuccess, ContactForm } from '../../components/contact';

export default function Contact() {
  const location = useLocation();
  const state = location.state || {};
  const productIds =
    Array.isArray(state.productIds)
      ? state.productIds
      : state.productIds
        ? [state.productIds]
        : undefined;
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: state.enquiryType || 'contact',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: state.planName
      ? `Enquiry for: ${state.planName}`
      : state.productName
        ? `Enquiry for: ${state.productName}`
        : state.serviceName
          ? `Enquiry for: ${state.serviceName}`
          : '',
    productIds,
    service: state.service || undefined,
    licensePlan: state.licensePlan || undefined,
    cloudPlan: state.cloudPlan || undefined,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.enquiry(form);
      setSent(true);
      toast.success('Enquiry submitted successfully. We will get back to you soon.');
    } catch (err) {
      const msg = err.message || 'Failed to submit';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <ContactSuccess
        title="Thank you"
        message="Your enquiry has been submitted. We will get back to you soon."
      />
    );
  }

  return (
    <>
      <PageMeta
        title="Contact - Axatech"
        description="Contact Axatech for Tally licenses, add-ons, cloud hosting and services."
      />

      <ContactHero
        title="Contact Us"
        subtitle="Send an enquiry for licenses, products, or services. We'll respond shortly."
      />

      <ContactForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
      />
    </>
  );
}
