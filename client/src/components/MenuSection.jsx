import MenuItem from "./MenuItem";


const MenuSection = ({ title, items }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
    <div className="space-y-6">
      {items?.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  </section>
);

export default MenuSection;