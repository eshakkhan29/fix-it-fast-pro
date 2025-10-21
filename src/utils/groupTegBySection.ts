export type ResponseOptionAction = {
  ActionId: number;
  ActionName: string;
  Item: string;
  Mode: string;
};

export type InspectionResponseOptionLimitAndAction = {
  LimitId: number;
  Compliance: number;
  ExcludeFromCalc: boolean;
  IsScoring: boolean;
  LowerLimit: number;
  UpperLimit: number;
  LimitName: string;
  ReponseOptionActions: ResponseOptionAction;
};

export type ReponseOption = {
  ResponseId: number;
  Order: number;
  Name: string;
  UiLabel: string;
  RangeMin: number;
  RangeMax: number;
  RangeFormat: string;
  BackGroundColor: string;
  LabelColor: string;
  RangeIncrement: number;
  AllowZero: boolean;
  HideLimit: boolean;
  ROUnitId: number;
  ROTypeId: number;
  ROInputMethodId: number;
  DBLookUpValue: number;
  IsDataOverwriteByEvaluator: boolean;
  ROCalculationFormula: string;
  TEGNumericInputValue: number | null;
  InspectionReponseOptionLimitAndAction: InspectionResponseOptionLimitAndAction[];
};

export type PredefinedNote = {
  NoteId: number;
  Name: string;
  Text: string;
  TegId: number;
};

export type TopicEvaluationGroup = {
  IsShowSection: boolean;
  TegSection: number;
  TegSectionTitle: string;
  TegSectionOrder: number;
  TEGId: number;
  TEGOrder: number;
  Weight: number;
  IsMandatory: boolean;
  IsHidden: boolean;
  DefaultDate: number;
  AllowRepeatResponses: boolean;
  AllowAddQuestion: boolean;
  IsSignatureMandatory: boolean;
  TopicId: number;
  Topic: string;
  QuestionId: number;
  Question: string;
  StandardId: number;
  StandardLabel: string | null;  // Changed to allow null
  Standard: string | null;       // Changed to allow null
  ProcedureLabel: string | null; // Changed to allow null
  Procedure: string | null;      // Changed to allow null
  MediaUrl: string[];
  ReponseOptions: ReponseOption[];
  PredefinedNotes: PredefinedNote[];
  TegUnlinkFlag: string;
  TemplateTegModifiedTimeStamp: string | null;
};

type GroupedSection = {
  sectionTitle: string;
  sectionOrder: number;
  items: TopicEvaluationGroup[];
};

/**
 * Groups TopicEvaluationGroups by TegSectionTitle and sorts by TegSectionOrder
 * @param groups - Array of TopicEvaluationGroup objects
 * @returns Array of grouped sections sorted by order
 */
export const groupTegBySection = (
  groups: TopicEvaluationGroup[]
): GroupedSection[] => {
  if (!groups || groups.length === 0) return [];

  // Step 1: Group by TegSectionTitle
  const grouped = groups.reduce((acc, item) => {
    const sectionTitle = item.TegSectionTitle || 'Uncategorized';
    
    if (!acc[sectionTitle]) {
      acc[sectionTitle] = {
        sectionTitle,
        sectionOrder: item.TegSectionOrder,
        items: [],
      };
    }
    
    acc[sectionTitle].items.push(item);
    
    return acc;
  }, {} as Record<string, GroupedSection>);

  // Step 2: Convert to array and sort by TegSectionOrder
  const sortedSections = Object.values(grouped).sort(
    (a, b) => a.sectionOrder - b.sectionOrder
  );

  return sortedSections;
};