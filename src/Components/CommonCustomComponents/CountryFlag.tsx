import { CountryCode } from "libphonenumber-js";

const CountryFlag = ({ countryCode }: { countryCode: CountryCode }) => {
    function countryCodeToFlagEmoji(countryCode: CountryCode) {
        if (!countryCode) return '';
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0)); // 127397 = U+1F1E6 - 'A'
        return String.fromCodePoint(...codePoints);
    }

    // const flagEmoji = countryCodeToFlagEmoji(countryCode)
    const flagEmoji = countryCodeToFlagEmoji(countryCode)
    return <>{flagEmoji}</>
}

export default CountryFlag