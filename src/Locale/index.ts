import CreateAccountTexts from "./CreateAccountText";
import ErrorTexts from "./ErrorTexts";
import LocaleTexts from "./LocaleTexts";
import ApplicationTypes from "./ApplicationTypes";

const Locale = {
  EN: {
    ...LocaleTexts.en,
    ...ErrorTexts.en,
    ...CreateAccountTexts.en,
    ...ApplicationTypes.EN
  },
  KR: {
    ...LocaleTexts.ko,
    ...ErrorTexts.ko,
    ...CreateAccountTexts.ko,
    ...ApplicationTypes.KR
  }
};

export default Locale