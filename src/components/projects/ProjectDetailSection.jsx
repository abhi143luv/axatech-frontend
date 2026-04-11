import { Link } from 'react-router-dom';
import { Button, Loader, SectionHeader } from '../common';
import { ChevronLeftIcon, OpenInNewIcon, ProjectsIcon } from '../icons';

export default function ProjectDetailSection({ project, loading, error }) {
  if (loading) {
    return (
      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex justify-center py-20">
            <Loader className="min-h-[120px]" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-5">
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 px-6 py-10 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            <Button to="/projects" variant="outline" fullWidth={false} className="mt-4 inline-flex items-center gap-2">
              <ChevronLeftIcon className="text-lg" />
              Back to projects
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-5">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-6 py-16 text-center">
            <ProjectsIcon className="mx-auto text-5xl text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">Project not found.</p>
            <Button to="/projects" variant="secondary" fullWidth={false} className="inline-flex items-center gap-2">
              <ChevronLeftIcon className="text-lg" />
              Back to projects
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-5">
        <SectionHeader label="Project" position="left" dataAos="fade-up" />
        <header className="mb-8">
          {project.category && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide dark:bg-secondary/15 dark:text-secondary mb-4"
              data-aos="fade-up"
            >
              {project.category}
            </span>
          )}
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-5"
            data-aos="fade-up"
          >
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-3" data-aos="fade-up">
            <Button
              to="/projects"
              variant="outline"
              size="sm"
              fullWidth={false}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-secondary/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <ChevronLeftIcon className="text-lg" />
              Back to projects
            </Button>
            {project.webLink && (
              <Button
                as="a"
                href={project.webLink}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="sm"
                fullWidth={false}
                className="inline-flex items-center gap-2 rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-secondary/25 transition-all duration-300"
              >
                Visit live project
                <OpenInNewIcon className="text-lg" />
              </Button>
            )}
          </div>
        </header>

        {project.image && (
          <div
            className="mb-10 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-none"
            data-aos="fade-up"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto max-h-[420px] object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          </div>
        )}

        <div className="space-y-8">
          {project.description && (
            <article
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8 shadow-sm dark:shadow-none"
              data-aos="fade-up"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {project.description}
              </p>
            </article>
          )}

          {Array.isArray(project.keyFeatures) && project.keyFeatures.length > 0 && (
            <article
              className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-6 sm:p-8 shadow-sm dark:shadow-none"
              data-aos="fade-up"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Key features
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.keyFeatures.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="mt-1.5 h-2 w-2 rounded-full bg-primary dark:bg-secondary shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
