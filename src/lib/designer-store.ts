import { useSyncExternalStore } from "react";

type DesignerState = {
  patioPhoto: string | null;
  selectedProductIds: Record<string, number>; // id -> qty
  style: string;
  details: string;
};

const initial: DesignerState = {
  patioPhoto: null,
  selectedProductIds: {},
  style: "mediterranean",
  details: "",
};

let state: DesignerState = { ...initial };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const designerStore = {
  get: () => state,
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  setPatioPhoto(url: string | null) {
    state = { ...state, patioPhoto: url };
    emit();
  },
  addProduct(id: string, qty = 1) {
    const next = { ...state.selectedProductIds };
    next[id] = (next[id] ?? 0) + qty;
    state = { ...state, selectedProductIds: next };
    emit();
  },
  setQty(id: string, qty: number) {
    const next = { ...state.selectedProductIds };
    if (qty <= 0) delete next[id];
    else next[id] = qty;
    state = { ...state, selectedProductIds: next };
    emit();
  },
  removeProduct(id: string) {
    const next = { ...state.selectedProductIds };
    delete next[id];
    state = { ...state, selectedProductIds: next };
    emit();
  },
  setStyle(style: string) {
    state = { ...state, style };
    emit();
  },
  setDetails(details: string) {
    state = { ...state, details };
    emit();
  },
};

export function useDesigner() {
  return useSyncExternalStore(
    designerStore.subscribe,
    designerStore.get,
    designerStore.get,
  );
}
