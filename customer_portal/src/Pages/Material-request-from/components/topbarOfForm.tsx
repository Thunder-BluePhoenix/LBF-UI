// Child component
import { FaArrowLeft } from "react-icons/fa";

type ChildProps = {
  navigate: (arg: number) => void;
  isEditMode: boolean;
  isDocStatusLocked: () => boolean;
};

const MaterialRequestHeader: React.FC<ChildProps> = ({ navigate, isEditMode, isDocStatusLocked }) => {
  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="cursor-pointer" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </span>
      <h2 className="text-xl font-semibold">
        <span
          className={`${
            !isDocStatusLocked()
              ? isEditMode
                ? "bg-yellow-500 text-white px-2 py-1 rounded-lg"
                : "bg-green-500 text-white px-2 py-1 rounded-lg"
              : "bg-blue-500 text-white px-2 py-1 rounded-lg"
          }`}
        >
          {!isDocStatusLocked() ? (isEditMode ? "Edit OR Submit" : "Create") : "Submit"}
        </span>{" "}
        Material Request
      </h2>
    </div>
  );
};

export default MaterialRequestHeader;
