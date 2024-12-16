import CreateAccountTexts from "./CreateAccountText";
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