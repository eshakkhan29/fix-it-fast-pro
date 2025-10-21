import { formatDate } from '@/utils/formatDate';

export const incidentDataFormatter = (values: any) => {
  // Build Location levels conditionally from campus -> room
  const location: { Level: number; Id: number }[] = [];
  const addIfPresent = (level: number, id: unknown) => {
    const num = Number(id as any);
    if (id !== undefined && id !== null && id !== '' && !Number.isNaN(num)) {
      location.push({ Level: level, Id: num });
    }
  };

  addIfPresent(0, values.campusId);
  addIfPresent(1, values.buildingId);
  addIfPresent(2, values.floorId);
  addIfPresent(3, values.areaId);
  addIfPresent(4, values.roomId);

  return {
    Id: 0,
    AccountId: Number(values.accountId),
    InspectionTemplateId: Number(values.inspectionTemplateId),
    Title: values.title || 'FixItFast Incident',
    Description: values.description || '',
    InitiatorId: values.initiatorId || '',
    inspectorId: values.evaluatorUserId || '',
    StartDate: formatDate(new Date()),
    EndDate: formatDate(
     new Date(new Date().getTime() + 15 * 1000)
    ), // 5 days
    // StartDate: "2025-10-1 9:49:17",
    // EndDate: "2025-10-1 9:49:30",
    Tags: '',
    Tegs: [
      {
        TegId: values.tegId,
        ResponseId: Number(values.responseId),
      },
    ],
    Score: 0,
    Signatures: [],
    Location: location,
    // mandatory
    Followups: [
      {
        Id: 0,
        InspectionId: 0,
        AccountId: 1261,
        InspectorId: values.evaluatorUserId || '',
        TEGId: Number(values.tegId),
        DueDate: formatDate(
          new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)
        ),
        PlannedForActionDate: '',
        ResponseOptionId: Number(values.responseId),
        ResponseOptionLimitId: Number(values.responseLimitId),
        ResponseOptionValue: 0,
        Notes: [{ Id: 0, Text: values.description || '' }],
        Responsibles: [],
        MediaUrls:
          values?.incidentImages?.map((item: any) => {
            return {
              URL: item,
            };
          }) || [],
        InformedParties: [],
        EmailOverride: true,
        IsReslovedOnSpot: 0,
        ROIndexForRepeatTeg: 0,
        IsRepeatTeg: false,
      },
    ],
    AssignmentId: Number(values.assignmentId),
    // CreatedOn: '2025-10-1 9:49:30',
    IsInspectionPerformedByOperator: false,
    IsDurationCalculated: true,
    InspectionType: 'FixItFast',
    EditStartDate: null,
    EditEndDate: null,
  };
};
