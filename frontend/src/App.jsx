import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/CreateUser";
import EditUser from "./pages/EditUser";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateUser />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </div>
  );
}

export default App;
