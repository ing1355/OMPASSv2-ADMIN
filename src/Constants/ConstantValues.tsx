import { FormattedMessage } from "react-intl";
import applicationMenuIconWhite from '@assets/applicationMenuIconWhite.png';
import applicationMenuIconBlack from '@assets/applicationMenuIconBlack.png';
import billingMenuIconWhite from '@assets/billingMenuIconWhite.png';
import billingMenuIconBlack from '@assets/billingMenuIconBlack.png';
import authLogMenuIconWhite from '@assets/authLogMenuIconWhite.png';
import authLogMenuIconBlack from '@assets/authLogMenuIconBlack.png';
import userLogMenuIconBlack from '@assets/userLogMenuIconBlack.png';
import userLogMenuIconWhite from '@assets/userLogMenuIconWhite.png';
import groupMenuIconBlack from '@assets/groupMenuIconBlack.png';
import groupMenuIconWhite from '@assets/groupMenuIconWhite.png';
import policyMenuIconBlack from '@assets/policyMenuIconBlack.png';
import policyMenuIconWhite from '@assets/policyMenuIconWhite.png';
import userManagementMenuIconBlack from '@assets/userManagementMenuIconBlack.png';
import userManagementMenuIconWhite from '@assets/userManagementMenuIconWhite.png';
import versionManagementMenuIconBlack from '@assets/versionManagementMenuIconBlack.png';
import versionManagementMenuIconWhite from '@assets/versionManagementMenuIconWhite.png';
import passcodeHistoryMenuIconBlack from '@assets/passcodeHistoryMenuIconBlack.png';
import passcodeHistoryMenuIconWhite from '@assets/passcodeHistoryMenuIconWhite.png';
import settingsMenuIconBlack from '@assets/settingsMenuIconBlack.png';
import SettingsMenuIconWhite from '@assets/settingsMenuIconWhite.png';
import ompassLogoIcon from '@assets/ompassLogoIcon.png'
import readyIcon from '@assets/ompassLogoIcon.png'
import progressIcon from '@assets/ompassAuthProgressIcon.png'
import completeIcon from '@assets/ompassAuthCompleteIcon.png'
import { isMobile } from "react-device-detect";

export const getOMPASSAuthIconByProgressStatus = (status: OMPASSAuthStatusType) => {
    if(status === 'ready') return readyIcon
    else if(status === 'progress') return progressIcon
    else return completeIcon
}

const TIMEZONE_ORIGINAL_NAMES = [
    "GMT",
    "UTC",
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar es Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San Juan",
    "America/Argentina/San Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge Bay",
    "America/Campo Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Ciudad Juarez",
    "America/Costa Rica",
    "America/Coyhaique",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El Salvador",
    "America/Fort Nelson",
    "America/Fortaleza",
    "America/Glace Bay",
    "America/Goose Bay",
    "America/Grand Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "America/Kentucky/Monticello",
    "America/Kralendijk",
    "America/La Paz",
    "America/Lima",
    "America/Los Angeles",
    "America/Lower Princes",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Marigot",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montserrat",
    "America/Nassau",
    "America/New York",
    "America/Nome",
    "America/Noronha",
    "America/North Dakota/Beulah",
    "America/North Dakota/Center",
    "America/North Dakota/New Salem",
    "America/Nuuk",
    "America/Ojinaga",
    "America/Panama",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port of Spain",
    "America/Porto Velho",
    "America/Puerto Rico",
    "America/Punta Arenas",
    "America/Rankin Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo Domingo",
    "America/Sao Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St Barthelemy",
    "America/St Johns",
    "America/St Kitts",
    "America/St Lucia",
    "America/St Thomas",
    "America/St Vincent",
    "America/Swift Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Arctic/Longyearbyen",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho Chi Minh",
    "Asia/Hong Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novokuznetsk",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qostanay",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South Georgia",
    "Atlantic/St Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken Hill",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Canada/Atlantic",
    "Canada/Central",
    "Canada/Eastern",
    "Canada/Mountain",
    "Canada/Newfoundland",
    "Canada/Pacific",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Bratislava",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Busingen",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle of Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kirov",
    "Europe/Kyiv",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Mariehamn",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Podgorica",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/San Marino",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zurich",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kanton",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis",
    "US/Alaska",
    "US/Arizona",
    "US/Central",
    "US/Eastern",
    "US/Hawaii",
    "US/Mountain",
    "US/Pacific"
]

