import { derived, get, writable } from "svelte/store";
import {
  parseInstanceJson,
  type AppInstanceRecord,
  type ParseResult,
} from "./instance-contract.js";
import {
  computeAggregateStatus,
  type AggregateStatus,
} from "./aggregate-status.js";

export interface InstanceStoreOptions {
  logger?: Pick<Console, "warn">;
}

function createInstanceStore(options: InstanceStoreOptions = {}) {
  const logger = options.logger ?? console;
  const _instances = writable<Map<string, AppInstanceRecord>>(new Map());
  const _parseErrors = writable<Map<string, string>>(new Map());

  const aggregate = derived(_instances, ($instances) => {
    return computeAggregateStatus([...$instances.values()]);
  });

  function loadFromJson(id: string, jsonText: string): void {
    const result: ParseResult = parseInstanceJson(jsonText);
    if (result.ok) {
      _instances.update((instances) => {
        const next = new Map(instances);
        next.set(result.record.id, result.record);
        return next;
      });

      _parseErrors.update((errors) => {
        const next = new Map(errors);
        next.delete(id);
        return next;
      });
      return;
    }

    logger.warn(`[instance-store] parse error for ${id}: ${result.error}`);
    _instances.update((instances) => {
      const next = new Map(instances);
      next.delete(id);
      return next;
    });
    _parseErrors.update((errors) => {
      const next = new Map(errors);
      next.set(id, result.error);
      return next;
    });
  }

  function removeInstance(id: string): void {
    _instances.update((instances) => {
      const next = new Map(instances);
      next.delete(id);
      return next;
    });

    _parseErrors.update((errors) => {
      const next = new Map(errors);
      next.delete(id);
      return next;
    });
  }

  function reconcile(records: AppInstanceRecord[]): void {
    const next = new Map<string, AppInstanceRecord>();
    for (const record of records) next.set(record.id, record);
    _instances.set(next);
  }

  function clear(): void {
    _instances.set(new Map());
    _parseErrors.set(new Map());
  }

  return {
    subscribe: _instances.subscribe,
    aggregate,
    parseErrors: { subscribe: _parseErrors.subscribe },
    loadFromJson,
    removeInstance,
    reconcile,
    clear,
    getInstances: (): Map<string, AppInstanceRecord> => get(_instances),
    getParseErrors: (): Map<string, string> => get(_parseErrors),
    getAggregate: (): AggregateStatus => get(aggregate),
  };
}

export const instanceStore = createInstanceStore();
export const createAgentbarInstanceStore = createInstanceStore;
