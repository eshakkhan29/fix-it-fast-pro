export interface StatusItem {
  Id: number;
  GlobalId: number;
  Name: string;
}

export interface InspectionItem {
  Id: number;
  Name: string;
  AssignmentId: number;
}

export interface ResponseOptItem {
  Id: number;
  Label: string;
}

export interface FollowUpData {
  AccountId: number;
  FollowUpId: number;
  StatusId: StatusItem[];
  Inspection: InspectionItem[];
  Location: string;
  CreateDate: string;
  ResponseOpt: ResponseOptItem[];
}

export const dummyFollowUpData: FollowUpData[] = [
  {
    AccountId: 1,
    FollowUpId: 1,
    StatusId: [{ Id: 1, GlobalId: 101, Name: "Open" }],
    Inspection: [{ Id: 1, Name: "Fixitfast", AssignmentId: 45231 }],
    Location: "Building A, Floor 2, Room 204",
    CreateDate: "2025-10-08T14:00:00Z",
    ResponseOpt: [{ Id: 1, Label: "Maintenance" }],
  },
  {
    AccountId: 2,
    FollowUpId: 2,
    StatusId: [{ Id: 2, GlobalId: 102, Name: "Open" }],
    Inspection: [{ Id: 2, Name: "Power Issue", AssignmentId: 0 }],
    Location: "Building C, Floor 1, Room 101",
    CreateDate: "2025-10-08T10:00:00Z",
    ResponseOpt: [{ Id: 2, Label: "Electrical" }],
  },
  {
    AccountId: 3,
    FollowUpId: 3,
    StatusId: [{ Id: 3, GlobalId: 103, Name: "In Progress" }],
    Inspection: [{ Id: 3, Name: "Water Leakage", AssignmentId: 98765 }],
    Location: "Building B, Floor 3, Room 305",
    CreateDate: "2025-10-08T07:00:00Z",
    ResponseOpt: [{ Id: 3, Label: "Plumbing" }],
  },
  {
    AccountId: 4,
    FollowUpId: 4,
    StatusId: [{ Id: 4, GlobalId: 104, Name: "Open" }],
    Inspection: [{ Id: 4, Name: "AC Not Cooling", AssignmentId: 0 }],
    Location: "Building D, Floor 1, Room 110",
    CreateDate: "2025-10-08T04:00:00Z",
    ResponseOpt: [{ Id: 4, Label: "HVAC" }],
  },
  {
    AccountId: 5,
    FollowUpId: 5,
    StatusId: [{ Id: 5, GlobalId: 105, Name: "In Progress" }],
    Inspection: [{ Id: 5, Name: "Network Down", AssignmentId: 12345 }],
    Location: "Building A, Floor 4, Room 401",
    CreateDate: "2025-10-08T03:00:00Z",
    ResponseOpt: [{ Id: 5, Label: "IT Support" }],
  },
  {
    AccountId: 6,
    FollowUpId: 6,
    StatusId: [{ Id: 6, GlobalId: 106, Name: "Open" }],
    Inspection: [{ Id: 6, Name: "Door Lock Malfunction", AssignmentId: 0 }],
    Location: "Building E, Floor G, Main Entrance",
    CreateDate: "2025-10-08T08:00:00Z",
    ResponseOpt: [{ Id: 6, Label: "Security" }],
  },
];