const TIMEZONE_NAMES = {
    "Africa": [
        "Abidjan",
        "Accra",
        "Addis_Ababa",
        "Algiers",
        "Asmara",
        "Bamako",
        "Bangui",
        "Banjul",
        "Bissau",
        "Blantyre",
        "Brazzaville",
        "Bujumbura",
        "Cairo",
        "Casablanca",
        "Ceuta",
        "Conakry",
        "Dakar",
        "Dar_es_Salaam",
        "Djibouti",
        "Douala",
        "El_Aaiun",
        "Freetown",
        "Gaborone",
        "Harare",
        "Johannesburg",
        "Juba",
        "Kampala",
        "Khartoum",
        "Kigali",
        "Kinshasa",
        "Lagos",
        "Libreville",
        "Lome",
        "Luanda",
        "Lubumbashi",
        "Lusaka",
        "Malabo",
        "Maputo",
        "Maseru",
        "Mbabane",
        "Mogadishu",
        "Monrovia",
        "Nairobi",
        "Ndjamena",
        "Niamey",
        "Nouakchott",
        "Ouagadougou",
        "Porto-Novo",
        "Sao_Tome",
        "Tripoli",
        "Tunis",
        "Windhoek"
    ],
    "America": [
        "Adak",
        "Anchorage",
        "Anguilla",
        "Antigua",
        "Araguaina",
        "Argentina/Buenos_Aires",
        "Argentina/Catamarca",
        "Argentina/Cordoba",
        "Argentina/Jujuy",
        "Argentina/La_Rioja",
        "Argentina/Mendoza",
        "Argentina/Rio_Gallegos",
        "Argentina/Salta",
        "Argentina/San_Juan",
        "Argentina/San_Luis",
        "Argentina/Tucuman",
        "Argentina/Ushuaia",
        "Aruba",
        "Asuncion",
        "Atikokan",
        "Bahia",
        "Bahia_Banderas",
        "Barbados",
        "Belem",
        "Belize",
        "Blanc-Sablon",
        "Boa_Vista",
        "Bogota",
        "Boise",
        "Cambridge_Bay",
        "Campo_Grande",
        "Cancun",
        "Caracas",
        "Cayenne",
        "Cayman",
        "Chicago",
        "Chihuahua",
        "Ciudad_Juarez",
        "Costa_Rica",
        "Coyhaique",
        "Creston",
        "Cuiaba",
        "Curacao",
        "Danmarkshavn",
        "Dawson",
        "Dawson_Creek",
        "Denver",
        "Detroit",
        "Dominica",
        "Edmonton",
        "Eirunepe",
        "El_Salvador",
        "Fort_Nelson",
        "Fortaleza",
        "Glace_Bay",
        "Goose_Bay",
        "Grand_Turk",
        "Grenada",
        "Guadeloupe",
        "Guatemala",
        "Guayaquil",
        "Guyana",
        "Halifax",
        "Havana",
        "Hermosillo",
        "Indiana/Indianapolis",
        "Indiana/Knox",
        "Indiana/Marengo",
        "Indiana/Petersburg",
        "Indiana/Tell_City",
        "Indiana/Vevay",
        "Indiana/Vincennes",
        "Indiana/Winamac",
        "Inuvik",
        "Iqaluit",
        "Jamaica",
        "Juneau",
        "Kentucky/Louisville",
        "Kentucky/Monticello",
        "Kralendijk",
        "La_Paz",
        "Lima",
        "Los_Angeles",
        "Lower_Princes",
        "Maceio",
        "Managua",
        "Manaus",
        "Marigot",
        "Martinique",
        "Matamoros",
        "Mazatlan",
        "Menominee",
        "Merida",
        "Metlakatla",
        "Mexico_City",
        "Miquelon",
        "Moncton",
        "Monterrey",
        "Montevideo",
        "Montserrat",
        "Nassau",
        "New_York",
        "Nome",
        "Noronha",
        "North_Dakota/Beulah",
        "North_Dakota/Center",
        "North_Dakota/New_Salem",
        "Nuuk",
        "Ojinaga",
        "Panama",
        "Paramaribo",
        "Phoenix",
        "Port-au-Prince",
        "Port_of_Spain",
        "Porto_Velho",
        "Puerto_Rico",
        "Punta_Arenas",
        "Rankin_Inlet",
        "Recife",
        "Regina",
        "Resolute",
        "Rio_Branco",
        "Santarem",
        "Santiago",
        "Santo_Domingo",
        "Sao_Paulo",
        "Scoresbysund",
        "Sitka",
        "St_Barthelemy",
        "St_Johns",
        "St_Kitts",
        "St_Lucia",
        "St_Thomas",
        "St_Vincent",
        "Swift_Current",
        "Tegucigalpa",
        "Thule",
        "Tijuana",
        "Toronto",
        "Tortola",
        "Vancouver",
        "Whitehorse",
        "Winnipeg",
        "Yakutat"
    ],
    "Antarctica": [
        "Casey",
        "Davis",
        "DumontDUrville",
        "Macquarie",
        "Mawson",
        "McMurdo",
        "Palmer",
        "Rothera",
        "Syowa",
        "Troll",
        "Vostok"
    ],
    "Arctic": [
        "Longyearbyen"
    ],
    "Asia": [
        "Aden",
        "Almaty",
        "Amman",
        "Anadyr",
        "Aqtau",
        "Aqtobe",
        "Ashgabat",
        "Atyrau",
        "Baghdad",
        "Bahrain",
        "Baku",
        "Bangkok",
        "Barnaul",
        "Beirut",
        "Bishkek",
        "Brunei",
        "Chita",
        "Colombo",
        "Damascus",
        "Dhaka",
        "Dili",
        "Dubai",
        "Dushanbe",
        "Famagusta",
        "Gaza",
        "Hebron",
        "Ho_Chi_Minh",
        "Hong_Kong",
        "Hovd",
        "Irkutsk",
        "Jakarta",
        "Jayapura",
        "Jerusalem",
        "Kabul",
        "Kamchatka",
        "Karachi",
        "Kathmandu",
        "Khandyga",
        "Kolkata",
        "Krasnoyarsk",
        "Kuala_Lumpur",
        "Kuching",
        "Kuwait",
        "Macau",
        "Magadan",
        "Makassar",
        "Manila",
        "Muscat",
        "Nicosia",
        "Novokuznetsk",
        "Novosibirsk",
        "Omsk",
        "Oral",
        "Phnom_Penh",
        "Pontianak",
        "Pyongyang",
        "Qatar",
        "Qostanay",
        "Qyzylorda",
        "Riyadh",
        "Sakhalin",
        "Samarkand",
        "Seoul",
        "Shanghai",
        "Singapore",
        "Srednekolymsk",
        "Taipei",
        "Tashkent",
        "Tbilisi",
        "Tehran",
        "Thimphu",
        "Tokyo",
        "Tomsk",
        "Ulaanbaatar",
        "Urumqi",
        "Ust-Nera",
        "Vientiane",
        "Vladivostok",
        "Yakutsk",
        "Yangon",
        "Yekaterinburg",
        "Yerevan"
    ],
    "Atlantic": [
        "Azores",
        "Bermuda",
        "Canary",
        "Cape_Verde",
        "Faroe",
        "Madeira",
        "Reykjavik",
        "South_Georgia",
        "St_Helena",
        "Stanley"
    ],
    "Australia": [
        "Adelaide",
        "Brisbane",
        "Broken_Hill",
        "Darwin",
        "Eucla",
        "Hobart",
        "Lindeman",
        "Lord_Howe",
        "Melbourne",
        "Perth",
        "Sydney"
    ],
    "Canada": [
        "Atlantic",
        "Central",
        "Eastern",
        "Mountain",
        "Newfoundland",
        "Pacific"
    ],
    "Europe": [
        "Amsterdam",
        "Andorra",
        "Astrakhan",
        "Athens",
        "Belgrade",
        "Berlin",
        "Bratislava",
        "Brussels",
        "Bucharest",
        "Budapest",
        "Busingen",
        "Chisinau",
        "Copenhagen",
        "Dublin",
        "Gibraltar",
        "Guernsey",
        "Helsinki",
        "Isle_of_Man",
        "Istanbul",
        "Jersey",
        "Kaliningrad",
        "Kirov",
        "Kyiv",
        "Lisbon",
        "Ljubljana",
        "London",
        "Luxembourg",
        "Madrid",
        "Malta",
        "Mariehamn",
        "Minsk",
        "Monaco",
        "Moscow",
        "Oslo",
        "Paris",
        "Podgorica",
        "Prague",
        "Riga",
        "Rome",
        "Samara",
        "San_Marino",
        "Sarajevo",
        "Saratov",
        "Simferopol",
        "Skopje",
        "Sofia",
        "Stockholm",
        "Tallinn",
        "Tirane",
        "Ulyanovsk",
        "Vaduz",
        "Vatican",
        "Vienna",
        "Vilnius",
        "Volgograd",
        "Warsaw",
        "Zagreb",
        "Zurich"
    ],
    "Indian": [
        "Antananarivo",
        "Chagos",
        "Christmas",
        "Cocos",
        "Comoro",
        "Kerguelen",
        "Mahe",
        "Maldives",
        "Mauritius",
        "Mayotte",
        "Reunion"
    ],
    "Pacific": [
        "Apia",
        "Auckland",
        "Bougainville",
        "Chatham",
        "Chuuk",
        "Easter",
        "Efate",
        "Fakaofo",
        "Fiji",
        "Funafuti",
        "Galapagos",
        "Gambier",
        "Guadalcanal",
        "Guam",
        "Honolulu",
        "Kanton",
        "Kiritimati",
        "Kosrae",
        "Kwajalein",
        "Majuro",
        "Marquesas",
        "Midway",
        "Nauru",
        "Niue",
        "Norfolk",
        "Noumea",
        "Pago_Pago",
        "Palau",
        "Pitcairn",
        "Pohnpei",
        "Port_Moresby",
        "Rarotonga",
        "Saipan",
        "Tahiti",
        "Tarawa",
        "Tongatapu",
        "Wake",
        "Wallis"
    ],
    "US": [
        "Alaska",
        "Arizona",
        "Central",
        "Eastern",
        "Hawaii",
        "Mountain",
        "Pacific"
    ]
}

