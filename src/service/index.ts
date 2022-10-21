export const loginService = (waitTime: number) => {
  return new Promise((resolve) => setTimeout(resolve, waitTime));
};
