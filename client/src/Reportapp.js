import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyReports from "./pages/MyReports";
import ReportBug from "./pages/ReportBug";
 
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/report-bug" element={<ReportBug />} />
      </Routes>
    </Router>
  );
}
 
export default App;  
//reportapp.js