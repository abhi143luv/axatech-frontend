import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { ArrowLeftIcon } from '../../components/icons';
import { ReactLayout } from '../../components/technologies/infoPages/frontend/react';
import { VueLayout } from '../../components/technologies/infoPages/frontend/vue';
import { HtmlLayout } from '../../components/technologies/infoPages/frontend/html';
import { AngularLayout } from '../../components/technologies/infoPages/frontend/angular';
import { FirebaseLayout } from '../../components/technologies/infoPages/database/firebase';
import { MongoDBLayout } from '../../components/technologies/infoPages/database/mongoDb';
import { MySQLLayout } from '../../components/technologies/infoPages/database/mySQL';
import { PostgreSQLLayout } from '../../components/technologies/infoPages/database/postGresQl';
import { ExpressJsLayout } from '../../components/technologies/infoPages/backend/ExpressJs';
import { GraphQLLayout } from '../../components/technologies/infoPages/backend/GraphQL';
import { NestJsLayout } from '../../components/technologies/infoPages/backend/NestJs';
import { NodeJsLayout } from '../../components/technologies/infoPages/backend/NodeJs';

const CUSTOM_LAYOUT_SLUGS = [
  'react',
  'vue',
  'vue-js',
  'html5',
  'html',
  'angular',
  'firebase',
  'mongodb',
  'mongo',
  'mysql',
  'postgresql',
  'postgres',
  'express',
  'expressjs',
  'graphql',
  'nestjs',
  'nest',
  'nodejs',
  'node-js',
  'node',
];

export default function TechnologyDetail() {
  const { slug } = useParams();
  const [technology, setTechnology] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    if (CUSTOM_LAYOUT_SLUGS.includes(slug)) {
      setLoading(false);
      return;
    }
    api.technology(slug).then(setTechnology).catch(() => setTechnology(null)).finally(() => setLoading(false));
  }, [slug]);

  if (slug === 'react') {
    return (
      <>
        <PageMeta
          title="React | Technologies | Axatech"
          description="React JS development services – scalable frontend solutions, React Native, state management, and performance optimization."
        />
        <ReactLayout />
      </>
    );
  }

  if (slug === 'vue' || slug === 'vue-js' || slug === 'vuejs') {
    return (
      <>
        <PageMeta
          title="Vue.js | Technologies | Axatech"
          description="Vue.js development services – modern frontend solutions, Vuex, Pinia, state management, and performance optimization."
        />
        <VueLayout />
      </>
    );
  }

  if (slug === 'html5' || slug === 'html') {
    return (
      <>
        <PageMeta
          title="HTML5 | Technologies | Axatech"
          description="HTML5 web development services – semantic markup, responsive design, SEO-friendly code, and modern web standards."
        />
        <HtmlLayout />
      </>
    );
  }

  if (slug === 'angular') {
    return (
      <>
        <PageMeta
          title="Angular | Technologies | Axatech"
          description="Angular development services – enterprise frontend solutions, TypeScript, PWAs, and performance optimization."
        />
        <AngularLayout />
      </>
    );
  }

  if (slug === 'firebase') {
    return (
      <>
        <PageMeta
          title="Firebase | Technologies | Axatech"
          description="Firebase development services – real-time database, authentication, Firestore, Cloud Functions, and serverless backend solutions."
        />
        <FirebaseLayout />
      </>
    );
  }

  if (slug === 'mongodb' || slug === 'mongo') {
    return (
      <>
        <PageMeta
          title="MongoDB | Technologies | Axatech"
          description="MongoDB development services – document database, query optimization, replication, sharding, and high-performance NoSQL solutions."
        />
        <MongoDBLayout />
      </>
    );
  }

  if (slug === 'mysql') {
    return (
      <>
        <PageMeta
          title="MySQL | Technologies | Axatech"
          description="MySQL development services – relational database design, optimization, replication, migration, and high-availability solutions."
        />
        <MySQLLayout />
      </>
    );
  }

  if (slug === 'postgresql' || slug === 'postgres') {
    return (
      <>
        <PageMeta
          title="PostgreSQL | Technologies | Axatech"
          description="PostgreSQL development services – relational database design, optimization, replication, migration, and high-performance solutions."
        />
        <PostgreSQLLayout />
      </>
    );
  }

  if (slug === 'express' || slug === 'expressjs') {
    return (
      <>
        <PageMeta
          title="Express.js | Technologies | Axatech"
          description="Express.js development services – Node.js backend, REST & GraphQL APIs, real-time apps, authentication, and microservices."
        />
        <ExpressJsLayout />
      </>
    );
  }

  if (slug === 'graphql') {
    return (
      <>
        <PageMeta
          title="GraphQL | Technologies | Axatech"
          description="GraphQL development services – API development, schema design, subscriptions, and efficient data query solutions."
        />
        <GraphQLLayout />
      </>
    );
  }

  if (slug === 'nestjs' || slug === 'nest') {
    return (
      <>
        <PageMeta
          title="NestJS | Technologies | Axatech"
          description="NestJS development services – TypeScript backend, REST & GraphQL APIs, microservices, and enterprise applications."
        />
        <NestJsLayout />
      </>
    );
  }

  if (slug === 'nodejs' || slug === 'node-js' || slug === 'node') {
    return (
      <>
        <PageMeta
          title="Node.js | Technologies | Axatech"
          description="Node.js development services – scalable backend systems, REST & GraphQL APIs, real-time apps, microservices, and cloud deployment."
        />
        <NodeJsLayout />
      </>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20 text-center text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }
  if (!technology) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-6">Technology not found.</p>
        <Link to="/technologies" className="text-primary dark:text-secondary font-medium hover:underline">
          Back to Technologies
        </Link>
      </div>
    );
  }

  const { title, description, category, image } = technology;

  return (
    <>
      <PageMeta title={`${title} | Technologies | Axatech`} description={description?.slice(0, 160)} />

      <section className="py-16 md:py-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-5">
          <Link
            to="/technologies"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary dark:text-secondary hover:underline mb-8"
          >
            <ArrowLeftIcon className="text-lg" />
            Back to Technologies
          </Link>
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {image && (
              <div className="w-full sm:w-48 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
                <img src={image} alt="" className="max-h-40 w-full object-contain" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {category && (
                <span className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-secondary">
                  {category}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1 mb-4">
                {title}
              </h1>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                {description?.split('\n').map((p, i) => (
                  <p key={i} className="mb-4 last:mb-0">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