// console.log(TIMEZONE_NAMES.filter(_ => !_.startsWith('Etc') && !_.startsWith('SystemV') && _.includes('/') || _ === 'UTC' || _ === 'GMT'))
// console.log(TIMEZONE_ORIGINAL_NAMES)
// console.log(TIMEZONE_ORIGINAL_NAMES.filter(_ => !_.startsWith('Etc') && !_.startsWith('SystemV') && _.includes('/')).reduce((acc, cur) => {
//     const [_, ...country] = cur.split('/')
//     if(!acc[_]) {
//         acc[_] = []
//     }
//     acc[_].push(country.join('/').replace(/\s/g, '_'))
//     return acc
// }, {} as { [key: string]: string[] }))
// console.log(TIMEZONE_NAMES)
export const DEEP_LINK_DOMAIN = 'https://applink.ompasscloud.com'
export const timeZoneNamesWithCustomSelect = ([{
    key: 'UTC',
    label: 'UTC'
}, {
    key: 'GMT',
    label: 'GMT'
}] as CustomSelectItemType[]).concat(Object.keys(TIMEZONE_NAMES).map(_ => {
    const countries = TIMEZONE_NAMES[_ as keyof typeof TIMEZONE_NAMES]
    const temp = [{
        key: _,
        label: _,
        isGroup: true
    }] as CustomSelectItemType[]
    return temp.concat(countries.map(country => ({
        key: `${_}/${country}`,
        label: country.replace(/\_/g, ' ')
    })))
}).flat())
export const languageList: LanguageType[] = ['KR', 'EN', 'JP']
export const ompassDefaultLogoImage = ompassLogoIcon
export const isDev = process.env.NODE_ENV === 'development'
export const isTta = process.env.REACT_APP_ENV === 'tta'
export const isDev2 = process.env.REACT_APP_DEV === 'dev'
// export const CopyRightText = (info: SubDomainInfoDataType) => `OMPASS Portal v${process.env.REACT_APP_VERSION} © 2024. OneMoreSecurity Inc. All Rights Reserved. (backend versions : portal - ${info.backendVersion.portalApp}, interface - ${info.backendVersion.interfaceApp}, fido - ${info.backendVersion.fidoApp})`
export const CopyRightText = (info: SubDomainInfoDataType) => `Copyright 2024 OneMoreSecurity Inc. All Rights Reserved.`
console.log('version:', process.env.REACT_APP_VERSION)
export const INT_MAX_VALUE = Math.pow(2, 31) - 1
export const DateTimeFormat = "YYYY-MM-DD HH:mm:ss"
// export const DateTimeFormat = "yyyy-MM-dd HH:mm:ss"
export const userSelectPageSize = () => parseInt(localStorage.getItem('user_select_size') || "10")

