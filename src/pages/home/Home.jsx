import { useEffect, useState } from 'react';
import api from '../../api';
import { Loader, PageMeta } from '../../components/common';
import {
  HomeHero,
  HomeHeroBannerSection,
  HomeIntro,
  HomeLicenseHighlights,
  HomeFeaturedAddons,
  HomeCloudOverview,
  HomeWhyChoose,
  HomeCta,
  HomeLogoLoop,
} from '../../components/home';

function sortedBannersWithImages(res) {
  if (!res) return [];
  const list = Array.isArray(res) ? res : res.items ?? [];
  return [...list]
    .filter((b) => b?.image && String(b.image).trim())
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

/** Prefer homepage rows; if none, use licenses/TSS rows (for carousel + fallback). */
function pickBannerSlides(heroHomeRes, heroLicensesRes) {
  const homeList = sortedBannersWithImages(heroHomeRes);
  if (homeList.length) {
    return homeList.map((b) => ({
      _id: b._id != null ? String(b._id) : undefined,
      image: String(b.image).trim(),
      title: String(b.title || '').trim(),
    }));
  }
  return sortedBannersWithImages(heroLicensesRes).map((b) => ({
    _id: b._id != null ? String(b._id) : undefined,
    image: String(b.image).trim(),
    title: String(b.title || '').trim(),
  }));
}

export default function Home() {
  const [content, setContent] = useState(null);
  const [licenses, setLicenses] = useState([]);
  const [products, setProducts] = useState([]);
  const [cmsHomeBanners, setCmsHomeBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [homeRes, licensesRes, productsRes, heroHomeRes, heroLicensesRes] = await Promise.all([
          api.home(),
          api.licenses(),
          api.products({ featured: 'true', limit: 4 }),
          api.adminHeroBanners({ placement: 'home' }).catch(() => null),
          api.adminHeroBanners({ placement: 'licenses' }).catch(() => null),
        ]);
        setContent(homeRes);
        setLicenses(licensesRes);
        setProducts(productsRes.products || []);
        setCmsHomeBanners(pickBannerSlides(heroHomeRes, heroLicensesRes));
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

      <HomeHeroBannerSection slides={cmsHomeBanners} />
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
