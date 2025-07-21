import { Pagination } from "antd"
import { useEffect, useRef } from "react"

type CustomTablePaginationProps = {
    pageNum: number
    tableSize: number
    totalCount: number
    onChangePage: (page: number, size: number) => void
}

const CustomTablePagination = ({ pageNum, tableSize, totalCount, onChangePage }: CustomTablePaginationProps) => {
    const alreadyReadonly = useRef(false)

    useEffect(() => {
        const logPaginationStructure = () => {
            const paginationContainer = document.querySelector('.custom-pagination');

            if (paginationContainer) {
                // 페이지 크기 선택기 input에 readonly 설정
                const sizeChangerInputs = paginationContainer.querySelectorAll('.ant-select-selection-search-input');

                if (sizeChangerInputs[0]) {
                    sizeChangerInputs[0].setAttribute('readonly', 'true');
                }

                // Quick Jumper input에 숫자만 입력 가능하도록 설정
                const quickJumperInputs = paginationContainer.querySelectorAll('.ant-pagination-options-quick-jumper input');

                if (quickJumperInputs[0]) {
                    const input = quickJumperInputs[0] as HTMLInputElement;
                    
                    // 숫자만 입력 가능하도록 onKeyDown 이벤트 추가
                    input.addEventListener('keydown', (e) => {
                        // 숫자 키 (0-9), 백스페이스, 삭제, 화살표 키, 탭 키만 허용
                        const allowedKeys = [
                            'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
                            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
                        ];
                        
                        if (!allowedKeys.includes(e.key)) {
                            e.preventDefault();
                        }
                    });

                    // 입력값이 숫자가 아닌 경우 제거
                    input.addEventListener('input', (e) => {
                        const target = e.target as HTMLInputElement;
                        target.value = target.value.replace(/[^0-9]/g, '');
                    });

                    // 붙여넣기 시에도 숫자만 허용
                    input.addEventListener('paste', (e) => {
                        e.preventDefault();
                        const clipboardData = e.clipboardData || (window as any).clipboardData;
                        const pastedText = clipboardData.getData('text');
                        const numericText = pastedText.replace(/[^0-9]/g, '');
                        if (numericText) {
                            input.value = numericText;
                        }
                    });
                }
            }
        };

        // MutationObserver를 사용하여 동적으로 생성되는 input에도 적용
        const observer = new MutationObserver((mutations) => {
            if (!alreadyReadonly.current) {
                logPaginationStructure()
                alreadyReadonly.current = true
            }
        });

        // Pagination 컨테이너를 관찰
        const paginationContainer = document.querySelector('.custom-pagination');
        if (paginationContainer) {
            observer.observe(paginationContainer, {
                childList: true,
                subtree: true
            });
        }

        // cleanup 함수
        return () => {
            observer.disconnect();
        };
    }, [])

    return <Pagination showQuickJumper showSizeChanger current={pageNum} pageSize={tableSize} total={totalCount || 1} onChange={onChangePage} className="custom-pagination" />
}

export default CustomTablePagination