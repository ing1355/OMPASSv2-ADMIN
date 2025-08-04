import { useEffect, useState, useMemo, useCallback } from "react"
import { VariableSizeList as List } from 'react-window'
import rpUesrIcon from '@assets/groupUserIcon.png'
import useFullName from "hooks/useFullName"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"
import GroupOpen from "./GroupOpen"
import { FormattedMessage } from "react-intl"

type ApplicationTypeViewProps = {
    datas: UserHierarchyDataApplicationViewDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
    height?: number
    loading: boolean
}

// 트리 아이템의 높이를 계산하는 함수
const calculateItemHeight = (data: UserHierarchyDataApplicationViewDataType, opened: UserHierarchyDataApplicationViewDataType['id'][]) => {
    const baseHeight = 40; // 기본 아이템 높이
    const userHeight = 30; // 사용자 높이
    
    if (!opened.includes(data.id)) {
        return baseHeight;
    }
    
    return baseHeight + (data.rpUsers.length * userHeight);
}

// 평면화된 아이템 타입
type FlattenedItem = {
    type: 'application' | 'user'
    data: UserHierarchyDataApplicationViewDataType | UserHierarchyDataApplicationViewRpUserType
    level: number
    parentId?: string
    height: number
}

const ApplicationTypeView = ({ datas, selected, setSelected, height = 400, loading }: ApplicationTypeViewProps) => {
    const [opened, setOpened] = useState<UserHierarchyDataType['id'][]>([])
    const getFullName = useFullName();

    useEffect(() => {
        const temp = datas.map(d => d.id)
        setOpened(opened.filter(o => temp.includes(o)))
    }, [datas])

    // 트리 데이터를 평면화
    const flattenedItems = useMemo(() => {
        const items: FlattenedItem[] = [];
        
        datas.forEach(app => {
            const appHeight = calculateItemHeight(app, opened);
            items.push({
                type: 'application',
                data: app,
                level: 0,
                height: appHeight
            });
            
            if (opened.includes(app.id)) {
                app.rpUsers.forEach(user => {
                    items.push({
                        type: 'user',
                        data: user,
                        level: 1,
                        parentId: app.id,
                        height: 30
                    });
                });
            }
        });
        
        return items;
    }, [datas, opened]);

    const handleApplicationClick = useCallback((app: UserHierarchyDataApplicationViewDataType) => {
        const userIds = app.rpUsers.map(user => user.id);
        if (userIds.every(id => selected.includes(id))) {
            setSelected(selected.filter(s => !userIds.includes(s)));
        } else {
            setSelected([...new Set(selected.concat(userIds))]);
        }
    }, [selected, setSelected]);

    const handleUserClick = useCallback((user: any) => {
        if (selected.includes(user.id)) {
            setSelected(selected.filter(tUser => tUser !== user.id));
        } else {
            setSelected(selected.concat(user.id));
        }
    }, [selected, setSelected]);

    const handleToggleOpen = useCallback((appId: string) => {
        if (opened.includes(appId)) {
            setOpened(opened.filter(id => id !== appId));
        } else {
            setOpened(opened.concat(appId));
        }
    }, [opened, setOpened]);

    // 렌더 아이템 함수
    const renderItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = flattenedItems[index];
        
        if (!item) return null;
        
        switch (item.type) {
            case 'application':
                const app = item.data as UserHierarchyDataApplicationViewDataType;
                const isAppSelected = app.rpUsers.every((users: any) => selected.includes(users.id));
                const isAppOpened = opened.includes(app.id);
                return (
                    <div style={style} className='custom-transfer-user-row'>
                        <div className='custom-transfer-user-row-title-container'>
                            <div className="custom-transfer-user-row-title-application-container" data-selected={isAppSelected} onClick={() => handleApplicationClick(app)}>
                                <div>
                                    <img src={logoImageWithDefaultImage(app.logoImage)} />
                                </div>
                                <div>
                                    {app.name}<span className="custom-transfer-application-rp-user-count">({app.rpUsers.length})</span>
                                </div>
                            </div>
                            <GroupOpen selected={isAppSelected} opened={isAppOpened} onClick={e => {
                                e.stopPropagation();
                                handleToggleOpen(app.id);
                            }}/>
                        </div>
                    </div>
                );
                
            case 'user':
                const user = item.data as UserHierarchyDataApplicationViewRpUserType;
                const isUserSelected = selected.includes(user.id);
                return (
                    <div style={{ ...style, paddingLeft: '20px' }} className='transfer-user-child-application-container' onClick={(e) => {
                        e.stopPropagation();
                        handleUserClick(user);
                    }}>
                        <div className='transfer-user-child-application-title application' data-selected={isUserSelected}>
                            <img src={rpUesrIcon} />
                            <div>
                                {user.portalUsername}({getFullName(user.portalName)}) - {user.username}({user.groupName ? user.groupName : <FormattedMessage id="NO_GROUP_SELECTED_LABEL"/>})
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    }, [flattenedItems, selected, opened, getFullName, handleApplicationClick, handleUserClick, handleToggleOpen]);

    // 아이템 크기 계산
    const getItemSize = useCallback((index: number) => {
        const item = flattenedItems[index];
        return item ? item.height : 40;
    }, [flattenedItems]);

    if (flattenedItems.length === 0) {
        return <div className="custom-transfer-user-list-empty-container">{loading ? <FormattedMessage id="CUSTOM_TRANSFER_USER_LOADING_LABEL"/> : <FormattedMessage id="NO_DATA_AVAILABLE_LABEL"/>}</div>;
    }

    return (
        <List
            height={height}
            itemCount={flattenedItems.length}
            itemSize={getItemSize}
            width="100%"
            overscanCount={5}
            itemKey={(index) => {
                const item = flattenedItems[index];
                return item ? `${item.type}-${item.data.id}` : index;
            }}
        >
            {renderItem}
        </List>
    );
}

export default ApplicationTypeView