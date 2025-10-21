// inspectionTemplate.types.ts

export interface ReponseOptionAction {
  ActionId: number;
  ActionName: string;
  Item: string;
  Mode: string;
}

export interface InspectionResponseOptionLimitAndAction {
  LimitId: number;
  Compliance: number;
  ExcludeFromCalc: boolean;
  IsScoring: boolean;
  LowerLimit: number;
  UpperLimit: number;
  LimitName: string;
  ReponseOptionActions: ReponseOptionAction;
}

export interface InspectionResponseOption {
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
}

export interface PredefinedNote {
  NoteId: number;
  Name: string;
  Text: string;
  TegId: number;
}

export interface TopicEvaluationGroupRow {
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
  StandardLabel: string | null;
  Standard: string;
  ProcedureLabel: string | null;
  Procedure: string;
  MediaUrl: any[];
  ReponseOptions: InspectionResponseOption[];
  PredefinedNotes: PredefinedNote[];
  TegUnlinkFlag: string;
  TemplateTegModifiedTimeStamp: string | null;
}

export interface SubIndustryOrQualityFocus {
  Id: number;
  Name: string;
}

export interface InspectionTemplateType {
  Id: number;
  AccountId: number;
  Title: string;
  Description: string;
  Tags: string;
  IsSignatureMandatory: boolean;
  IsHidden: boolean;
  SubIndustry: SubIndustryOrQualityFocus[];
  QualityFocus: SubIndustryOrQualityFocus[];
  TopicEvaluationGroups: TopicEvaluationGroupRow[];
}

export interface InspectionTemplateState {
  templates: InspectionTemplateType[];
  currentTemplate: InspectionTemplateType | null;
  isLoading: boolean;
  error: string | null;
}
