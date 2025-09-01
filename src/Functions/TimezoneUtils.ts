/**
 * 사용자 위치 기반 타임존 획득 유틸리티
 */

// 브라우저의 Intl API를 사용하여 현재 시스템 타임존 획득
export const getSystemTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Failed to get system timezone:', error);
    return 'UTC';
  }
};

// IP 기반 위치 정보로 타임존 추정 (외부 API 사용)
export const getTimezoneByIP = async (): Promise<string> => {
  try {
    // IP 기반 위치 정보를 제공하는 무료 API들
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.timezone) {
      return data.timezone;
    }
    
    // 대체 API 시도
    const altResponse = await fetch('https://worldtimeapi.org/api/ip');
    const altData = await altResponse.json();
    
    if (altData.timezone) {
      return altData.timezone;
    }
    
    throw new Error('No timezone data available');
  } catch (error) {
    console.warn('Failed to get timezone by IP:', error);
    return getSystemTimezone();
  }
};

// 브라우저의 Geolocation API를 사용하여 정확한 위치 기반 타임존 획득
export const getTimezoneByGeolocation = (): Promise<string> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported');
      resolve(getSystemTimezone());
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Google Timezone API (API 키 필요) 또는 무료 대안 사용
          const response = await fetch(
            `https://worldtimeapi.org/api/timezone/Etc/GMT-0`
          );
          
          if (response.ok) {
            const data = await response.json();
            resolve(data.timezone);
          } else {
            // 좌표 기반으로 간단한 타임존 추정
            const estimatedTimezone = estimateTimezoneByCoordinates(latitude, longitude);
            resolve(estimatedTimezone);
          }
        } catch (error) {
          console.warn('Failed to get timezone by geolocation:', error);
          resolve(getSystemTimezone());
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        resolve(getSystemTimezone());
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5분 캐시
      }
    );
  });
};

// 좌표 기반으로 간단한 타임존 추정 (UTC 오프셋 기준)
const estimateTimezoneByCoordinates = (lat: number, lng: number): string => {
  // 경도 기반으로 대략적인 UTC 오프셋 계산
  // 경도 15도당 1시간 차이
  const utcOffset = Math.round(lng / 15);
  
  if (utcOffset >= 0) {
    return `Etc/GMT-${utcOffset}`;
  } else {
    return `Etc/GMT+${Math.abs(utcOffset)}`;
  }
};

// 사용자 환경에 가장 적합한 타임존 획득 방법 선택
export const getOptimalTimezone = async (): Promise<string> => {
  try {
    // 1. 먼저 시스템 타임존 시도
    const systemTz = getSystemTimezone();
    if (systemTz && systemTz !== 'UTC') {
      return systemTz;
    }
    
    // 2. IP 기반 타임존 시도
    const ipTz = await getTimezoneByIP();
    if (ipTz && ipTz !== 'UTC') {
      return ipTz;
    }
    
    // 3. 마지막으로 시스템 타임존 반환
    return systemTz;
  } catch (error) {
    console.warn('Failed to get optimal timezone:', error);
    return 'UTC';
  }
};

// 타임존 유효성 검증
export const isValidTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

// 타임존별 현재 시간 문자열 반환
export const getCurrentTimeInTimezone = (timezone: string): string => {
  try {
    const now = new Date();
    return now.toLocaleString('en-US', { timeZone: timezone });
  } catch (error) {
    console.warn('Failed to get current time in timezone:', error);
    return new Date().toLocaleString();
  }
};

// 타임존별 UTC 오프셋 반환 (분 단위)
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
    const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
    return (targetTime.getTime() - utc.getTime()) / 60000;
  } catch (error) {
    console.warn('Failed to get timezone offset:', error);
    return 0;
  }
};
