import { Helmet } from 'react-helmet-async';

/**
 * Reusable page meta / SEO head component.
 * @param {string} title - Page title
 * @param {string} [description] - Meta description
 * @param {string} [keywords] - Meta keywords (optional)
 */
export default function PageMeta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
    </Helmet>
  );
}
