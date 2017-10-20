export default (ratio, radius) => {
  const circleLength = 2 * Math.PI * radius;
  return {
    stroke: Math.round(circleLength * ratio),
    offset: Math.round(circleLength - circleLength * ratio)
  };
};
