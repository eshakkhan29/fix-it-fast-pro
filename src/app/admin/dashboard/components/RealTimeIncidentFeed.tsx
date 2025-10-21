'use client'
import { WidgetWrapper } from '@/components/widget-wrapper'
import { Button, ScrollArea, Stack } from '@mantine/core'
import React from 'react'
import { useGetFollowUpsListByFilters } from '../../hooks/useGetFollowUpListByFilters'
import { useAccountIdStore } from '@/stores/user/accountId-store'
import { useSession } from 'next-auth/react'
import Cookies from 'js-cookie'
import { getFollowUpDefaultDates } from '@/utils/gerFollowUpDefaultDates'
import RequestFeedCardNew from './RequestFeedCardNew'
import RealTimeSkeleton from './RealTimeSkeleton'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

const RealTimeIncidentFeed = () => {
  const { userAccountId } = useAccountIdStore();
  const pathname = usePathname()
  const session: any = useSession();
  const roleId = Cookies.get('fifRoleId');
  const t = useTranslations('Dashboard')

  const isAdmin = pathname.startsWith('/admin');
  const isEvaluator = pathname.startsWith('/evaluator');


  const defaultDates = getFollowUpDefaultDates();


  const params = {
    AccountId: Number(userAccountId),
    UserId: session?.data?.user?.id || '',
    RoleId: Number(roleId),
    PageNumber: 1,
    PageSize: 5,
    Sorted: true,
    CreatedDateFrom: defaultDates.from,
    CreatedDateTo: defaultDates.to,
    LocationNodeLevelType: '',
  };
  const { data: followUpsList, isLoading, refetch } = useGetFollowUpsListByFilters(params, {
    enabled: true
  });



  return (
    <WidgetWrapper title={t('widgetTitles.realTimeIncidentFeed')} bg='#FAFAFA'
      primaryActionSection={
        <Button component={Link} href={`/${isAdmin ? "admin" : isEvaluator ? "evaluator" : "operator"}/incident-management`} variant='outline'>{t('actions.seeMore')}</Button>
      }
    >

      <ScrollArea h={250}>
        {
          isLoading ?
            <RealTimeSkeleton />
            : <Stack p={{base:5, md:25}}>
              {followUpsList?.data?.map((followUpData) => (
                <RequestFeedCardNew
                role={isAdmin ? "admin" : isEvaluator ? "evaluator" : "operator"}
                  key={followUpData?.FollowupId}
                  followUp={followUpData}
                  isChecked={false}
                  onCheckboxChange={() => { }}
                  refetch={refetch}
                  path={`/${isAdmin ? "admin" : isEvaluator ? "evaluator" : "operator"}/incident-management/${followUpData?.FollowupId}`}
                />
              ))}
            </Stack>
        }
      </ScrollArea>


    </WidgetWrapper>
  )
}

export default RealTimeIncidentFeed