import { useEffect, useState, useMemo, useCallback } from "react"
import { VariableSizeList as List } from 'react-window'
import rpUesrIcon from '@assets/groupUserIcon.png'
import useFullName from "hooks/useFullName"
import { logoImageWithDefaultImage } from "Functions/GlobalFunctions"
import { SetStateType } from "Types/PropsTypes"
import GroupOpen from "./GroupOpen"
import { FormattedMessage } from "react-intl"

type PortalTypeViewProps = {
    datas: UserHierarchyDataType[]
    selected: UserHierarchyDataRpUserType['id'][]
    setSelected: SetStateType<UserHierarchyDataRpUserType['id'][]>
    height?: number
    loading: boolean
}

const getRpUserIds = (data: UserHierarchyDataType) => {
    return data.applications.flatMap(app => app.rpUsers.map(user => user.id))
}

// 트리 아이템의 높이를 계산하는 함수
const calculateItemHeight = (data: UserHierarchyDataType, opened: UserHierarchyDataType['id'][]) => {
    const baseHeight = 40; // 기본 아이템 높이
    const applicationHeight = 35; // 애플리케이션 높이
    const userHeight = 30; // 사용자 높이
    
    if (!opened.includes(data.id)) {
        return baseHeight;
    }
    
    let totalHeight = baseHeight;
    data.applications.forEach(app => {
        totalHeight += applicationHeight;
        totalHeight += app.rpUsers.length * userHeight;
    });
    
    return totalHeight;
}

// 평면화된 아이템 타입
type FlattenedItem = {
    type: 'portal' | 'application' | 'user'
    data: any
    level: number
    parentId?: string
    height: number
}

const PortalTypeView = ({ datas, selected, setSelected, height = 400, loading }: PortalTypeViewProps) => {
    const [opened, setOpened] = useState<UserHierarchyDataType['id'][]>([])
    const getFullName = useFullName();

    useEffect(() => {
        const temp = datas.map(d => d.id)
        setOpened(opened.filter(o => temp.includes(o)))
    }, [datas])

    // 트리 데이터를 평면화
    const flattenedItems = useMemo(() => {
        const items: FlattenedItem[] = [];
        
        datas.forEach(portal => {
            const portalHeight = calculateItemHeight(portal, opened);
            items.push({
                type: 'portal',
                data: portal,
                level: 0,
                height: portalHeight
            });
            
            if (opened.includes(portal.id)) {
                portal.applications.forEach(app => {
                    items.push({
                        type: 'application',
                        data: app,
                        level: 1,
                        parentId: portal.id,
                        height: 35
                    });
                    
                    app.rpUsers.forEach(user => {
                        items.push({
                            type: 'user',
                            data: user,
                            level: 2,
                            parentId: app.id,
                            height: 30
                        });
                    });
                });
            }
        });
        
        return items;
    }, [datas, opened]);

    const handlePortalClick = useCallback((portal: UserHierarchyDataType) => {
        const userIds = getRpUserIds(portal);
        if (userIds.every(id => selected.includes(id))) {
            setSelected(selected.filter(s => !userIds.includes(s)));
        } else {
            setSelected([...new Set(selected.concat(userIds))]);
        }
    }, [selected, setSelected]);

    const handleApplicationClick = useCallback((app: any) => {
        const userIds = app.rpUsers.flatMap((user: any) => user.id);
        if (userIds.every((id: string) => selected.includes(id))) {
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

    const handleToggleOpen = useCallback((portalId: string) => {
        if (opened.includes(portalId)) {
            setOpened(opened.filter(id => id !== portalId));
        } else {
            setOpened(opened.concat(portalId));
        }
    }, [opened, setOpened]);

    // 렌더 아이템 함수
    const renderItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = flattenedItems[index];
        
        if (!item) return null;

        switch (item.type) {
            case 'portal':
                const portal = item.data;
                const userIds = getRpUserIds(portal);
                const isPortalSelected = userIds.every(user => selected.includes(user));
                const isPortalOpened = opened.includes(portal.id);
                return (
                    <div style={style} className='custom-transfer-user-row'>
                        <div className='custom-transfer-user-row-title-container' data-selected={isPortalSelected}>
                            <div onClick={() => handlePortalClick(portal)}>
                                {getFullName(portal.name)}({portal.username})
                            </div>
                            <GroupOpen 
                                selected={isPortalSelected} 
                                opened={isPortalOpened} 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleOpen(portal.id);
                                }}
                            />
                        </div>
                    </div>
                );
                
            case 'application':
                const app = item.data;
                const appUserIds = app.rpUsers.flatMap((user: any) => user.id);
                const isAppSelected = appUserIds.every((id: string) => selected.includes(id));
                return (
                    <div style={{ ...style, paddingLeft: '20px' }} className='transfer-user-child-application-container' onClick={(e) => {
                        e.stopPropagation();
                        handleApplicationClick(app);
                    }}>
                        <div className='transfer-user-child-application-title' data-selected={isAppSelected}>
                            <img src={logoImageWithDefaultImage(app.logoImage)} />
                            <div>{app.name}</div>
                        </div>
                    </div>
                );
                
            case 'user':
                const user = item.data;
                const isUserSelected = selected.includes(user.id);
                return (
                    <div style={{ ...style, paddingLeft: '40px' }} className='transfer-user-child-rp-user-container' onClick={() => handleUserClick(user)}>
                        <div className='transfer-user-child-rp-user-title' data-selected={isUserSelected}>
                            <img src={rpUesrIcon} />
                            <div>
                                {user.username}({user.groupName ? user.groupName : <FormattedMessage id="NO_GROUP_SELECTED_LABEL"/>})
                            </div>
                        </div>
                    </div>
                );
                
            default:
                return null;
        }
    }, [flattenedItems, selected, opened]);

    // 아이템 크기 계산
    const getItemSize = useCallback((index: number) => {
        const item = flattenedItems[index];
        // return item ? item.height : 40;
        return 30;
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
                return item ? `${item.type}-${item.data.id}-${index}-${item.level}` : index;
            }}
        >
            {renderItem}
        </List>
    );
}

export default PortalTypeView