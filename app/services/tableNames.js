const planets = ['Mercury', 'Venus', 'Moon', 'Mars', 'Ceres', 'Jupiter', 'Io', 'Europa', 'Ganymede', 'Callisto', 'Saturn', 'Enceladus', 'Titan', 'Hyperion', 'Phoebe', 'Uranus', 'Oberon', 'Titania', 'Neptune', 'Pluto', 'Charon', 'Canceron', 'Aquaria', 'Caprica', 'Virgon', 'Leonis', 'Picon', 'Scorpia', 'Aerelon', 'Gemenon', 'Libris', 'Sagittaron', 'Tauron', 'Ragnar', 'Kobol', 'Feros', 'Tuchanka‎', 'Elaaden', 'Noveria', 'Virmire', 'Ilos', 'Palaven', 'Menae', 'Rannoch', 'Thessia', 'Namakli', 'Illium', 'Tatooine', 'Hoth', 'Endor', 'Coruscant', 'Alderaan', 'Naboo', 'Anoat', 'Bespin', 'Corellia', 'Dagobah', 'Dantooine', 'Geonosis', 'Jakku', 'Kamino', 'Kessel', 'Yavin', 'Jedha', 'Scarif', 'Mustafar', 'Eros', 'Lusitania', 'Ariel', 'Beaumonde', 'Hera', 'Persephone', 'Whitefall', 'Sihnon', 'Solaris', 'Arrakis', 'Caladan', 'Kaitain', 'Giedi Prime', 'Cybertron', 'K-PAX', 'Nirn', 'Omega', 'Citadel', 'Pandora', 'Triton', 'Rhea', 'Umbriel', 'Miranda', 'Proteus', 'Galatea'];
const colors = ['Amber', 'Amethyst', 'Aquamarine', 'Awesome', 'Azure', 'Begonia', 'Beige', 'Black', 'Blue', 'Bronze', 'Brown', 'Burgundy', 'Canary', 'Cherry', 'Coral', 'Cyan', 'Emerald', 'Gold', 'Green', 'Indigo', 'Jade', 'Magenta', 'Mint', 'Mustard', 'Navy', 'Olive', 'Opal', 'Orange', 'Pink', 'Pistachio', 'Red', 'Rose', 'Ruby', 'Salmon', 'Sapphire', 'Scarlet', 'Sepia', 'Silver', 'Turquoise', 'Ultramarine', 'Vermilion', 'Violet', 'White', 'Yellow'];

export function tableNameByAddress(address) {
  const planetIdx = parseInt(address.substr(9, 8), 16) % planets.length;
  const colorIdx = parseInt(address.substr(12, 6), 16) % colors.length;

  return `${colors[colorIdx]} ${planets[planetIdx]}`;
}
