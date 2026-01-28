import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProgressPage from "./pages/ProgressPage";

<BrowserRouter>
  <Routes>
    {/* otras rutas */}
    <Route path="/progress" element={<ProgressPage />} />
  </Routes>
</BrowserRouter>
