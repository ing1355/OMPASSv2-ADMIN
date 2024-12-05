import CreateAccountTexts from "./CreateAccountText";
import ErrorTexts from "./ErrorTexts";
import LocaleTexts from "./LocaleTexts";
import ApplicationTypes from "./ApplicationTypes";
import ServerErrorCodes from "./ServerErrorCodes";
import CalendarText from "./CalendarText";
import ValidationText from "./ValidationText";
import MessageText from "./MessageText";
import SecurityQuestions from "./SecurityQuestions";

const Locale = {
  EN: {
    ...LocaleTexts.en,
    ...ErrorTexts.en,
    ...CreateAccountTexts.en,
    ...ApplicationTypes.EN,
    ...ServerErrorCodes.EN,
    ...CalendarText.EN,
    ...ValidationText.EN,
    ...MessageText.EN,
    ...SecurityQuestions.EN
  },
  KR: {
    ...LocaleTexts.ko,
    ...ErrorTexts.ko,
    ...CreateAccountTexts.ko,
    ...ApplicationTypes.KR,
    ...ServerErrorCodes.KR,
    ...CalendarText.KR,
    ...ValidationText.KR,
    ...MessageText.KR,
    ...SecurityQuestions.KR
  }
};

export default Locale