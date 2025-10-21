'use client';

import { LoginFormData, loginSchema } from '@/schemas/auth';
import { useAuthStore } from '@/stores/auth/auth-store';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { setLoading } = useAuthStore();
  const callbackUrl = useSearchParams().get("callbackUrl") || '/role-select';
  const t = useTranslations('LoginPage');


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: callbackUrl,
      });

      if (result?.ok) {
        router.push(callbackUrl);
      }

      if (result?.error) {
        setError('Invalid email or password');
      }
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setLoading(false);
    }
  };

  return (
    <Paper
      withBorder
      shadow="lg"
      p="xl"
      radius="lg"
      className="w-full"
      style={{ maxWidth: 420, margin: '0 auto' }}
     
    >
      <Stack gap="xl">
        <div style={{ textAlign: 'center' }}>
          {/* <SiteLogo width={140} height={35} /> */}
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background:
                'linear-gradient(135deg, var(--mantine-color-primary-3) 0%, var(--mantine-color-primary-4) 100%)',
              margin: '0 auto 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 125, 55, 0.2)',
            }}
          >
            <Text size="xl" fw={700} c="white">
              F
            </Text>
          </div>
          <Title order={2} c="neutral.9" mb="xs" fw={600}>
           {t('welcome')}
          </Title>
          <Text c="neutral.6" size="md">
            {t('instruction')}
          </Text>
        </div>

        {error && (
          <Alert
            color="error"
            variant="light"
            radius="md"
            style={{
              border: '1px solid var(--mantine-color-error-2)',
              backgroundColor: 'var(--mantine-color-error-0)',
            }}
          >
            <Group gap="sm">
              <ThemeIcon color="error" variant="light" size="md" radius="xl">
                <IconAlertCircle size={16} />
              </ThemeIcon>
              <Text size="sm" c="error.7" fw={500}>
                {error}
              </Text>
            </Group>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <Stack gap="lg" className="w-full">
            <div>
              <TextInput
                label={t('emailLabel')}
                placeholder={t('emailPlaceholder')}
                {...register('email')}
                error={errors.email?.message}
                radius="lg"
                size="lg"
                styles={{
                  input: {
                    border: '2px solid var(--mantine-color-neutral-2)',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-primary-3)',
                      boxShadow: '0 0 0 3px rgba(0, 125, 55, 0.1)',
                    },
                  },
                }}
              />
            </div>

            <div>
              <PasswordInput
                label={t('passwordLabel')}
                placeholder={t('passwordPlaceholder')}
                {...register('password')}
                error={errors.password?.message}
                radius="lg"
                size="lg"
                styles={{
                  input: {
                    border: '2px solid var(--mantine-color-neutral-2)',
                    '&:focus': {
                      borderColor: 'var(--mantine-color-primary-3)',
                      boxShadow: '0 0 0 3px rgba(0, 125, 55, 0.1)',
                    },
                  },
                }}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              color="primary"
              size="lg"
              radius="lg"
              mt="md"
              fw={600}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </Stack>
        </form>
      </Stack>
    </Paper>
  );
}
