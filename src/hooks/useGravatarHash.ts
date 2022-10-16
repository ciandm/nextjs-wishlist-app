import md5 from "md5";

export const useGravatarHash = (email: string) => {
  const hash = md5(email.trim().toLowerCase());

  return `https://www.gravatar.com/avatar/${hash}?d=retro`;
};
