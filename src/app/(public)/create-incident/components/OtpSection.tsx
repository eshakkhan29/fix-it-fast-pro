import { Button, Group, PinInput, Stack, Text } from '@mantine/core'
import React from 'react'

interface OtpSectionProps {
  handleOtpSubmit: () => void;
}

const OtpSection = ({ handleOtpSubmit }: OtpSectionProps) => {
  return (
    <Stack px={10}>
      <Text c="white" fw={500} fz={18}>
        Please enter your OTP
      </Text>
      <Text c="white">{`(An OTP has been sent to your email)`}</Text>
      <Group justify="center">
        <PinInput
        mb={10}
          radius="lg"
          size="lg"
          length={5}
          placeholder=""
          type="number"
        />
      </Group>
      {/* <Divider /> */}
      <Group justify='end'>
        <Button variant='outline' c='white' className=' !border-2 !border-[#00A64C]' size='lg' >Cancel</Button>
        <Button variant='default' size='lg' onClick={handleOtpSubmit}>Next</Button>
      </Group>
    </Stack>
  );
}

export default OtpSection