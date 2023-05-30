import CreateAccountTexts from "./CreateAccountText";
import ErrorTexts from "./ErrorTexts";
import LocaleTexts from "./LocaleTexts";

const Locale = {
  en: {
    ...LocaleTexts.en,
    ...ErrorTexts.en,
    ...CreateAccountTexts.en,
  },
  ko: {
    ...LocaleTexts.ko,
    ...ErrorTexts.ko,
    ...CreateAccountTexts.ko,
  }
};

export default Locale