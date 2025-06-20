import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="text-center text-gray-600 text-sm">
            <p>&copy; 2025 英语单词学习器. 用 ❤️ 为语言学习而制作.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
