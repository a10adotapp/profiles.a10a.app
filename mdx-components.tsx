import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    h1: (props) => (
      <h1 {...props}
        className="mt-8 mb-4 text-2xl font-bold" />
    ),
    h2: (props) => (
      <h2 {...props}
        className="mt-6 mb-3 text-xl font-bold" />
    ),
    p: (props) => (
      <p {...props}
        className="mt-2 mb-1" />
    ),
    ol: (props) => (
      <ol {...props}
        className="ps-8 list-decimal" />
    ),
    ul: (props) => (
      <ul {...props}
        className="ps-8 list-disc" />
    ),
    hr: (props) => (
      <hr {...props}
        className="my-6" />
    ),
  };
}
