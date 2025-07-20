interface TitleProps {
  fileName: string;
  showRawData: boolean;
  setShowRawData: (value: boolean) => void;
}

export const Title = (props: TitleProps) => {
  return (
    <h1 className="flex gap-4 text-2xl font-bold mb-4 content-left">
      {props.fileName}
      <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={props.showRawData}
            onChange={(e) => props.setShowRawData(e.target.checked)}
          />
          <div
            className="w-10 h-6 bg-gray-200 rounded-full peer 
                  peer-checked:bg-blue-500
                  after:content-[''] 
                  after:absolute 
                  after:top-0.5 
                  after:left-0.5
                  after:bg-white 
                  after:rounded-full 
                  after:h-5 
                  after:w-5
                  after:transition-all
                  peer-checked:after:translate-x-4
                  hover:bg-gray-300
                  peer-checked:hover:bg-blue-600"
          ></div>
        </label>
        <span className="text-sm font-medium text-gray-700">Show Raw Data</span>
      </div>
    </h1>
  );
};
