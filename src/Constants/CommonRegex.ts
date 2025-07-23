// Regex

// userId regex
export const idRegex:RegExp = /^[a-z0-9]{4,16}$/;

// userName regex
export const nameRegex:RegExp = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{1,16}$/
// export const nameRegex:RegExp = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z]{1,16}$/

// password regex
export const passwordRegex:RegExp = /(?=.*[a-zA-Z])(?=.*[\d])(?=.*[\W]).{8,16}|(?=.*[a-zA-Z])(?=.*[\d]).{10,16}|(?=.*[a-zA-Z])(?=.*[\W]).{10,16}|(?=.*[\d])(?=.*[\W]).{10,16}/

// email regex - supports multiple dots in domain (e.g., hozzi@omsecurity.co.kr)
// export const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*\.[a-zA-Z]+$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// phone regex - Korean phone number format (010-1234-5678, 02-1234-5678, etc.)
export const phoneRegex = /^01[016789]-[0-9]{3,4}-[0-9]{4}$|^0[2-9][0-9]?-[0-9]{3,4}-[0-9]{4}$/;

// korean regex
export const koreanRegex:RegExp = /[ㄱ-ㅎㅏ-ㅣ가-힣]/

// ipv4, cidr 
export const ipAddressRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
export const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}\/([0-9]|[1-2][0-9]|3[0-2])$/

export const domainRegex:RegExp = /^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|(\d{1,3}\.){3}\d{1,3})(:\d+)?(\/.*)?$/

export const redirectUriRegex:RegExp = /^(\/[a-zA-Z0-9\-_\/\.]*)?(\?[a-zA-Z0-9\-_\.=]*(?:&[a-zA-Z0-9\-_\.=]*)*)?(#[a-zA-Z0-9\-_\.]*)?$/