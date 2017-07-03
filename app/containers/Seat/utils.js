export function getPosCoords(seatCoords, lineupSize, pos) {
  const cY = seatCoords[0][1];
  const coords = seatCoords.slice(0, lineupSize).sort((a, b) => {
    if (a[1] <= cY && b[1] <= cY) {
      return Math.sign(a[0] - b[0]);
    } else if (a[1] >= cY && b[1] >= cY) {
      return Math.sign(b[0] - a[0]);
    }

    return Math.sign(a[1] - b[1]);
  });

  return coords[pos];
}
