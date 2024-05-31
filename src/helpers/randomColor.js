export function generateRandomColor() {
  // Generate a random number between 0 and 255 for red, green, and blue components
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

 
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  // Combine the components into a single hex color string
  const color = `#${redHex}${greenHex}${blueHex}`;

  return color;
}
