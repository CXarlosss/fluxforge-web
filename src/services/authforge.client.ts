export const getAuthForgeUrl = () => {
  return import.meta.env.VITE_AUTHFORGE_URL || 'http://localhost:4000';
};