// export const policyNoticeRestrictionTypes: NoticeRestrictionTypes[] = ["ACCESS_CONTROL", "BROWSER", "LOCATION", "IP_WHITE_LIST", "ACCESS_TIME", "COUNTRY"]
export const policyNoticeRestrictionTypes: NoticeRestrictionTypes[] = ["ACCESS_CONTROL", "BROWSER", "LOCATION", "IP_WHITE_LIST", "ACCESS_TIME"]

export const userStatusTypes: UserStatusType[] = ["RUN", "WAIT_ADMIN_APPROVAL", "LOCK", "WAIT_INIT_PASSWORD"]

export const PolicyBrowsersList: BrowserPolicyType[] = [
    "CHROME",
    "CHROME_MOBILE",
    "MICROSOFT_EDGE",
    "FIREFOX",
    "SAFARI",
    "MOBILE_SAFARI",
    "WHALE_BROWSER",
    "WHALE_BROWSER_MOBILE",
    "SAMSUNG_BROWSER",
    "INTERNET_EXPLORER",
    "ALL_OTHER_BROWSERS"
];

type menuDataType = {
    label: string
    route: '/UserManagement' | '/Groups' | '/PasscodeManagement' | '/AuthLogs' | '/PortalLogs' | '/Applications' | '/Policies' | '/AgentManagement' | '/Billing' | '/Settings'
    whiteImg?: string
    blackImg?: string
}

