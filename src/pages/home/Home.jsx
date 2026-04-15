import { useEffect, useState } from 'react';
import api from '../../api';
import { Loader, PageMeta } from '../../components/common';
import {
  HomeHero,
  HomeIntro,
  HomeLicenseHighlights,
  HomeFeaturedAddons,
  HomeCloudOverview,
  HomeWhyChoose,
  HomeCta,
  HomeLogoLoop,
} from '../../components/home';

export default function Home() {
  const [content, setContent] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [homeRes, licensesRes, productsRes] = await Promise.all([
          api.home(),
          api.licenses(),
          api.products({ featured: 'true', limit: 4 }),
        ]);
        setContent(homeRes);
        setLicenses(licensesRes);
        setProducts(productsRes.products || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !content) {
    return <Loader className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen">
      <PageMeta
        title={content.metaTitle || 'Axatech - Tally & Business Solutions'}
        description={content.metaDescription || content.introText}
        keywords={content.metaKeywords}
      />

      <HomeHero content={content} />
      <HomeIntro content={content} />
      <HomeLicenseHighlights licenses={licenses} />
      <HomeFeaturedAddons
        products={products}
        featuredAddonsTitle={content.featuredAddonsTitle}
      />
      <HomeLogoLoop />
      <HomeCloudOverview content={content} />
      <HomeWhyChoose
        whyChooseItems={content.whyChooseItems}
        whyChooseTitle={content.whyChooseTitle}
      />
      <HomeCta contactTitle={content.contactTitle} />
    </div>
  );
}
