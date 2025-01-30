
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Table from './Components/Table';
import RedeliveryRequest from './Components/Redelivery-Request';
import AddNewItemDetails from './Components/Add-new-item-details';
import NewCustomer from './Components/New-customer-add';
import RequestList from './Components/Request-list';
import MaterialRequestDetails from './Components/MaterialRequestDetails';
import Login from './Components/Login';
import BloList from './Components/Blo-list';
import { useFrappeAuth } from 'frappe-react-sdk';
import Layout from './Components/Layout';
import { useEffect } from 'react';


function LBFApp() {
	const { currentUser, isLoading, isValidating } = useFrappeAuth()
	const navigate = useNavigate()
	useEffect(() => {
		if (isLoading || isValidating)
			return
		if (!currentUser)
			navigate('/customer_portal/login')

	}, [currentUser, isLoading, isValidating,])

	return (

		
			<div key={JSON.stringify(currentUser)} className="flex h-screen w-full">
				<>
				 <Routes>
						<Route path="/customer_portal/dashboard" element={
							<Layout ><Dashboard /> </Layout>} />

						<Route path="/customer_portal/login" element={<Login />} />
						<Route path="/customer_portal" element={<Navigate to="/customer_portal/dashboard" />} />
						<Route
							path="/customer_portal/request-list"
							element={
								<Layout ><div className="p-4 pl-0">
								<RequestList />
							</div> </Layout>
								
							}
						/>
						<Route
							path="/customer_portal/table"
							element={
								<div className="p-4">
									<Table />
								</div>
							}
						/>
						<Route
							path="/customer_portal/redelivery-request"
							element={
								<Layout><div className="">
								<RedeliveryRequest />
							</div></Layout>
							}
						/>
						<Route
							path="/customer_portal/add-new-item-details"
							element={
								<div className="p-4">
									<AddNewItemDetails />
								</div>
							}
						/>
						<Route
							path="/customer_portal/new-customer"
							element={
								<Layout><div className="">
								<NewCustomer />
							</div></Layout>
							}
						/>
						<Route
							path="/customer_portal/material-request-details"
							element={
								<div className="p-4">
									<MaterialRequestDetails />
								</div>
							}
						/>
						<Route
							path="/customer_portal/blo-list"
							element={
								<Layout > <div className="p-4 ">
									<BloList />
								</div> </Layout>

							}
						/>
					</Routes>
				
				
				</>
				
			</div>
		

	);
}

export default LBFApp;
