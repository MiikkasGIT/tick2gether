import React from 'react';

const AvatarGroup = ({ assignedUsers = [], users = [], selected }) => {
  const colorSpectrum = [
    { background: "#D7FFF8", text: "#69F4DB" },
    { background: "#D8EAFF", text: "#0374FA" },
    { background: "#D8FFE7", text: "#46DE83" },
    { background: "#F2F2F2", text: "#DCDEE1" },
    { background: "#FFD8FF", text: "#F369F4" },
    { background: "#FFDCDC", text: "#FC5E5E" },
    { background: "#FFE9DD", text: "#FF843F" }
  ];

  return (
    <div className="flex items-start">
      {assignedUsers.map((userId, index) => {
        const user = users.find(u => u.userId === userId) || { initials: 'N/A' };
        const color = colorSpectrum[index % colorSpectrum.length]; 
        
      
        return (
          <div
            key={userId}
            className={`relative flex items-center justify-center ml-[-0.5rem] h-7 w-7 max-h-8 max-w-8 rounded-full ring-2 ${selected ? 'ring-[#DBE9FE]' : 'ring-white'}`}
            style={{ backgroundColor: color.background, zIndex: colorSpectrum.length - index }}
          >
            <span className="text-xs font-bold" style={{ fontSize: '14px', color: color.text }}>{user.initials}</span>
          </div>
        );
      })}
    </div>
  );
};

export default AvatarGroup;
