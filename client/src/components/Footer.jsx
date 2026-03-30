const Footer = ({ hotelProfile }) => (
  <footer className="mt-16 bg-slate-950 text-white" id="contact">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3 lg:px-8">
      <div>
        <p className="text-3xl font-black">{hotelProfile?.hotelName || "Digital Menu"}</p>
        <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
          {hotelProfile?.about || "A clean digital menu with hotel information, menu categories, contact details, and a connected settings flow."}
        </p>
      </div>
      <div id="about">
        <p className="text-lg font-semibold">About</p>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p><span className="font-semibold text-white">Admin:</span> {hotelProfile?.adminName || "Admin"}</p>
          <p><span className="font-semibold text-white">Address:</span> {hotelProfile?.address || "Update hotel address from settings."}</p>
          <p><span className="font-semibold text-white">Public page:</span> {hotelProfile?.publicSlug || "not-generated"}</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-semibold">Contact</p>
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p><span className="font-semibold text-white">Phone:</span> {hotelProfile?.phone || "Not added"}</p>
          <p><span className="font-semibold text-white">Alt Phone:</span> {hotelProfile?.altPhone || "Not added"}</p>
          <p><span className="font-semibold text-white">Email:</span> {hotelProfile?.contactEmail || hotelProfile?.email || "Not added"}</p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
