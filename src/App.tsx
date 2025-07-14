import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Bookmark, MessageType } from "./interfaces";
import Bookmarks from "./components/bookmark";

function resizeGridItem(item: HTMLElement, grid: HTMLElement) {
  const rowHeight = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"),
  );
  const rowGap = parseInt(
    window.getComputedStyle(grid).getPropertyValue("grid-row-gap"),
  );

  const contentHeight = item.getBoundingClientRect().height;
  const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));

  item.style.gridRowEnd = "span " + rowSpan;
}

function resizeAllGridItems(grid: HTMLElement) {
  const items = grid.children;
  for (const item of items) {
    resizeGridItem(item as HTMLElement, grid);
  }
}

const NewTab = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedTabId, setSelectedTabId] = useState("1");
  const [darkMode, setDarkMode] = useState(true);

  const handleTabClick = (tabId: string) => {
    setSelectedTabId(tabId);
    chrome.runtime.sendMessage({ type: "setBookmarkTabSelectionId", tabId });
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    chrome.runtime.sendMessage({ type: "setDarkMode", darkMode: newDarkMode });
  };

  useEffect(() => {
    // Fetch initial state from the background script when the component mounts
    chrome.runtime.sendMessage({ type: "getState" });
  }, []);

  useEffect(() => {
        if (darkMode) {
          document.body.classList.add('dark-mode');
          document.body.classList.remove('light-mode');
        } else {
          document.body.classList.add('light-mode');
          document.body.classList.remove('dark-mode');
        }
  }, [darkMode])

  useEffect(() => {
    const handleMessage = (message: MessageType) => {
      if (message.type === "fullState") {
        console.log(
          "Received full state from background script:",
          message.state,
        );
        setBookmarks(message.state.bookmarks);
        setSelectedTabId(message.state.selectedBookmarkTabId);
        setDarkMode(message.state.darkMode);
      } else if (message.type === "setBookmarkTabSelectionId") {
        console.log(
          "Received tab selection ID from background script:",
          message.tabId,
        );
        setSelectedTabId(message.tabId);
      } else if (message.type === "setDarkMode") {
        console.log(
          "Received dark mode setting from background script:",
          message.darkMode,
        );
        setDarkMode(message.darkMode);
      };
    }

      console.log("Setting up message listener for new tab");
      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        console.log("Cleaning up message listener for new tab");
        chrome.runtime.onMessage.removeListener(handleMessage);
      };
    }, []);

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      console.log("Resizing grid items");
      resizeAllGridItems(gridRef.current);
    }
  }, [bookmarks, selectedTabId]);

  return (
    <>
      <header className="header border-b shadow-sm sticky top-0 z-50 transition-colors duration-200">
        <div className="container mx-auto px-5 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center flex-grow">
              <img className="h-8 w-8 mr-2" src="/icons/icon48.png" alt="Bookmark Buddy" />
              <span className="font-bold text-lg">Bookmark Buddy</span>
            </div>
            <div className="flex items-center ml-auto mr-4">
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="w-full md:w-auto mt-2 md:mt-0 overflow-x-auto">
              <div className="flex flex-wrap justify-center md:flex-nowrap space-x-0 md:space-x-1">
                {bookmarks.map((bookmark) => {
                  return (
                    <button
                      key={bookmark.id}
                      className={`tab-button ${selectedTabId === bookmark.id ? "tab-active" : ""} px-4 py-2 rounded-lg font-medium transition-colors duration-200`}
                      onClick={() => {
                        handleTabClick(bookmark.id);
                      }}
                    >
                      {bookmark.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div ref={gridRef} id="card-container" className="masonry-grid">
          {bookmarks
            .find((b) => b.id === selectedTabId)
            ?.children?.map((cardData) => (
              <Bookmarks key={cardData.id} bookmark={cardData} />
            ))}
        </div>
      </main>
    </>
  );
};

export default NewTab;
