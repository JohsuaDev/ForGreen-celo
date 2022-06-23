import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import useContract from '../../../services/useContract';


export default function ChooseProjectModal({
	show,
	onHide,
	contract,
	eventId,

}) {

	const [list, setList] = useState([]);
	const sleep = (milliseconds) => {
		return new Promise(resolve => setTimeout(resolve, milliseconds))
	}



	async function fetchContractData() {
		try {
			if (contract) {

				const totalEvent = await contract.totalEvent();
				const arr = [];
				for (let i = 0; i < Number(totalEvent); i++) {
					const value = await contract.eventURI(i);
					if (value) {
						const object = JSON.parse(value);
						if (object.properties.wallet.description == window.ethereum.selectedAddress) {
							var c = new Date(object.properties.Date.description).getTime();
							var n = new Date().getTime();
							var d = c - n;
							var s = Math.floor((d % (1000 * 60)) / 1000);
							if (s.toString().includes("-")) {
								continue;
							}
							arr.push({
								eventId: i,
								Title: object.properties.Title.description,
								Date: object.properties.Date.description,
								Goal: object.properties.Goal.description,
								logo: object.properties.logo.description.url,
							});
						}
					}
				}
				setList(arr);
			}
		} catch (error) {
			console.error(error);
		}
	}
	useEffect(() => {
		fetchContractData();

	}, [contract]);



	return (
		<Modal
			show={show}
			onHide={onHide}
			onShow={fetchContractData}
			aria-labelledby="contained-modal-title-vcenter"
			centered
			size='lg'
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Choose project
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="show-grid">
				<div className='Project-ALL-project-Container'>
					{list.map((item, i) => {
						return <>
							<div style={{ height: 110, width: 110 }}>
								<div className="Project-Image-Container">
									<img
										className="Event-Uploaded-File-clip-icon"
										src={item.logo}
										style={{ width: "90%", height: "90%" }}
									/>
									<span className="Event-Uploaded-File-name" >
										{item.Title.substring(0, 20)}...
									</span>
								</div>
							</div>
						</>
					})}
				</div>
			</Modal.Body>

		</Modal>

	);
}
