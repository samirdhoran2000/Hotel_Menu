const MenuItem = ({ item }) => (
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="grid grid-cols-2 gap-2">
        {item.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${item.name} ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg"
          />
        ))}
      </div>
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <span className="text-gray-400">
              ${item.originalPrice.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xl font-bold">${item.price.toFixed(2)}</span>
            <span className="text-gray-500 text-sm ml-2">{item.sgm}</span>
          </div>
          <button className="bg-beige-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-beige-200 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default MenuItem;