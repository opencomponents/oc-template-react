const RE_FONT_FAMILY = /font-family\s*:\s*([^;\n]+)[;\n]/g;
const RE_FONT_NAMES = /(?:(?:'|(?:\\"))?([(?:\\\\)\w\d _-]+)(?:'|(?:\\"))?(,\s*)?)/g;
const RE_DOUBLE_COUTE = /"/g;
const RE_SPACE = /[ ]+/g;
const RE_UNICODE = /\\([\d\w]{4})/g;

module.exports = function(source) {
  source = source.replace(RE_FONT_FAMILY, (str, fontNames) => {
    const strFontNames = fontNames
      .replace(RE_DOUBLE_COUTE, "'")
      .replace(RE_FONT_NAMES, (match, fontName, sep) => {
        if (match.includes("'")) {
          const replacement = fontName
            .replace(RE_SPACE, " ")
            .replace(RE_UNICODE, (m, unicode) =>
              String.fromCharCode(parseInt(unicode, 16))
            );
          return `'${replacement}'${sep || ""}`;
        }
        return match;
      });
    return `font-family: ${strFontNames};`;
  });
  return source;
};
