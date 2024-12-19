import CreateAccountTexts from "./CreateAccountText";
import LocaleTexts from "./LocaleTexts";
import ServerErrorCodes from "./ServerErrorCodes";
import CalendarText from "./CalendarText";
import ValidationText from "./ValidationText";
import MessageText from "./MessageText";
import SecurityQuestions from "./SecurityQuestions";
import ValuesText from "./ValuesText";

const Locale = {
  EN: {
    ...LocaleTexts.EN,
    ...CreateAccountTexts.EN,
    ...ServerErrorCodes.EN,
    ...CalendarText.EN,
    ...ValidationText.EN,
    ...MessageText.EN,
    ...SecurityQuestions.EN,
    ...ValuesText.EN
  },
  KR: {
    ...LocaleTexts.KR,
    ...CreateAccountTexts.KR,
    ...ServerErrorCodes.KR,
    ...CalendarText.KR,
    ...ValidationText.KR,
    ...MessageText.KR,
    ...SecurityQuestions.KR,
    ...ValuesText.KR
  },
  JP: {
    
  }
};

export default Locale