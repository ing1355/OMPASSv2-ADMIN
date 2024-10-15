import CreateAccountTexts from "./CreateAccountText";
import ErrorTexts from "./ErrorTexts";
import LocaleTexts from "./LocaleTexts";
import ApplicationTypes from "./ApplicationTypes";
import ServerErrorCodes from "./ServerErrorCodes";
import CalendarText from "./CalendarText";

const Locale = {
  EN: {
    ...LocaleTexts.en,
    ...ErrorTexts.en,
    ...CreateAccountTexts.en,
    ...ApplicationTypes.EN,
    ...ServerErrorCodes.EN,
    ...CalendarText.EN
  },
  KR: {
    ...LocaleTexts.ko,
    ...ErrorTexts.ko,
    ...CreateAccountTexts.ko,
    ...ApplicationTypes.KR,
    ...ServerErrorCodes.KR,
    ...CalendarText.KR
  }
};

export default Locale