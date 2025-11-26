import CreateAccountTexts from "./CreateAccountText";
import LocaleTexts from "./LocaleTexts";
import ServerErrorCodes from "./ServerErrorCodes";
import CalendarText from "./CalendarText";
import ValidationText from "./ValidationText";
import MessageText from "./MessageText";
import SecurityQuestions from "./SecurityQuestions";
import ValuesText from "./ValuesText";
import BillingText from "./BillingText";
import LogActionTypes from "./LogActionTypes";
import DocsLabel from "./DocsLabel";

const Locale = {
  EN: {
    ...LocaleTexts.EN,
    ...CreateAccountTexts.EN,
    ...ServerErrorCodes.EN,
    ...CalendarText.EN,
    ...ValidationText.EN,
    ...MessageText.EN,
    ...SecurityQuestions.EN,
    ...ValuesText.EN,
    ...BillingText.EN,
    ...LogActionTypes.EN,
    ...DocsLabel.EN
  },
  KR: {
    ...LocaleTexts.KR,
    ...CreateAccountTexts.KR,
    ...ServerErrorCodes.KR,
    ...CalendarText.KR,
    ...ValidationText.KR,
    ...MessageText.KR,
    ...SecurityQuestions.KR,
    ...ValuesText.KR,
    ...BillingText.KR,
    ...LogActionTypes.KR,
    ...DocsLabel.KR
  },
  JP: {
    ...LocaleTexts.JP,
    ...CreateAccountTexts.JP,
    ...ServerErrorCodes.JP,
    ...CalendarText.JP,
    ...ValidationText.JP,
    ...MessageText.JP,
    ...SecurityQuestions.JP,
    ...ValuesText.JP,
    ...BillingText.JP,
    ...LogActionTypes.JP,
    ...DocsLabel.JP
  }
};

export default Locale