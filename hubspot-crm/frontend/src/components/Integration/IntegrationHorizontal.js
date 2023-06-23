import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import Api from '../../api/api';
import ToggleSwitch from './ToggleSwitch';
import ModalFormBasedAuth from './ModalFormBasedAuth';
import ModalConfig from './ModalConfig';

function IntegrationHorizontal(props) {
	const { name, description, category, icon } = props.data.display;
	const { type, hasUserConfig, status: initialStatus } = props.data;
	const refreshIntegrations = props.refreshIntegrations;

	const [isProcessing, setIsProcessing] = useState(false);
	const [status, setStatus] = useState(initialStatus);
	const [jsonSchema, setJsonSchema] = useState({});
	const [uiSchema, setUiSchema] = useState({});
	const [installed, setInstalled] = useState([]);
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
	const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

	const api = new Api();

	const getAuthorizeRequirements = async () => {
		setIsProcessing(true);
		api.setJwt(sessionStorage.getItem('jwt'));
		const authorizeData = await api.getAuthorizeRequirements(type, '');
		if (authorizeData.type === 'oauth2') {
			window.location.href = authorizeData.url;
		}
		if (authorizeData.type !== 'oauth2') {
			let data = authorizeData.data
			for (const element of Object.entries(data.uiSchema)) {
				if (!element['ui:widget']) {
					element['ui:widget'] = 'text';
				}
			}
			setJsonSchema(data.jsonSchema);
			setUiSchema(data.uiSchema);
			openAuthModal();
		}
	};

	function openAuthModal() {
		setIsAuthModalOpen(true);
	}
	function closeAuthModal() {
		setIsAuthModalOpen(false);
		setIsProcessing(false);
	}
	function openConfigModal() {
		setIsConfigModalOpen(true);
	}
	function closeConfigModal() {
		setIsConfigModalOpen(false);
		setIsProcessing(false);
	}

	const getSampleData = async () => {
		props.history.push(`/data/${props.data.id}`);
	};

	const disconnectIntegration = async () => {
		console.log('Disconnect Clicked!');
		const jwt = sessionStorage.getItem('jwt');
		api.setJwt(jwt)
		await api.deleteIntegration(props.data.id);
		setIsProcessing(true);
		setStatus(false)
		await refreshIntegrations(props);
		setIsProcessing(false);
	};
	return (
		<>
			<div className="flex flex-nowrap p-4 bg-white rounded-lg shadow-xs" data-testid="integration-horizontal">
				<img className="mr-3 w-[80px] h-[80px] rounded-lg" alt={name} src={icon} />
				<div className="pr-1 overflow-hidden">
					<p className="w-full text-lg font-semibold text-gray-700 truncate ...">{name}</p>
					<p className="pt-2 text-sm font-medium text-gray-600">{description}</p>
					{status && status === 'NEEDS_CONFIG' && (
						<p className="inline-flex pt-2 text-xs font-medium text-red-300">
							<ExclamationCircleIcon className="w-4 h-4 mr-1" /> Configure
						</p>
					)}
				</div>
				<div className="ml-auto">
					<div className="relative">
						{status && (
							<ToggleSwitch
								getSampleData={getSampleData}
								openConfigModal={openConfigModal}
								disconnectIntegration={disconnectIntegration}
								status={status}
								name={name}
							/>
						)}
						{!status && (
							<button
								onClick={getAuthorizeRequirements}
								className="px-3 py-2 text-xs font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
							>
								{isProcessing ? (
									<svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								) : (
									'Connect'
								)}
							</button>
						)}
					</div>
				</div>
			</div>

			{isAuthModalOpen ? (
				<ModalFormBasedAuth
					isAuthModalOpen={isAuthModalOpen}
					closeAuthModal={closeAuthModal}
					refreshIntegrations={refreshIntegrations}
					name={name}
					type={type}
				></ModalFormBasedAuth>
			) : null}

			{isConfigModalOpen ? (
				<ModalConfig
					isConfigModalOpen={isConfigModalOpen}
					closeConfigModal={closeConfigModal}
					connectMock={connect}
					name={name}
					type={type}
				></ModalConfig>
			) : null}
		</>
	);
}
function mapStateToProps({ auth, integrations }) {
	console.log(`integrations: ${JSON.stringify(integrations)}`);
	return {
		authToken: auth.token,
		integrations,
	};
}

export default withRouter(connect(mapStateToProps)(IntegrationHorizontal));

