import { Bookmark } from "../interfaces";

const Bookmarks = ({ bookmark }: { bookmark: Bookmark }) => {
  if (bookmark.children && bookmark.children.length > 0) {
    return (
      <div
        className="card border rounded-lg shadow-sm transition-colors duration-200"
        data-id="2"
      >
        <div className="p-4 border-b font-bold flex justify-between items-center">
          <h3>{bookmark.title}</h3>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <i className="fas fa-ellipsis-v"></i>
            </button>
            <div className="card-drag-handle cursor-grab">
              <i className="fas fa-grip-lines"></i>
            </div>
          </div>
        </div>
        <div className="p-4">
          <ul className="space-y-2">
            {bookmark.children.map((children) => (
              <Bookmarks key={children.id} bookmark={children} />
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return (
      <li className="flex items-center justify-between group">
        <a
          href={bookmark.url}
          className="hover:underline transition-colors duration-200"
        >
          <i className="fas fa-link mr-2 text-blue-500 dark:text-blue-400"></i>
          {bookmark.title}
        </a>
        <button
          className="edit-link-btn opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-opacity duration-200"
          data-card="2"
          data-link="1"
        >
          <i className="fas fa-edit"></i>
        </button>
      </li>
    );
  }
};

export default Bookmarks;
