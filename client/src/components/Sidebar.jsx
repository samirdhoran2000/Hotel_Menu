import { Settings, UserCircle2, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose, onOpenSettings, onOpenAdmin }) => {
  const nav = [
    { title: "Menu", href: "#menu" },
    { title: "About", href: "#about" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? "block" : "hidden"}`}>
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <aside className={`absolute left-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-orange-100 px-5 py-4">
          <div>
            <p className="text-lg font-bold text-slate-900">Digital Menu</p>
            <p className="text-xs text-slate-500">Navigation</p>
          </div>
          <button onClick={onClose} className="rounded-xl border border-orange-100 p-2 text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2 px-5 py-5">
          {nav.map((item) => (
            <a key={item.title} href={item.href} onClick={onClose} className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600">
              {item.title}
            </a>
          ))}
          <button onClick={() => { onOpenSettings(); onClose(); }} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-base font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-600">
            <Settings className="h-5 w-5" />
            Setting
          </button>
          <button onClick={() => { onOpenAdmin(); onClose(); }} className="flex w-full items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-left text-base font-semibold text-white transition hover:bg-slate-800">
            <UserCircle2 className="h-5 w-5" />
            Admin
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
