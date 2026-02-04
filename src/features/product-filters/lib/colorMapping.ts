// Color name to CSS color/gradient mapping
export const COLOR_MAP: Record<string, string> = {
  // Basic colors
  black: "#000000",
  white: "#FFFFFF",
  gray: "#9CA3AF",
  grey: "#9CA3AF",
  silver: "#C0C0C0",

  // Reds
  red: "#EF4444",
  pink: "#EC4899",
  rose: "#F43F5E",
  burgundy: "#7F1D1D",
  maroon: "#800000",

  // Blues
  blue: "#3B82F6",
  navy: "#1E3A8A",
  "light blue": "#38BEF8",
  "sky blue": "#0EA5E9",
  turquoise: "#14B8A6",
  cyan: "#06B6D4",
  teal: "#14B8A6",

  // Greens
  green: "#22C55E",
  "light green": "#84CC16",
  lime: "#84CC16",
  emerald: "#10B981",
  olive: "#808000",

  // Yellows/Oranges
  yellow: "#EAB308",
  orange: "#F97316",
  amber: "#F59E0B",
  gold: "#FFD700",

  // Purples
  purple: "#A855F7",
  violet: "#8B5CF6",
  lavender: "#E9D5FF",
  indigo: "#6366F1",

  // Browns
  brown: "#92400E",
  tan: "#D2B48C",
  beige: "#F5F5DC",
  cream: "#FFFDD0",

  // Multi-color (gradient)
  multicolor:
    "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
  rainbow:
    "linear-gradient(135deg, #FF0000 0%, #FF7F00 16%, #FFFF00 33%, #00FF00 50%, #0000FF 66%, #4B0082 83%, #9400D3 100%)",
};

// Get color value for a color name (case-insensitive)
export const getColorValue = (colorName: string): string => {
  const normalizedName = colorName.toLowerCase().trim();
  return COLOR_MAP[normalizedName] || "#6B7280"; // Default to gray if color not found
};

// Check if color is light (for border visibility)
export const isLightColor = (colorName: string): boolean => {
  const lightColors = [
    "white",
    "cream",
    "beige",
    "light blue",
    "light green",
    "yellow",
    "lavender",
  ];
  return lightColors.includes(colorName.toLowerCase());
};
