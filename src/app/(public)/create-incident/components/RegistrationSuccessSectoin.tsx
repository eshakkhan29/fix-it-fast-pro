import { Group, Image, Text } from '@mantine/core'
import React from 'react'

const RegistrationSuccessSectoin = () => {
  return (
   <>
                  <Text c="white" fw={500} fz={18}>
                   You have been successfully Registered
                  </Text>
                  <Text c="white" >
                   You can now see your scan history on dashboard. Check your email to get further instruction
                  </Text>
                  <Group justify='center'>
                      <Image src="/registrationSuccessLogo.png" alt="success" w={215} />
                  </Group>
                 
                 
                  
                  </>
  )
}

export default RegistrationSuccessSectoin