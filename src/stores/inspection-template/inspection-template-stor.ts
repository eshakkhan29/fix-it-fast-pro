import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { InspectionTemplateType } from '@/types/inspection-template';

interface InspectionTemplateState {
  templates: InspectionTemplateType[];
  currentTemplate: InspectionTemplateType | null;
}

interface InspectionTemplateActions {
  setTemplates: (templates: InspectionTemplateType[]) => void;
  setCurrentTemplate: (template: InspectionTemplateType | null) => void;
  getTemplateById: (id: number) => InspectionTemplateType | undefined;
  reset: () => void;
}

type InspectionTemplateStore = InspectionTemplateState &
  InspectionTemplateActions;

const initialState: InspectionTemplateState = {
  templates: [],
  currentTemplate: null,
};

export const useInspectionTemplateStore = create<InspectionTemplateStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set all templates
      setTemplates: (templates) => set({ templates }),

      // Set current template
      setCurrentTemplate: (template) => set({ currentTemplate: template }),

      // Get template by ID
      getTemplateById: (id) => {
        const { templates } = get();
        return templates.find((template) => template.Id === id);
      },

      // Reset store to initial state
      reset: () => set(initialState),
    }),
    {
      name: 'inspection-template-store',
      partialize: (state) => ({
        templates: state.templates,
        currentTemplate: state.currentTemplate,
      }),
    }
  )
);
