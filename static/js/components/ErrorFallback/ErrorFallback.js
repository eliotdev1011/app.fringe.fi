/* eslint-disable no-unused-vars */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  // eslint-disable-next-line no-console
  console.warn(error);
  return <div />;
};

export default ErrorFallback;
