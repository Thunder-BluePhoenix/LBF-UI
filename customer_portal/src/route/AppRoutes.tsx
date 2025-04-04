/* eslint-disable react-hooks/exhaustive-deps */
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import Home from "../Pages/Home/home";
import BillOfLandingList from "../Pages/BOL-List/Blo-list";
import { useFrappeAuth } from "frappe-react-sdk";
import { useEffect } from "react";
import Login from "../Pages/Login";
import BillOfLandingDitails from "../Pages/BOL-List/Components/BillOfLandingDitails";
import QualityInspectionData from "../Pages/BOL-List/Components/QualityInspestion";
import SerialAndBatchNo from "../Pages/BOL-List/Components/SerialAndBatchNo";
import MaterialRequestList from "../Pages/Material-List/MaterialRequest-list";
import MaterialRequestDetails from "../Pages/Material-List/Components/MaterialRequestDetails";
import NewCustomer from "../Pages/Customer/Components/NewCustomer";
import NotificationPage from "../Pages/Notification/Notification";
import CustomerTable from "../Pages/Customer/Customer";
import CustomerDetails from "../Pages/Login-customer-profile/customer-details";
import RedeliveryForm from "../Pages/Material-request-from/redelivery-form";
import ModalMaterialListForTH from "../Pages/Material-request-from/components/modalMaterialListForTH";

const AppRoutes = () => {
    const { currentUser, isLoading, isValidating } = useFrappeAuth()
	const navigate = useNavigate()
	useEffect(() => {
		if (isLoading || isValidating)
			return
		if (!currentUser)
			navigate('/customer_portal/login')

	}, [currentUser, isLoading, isValidating,])

  return (
 <div  className="flex h-screen w-full">
      <Routes>
      <Route path="/customer_portal/login" element={<Login />} />
      <Route path="/customer_portal/home" element={<Layout><div className="p-4"> <Home/></div></Layout>}/>
      <Route path="/customer_portal/bill-of-landing-list" element={<Layout><div className="p-4"> <BillOfLandingList/></div></Layout>}/>
      <Route path="/customer_portal/bill-of-landing-ditails/:id" element={<Layout> <div className="p-4"><BillOfLandingDitails/></div></Layout> }/>
      <Route path="/customer_portal/quality-inspection-data/:id" element={<Layout> <div className="p-4"><QualityInspectionData/></div></Layout> }/>
      <Route path="/customer_portal/serial-batch-no/:id" element={<Layout> <div className="p-4"><SerialAndBatchNo/></div></Layout> }/>
      <Route path="/customer_portal/material-request-list" element={<Layout> <div className="p-4"><MaterialRequestList/></div></Layout> }/>
      <Route path="/customer_portal/material-request-details/:id" element={<Layout> <div className="p-4"><MaterialRequestDetails/></div></Layout> }/>
      <Route path="/customer_portal/material-request-form/" element={<Layout> <div className="p-4"><RedeliveryForm/></div></Layout> }/>
      <Route path="/customer_portal/material-request-form/:id" element={<Layout> <div className="p-4"><RedeliveryForm/></div></Layout> }/>
      <Route path="/customer_portal/modal-material-list-for-th/" element={<Layout> <div className="p-4"><ModalMaterialListForTH/></div></Layout> }/>
      <Route path="/customer_portal/newcustomer" element={<Layout> <div className="p-4"><NewCustomer/></div></Layout> }/>
      <Route path="/customer_portal/newcustomer/:id" element={<Layout> <div className="p-4"><NewCustomer/></div></Layout> }/>
      <Route path="/customer_portal/customer-table" element={<Layout> <div className="p-4"><CustomerTable/></div></Layout> }/>
      <Route path="/customer_portal/notificationpage" element={<Layout> <div className="p-4"><NotificationPage/></div></Layout> }/>
      <Route path="/customer_portal/Login-customerdetails" element={<Layout> <div className="p-4"><CustomerDetails/></div></Layout> }/>
      </Routes>
 </div>
  );
};

export default AppRoutes;
