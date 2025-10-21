'use client';

export const dynamic = 'force-dynamic';
import { Badge, Button, Card, Container, Grid, Group, Text, Title } from '@mantine/core';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8">
      <Container size="xl">
        <div className="text-center mb-12">
          <Title order={1} className="text-4xl font-bold text-gray-800 mb-4">
            FixItFast Frontend
          </Title>
          <Text size="lg" c="dimmed" className="max-w-2xl mx-auto">
            A modern Next.js application with Tailwind CSS v4, Mantine UI, React Query, 
            NextAuth, Zustand, and Yup validation - all working together seamlessly.
          </Text>
        </div>

        <Grid gutter="lg" className="mb-8">
          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Tailwind CSS v4</Text>
                <Badge color="cyan" variant="light">CSS-First</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Modern utility-first CSS framework with CSS-first configuration approach.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Utility Classes
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Responsive
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  @theme Directive
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Mantine UI</Text>
                <Badge color="blue" variant="light">Components</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Rich set of accessible React components with excellent TypeScript support.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Accessible
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  TypeScript
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Theming
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>React Query</Text>
                <Badge color="orange" variant="light">Data Fetching</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Powerful data synchronization for React with caching and background updates.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Caching
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Mutations
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  DevTools
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>NextAuth.js</Text>
                <Badge color="green" variant="light">Authentication</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Complete authentication solution with multiple providers and JWT support.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  OAuth
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  JWT
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Secure
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Zustand</Text>
                <Badge color="violet" variant="light">State Management</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Lightweight state management with TypeScript support and persistence.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Lightweight
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Persist
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Simple
                </div>
              </div>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" radius="md" p="lg" h="100%">
              <Group justify="space-between" mb="xs">
                <Text fw={500}>Yup Validation</Text>
                <Badge color="red" variant="light">Validation</Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                Schema validation with excellent TypeScript integration and error handling.
              </Text>
              <div className="flex gap-2 flex-wrap">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                  Schema
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  TypeScript
                </div>
                <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  Async
                </div>
              </div>
            </Card>
          </Grid.Col>
        </Grid>

        <Card withBorder shadow="sm" radius="md" p="lg" mt="xl" className="text-center">
          <Title order={3} mb="md">
            🚀 Ready to Build!
          </Title>
          <Text c="dimmed" mb="md">
            Your development environment is fully configured with all the modern tools you need.
          </Text>
          <Group justify="center">
            <Button
              component="a"
              href="https://nextjs.org/docs"
              target="_blank"
              variant="filled"
              color="primary"
            >
              Next.js Docs
            </Button>
            <Button
              component="a"
              href="https://mantine.dev"
              target="_blank"
              variant="filled"
              color="primary"
            >
              Mantine Docs
            </Button>
            <Button
              component="a"
              href="https://tailwindcss.com/docs"
              target="_blank"
              variant="filled"
              color="primary"
            >
              Tailwind Docs
            </Button>
          </Group>
        </Card>
      </Container>
    </div>
  );
}
