import { Button, Group, PasswordInput, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useUserRoleCheck } from '../hook/useUserRoleCheck';

interface UserRegisterSectionProps {
  form: any;
}

const UserRegisterSection = ({ form }: UserRegisterSectionProps) => {
  const [loading, setLoading] = useState(false);
  const { createNewInitiator, setAccountCreateSuccess, sendInvitation } = useUserRoleCheck();

  // handle user create
  const handleUserCreate = async () => {
    setLoading(true);
    const res = await createNewInitiator({
      email: form.values.email,
      password: form.values.password,
      confirmPassword: form.values.confirmPassword,
      firstName: form.values.firstName,
      lastName: form.values.lastName,
      phoneNumber: form.values.phoneNumber,
    });
    setLoading(false);
    if (res?.success) {
      const userId = res?.data?.split('=')[1]?.trim();
      setAccountCreateSuccess(true);
      await sendInvitation({ email: form?.values?.email, userId: userId })
      form.setFieldValue('initiatorId', userId);
    } else {
      setAccountCreateSuccess(false);
    }
  };

  return (
    <>
      <TextInput
        label="Email"
        placeholder="email@example.com"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('email')}
      />
      <TextInput
        label="First Name"
        placeholder="Your First Name"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('firstName')}
      />
      <TextInput
        label="Last Name"
        placeholder="Your Last Name"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('lastName')}
      />

      <TextInput
        label="Phone Number"
        placeholder="Your Phone Number"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('phoneNumber')}
      />

      <PasswordInput
        label="Password"
        placeholder="Your Password"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('password')}
        error={form.errors.password}
        errorProps={{ color: "white", c: "white" }}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm Your Password"
        size="lg"
        styles={{
          label: { color: 'white', fontSize: '16px' },
        }}
        {...form.getInputProps('confirmPassword')}
        error={form.errors.confirmPassword}
        errorProps={{ color: "white", c: "white" }}
      />
      <Group justify="end">
        <Button
          loading={loading}
          disabled={loading}
          type="button"
          miw={120}
          variant="default"
          onClick={handleUserCreate}
        >
          Create User & Submit
        </Button>
      </Group>
    </>
  );
};

export default UserRegisterSection;
