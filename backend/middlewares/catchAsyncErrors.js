export const catchAsyncErrors = (theFunction) => {
  return (req, res, next) => {
    Promise.resolve(theFunction(req, res, next)).catch((error) => {
      console.error("Async Error:", error);
      next(error);
    });
  };
};
