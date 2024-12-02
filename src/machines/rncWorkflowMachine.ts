import { createMachine } from 'xstate';
import { WorkflowStatusEnum } from '@/types/rnc';

export type RNCWorkflowEvent =
  | { type: 'START_ANALYSIS' }
  | { type: 'START_RESOLUTION' }
  | { type: 'MARK_SOLVED' }
  | { type: 'START_CLOSING' }
  | { type: 'CLOSE' }
  | { type: 'REOPEN' };

export type RNCWorkflowContext = {
  rncId: string;
  notes?: string;
};

export const rncWorkflowMachine = createMachine({
  id: 'rncWorkflow',
  initial: 'open',
  context: {
    rncId: '',
    notes: undefined
  },
  types: {
    context: {} as RNCWorkflowContext,
    events: {} as RNCWorkflowEvent,
  },
  states: {
    open: {
      on: {
        START_ANALYSIS: 'analysis'
      }
    },
    analysis: {
      on: {
        START_RESOLUTION: 'resolution',
        REOPEN: 'open'
      }
    },
    resolution: {
      on: {
        MARK_SOLVED: 'solved',
        REOPEN: 'open'
      }
    },
    solved: {
      on: {
        START_CLOSING: 'closing',
        REOPEN: 'open'
      }
    },
    closing: {
      on: {
        CLOSE: 'closed',
        REOPEN: 'open'
      }
    },
    closed: {
      on: {
        REOPEN: 'open'
      }
    }
  }
});