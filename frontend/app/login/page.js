export default function Login() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-10 shadow-2xl w-full max-w-md border-t-4 border-gold">
        <h2 className="text-3xl font-extrabold mb-8 text-center text-black dark:text-white uppercase tracking-wider">Login</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded focus:outline-none focus:border-gold transition" placeholder="Enter email" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded focus:outline-none focus:border-gold transition" placeholder="Enter password" />
          </div>
          <button type="submit" className="w-full bg-black text-white font-bold py-3 uppercase tracking-widest hover:bg-gold transition">Sign In</button>
        </form>
      </div>
    </div>
  );
}