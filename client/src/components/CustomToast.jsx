import { toast } from "react-hot-toast";

const CustomToast = ({ t, icon, title, message, iconClass = "fas fa-check" }) => (
    <div 
        className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-center">
                {icon ? (
                    <div className="flex-shrink-0 h-10 w-10">
                        <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={icon}
                            alt={title}
                        />
                    </div>
                ) : (
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <i className={`${iconClass} text-gray-600`}></i>
                    </div>
                )}
                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        {title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                        {message}
                    </p>
                </div>
            </div>
        </div>
        <div className="flex border-l border-gray-100">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    toast.remove(t.id);
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-500 focus:outline-none"
            >
                Close
            </button>
        </div>
    </div>
);

export default CustomToast; 