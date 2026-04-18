import { Link, createFileRoute } from "@tanstack/react-router";
import type { Image, RecipePreview } from "@wizard/content";

import { BlurrableImage } from "@/components/domain/blurrable-image";
import { Tag } from "@/components/ui/tag";
import { previewToCardImage } from "@/lib/images";
import { getHomePageData } from "@/server/content.functions";

type GridItem = {
  slug: string;
  title: string;
  image: Image;
  tag?: string;
  duration?: string;
};

const mapGridItem = (recipe: RecipePreview) => {
  return {
    slug: recipe.slug,
    title: recipe.title,
    image: previewToCardImage(recipe),
    tag: recipe.featuredTag,
    duration: recipe.totalDurationLabel,
  } satisfies GridItem;
};

const SectionHeader = (props: Readonly<{ title: string; subtitle?: string }>) => {
  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">{props.title}</h2>
      {props.subtitle ? (
        <p className="max-w-2xl text-[color:var(--color-muted)]">{props.subtitle}</p>
      ) : null}
    </div>
  );
};

const EditorialCard = (props: Readonly<GridItem>) => {
  return (
    <Link to="/recipes/$slug" params={{ slug: props.slug }} className="group block space-y-3">
      <BlurrableImage image={props.image} variant="preview" aspectRatio="square" lazy />
      <div className="space-y-2">
        <p className="text-xl font-semibold leading-tight transition-colors group-hover:text-[color:var(--color-primary)]">
          {props.title}
        </p>
        <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-[color:var(--color-muted)]">
          {props.duration ? <span>{props.duration}</span> : null}
          {props.duration && props.tag ? (
            <span className="h-1 w-1 rounded-full bg-[color:var(--color-border)]" />
          ) : null}
          {props.tag ? <span>{props.tag}</span> : null}
        </div>
      </div>
    </Link>
  );
};

const CompactCard = (props: Readonly<GridItem>) => {
  return (
    <Link
      to="/recipes/$slug"
      params={{ slug: props.slug }}
      className="group grid grid-cols-[112px_1fr] gap-4 rounded-xl border border-[color:var(--color-border)]/40 bg-[color:var(--color-surface)]/80 p-3"
    >
      <BlurrableImage image={props.image} variant="preview" aspectRatio="square" lazy />
      <div className="flex flex-col justify-center gap-2">
        <p className="font-semibold leading-tight transition-colors group-hover:text-[color:var(--color-primary)]">
          {props.title}
        </p>
        <div className="flex items-center gap-2 text-xs text-[color:var(--color-muted)]">
          {props.tag ? <Tag>{props.tag}</Tag> : null}
          {props.duration ? <span>{props.duration}</span> : null}
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const data = Route.useLoaderData();
  const latest = data.featuredRecipes.latestRecipes;
  const favourites = data.featuredRecipes.favouriteRecipes;
  const quick = data.featuredRecipes.quickRecipes;
  const world = data.featuredRecipes.worldCuisineRecipes;

  const hero = latest[0] ?? favourites[0] ?? quick[0] ?? world[0];
  const heroImage = hero ? previewToCardImage(hero) : null;

  return (
    <section className="space-y-20 pb-16">
      <section className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[2fr_1fr]">
          {hero && heroImage ? (
            <Link
              to="/recipes/$slug"
              params={{ slug: hero.slug }}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <BlurrableImage image={heroImage} variant="cover" aspectRatio="square" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            </Link>
          ) : (
            <div className="h-[420px] rounded-2xl bg-[color:var(--color-surface-soft)]" />
          )}

          <div className="rounded-2xl border border-[color:var(--color-border)]/40 bg-[color:var(--color-surface)]/90 p-8 shadow-[0_18px_50px_-35px_rgba(0,0,0,0.7)] lg:-ml-20 lg:translate-y-10">
            <span className="inline-flex rounded-full bg-[color:var(--color-primary-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--color-primary)]">
              Featured Recipe
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
              {hero?.title ?? data.content.title}
            </h1>
            <p className="mt-4 text-[color:var(--color-muted)]">
              {hero?.descriptionSnippet ?? data.content.description}
            </p>
            {hero ? (
              <Link
                to="/recipes/$slug"
                params={{ slug: hero.slug }}
                className="mt-7 inline-flex rounded-xl bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95"
              >
                View Recipe
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          title="Latest Recipes"
          subtitle="Fresh dishes from the latest updates in Wizard Food."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.slice(0, 3).map((recipe) => (
            <EditorialCard key={recipe.slug} {...mapGridItem(recipe)} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader
          title="Personal Favourites"
          subtitle="An asymmetric mix of standout recipes and quick picks."
        />
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {favourites[0] ? (
            <Link
              to="/recipes/$slug"
              params={{ slug: favourites[0].slug }}
              className="group relative block overflow-hidden rounded-2xl"
            >
              <BlurrableImage
                image={previewToCardImage(favourites[0])}
                variant="cover"
                aspectRatio="square"
                lazy
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute bottom-0 space-y-3 p-8 text-white">
                {favourites[0].featuredTag ? (
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary-soft)]">
                    {favourites[0].featuredTag}
                  </span>
                ) : null}
                <p className="text-3xl font-semibold leading-tight">{favourites[0].title}</p>
                <p className="max-w-lg text-sm text-white/80">{favourites[0].descriptionSnippet}</p>
              </div>
            </Link>
          ) : null}

          <div className="space-y-4">
            {favourites.slice(1, 4).map((recipe) => (
              <CompactCard key={recipe.slug} {...mapGridItem(recipe)} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader title="Quick Eats" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quick.slice(0, 4).map((recipe) => (
            <EditorialCard key={recipe.slug} {...mapGridItem(recipe)} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeader title="World Cuisines" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {world.slice(0, 4).map((recipe) => (
            <EditorialCard key={recipe.slug} {...mapGridItem(recipe)} />
          ))}
        </div>
      </section>
    </section>
  );
};

export const Route = createFileRoute("/")({
  loader: async () => await getHomePageData(),
  component: HomePage,
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.content.title },
      {
        name: "description",
        content: loaderData?.content.description,
      },
      {
        property: "og:title",
        content: loaderData?.content.title,
      },
      {
        property: "og:description",
        content: loaderData?.content.openGraphDescription,
      },
    ],
  }),
});
