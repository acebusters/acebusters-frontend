/* eslint-disable import/prefer-default-export */
import tinycolor from 'tinycolor2';

// COLORS
// --------------------------------------------------------
export const baseColor = '#FD5E60';
export const black = '#080B0F';
export const background = '#ECECEC';
export const disabled = '#FF755C';
export const gray = '#999999';
export const green = '#A0FFB1';
export const white = '#FFF';
export const hover = '#C85C5C';

// FONTS
// --------------------------------------------------------
export const fontPrimary = '#262626';

// BOOTSTRAP
// Screen sizes
// Extra small screen
export const screenXsMin = '500px';
// Small screen / tablet
export const screenSmMin = '768px';
// Medium screen / desktop
export const screenMdMin = '992px';
// Large screen / wide desktop
export const screenLgMin = '1200px';
// So media queries don't overlap when required, provide a maximum
export const screenXsMax = `${parseInt(screenSmMin, 10) - 1}px`;
export const screenSmMax = `${parseInt(screenMdMin, 10) - 1}px`;
export const screenMdMax = `${parseInt(screenLgMin, 10) - 1}px`;
// Boostrap sizing
export const fontFamilyBase = "'Source Sans Pro','Helvetica Neue',Helvetica,Arial,sans-serif";
export const fontSizeBase = '14px';
export const lineHeightBase = 1.428571429;
export const fontWeightBase = '400';
export const lineHeightComputed = `${Math.floor(parseInt(fontSizeBase, 10) * lineHeightBase)}px`;
export const gridGutterWidth = '30px';

// Navbar heights
export const navbarHeight = '50px';
export const navbarPaddingHorizontal = `${Math.floor(parseInt(gridGutterWidth, 10) / 2)}px`;
export const navbarPaddingVertical = `${(parseInt(navbarHeight, 10) - parseInt(lineHeightComputed, 10)) / 2}px`;
// Side bar and logo width
export const sidebarWidth = '230px';
export const sidebarMiniWidth = '50px';
// Boxed layout maximum width
export const boxedLayoutMaxWidth = '1024px';
// When the logo should go to the top of the screen
export const screenHeaderCollapse = screenXsMax;

// Link colors (Aka = <a> tags)
export const linkColor = baseColor;
export const linkHoverColor = tinycolor(linkColor).lighten(15).toString();

// Transition global options
export const transitionSpeed = '.3s';
export const transitionFn = 'ease-in-out';
