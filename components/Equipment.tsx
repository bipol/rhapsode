const EquipmentList = ({ equipment }) => {
  return (
    <div className="bg-gray-100 p-4 shadow-sm rounded-lg mb-4">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Equipment</h2>
      {equipment.length === 0 ? (
        <p className="text-gray-500">No equipment available.</p>
      ) : (
        <ul className="list-disc list-inside">
          {equipment.map((item, index) => (
            <li key={index} className="text-gray-700">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EquipmentList;
