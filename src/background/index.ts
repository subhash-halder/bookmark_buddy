import { v4 as uuidv4 } from "uuid";
import type { Bookmark, IState, MessageType } from "../interfaces";

let bookmarkSelectedTabIdLocal: string | undefined;
let darkModeLocal: boolean | undefined;

async function getBookmarkSelectedTabId(): Promise<string> {
  if (bookmarkSelectedTabIdLocal === undefined) {
    const selectedTab = (await chrome.storage.local.get(
      "bookmarkSelectedTabId",
    )) as unknown as Record<string, string>;
    bookmarkSelectedTabIdLocal = selectedTab.bookmarkSelectedTabId ?? "1";
  }
  return bookmarkSelectedTabIdLocal;
}

async function setBookmarkSelectedTabId(tabId: string): Promise<void> {
  bookmarkSelectedTabIdLocal = tabId;
  await chrome.storage.local.set({ bookmarkSelectedTabId: tabId });
}

async function getDarkMode(): Promise<boolean> {
  if (darkModeLocal === undefined) {
    const darkModeSetting = (await chrome.storage.local.get(
      "darkMode",
    )) as unknown as Record<string, boolean>;
    darkModeLocal = darkModeSetting.darkMode ?? true;
  }
  return darkModeLocal;
}

async function setDarkMode(darkMode: boolean): Promise<void> {
  darkModeLocal = darkMode;
  await chrome.storage.local.set({ darkMode });
}

async function getState(): Promise<IState> {
  const [bookmarks, selectedBookmarkTabId, darkMode] = await Promise.all([
    getBookmarks(),
    getBookmarkSelectedTabId(),
    getDarkMode(),
  ]);
  return {
    bookmarks,
    selectedBookmarkTabId,
    darkMode,
  };
}

async function getBookmarks(): Promise<Bookmark[]> {
  /**
   * This function transforms the Chrome bookmark tree into a custom Bookmark structure.
   *
   * Example of the resulting bookmark structure:
   * [
   *   {
   *     index: 0,
   *     url: "https://example.com",
   *     title: "Example",
   *     id: "unique-id-1",
   *     parentId: "parent-id",
   *     children: [
   *       {
   *         index: 0,
   *         url: "https://child-example.com",
   *         title: "Child Example",
   *         id: "unique-id-2",
   *         parentId: "unique-id-1",
   *         children: undefined
   *       }
   *     ]
   *   }
   * ]
   *
   * The parents bookmarks will represent the tab and the children will represent
   * respective bookmarks in that tab.
   */
  function createBookmarkFromBookmarkTree(
    tree: chrome.bookmarks.BookmarkTreeNode[],
  ): Bookmark[] {
    const bookmark: Bookmark[] = [...tree]
      .sort((n1, n2) => (n1.index ?? 0) - (n2.index ?? 0))
      .map((n) => ({
        index: n.index ?? 0,
        url: n.url,
        title: n.title,
        id: n.id ?? uuidv4(),
        parentId: n.parentId,
        children:
          n.children !== undefined
            ? createBookmarkFromBookmarkTree(n.children)
            : undefined,
      }));

    return bookmark;
  }
  const tree = await chrome.bookmarks.getTree();
  return createBookmarkFromBookmarkTree(tree[0].children ?? []);
}

async function sendState(): Promise<void> {
  const state = await getState();
  await chrome.runtime.sendMessage({
    type: "fullState",
    state,
  } as MessageType);
}

chrome.runtime.onMessage.addListener((message) => {
  void (async (message) => {
    switch (message.type) {
      case "getState":
        await sendState();
        break;
      case "setBookmarkTabSelectionId": {
        await setBookmarkSelectedTabId(message.tabId);
        const tabId = await getBookmarkSelectedTabId();
        await chrome.runtime.sendMessage({
          type: "setBookmarkTabSelectionId",
          tabId,
        } as MessageType);
        break;
      }
      case "setDarkMode": {
        await setDarkMode(message.darkMode);
        await chrome.runtime.sendMessage({
          type: "setDarkMode",
          darkMode: message.darkMode,
        } as MessageType);
        break;
      }
    }
  })(message);
});
