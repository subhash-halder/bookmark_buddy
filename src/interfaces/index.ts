export interface Bookmark {
  id: string;
  index: number;
  title: string;
  url?: string;
  children?: Bookmark[];
  parentId?: string;
}

export interface IState {
  bookmarks: Bookmark[];
  selectedBookmarkTabId: string;
  darkMode: boolean;
}

export type FullStateMessage = {
  type: 'fullState';
  state: IState;
};

export type SetBookmarkSelectedTabIdMessage = {
  type: 'setBookmarkTabSelectionId';
  tabId: string;
};

export type SetDarkModeMessage = {
  type: 'setDarkMode';
  darkMode: boolean;
};

export type MessageType = FullStateMessage | SetBookmarkSelectedTabIdMessage | SetDarkModeMessage;
