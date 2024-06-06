export function generateRandomColor() {
  var letters = "0123456789A".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.round(Math.random() * 11)];
  }
  return color;
}
