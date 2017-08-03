/* eslint-disable import/prefer-default-export */
import tinycolor from 'tinycolor2';

// COLORS
// --------------------------------------------------------
export const baseColor = '#FD5E60';
export const black = '#080B0F';
export const background = '#ECECEC'; // lightgray
export const backgroundBoxed = '#ECECEC'; // lightgray
export const backgroundTableColor = '#353535';
export const backgroundTable = `radial-gradient(50% 50%, #B4B3B3 50%, ${backgroundTableColor} 100%)`; // lightgray radial-gradient
export const disabled = '#FFC7BD';
export const gray = '#999999';
export const green = '#A0FFB1';
export const white = '#FFF';
export const hover = '#C85C5C';
export const menuClose = 'linear-gradient(0deg, #606060 0%, #808080 100%)';
export const successBg = 'linear-gradient(0deg, #B4ED50 0%, #78D049 100%)';
export const infoBg = 'linear-gradient(0deg, #D4D4D4 0%, #4D4D4D 100%)';
export const infoBgInverse = 'linear-gradient(0deg, #4D4D4D 0%, #D4D4D4 100%)';
export const warningBg = 'linear-gradient(0deg, #F7F8CB 0%, #F7F51C 100%)';
export const dangerBg = 'linear-gradient(0deg, #FBDA61 0%, #F76B1C 100%)';
export const activeColor = '#35C5E3'; // tealish
export const successColor = '#305209'; // greenish
export const infoColor = 'white'; // white
export const warningColor = '#5E5F3B'; // yellowish
export const dangerColor = '#63430F';  // orangish

export const successBgSolid = 'lightgreen';
export const infoBgSolid = 'white';
export const warningBgSolid = 'lightyellow';
export const dangerBgSolid = '#f89435'; // orangish

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

// Navbar
export const navbarHeight = '50px';
export const navbarPaddingHorizontal = `${Math.floor(parseInt(gridGutterWidth, 10) / 2)}px`;
export const navbarPaddingVertical = `${(parseInt(navbarHeight, 10) - parseInt(lineHeightComputed, 10)) / 2}px`;
export const navbarColorCurrent = '#333';
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

export const curtainWidth = '400px';
export const curtainHalfWidth = '200px';
// Max width sticking curtain
export const curtainStickyWidth = '1168px';
