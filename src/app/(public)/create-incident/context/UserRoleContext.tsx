'use client';
import React, { createContext, useContext, useState } from 'react';
import { useAccountIdStore } from '@/stores/user/accountId-store';
import { getData } from '../action/getData';
import { useSession } from 'next-auth/react';
import { createInitiatorRole } from '../action/createInitiatorRole';
import { createInitiator } from '../action/createInitiator';
import { sendInvitationToUser } from '../action/sendInvitationToUser';
import { assignInAssignment } from '../action/assignInAssignment';
import { getApiData } from '@/lib/getApiData';
import { sendNotification } from '../action/sendNotification';

type UserRoleContextType = {
  getUserByEmail: (email: string) => Promise<any | null>;
  createNewInitiator: (data: any) => Promise<any>;
  checkUserRole: (userId?: string, rootUser?: boolean) => Promise<boolean>;
  isInitiator: boolean | null;
  wishToBecome: string | null;
  setWishToBecome: (v: string | null) => void;
  userExist: boolean | null;
  setUserExist: (v: boolean | null) => void;
  accountCreateSuccess: boolean | null;
  setAccountCreateSuccess: (v: boolean | null) => void;
  sendInvitation: (data: any) => Promise<any>
  invitationSuccess: boolean | null;
  userDetails: null | any
  userAssignToAssignment: (assignmentId: string, userId: string) => Promise<any>
  sendEmailNotification: (data: {
    assignmentId: string,
    location: string,
    toEmail: string,
    url: string,
    inspectionId: string,
    followupId: string,
    status: string,
    createdByUserId: string,
  }) => Promise<any>
  getInspectionDetails: (inspectionId: string) => Promise<any | null>

};

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const { userAccountId, initializeAccountId } = useAccountIdStore();
  const [wishToBecome, setWishToBecome] = useState<string | null>(null);
  const [userExist, setUserExist] = useState<boolean | null>(null);
  const [isInitiator, setIsInitiator] = useState<boolean | null>(null);
  const [invitationSuccess, setInvitationSuccess] = useState<boolean | null>(null);
  const [userDetails, setUserDetails] = useState<null | any>(null)
  const [accountCreateSuccess, setAccountCreateSuccess] = useState<
    boolean | null
  >(null);
  const session: any = useSession();

  // send email to user 
  const sendEmailNotification = async ({
    assignmentId,
    location,
    toEmail,
    url,
    inspectionId,
    followupId,
    status,
    createdByUserId,
  }: {
    assignmentId: string,
    location: string,
    toEmail: string,
    url: string,
    inspectionId: string,
    followupId: string,
    status: string,
    createdByUserId: string,
  }) => {
    const res = await sendNotification({
      accountId: userAccountId,
      assignmentId: assignmentId,
      location: location,
      toEmail: toEmail,
      ccEmail: "",
      url: url,
      inspectionId: inspectionId,
      followupId: followupId,
      status: status,
      createdByUserId: createdByUserId,
      modifiedByUserId: "",
      modifiedByUserName: "",
    })
    return res
  }

  // get inspection details
  const getInspectionDetails = async (inspectionId: string) => {
    const res = await getApiData(`/Inspections/${inspectionId}`)
    if (res?.Id) {
      return res
    }
  }

  // user assign to assignment
  const userAssignToAssignment = async (assignmentId: string, userId: string) => {
    await assignInAssignment({
      assignmentId: assignmentId,
      userId: userId
    })
  }

  // get user details 
  const getUserDetails = async (userId: string) => {
    const res = await getApiData(`/UserAccount/GetByUserId?userId=${userId}`)
    if (res?.Id) {
      setUserDetails(res)
    }
  }

  // invitation email to new user 
  const sendInvitation = async (data: any) => {
    await sendInvitationToUser({
      userId: data?.userId,
      email: data?.email,
      accountId: Number(userAccountId),
    })
    setInvitationSuccess(true)
  }

  // create new initiator
  const createNewInitiator = async (data: any) => {
    const res = await createInitiator({
      accountId: Number(userAccountId),
      email: data?.email,
      password: data?.password,
      confirmPassword: data?.confirmPassword,
      firstName: data?.firstName,
      lastName: data?.lastName,
      phoneNumber: data?.phoneNumber,
    });
    if (res.success) {
      const userId = res?.data?.split('=')[1]?.trim();
      await getUserDetails(userId)
      return res;
    } else {
      return res
    }
  };

  // make initiator role for this user
  const createRole = async (userId: string) => {
    const res = await createInitiatorRole({
      accountId: Number(userAccountId),
      userId: userId || '',
      roleId: 7,
    });
    if (res?.success) {
      await getUserDetails(userId)
      setIsInitiator(true);
    } else {
      setIsInitiator(false);
    }
  };

  const checkUserRole = async (
    userId: string = session?.data?.user?.id || '',
    rootUser: boolean = false
  ) => {
    const res = await getData(
      `/Roles/GetByUserIdAccountId?userId=${userId}&accountId=${userAccountId}`
    );

    const initiator =
      res?.length > 0 && res?.some((item: any) => item?.Name === 'Initiator');

    if (initiator) {
      setIsInitiator(true);
      if (!rootUser) await getUserDetails(userId)
      return true;
    } else {
      if (!rootUser) await createRole(userId);
      setIsInitiator(false);
      return false;
    }
  };

  // get user data by email
  const getUserByEmail = async (email: string) => {
    const res = await getData(`/UserAccount/GetbyEmail?email=${email}`);

    if (res?.Id) {
      initializeAccountId(res?.UserId);
      await checkUserRole(res?.UserId);
      return res;
    } else {
      return null;
    }
  };

  const value: UserRoleContextType = {
    getUserByEmail,
    createNewInitiator,
    checkUserRole,
    isInitiator,
    wishToBecome,
    setWishToBecome,
    userExist,
    setUserExist,
    accountCreateSuccess,
    setAccountCreateSuccess,
    sendInvitation,
    invitationSuccess,
    userDetails,
    userAssignToAssignment,
    sendEmailNotification,
    getInspectionDetails,
  };

  return (
    <UserRoleContext.Provider value={value}>
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRoleContext() {
  const ctx = useContext(UserRoleContext);
  if (!ctx)
    throw new Error(
      'useUserRoleContext must be used within a UserRoleProvider'
    );
  return ctx;
}

export default UserRoleProvider;
