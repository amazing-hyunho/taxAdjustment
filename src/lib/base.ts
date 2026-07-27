export const resolveBase = (repositoryName?: string) =>
  repositoryName ? `/${repositoryName.replace(/^\/|\/$/g, "")}/` : "/";
