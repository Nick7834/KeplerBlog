export const lightenColor = (hex: string, amount: number) => {
  hex = hex.replace("#", "");

  const num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;

  r = Math.min(255, r);
  g = Math.min(255, g);
  b = Math.min(255, b);

  return `rgb(${r}, ${g}, ${b})`;
};
