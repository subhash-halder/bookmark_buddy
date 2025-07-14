import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Bookmark, MessageType } from "./interfaces";
import Bookmarks from "./components/bookmark";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faMoon } from "@fortawesome/free-solid-svg-icons";

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
            <div className="flex items-center">
              <img className="h-8 w-8 mr-2" src="/icons/icon48.png" alt="Bookmark Buddy" />
              <span className="font-bold text-lg">Bookmark Buddy</span>
            </div>

            <div className="w-full md:w-auto order-3 md:order-2 mt-2 md:mt-0 overflow-x-auto">
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
            
            <div className="flex items-center order-2 md:order-3">
              <button
                onClick={toggleDarkMode}
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <FontAwesomeIcon icon={faSun} className="text-yellow-400 text-xl" />
                ) : (
                  <FontAwesomeIcon icon={faMoon} className="text-gray-700 text-xl" />
                )}
              </button>
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
