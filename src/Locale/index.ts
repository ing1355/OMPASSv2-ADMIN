import ErrorTexts from "./ErrorTexts";
import LocaleTexts from "./LocaleTexts";

const Locale = {
  en: {
    ...LocaleTexts.en,
    ...ErrorTexts.en,
  },
  ko: {
    ...LocaleTexts.ko,
    ...ErrorTexts.ko,
  }
};

export default Locale