export const menuDatas = (role: userRoleType): menuDataType[] => {
    const datas: menuDataType[] = [
        {
            label: 'USER_MANAGEMENT',
            route: '/UserManagement',
            whiteImg: userManagementMenuIconWhite,
            blackImg: userManagementMenuIconBlack
        },
        {
            label: 'GROUP_MANAGEMENT',
            route: '/Groups',
            whiteImg: groupMenuIconWhite,
            blackImg: groupMenuIconBlack
        },
        {
            label: 'PASSCODE_MANAGEMENT',
            route: '/PasscodeManagement',
            whiteImg: passcodeHistoryMenuIconWhite,
            blackImg: passcodeHistoryMenuIconBlack
        },
        {
            label: 'AUTH_LOG_MANAGEMENT',
            route: '/AuthLogs',
            whiteImg: authLogMenuIconWhite,
            blackImg: authLogMenuIconBlack
        },
        {
            label: 'PORTAL_LOG_MANAGEMENT',
            route: '/PortalLogs',
            whiteImg: userLogMenuIconWhite,
            blackImg: userLogMenuIconBlack
        },
        {
            label: 'APPLICATION_MANAGEMENT',
            route: '/Applications',
            whiteImg: applicationMenuIconWhite,
            blackImg: applicationMenuIconBlack
        },
        {
            label: 'POLICY_MANAGEMENT',
            route: '/Policies',
            whiteImg: policyMenuIconWhite,
            blackImg: policyMenuIconBlack
        },
        {
            label: 'VERSION_MANAGEMENT',
            route: '/AgentManagement',
            whiteImg: versionManagementMenuIconWhite,
            blackImg: versionManagementMenuIconBlack
        },
    ]
    if(!isTta) {
        datas.push({
            label: 'BILLING_MANAGEMENT',
            route: '/Billing',
            whiteImg: billingMenuIconWhite,
            blackImg: billingMenuIconBlack
        })
    }
    datas.push({
        label: 'SETTINGS_MANAGEMENT',
        route: '/Settings',
        whiteImg: SettingsMenuIconWhite,
        blackImg: settingsMenuIconBlack
    })
    if (role === 'ROOT') {
    }
    return datas
}

// const appTypes: ApplicationDataType['type'][] = ["ADMIN", "WINDOWS_LOGIN", "DEFAULT", "LINUX_LOGIN", "RADIUS", "REDMINE", "MS_ENTRA_ID", "KEYCLOAK", "LDAP"]
// export const applicationTypes: ApplicationDataType['type'][] = ["WEB", "WINDOWS_LOGIN", "LINUX_LOGIN", "MAC_LOGIN", "PORTAL", "RADIUS", "REDMINE", "MICROSOFT_ENTRA_ID", "KEYCLOAK", "LDAP"]
export const applicationTypes: ApplicationDataType['type'][] = isTta ? ["PORTAL", "WINDOWS_LOGIN", "WEB", "LINUX_LOGIN"] : ["PORTAL", "WINDOWS_LOGIN", "MAC_LOGIN", "WEB", "LINUX_LOGIN", "RADIUS", "REDMINE", "MICROSOFT_ENTRA_ID", "KEYCLOAK", "LDAP"]
export const getApplicationTypesByPlanType = (planType: PlanDataType['type']) => {
    if(planType === 'TRIAL_PLAN' || planType === 'LICENSE_PLAN_L1') {
        return applicationTypes.filter(_ => _ === 'PORTAL' || _ === 'WEB')
    } else {
        return applicationTypes
    }
}

