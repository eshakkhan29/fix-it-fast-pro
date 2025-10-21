'use client';
import {
  Card,
  Divider,
  Radio,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import RegistrationSuccessSectoin from './RegistrationSuccessSectoin';
import UserRegisterSection from './UserRegisterSection';
import { useUserRoleCheck } from '../hook/useUserRoleCheck';
import { useSession } from 'next-auth/react';

interface GetNotificationSectionProps {
  form: any;
}

const GetNotificationSection = ({ form }: GetNotificationSectionProps) => {
  const {
    getUserByEmail,
    wishToBecome,
    setWishToBecome,
    userExist,
    setUserExist,
    accountCreateSuccess,
    userDetails,
    userAssignToAssignment
  } = useUserRoleCheck();
  const [getNotified, setGetNotified] = useState(false);
  const session: any = useSession();

  // handle notification preference via radio (yes/no)
  const handleNotifyRadio = (value: string) => {
    const notify = value === 'yes';
    setGetNotified(notify);
    form.setFieldValue(
      'walshUserStatus',
      notify ? 'send-notification' : 'no-notification'
    );
  };

  // check user by email
  useEffect(() => {
    const checkUser = async () => {
      const user = await getUserByEmail(form.values.email);
      if (user?.Id) {
        form.setFieldValue('initiatorId', user?.UserId);
        setUserExist(true);
      } else {
        form.setFieldValue('initiatorId', session?.data?.user?.id || '');
        setUserExist(false);
      }
    };

    let timeout: NodeJS.Timeout | null = null;

    if (form.values.email && wishToBecome === null) {
      // email validation with regex
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (emailRegex.test(form.values.email)) {
        // use debounce to check user after 500ms with clear timeout
        timeout = setTimeout(() => {
          checkUser();
        }, 500);
      }
    }

    // Return cleanup function for all code paths
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [form.values.email]);

  // assign user to assignment
  useEffect(() => {
    const assignUserInAssignment = async () => {
      await userAssignToAssignment(form?.values?.assignmentId, userDetails?.Id)
    }
    if (userDetails) assignUserInAssignment()

  }, [userDetails])


  return (
    <>
      <Stack px={14}>
        <Radio.Group
          label="Do you want to be notified?"
          value={getNotified ? 'yes' : 'no'}
          onChange={handleNotifyRadio}
          name="getNotified"
        >
          <Stack mt="xs" gap="xs">
            <Radio value="yes" label="Yes" />
            <Radio value="no" label="No" />
          </Stack>
        </Radio.Group>
      </Stack>
      {getNotified && <Divider />}
      {getNotified && (
        <Stack px={14}>
          <Card withBorder bg="primary" p={0} radius="lg">
            <Stack gap={5}>
              {userExist !== false && (
                <Text px={10} py={5} fw={500} fz={20} c="white">
                  Please Enter your Email
                </Text>
              )}
              <Divider />
              <Stack px={10} py={5} mb={15}>
                {accountCreateSuccess ? (
                  <RegistrationSuccessSectoin />
                ) : (
                  <>
                    {userExist !== false && (
                      <TextInput
                        label="Email"
                        placeholder="email@example.com"
                        size="lg"
                        styles={{
                          label: {
                            color: 'white',
                            fontSize: '16px',
                            marginBottom: 10,
                          },
                        }}
                        {...form.getInputProps('email')}
                      />
                    )}

                    {userExist === false && (
                      <Stack>
                        <Text c="white" fw={500} fz={18}>
                          Do you wish to become a registered Walsh user?
                        </Text>
                        <Radio.Group
                          value={wishToBecome ?? ''}
                          onChange={(value) => {
                            setWishToBecome(value);
                            form.setFieldValue('wishToBecome', value);
                          }}
                          name="wishToBecome"
                        >
                          <Stack mt="xs" gap="xs">
                            <div
                              onClick={() => {
                                setWishToBecome('yes');
                                form.setFieldValue('wishToBecome', 'yes');
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <Radio
                                value="yes"
                                label="Yes"
                                styles={{
                                  root: {
                                    cursor: 'pointer',
                                    background: '#F8F9FB',
                                    borderRadius: 6,
                                    padding: 15,
                                  },
                                  label: {
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                  },
                                }}
                              />
                            </div>
                            <div
                              onClick={() => {
                                setWishToBecome('no');
                                form.setFieldValue('wishToBecome', 'no');
                              }}
                              style={{ cursor: 'pointer' }}
                            >
                              <Radio
                                value="no"
                                label="No"
                                styles={{
                                  root: {
                                    cursor: 'pointer',
                                    background: '#F8F9FB',
                                    borderRadius: 6,
                                    padding: 15,
                                  },
                                  label: {
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                  },
                                }}
                              />
                            </div>
                          </Stack>
                        </Radio.Group>
                        {wishToBecome === 'yes' && (
                          <Stack>
                            <UserRegisterSection form={form} />
                          </Stack>
                        )}
                        {wishToBecome === 'no' && null}
                      </Stack>
                    )}
                  </>
                )}
              </Stack>
            </Stack>
          </Card>
        </Stack>
      )}
    </>
  );
};

export default GetNotificationSection;
