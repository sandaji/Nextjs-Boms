"use client";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold transition-colors duration-300">
        {name}
      </h1>
    </div>
  );
};

export default Header;
