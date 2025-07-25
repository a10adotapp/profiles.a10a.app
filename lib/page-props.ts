export type PageProps = {
  params: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export function parseSearchParams(searchParams: {
  [key: string]: string | string[] | undefined;
}): URLSearchParams {
  return new URLSearchParams(Object.keys(searchParams).flatMap((key) => {
    const value = searchParams[key];

    if (Array.isArray(value)) {
      return value.map((v) => ([key, v]));
    }

    return [[
      key,
      value ? value : "",
    ]];
  }));
}
