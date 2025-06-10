import React from "react";

const teamMembers = [
  {
    name: "Raj",
    role: "CTO",
    description: "QR-code guru.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Sophia",
    role: "CEO",
    description: "Visionary leader.",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612c7d3?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Liam",
    role: "Head of Design",
    description: "Crafts intuitive interfaces.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
];

const Team = () => {
  return (
    <>
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            The Team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className="w-40 h-40 bg-cover bg-center rounded-full mb-4 shadow-md border-2 border-orange-500 group-hover:scale-105 transition-transform"
                  style={{ backgroundImage: `url(${member.avatar})` }}
                ></div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}, {member.role}
                </h3>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Team;
