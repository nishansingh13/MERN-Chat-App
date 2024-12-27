import React, { useState } from 'react';

function UserData({ userdata }) {
  const [search, setSearch] = useState('');
  const [searchBy, setSearchBy] = useState('');

  const filteredData = userdata.filter((i) => {
    if (searchBy === 'Name') {
      return i.name.toLowerCase().includes(search.toLowerCase());
    }
    if (searchBy === 'Email') {
      return i.email.toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  return (
    <div className='bg-[#F3F4F6] h-lvh'>
      <h2 className='text-[2rem] p-4'>User Data</h2>
      <div className='flex gap-4 p-[1.5rem]'>
        <div className='pt-1'>Search: </div>
        <input
          type="text"
          className='border border-[#c2d8eb] outline-none p-1 rounded-sm'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search..."
        />
        <select
          className='px-2 border border-[#c2d8eb]'
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
        >
          <option value="">Search by</option>
          <option value="Name">Name</option>
          <option value="Email">Email</option>
        </select>
      </div>

      {filteredData.length > 0 ? (
        <table cellPadding="10" className='mx-auto w-[80%] bg-white'>
          <thead className='bg-[#edf4fa]'>
            <tr className='border border-[#c2d8eb]'>
              <th className='border border-[#c2d8eb]'>Sr. No</th>
              <th className='border border-[#c2d8eb]'>Name</th>
              <th className='border border-[#c2d8eb]'>Email</th>
              <th className='border border-[#c2d8eb]'>Password</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user, index) => (
              <tr key={index} className='border border-[#c2d8eb]'>
                <td>{index + 1}</td>
                <td className='border border-[#c2d8eb]'>{user.name }</td>
                <td className='border border-[#c2d8eb]'>{user.email }</td>
                <td className='border border-[#c2d8eb]'>{user.password}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No user data available.</p>
      )}
    </div>
  );
}

export default UserData;
