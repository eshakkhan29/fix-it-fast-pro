import { useAccountIdStore } from '@/stores/user/accountId-store';
import { Text } from '@mantine/core';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

function LocationPreview({ form }: { form: any }) {
    const searchParams = useSearchParams();
    const { userAccountId: accountId, setUserAccountId } = useAccountIdStore();
    const nowAccountId = searchParams.get('accountId');

    useEffect(() => {
        if (nowAccountId) setUserAccountId(Number(nowAccountId.trim()));
        if (accountId) form.setFieldValue('accountId', accountId);
    }, [nowAccountId, setUserAccountId, accountId]);

    const segments = [
        form?.values?.roomId && `${form?.values?.roomName}`,
        form?.values?.areaId && `${form?.values?.areaName}`,
        form?.values?.floorId && `${form?.values?.floorName}`,
        form?.values?.buildingId && `${form?.values?.buildingName}`,
        form?.values?.campusId && `${form?.values?.campusName}`,
    ].filter(Boolean) as string[];

    return (
        <div className="flex flex-wrap gap-2 text-xs">
            {segments?.length ? (
                <>
                    <Text span className="font-bold whitespace-nowrap text-neutral-800">
                        {segments[0]},
                    </Text>
                    {segments.slice(1).map((segment, index) => (
                        <Text span key={index} c="dimmed" className="whitespace-nowrap">
                            {segment}{index !== segments.length - 2 ? ',' : ''}
                        </Text>
                    ))}
                </>
            ) : null}
        </div>
    )
}

export default LocationPreview