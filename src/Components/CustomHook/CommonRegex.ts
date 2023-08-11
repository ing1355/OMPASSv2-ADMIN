// Regex

// userId regex
export const idRegex:RegExp = /^[a-z0-9]{4,16}$/;

// userName regex
export const nameRegex:RegExp = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/

// password regex
export const passwordRegex:RegExp = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/