// 애플리케이션 타입 다국어 매칭해놨으나 타입 지정은 불가능하므로 값 바뀌면 다국어 키값도 바뀌어야함
export const AuthenticationProcessTypes: ProcessTypeType[] = ["POLICY", "REGISTRATION", "AUTHENTICATION"]
export const HttpMethodTypes: HttpMethodType[] = ["POST", "PUT", "DELETE"]

export const ExternalDirectoryTypes: {
    [key in ExternalDirectoryType]: ExternalDirectoryType
} = {
    OPEN_LDAP: 'OPEN_LDAP',
    MICROSOFT_ACTIVE_DIRECTORY: 'MICROSOFT_ACTIVE_DIRECTORY',
    MICROSOFT_ENTRA_ID: 'MICROSOFT_ENTRA_ID',
    API: 'API'
}

export const getApplicationTypeLabel = (type: LocalApplicationTypes) => type ? <FormattedMessage id={type + '_APPLICATION_TYPE'} /> : ""

export const UserSignupMethod: {
    [key in UserSignUpMethodType]: UserSignUpMethodType
} = {
    USER_SELF_ADMIN_PASS: "USER_SELF_ADMIN_PASS",
    USER_SELF_ADMIN_ACCEPT: "USER_SELF_ADMIN_ACCEPT"
}

export const devUrl = process.env['REACT_APP_DEV_URL'] as string
export const subDomain = isDev ? (isTta ? 'ompass.kr:54006' : devUrl.replace('https://', '')) : window.location.host.replace('www.', '');

export const MainRouteByDeviceType = isMobile ? '/Main' : '/Dashboard'

export const LDAPAuthenticationTypes: LdapAuthenticationEnumType[] = ['PLAIN', 'NTLMv2']
export const LDAPTransportTypes: LdapTransportType[] = ['CLEAR', 'LDAPS', 'STARTTLS']

export const authProcessTypeList: AllAuthLogDataType['processType'][] = ['REGISTRATION', 'AUTHENTICATION', 'POLICY']
export const logAuthPurposeList: LogAuthPurposeType[] = ['ADD_OTHER_AUTHENTICATOR', 'ADMIN_2FA_FOR_APPLICATION_DELETION', 'ADMIN_2FA_FOR_SECRET_KEY_UPDATE', 'AUTH_LOGIN', 'RADIUS_REGISTRATION', 'REG_LOGIN', 'ROLE_SWAPPING_SOURCE', 'ROLE_SWAPPING_TARGET']
export const authenticatorList: AuthenticatorTypeType[] = ['OMPASS', 'PASSCODE', 'WEBAUTHN', 'OTP', 'MASTER_USB', 'NONE']
export const authenticatorLabelList: {
    [key in AuthenticatorTypeType]: string
} = {
    OMPASS: 'OMPASS',
    PASSCODE: 'PASSCODE',
    WEBAUTHN: 'WebAuthn',
    OTP: 'OTP',
    MASTER_USB: 'Master USB',
    NONE: '-'
}
export const authFailReasonList: InvalidAuthLogDataType['reason'][] = ['ACCESS_TIME', 'BROWSER', 'COUNTRY', 'ACCESS_CONTROL', 'CANCEL', 'INVALID_OTP', 'INVALID_PASSCODE', 'INVALID_SIGNATURE', 'IP_WHITE_LIST', 'LOCATION', 'NONE']

export const convertLangToIntlVer = (lang: ReduxStateType['lang']) => {
  if(lang === 'EN') {
    return 'en-us'
  } else if(lang === 'JP') {
    return 'ja'
  } else {
    return 'ko-kr'
  }
}

export const AgentTypes: AgentType[] = ['WINDOWS_LOGIN', 'LINUX_PAM', 'OMPASS_PROXY', 'REDMINE_PLUGIN', 'KEYCLOAK_PLUGIN', 'WINDOWS_FRAMEWORK']

export const maxLengthByType = (type: InputValueType | undefined) => {
  if(!type) return 50
  if(type === 'username') {
    return 16
  } else if(type === 'password') {
    return 16
  } else if(type === 'email') {
    return 48
  } else if(type === 'firstName') {
    return 16
  } else if(type === 'lastName') {
    return 16
  } else if(type === 'phone') { 
    return 16
  } else if(type === 'domain') {
    return 48
  } else if(type === 'description') {
    return 100
  } else if(type === 'title') {
    return 40
  }
}