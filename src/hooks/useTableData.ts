import { useState, useCallback } from 'react';
import { SetStateType } from 'Types/PropsTypes';

interface UseTableDataOptions<T> {
  apiFunction: (params: GeneralParamsType, callback: (data: GetListDataGeneralType<T>) => void) => Promise<void>;
  additionalParams?: (params: CustomTableSearchParams) => Partial<GeneralParamsType>;
}

interface UseTableDataReturn<T> {
  tableData: T[];
  totalCount: number;
  dataLoading: boolean;
  getDatas: (params: CustomTableSearchParams) => Promise<void>;
  setTableData: SetStateType<T[]>;
  setTotalCount: SetStateType<number>;
  setDataLoading: SetStateType<boolean>;
}

/**
 * 테이블 데이터 페칭을 위한 공통 훅
 * @param options - API 함수와 추가 파라미터 함수를 포함한 옵션
 * @returns 테이블 데이터, 로딩 상태, 페칭 함수 등을 포함한 객체
 */
const useTableData = <T>({ 
  apiFunction, 
  additionalParams 
}: UseTableDataOptions<T>): UseTableDataReturn<T> => {
  const [tableData, setTableData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState<boolean>(true);

  const getDatas = useCallback(async (params: CustomTableSearchParams) => {
    setDataLoading(true);
    
    const _params: GeneralParamsType = {
      pageSize: params.size,
      page: params.page
    };

    // 검색 타입과 값 처리
    if (params.searchType) {
      _params[params.searchType] = params.searchValue;
    }

    // 필터 옵션 처리
    if (params.filterOptions) {
      params.filterOptions.forEach(filter => {
        _params[filter.key] = filter.value;
      });
    }

    // 정렬 파라미터 처리
    if (params.sortKey) {
      _params.sortBy = params.sortKey;
    }
    if (params.sortDirection) {
      _params.sortDirection = params.sortDirection as DirectionType;
    }

    // 추가 파라미터 처리
    if (additionalParams) {
      const extraParams = additionalParams(params);
      Object.assign(_params, extraParams);
    }
    
    try {
      await apiFunction(_params, ({ results, totalCount }) => {
        setTableData(results);
        setTotalCount(totalCount);
      });
    } finally {
      setDataLoading(false);
    }
  }, [apiFunction, additionalParams]);

  return {
    tableData,
    totalCount,
    dataLoading,
    getDatas,
    setTableData,
    setTotalCount,
    setDataLoading
  };
};

export default useTableData;
