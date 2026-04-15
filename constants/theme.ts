/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#D06B00";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "Fredoka_400Regular",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "Fredoka_400Regular",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "Fredoka_600SemiBold",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "Fredoka_400Regular",
    serif: "Fredoka_400Regular",
    rounded: "Fredoka_600SemiBold",
    mono: "monospace",
  },
  web: {
    sans: "'Fredoka', system-ui, sans-serif",
    serif: "'Fredoka', system-ui, sans-serif",
    rounded: "'Fredoka', system-ui, sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
