import "./App.css";
// import { useEffect, useState } from "react";

const NewTab = () => {
  return (
    <>
      <header className="header border-b shadow-sm sticky top-0 z-50 transition-colors duration-200">
        <div className="container mx-auto px-5 py-3">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <img className="h-8 w-8 mr-2" src="/icons/icon48.png"></img>
              <span className="font-bold text-lg">Bookmark Buddy</span>
            </div>

            <div className="order-3 md:order-2 w-full md:w-auto mt-2 md:mt-0 overflow-x-auto">
              <div className="flex space-x-1">
                <button className="tab-button tab-active px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Dashboard
                </button>
                <button className="tab-button px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Projects
                </button>
                <button className="tab-button px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Resources
                </button>
                <button className="tab-button px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                  Settings
                </button>
              </div>
            </div>

            <div className="flex order-2 md:order-3 items-center space-x-2">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-40 lg:w-64 px-3 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
                ></input>
                <button className="absolute right-2 top-1.5">
                  <i className="fas fa-search text-sm"></i>
                </button>
              </div>

              <button
                id="theme-toggle"
                className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              ></button>
            </div>
          </div>

          <div className="md:hidden mt-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              ></input>
              <button className="absolute right-3 top-2"></button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div id="card-container" className="masonry-grid"></div>
      </main>
    </>
  );
};

export default NewTab;
