import { v4 as uuidv4 } from 'uuid';
import type { Bookmark, IState, MessageType } from '../interfaces';

let bookmarkSelectedTabIdLocal: string | undefined;


async function getBookmarkSelectedTabId(): Promise<string | undefined> {
  if (bookmarkSelectedTabIdLocal === undefined) {
    const selectedTab = (await chrome.storage.local.get(
      'bookmarkSelectedTabId'
    )) as unknown as Record<string, string>;
    bookmarkSelectedTabIdLocal = selectedTab.bookmarkSelectedTabId ?? '0';
  }
  return bookmarkSelectedTabIdLocal;
}



async function setBookmarkSelectedTabId(tabId: string): Promise<void> {
  bookmarkSelectedTabIdLocal = tabId;
  await chrome.storage.local.set({ bookmarkSelectedTabId: tabId });
}


async function getState(): Promise<IState> {
  const bookmarks = await getBookmarks();
  const selectedBookmarkTabId = await getBookmarkSelectedTabId();
  return {
    bookmarks,
    selectedBookmarkTabId,
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
   */
  function createBookmarkFromBookmarkTree(
    tree: chrome.bookmarks.BookmarkTreeNode[]
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
    type: 'fullState',
    state
  } as MessageType);
}

chrome.runtime.onMessage.addListener((message) => {
  void (async (message) => {
    switch (message.type) {
      case 'getState':
        await sendState();
        break;
      case 'setBookmarkTabSelectionId': {
        await setBookmarkSelectedTabId(message.tabId);
        const tabId = await getBookmarkSelectedTabId();
        await chrome.runtime.sendMessage({
          type: 'setBookmarkTabSelectionId',
          tabId,
        } as MessageType);
      }
    }
  })(message);
});
