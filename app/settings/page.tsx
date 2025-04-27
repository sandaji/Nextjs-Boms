"use client";

import React, { useState } from "react";
import Header from "../(components)/Header";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const mockSettings: UserSetting[] = [
  { label: "Username", value: "john_doe", type: "text" },
  { label: "Email", value: "john.doe@example.com", type: "text" },
  { label: "Notification", value: true, type: "toggle" },
  { label: "Dark Mode", value: false, type: "toggle" },
  { label: "Language", value: "English", type: "text" },
];

const Settings = () => {
  const [userSettings, setUserSettings] = useState<UserSetting[]>(mockSettings);

  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    settingsCopy[index].value = !settingsCopy[index].value as boolean;
    setUserSettings(settingsCopy);
  };

  return (
    <div className="w-full px-4 py-6 bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-900 dark:text-slate-100">
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-6 rounded-lg shadow-md">
        <table className="min-w-full bg-white dark:bg-slate-800 rounded-lg">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr
                key={setting.label}
                className="hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <td className="py-3 px-4">{setting.label}</td>
                <td className="py-3 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                      />
                      <div
                        className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full peer peer-focus:ring-4 
                        peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-600 transition-all
                        peer-checked:bg-indigo-600 relative
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white
                        after:border after:border-slate-300 after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 w-full border border-slate-300 dark:border-slate-600 
                      rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 
                      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={setting.value as string}
                      onChange={(e) => {
                        const settingsCopy = [...userSettings];
                        settingsCopy[index].value = e.target.value;
                        setUserSettings(settingsCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
