import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { EquipmentProvider } from "./contexts/EquipmentContext";
import { SettingsProvider } from "./contexts/SettingsContext";
import { TeamsProvider } from "./contexts/TeamsContext";
import { SearchProvider } from "./contexts/SearchContext";
import { MaintenanceRequestsProvider } from "./contexts/MaintenanceRequestsContext";
import { RoleProvider } from "./contexts/RoleContext";
import Dashboard from "./pages/Dashboard";
import Equipment from "./pages/Equipment";
import EquipmentDetail from "./pages/EquipmentDetail";
import Teams from "./pages/Teams";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import MyRequests from "./pages/MyRequests";
import NewRequest from "./pages/NewRequest";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RoleProvider>
          <SearchProvider>
            <SettingsProvider>
              <EquipmentProvider>
                <TeamsProvider>
                  <MaintenanceRequestsProvider>
                    <TooltipProvider>
                      <Toaster />
                      <Sonner />
                      <BrowserRouter>
                        <Routes>
                          <Route path="/auth" element={<Auth />} />
                          <Route element={<DashboardLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/equipment" element={<Equipment />} />
                            <Route path="/equipment/:id" element={<EquipmentDetail />} />
                            <Route path="/teams" element={<Teams />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/settings" element={<Settings />} />
                            <Route path="/my-requests" element={<MyRequests />} />
                            <Route path="/new-request" element={<NewRequest />} />
                            <Route path="/admin" element={<AdminPanel />} />
                          </Route>
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </BrowserRouter>
                    </TooltipProvider>
                  </MaintenanceRequestsProvider>
                </TeamsProvider>
              </EquipmentProvider>
            </SettingsProvider>
          </SearchProvider>
        </RoleProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
