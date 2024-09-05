const SpellList = ({ spells }) => {
  return (
    <div className="bg-rsPanel border-rsGold border-4 p-4 shadow-md rounded-rs mb-4">
      <h2 className="text-lg font-medium text-rsGold mb-2 font-rsFont">
        Spells
      </h2>
      {spells.length === 0 ? (
        <p className="text-gray-400 font-rsFont">No spells available.</p>
      ) : (
        <ul className="list-disc list-inside text-rsText font-rsFont">
          {spells.map((item, index) => (
            <li key={index} className="text-rsText">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpellList;
