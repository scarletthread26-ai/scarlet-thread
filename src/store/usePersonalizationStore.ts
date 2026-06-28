import { create } from 'zustand'

interface Position {
  x: number;
  y: number;
}

interface PersonalizationState {
  productId: string | null;
  name: string;
  customText: string;
  fontStyle: string;
  fontColor: string;
  photoUrl: string | null;
  logoUrl: string | null;
  textPosition: Position;
  
  // Actions
  setProductId: (id: string) => void;
  setName: (name: string) => void;
  setCustomText: (text: string) => void;
  setFontStyle: (font: string) => void;
  setFontColor: (color: string) => void;
  setPhotoUrl: (url: string | null) => void;
  setLogoUrl: (url: string | null) => void;
  setTextPosition: (pos: Position) => void;
  reset: () => void;
}

const initialState = {
  productId: null,
  name: '',
  customText: '',
  fontStyle: 'font-sans',
  fontColor: '#000000',
  photoUrl: null,
  logoUrl: null,
  textPosition: { x: 50, y: 50 }, // percentages
}

export const usePersonalizationStore = create<PersonalizationState>((set) => ({
  ...initialState,
  
  setProductId: (id) => set({ productId: id }),
  setName: (name) => set({ name }),
  setCustomText: (customText) => set({ customText }),
  setFontStyle: (fontStyle) => set({ fontStyle }),
  setFontColor: (fontColor) => set({ fontColor }),
  setPhotoUrl: (photoUrl) => set({ photoUrl }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),
  setTextPosition: (textPosition) => set({ textPosition }),
  
  reset: () => set(initialState),
}))
