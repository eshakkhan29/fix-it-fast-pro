import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'primary',
  primaryShade: 3,
  colors: {
    primary: [
      '#08FF78',
      '#00D261', 
      '#00A64C',
      '#007D37',
      '#005624',
      '#003212',
      '#001505',
      '#001505',
      '#001505',
      '#001505'
    ],
    secondary: [
      '#E1D9FF',
      '#BEAAFF',
      '#9E78FF', 
      '#813AFF',
      '#5E00CC',
      '#37007D',
      '#18003F',
      '#18003F',
      '#18003F',
      '#18003F'
    ],
    success: [
      '#EFFEFA',
      '#DDF2EE',
      '#9DE0D3',
      '#40C4AA',
      '#287F6E',
      '#174E43',
      '#174E43',
      '#174E43',
      '#174E43',
      '#174E43'
    ],
    warning: [
      '#FFF6E0',
      '#F9ECCB',
      '#FBD982',
      '#FFBD4C',
      '#956321',
      '#5B3D1E',
      '#5B3D1E',
      '#5B3D1E',
      '#5B3D1E',
      '#5B3D1E'
    ],
    error: [
      '#FFF0F3',
      '#FADBE1',
      '#ED8296',
      '#DF1C41',
      '#95122B',
      '#710E21',
      '#710E21',
      '#710E21',
      '#710E21',
      '#710E21'
    ],
    neutral: [
      '#FFFFFF',
      '#F8F9FB',
      '#EEEFF2',
      '#DFE1E6',
      '#C1C7CF',
      '#A4ABB8',
      '#808897',
      '#666D80',
      '#353849',
      '#272835'
    ]
  },
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  fontFamilyMonospace: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
  headings: {
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    fontWeight: '600',
  },
  radius: {
    xs: '4px',
    sm: '6px', 
    md: '8px',
    lg: '12px',
    xl: '16px',
  },
  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
        variant: 'filled',
      },
      styles: {
        root: {
          fontWeight: 500,
        },
        // Ensure primary filled buttons use shade-3 by default and shade-5 when loading
        // Mantine attaches data attributes for variant, color and loading states
        // We scope styles here so they participate in theming (no global CSS hacks)
        ['&[data-variant="filled"][data-color="primary"]']: {
          background: 'var(--mantine-color-primary-3)',
          '&:hover,&:active': {
            background: 'var(--mantine-color-primary-3)',
          },
        },
        ['&[data-variant="filled"][data-color="primary"][data-loading]']: {
          background: 'var(--mantine-color-primary-5)',
        },

        // Secondary: default = secondary-5 (#37007D), pressed = secondary-3 (#813AFF), loading = secondary-5
        ['&[data-variant="filled"][data-color="secondary"]']: {
          background: 'var(--mantine-color-secondary-5)',
          '&:hover,&:active': {
            background: 'var(--mantine-color-secondary-3)',
          },
        },
        ['&[data-variant="filled"][data-color="secondary"][data-loading]']: {
          background: 'var(--mantine-color-secondary-5)',
        },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Select: {
      defaultProps: {
        radius: 'lg',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'lg',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'lg',
      },
    },
    Card: {
      defaultProps: {
        radius: 'md',
        shadow: 'sm',
      },
    },
    Modal: {
      defaultProps: {
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        radius: 'md',
        shadow: 'xs',
      },
    },
    Notification: {
      defaultProps: {
        radius: 'md',
      },
    },
    Alert: {
      defaultProps: {
        radius: 'md',
      },
    },
    Badge: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Chip: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Switch: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Checkbox: {
      defaultProps: {
        radius: 'xs',
      },
    },
    Radio: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Slider: {
      defaultProps: {
        radius: 'xl',
      },
    },
    Progress: {
      defaultProps: {
        radius: 'xl',
      },
      styles: {
        root: {
          backgroundColor: 'var(--mantine-color-neutral-2)',
        },
        section: {
          // Ensure progress bars use darker shades for better visibility
          '&[data-progress-color="success"]': {
            backgroundColor: 'var(--mantine-color-success-4) !important',
          },
          '&[data-progress-color="primary"]': {
            backgroundColor: 'var(--mantine-color-primary-3) !important',
          },
          '&[data-progress-color="warning"]': {
            backgroundColor: 'var(--mantine-color-warning-3) !important',
          },
          '&[data-progress-color="error"]': {
            backgroundColor: 'var(--mantine-color-error-3) !important',
          },
        },
      },
    },
    Skeleton: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Tabs: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Accordion: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Menu: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Popover: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Tooltip: {
      defaultProps: {
        radius: 'sm',
      },
    },
    Drawer: {
      defaultProps: {
        radius: 'md',
      },
    },
    Navbar: {
      defaultProps: {
        radius: 0,
      },
    },
    Header: {
      defaultProps: {
        radius: 0,
      },
    },
    Footer: {
      defaultProps: {
        radius: 0,
      },
    },
    AppShell: {
      defaultProps: {
        radius: 0,
      },
    },
  },
});
